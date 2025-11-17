import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

const vocabularyData = [
  { id: 1, english: 'Hello', russian: 'Привет', category: 'Базовые' },
  { id: 2, english: 'Goodbye', russian: 'До свидания', category: 'Базовые' },
  { id: 3, english: 'Thank you', russian: 'Спасибо', category: 'Базовые' },
  { id: 4, english: 'Beautiful', russian: 'Красивый', category: 'Прилагательные' },
  { id: 5, english: 'Learning', russian: 'Обучение', category: 'Существительные' },
  { id: 6, english: 'Wonderful', russian: 'Замечательный', category: 'Прилагательные' },
];

const grammarTopics = [
  {
    title: 'Present Simple',
    description: 'Простое настоящее время',
    content: 'Используется для описания регулярных действий, привычек и общих истин.',
    examples: ['I work every day', 'She speaks English', 'The sun rises in the east']
  },
  {
    title: 'Present Continuous',
    description: 'Настоящее длительное время',
    content: 'Используется для описания действий, происходящих в момент речи.',
    examples: ['I am working now', 'She is reading a book', 'They are playing football']
  },
  {
    title: 'Past Simple',
    description: 'Простое прошедшее время',
    content: 'Используется для описания завершенных действий в прошлом.',
    examples: ['I worked yesterday', 'She visited Paris last year', 'They played tennis on Sunday']
  },
  {
    title: 'Articles (a, an, the)',
    description: 'Артикли',
    content: 'A/an используются с исчисляемыми существительными в единственном числе. The - для конкретных предметов.',
    examples: ['I saw a cat', 'She is an engineer', 'The book on the table is mine']
  }
];

const exercises = [
  {
    id: 1,
    question: 'She ___ to school every day.',
    options: ['go', 'goes', 'going', 'gone'],
    correct: 1,
    topic: 'Present Simple'
  },
  {
    id: 2,
    question: 'I ___ a book right now.',
    options: ['read', 'reads', 'am reading', 'reading'],
    correct: 2,
    topic: 'Present Continuous'
  },
  {
    id: 3,
    question: 'They ___ football yesterday.',
    options: ['play', 'plays', 'playing', 'played'],
    correct: 3,
    topic: 'Past Simple'
  }
];

const blogPosts = [
  {
    id: 1,
    title: '10 советов для эффективного изучения английского',
    excerpt: 'Узнайте проверенные методы, которые помогут вам быстрее освоить английский язык и говорить уверенно.',
    date: '15 ноября 2024',
    readTime: '5 мин',
    category: 'Советы',
    content: 'Изучение английского языка — это путешествие, которое требует времени и усилий. Вот 10 советов, которые помогут вам на этом пути: 1) Занимайтесь каждый день хотя бы 15 минут. 2) Смотрите фильмы и сериалы на английском с субтитрами. 3) Читайте книги и статьи на интересующие вас темы. 4) Общайтесь с носителями языка онлайн. 5) Используйте флэш-карточки для запоминания новых слов.'
  },
  {
    id: 2,
    title: 'Самые распространенные ошибки в английском',
    excerpt: 'Разбираем типичные ошибки русскоговорящих студентов и способы их избежать.',
    date: '12 ноября 2024',
    readTime: '7 мин',
    category: 'Грамматика',
    content: 'Многие изучающие английский делают похожие ошибки. Одна из самых частых — неправильное использование артиклей. Русскоговорящие часто забывают про артикли, так как в русском языке их нет. Другая распространенная ошибка — порядок слов в предложении. В английском он более строгий, чем в русском.'
  },
  {
    id: 3,
    title: 'Как улучшить произношение: практические упражнения',
    excerpt: 'Простые и эффективные техники для работы над акцентом и четкостью речи.',
    date: '8 ноября 2024',
    readTime: '6 мин',
    category: 'Произношение',
    content: 'Хорошее произношение — ключ к уверенному общению. Начните с изучения фонетики и звуков, которых нет в русском языке. Записывайте свою речь и сравнивайте с носителями. Практикуйте скороговорки и повторяйте за аудио материалами.'
  },
  {
    id: 4,
    title: 'Лучшие приложения для изучения английского в 2024',
    excerpt: 'Обзор современных приложений и платформ, которые сделают обучение интересным и эффективным.',
    date: '5 ноября 2024',
    readTime: '8 мин',
    category: 'Ресурсы',
    content: 'Современные технологии открывают множество возможностей для изучения языков. Мы протестировали десятки приложений и отобрали лучшие для разных целей: от грамматики до разговорной практики.'
  },
  {
    id: 5,
    title: 'Английский для путешествий: базовые фразы',
    excerpt: 'Необходимый минимум английского для комфортного общения за границей.',
    date: '1 ноября 2024',
    readTime: '4 мин',
    category: 'Разговорный',
    content: 'Собираетесь в путешествие? Эти фразы помогут вам в отеле, ресторане, магазине и на улице. Выучите их заранее, и ваша поездка станет намного комфортнее.'
  },
  {
    id: 6,
    title: 'Времена в английском: полное руководство',
    excerpt: 'Подробный разбор всех времен с примерами и схемами для быстрого понимания.',
    date: '28 октября 2024',
    readTime: '12 мин',
    category: 'Грамматика',
    content: 'Времена в английском часто пугают начинающих. На самом деле, систему можно освоить быстро, если понять логику. В этой статье мы разберем все времена с практическими примерами.'
  }
];

