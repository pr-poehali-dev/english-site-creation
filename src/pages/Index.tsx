import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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

export default function Index() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [learnedWords, setLearnedWords] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState(0);

  const handleNextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % vocabularyData.length);
    setLearnedWords((prev) => Math.min(prev + 1, vocabularyData.length));
  };

  const handleExerciseAnswer = (correct: boolean) => {
    if (correct) setScore((prev) => prev + 1);
    setCurrentExercise((prev) => (prev + 1) % exercises.length);
  };

  const progress = (learnedWords / vocabularyData.length) * 100;

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
            <TabsList className="grid w-full grid-cols-3 mb-8">
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
          </Tabs>
        </div>
      </section>

      <footer className="border-t mt-16 py-8 bg-white/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 English Learning Platform. Учись с удовольствием!</p>
        </div>
      </footer>
    </div>
  );
}
