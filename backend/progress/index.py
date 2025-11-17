'''
Business: Manages user learning progress - saves and retrieves vocabulary stats, exercise scores
Args: event with httpMethod, body, queryStringParameters; context with request_id
Returns: HTTP response with progress data or success confirmation
'''

import json
import os
import psycopg2
from typing import Dict, Any

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('x-user-id') or headers.get('X-User-Id') or 'anonymous'
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute(
                "SELECT learned_words_count, exercise_score, last_card_index, last_exercise_index, learned_words FROM user_progress WHERE user_id = %s",
                (user_id,)
            )
            row = cur.fetchone()
            
            if row:
                progress_data = {
                    'learnedWordsCount': row[0],
                    'exerciseScore': row[1],
                    'lastCardIndex': row[2],
                    'lastExerciseIndex': row[3],
                    'learnedWords': json.loads(row[4]) if row[4] else []
                }
            else:
                progress_data = {
                    'learnedWordsCount': 0,
                    'exerciseScore': 0,
                    'lastCardIndex': 0,
                    'lastExerciseIndex': 0,
                    'learnedWords': []
                }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(progress_data),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            learned_words_count = body_data.get('learnedWordsCount', 0)
            exercise_score = body_data.get('exerciseScore', 0)
            last_card_index = body_data.get('lastCardIndex', 0)
            last_exercise_index = body_data.get('lastExerciseIndex', 0)
            learned_words = json.dumps(body_data.get('learnedWords', []))
            
            cur.execute(
                "SELECT id FROM user_progress WHERE user_id = %s",
                (user_id,)
            )
            existing = cur.fetchone()
            
            if existing:
                cur.execute(
                    "UPDATE user_progress SET learned_words_count = %s, exercise_score = %s, last_card_index = %s, last_exercise_index = %s, learned_words = %s, updated_at = CURRENT_TIMESTAMP WHERE user_id = %s",
                    (learned_words_count, exercise_score, last_card_index, last_exercise_index, learned_words, user_id)
                )
            else:
                cur.execute(
                    "INSERT INTO user_progress (user_id, learned_words_count, exercise_score, last_card_index, last_exercise_index, learned_words) VALUES (%s, %s, %s, %s, %s, %s)",
                    (user_id, learned_words_count, exercise_score, last_card_index, last_exercise_index, learned_words)
                )
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'message': 'Progress saved'}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    finally:
        cur.close()
        conn.close()