function FlashCard({ word, onNext }: { word: typeof vocabularyData[0], onNext: () => void }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto">
      <div
        className={`relative h-64 cursor-pointer transition-transform duration-600 transform-style-3d ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="absolute w-full h-full backface-hidden">
          <Card className="h-full bg-gradient-to-br from-primary to-secondary shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="h-full flex flex-col items-center justify-center p-8">
              <Badge className="mb-4 bg-white/20 text-white">{word.category}</Badge>
              <h3 className="text-4xl font-bold text-white mb-4">{word.english}</h3>
              <p className="text-white/80 text-sm">Нажмите, чтобы увидеть перевод</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="absolute w-full h-full backface-hidden [transform:rotateY(180deg)]">
          <Card className="h-full bg-gradient-to-br from-secondary to-primary shadow-lg">
            <CardContent className="h-full flex flex-col items-center justify-center p-8">
              <Icon name="Languages" className="text-white mb-4" size={32} />
              <h3 className="text-4xl font-bold text-white mb-4">{word.russian}</h3>
              <p className="text-white/80 text-sm">Нажмите, чтобы вернуться</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <Button onClick={onNext} size="lg" className="px-8">
          Следующее слово <Icon name="ArrowRight" className="ml-2" size={20} />
        </Button>
      </div>
    </div>
  );
}

function ExerciseCard({ exercise, onAnswer }: { exercise: typeof exercises[0], onAnswer: (correct: boolean) => void }) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
    const isCorrect = index === exercise.correct;
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedAnswer(null);
      setShowResult(false);
    }, 1500);
  };

  return (
    <Card className="animate-fade-in">
      <CardContent className="p-6">
        <Badge className="mb-4">{exercise.topic}</Badge>
        <h3 className="text-xl font-semibold mb-6">{exercise.question}</h3>
        <div className="grid gap-3">
          {exercise.options.map((option, index) => (
            <Button
              key={index}
              variant={
                showResult
                  ? index === exercise.correct
                    ? 'default'
                    : index === selectedAnswer
                    ? 'destructive'
                    : 'outline'
                  : 'outline'
              }
              className="justify-start text-left h-auto py-3"
              onClick={() => !showResult && handleAnswer(index)}
              disabled={showResult}
            >
              {option}
              {showResult && index === exercise.correct && (
                <Icon name="CheckCircle2" className="ml-auto" size={20} />
              )}
              {showResult && index === selectedAnswer && index !== exercise.correct && (
                <Icon name="XCircle" className="ml-auto" size={20} />
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const PROGRESS_API = 'https://functions.poehali.dev/7c9ff1d7-87fa-4d64-851f-4d21653e6853';

function getUserId() {
  let userId = localStorage.getItem('english_learning_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('english_learning_user_id', userId);
  }
  return userId;
}

export default function Index() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [learnedWords, setLearnedWords] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedPost, setSelectedPost] = useState<typeof blogPosts[0] | null>(null);
  const [learnedWordIds, setLearnedWordIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const userId = getUserId();
        const response = await fetch(PROGRESS_API, {
          method: 'GET',
          headers: {
            'X-User-Id': userId
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setLearnedWords(data.learnedWordsCount || 0);
          setScore(data.exerciseScore || 0);
          setCurrentCardIndex(data.lastCardIndex || 0);
          setCurrentExercise(data.lastExerciseIndex || 0);
          setLearnedWordIds(data.learnedWords || []);
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProgress();
  }, []);

  const saveProgress = async () => {
    try {
      const userId = getUserId();
      await fetch(PROGRESS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          learnedWordsCount: learnedWords,
          exerciseScore: score,
          lastCardIndex: currentCardIndex,
          lastExerciseIndex: currentExercise,
          learnedWords: learnedWordIds
        })
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        saveProgress();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [learnedWords, score, currentCardIndex, currentExercise, learnedWordIds, isLoading]);

  const handleNextCard = () => {
    const newIndex = (currentCardIndex + 1) % vocabularyData.length;
    setCurrentCardIndex(newIndex);
    
    const currentWordId = vocabularyData[currentCardIndex].id;
    if (!learnedWordIds.includes(currentWordId)) {
      setLearnedWords((prev) => Math.min(prev + 1, vocabularyData.length));
      setLearnedWordIds((prev) => [...prev, currentWordId]);
    }
  };

  const handleExerciseAnswer = (correct: boolean) => {
    if (correct) setScore((prev) => prev + 1);
    setCurrentExercise((prev) => (prev + 1) % exercises.length);
  };

  const progress = (learnedWords / vocabularyData.length) * 100;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" className="animate-spin mx-auto mb-4 text-primary" size={48} />
          <p className="text-muted-foreground">Загрузка прогресса...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Icon name="GraduationCap" size={28} />
              </div>
              <h1 className="text-2xl font-bold">English Learning</h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-sm">
                <span className="text-muted-foreground">Прогресс:</span>
                <span className="font-semibold ml-2">{learnedWords}/{vocabularyData.length}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl font-bold mb-4">Изучай английский эффективно</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Флэш-карточки, грамматика и упражнения для быстрого освоения языка
            </p>
          </div>

          <div className="mb-12">
            <Card className="bg-white/90 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium">Ваш прогресс обучения</span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="flashcards" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="flashcards" className="text-base">
                <Icon name="CreditCard" className="mr-2" size={18} />
                Флэш-карточки
              </TabsTrigger>
              <TabsTrigger value="grammar" className="text-base">
                <Icon name="BookOpen" className="mr-2" size={18} />
                Грамматика
              </TabsTrigger>
              <TabsTrigger value="exercises" className="text-base">
                <Icon name="PenTool" className="mr-2" size={18} />
                Упражнения
              </TabsTrigger>
              <TabsTrigger value="blog" className="text-base">
                <Icon name="Newspaper" className="mr-2" size={18} />
                Блог
              </TabsTrigger>
            </TabsList>

            <TabsContent value="flashcards" className="mt-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold mb-2">Словарный запас</h3>
                <p className="text-muted-foreground">
                  Карточка {currentCardIndex + 1} из {vocabularyData.length}
                </p>
              </div>
              <FlashCard word={vocabularyData[currentCardIndex]} onNext={handleNextCard} />
            </TabsContent>

            <TabsContent value="grammar" className="mt-8">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-2xl font-semibold mb-6 text-center">Правила грамматики</h3>
                <Accordion type="single" collapsible className="space-y-4">
                  {grammarTopics.map((topic, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6 bg-white">
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        <div className="flex items-center">
                          <Icon name="BookMarked" className="mr-3 text-primary" size={20} />
                          <div className="text-left">
                            <div>{topic.title}</div>
                            <div className="text-sm text-muted-foreground font-normal">{topic.description}</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <p className="mb-4 text-foreground/80">{topic.content}</p>
                        <div className="bg-accent/50 p-4 rounded-lg">
                          <p className="font-semibold mb-2 text-sm">Примеры:</p>
                          <ul className="space-y-2">
                            {topic.examples.map((example, idx) => (
                              <li key={idx} className="flex items-start">
                                <Icon name="Check" className="mr-2 mt-0.5 text-primary flex-shrink-0" size={16} />
                                <span className="text-sm">{example}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="exercises" className="mt-8">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold mb-2">Практические упражнения</h3>
                  <p className="text-muted-foreground mb-4">
                    Упражнение {currentExercise + 1} из {exercises.length}
                  </p>
                  <Badge variant="outline" className="text-base px-4 py-1">
                    <Icon name="Trophy" className="mr-2" size={16} />
                    Правильных ответов: {score}
                  </Badge>
                </div>
                <ExerciseCard
                  exercise={exercises[currentExercise]}
                  onAnswer={handleExerciseAnswer}
                />
              </div>
            </TabsContent>

            <TabsContent value="blog" className="mt-8">
              <div className="max-w-5xl mx-auto">
                <h3 className="text-2xl font-semibold mb-8 text-center">Блог об изучении английского</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogPosts.map((post) => (
                    <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer group animate-fade-in" onClick={() => setSelectedPost(post)}>
                      <CardContent className="p-6">
                        <Badge className="mb-3">{post.category}</Badge>
                        <h4 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-muted-foreground mb-4 text-sm line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Icon name="Calendar" size={14} className="mr-1" />
                            {post.date}
                          </div>
                          <div className="flex items-center">
                            <Icon name="Clock" size={14} className="mr-1" />
                            {post.readTime}
                          </div>
                        </div>
                        <Button variant="ghost" className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          Читать статью
                          <Icon name="ArrowRight" className="ml-2" size={16} />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <footer className="border-t mt-16 py-8 bg-white/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 English Learning Platform. Учись с удовольствием!</p>
        </div>
      </footer>

      <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedPost && (
            <>
              <DialogHeader>
                <div className="mb-4">
                  <Badge className="mb-3">{selectedPost.category}</Badge>
                  <DialogTitle className="text-3xl font-bold mb-4">{selectedPost.title}</DialogTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Icon name="Calendar" size={16} className="mr-2" />
                      {selectedPost.date}
                    </div>
                    <div className="flex items-center">
                      <Icon name="Clock" size={16} className="mr-2" />
                      {selectedPost.readTime}
                    </div>
                  </div>
                </div>
              </DialogHeader>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-muted-foreground mb-6 italic">{selectedPost.excerpt}</p>
                <div className="text-foreground/90 leading-relaxed whitespace-pre-line">
                  {selectedPost.content}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}