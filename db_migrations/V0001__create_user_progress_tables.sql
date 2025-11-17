CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    learned_words_count INTEGER DEFAULT 0,
    exercise_score INTEGER DEFAULT 0,
    last_card_index INTEGER DEFAULT 0,
    last_exercise_index INTEGER DEFAULT 0,
    learned_words TEXT DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);

CREATE TABLE IF NOT EXISTS vocabulary_stats (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    word_id INTEGER NOT NULL,
    times_viewed INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_learned BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, word_id)
);

CREATE INDEX idx_vocabulary_stats_user_id ON vocabulary_stats(user_id);