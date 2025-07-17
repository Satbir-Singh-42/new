import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Home, Star } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import MobileHeader from "@/components/mobile-header";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  points: number;
}

interface QuizAttempt {
  id: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

export default function QuizScreen() {
  const [currentView, setCurrentView] = useState("home");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizAttemptId, setQuizAttemptId] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  // Sample quiz data - in a real app this would come from the API
  const mockQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "What is the 50/30/20 rule in budgeting?",
      options: [
        "50% savings, 20% needs, 30% wants",
        "50% needs, 30% wants, 20% savings",
        "50% investment, 30% debt, 20% rent"
      ],
      correctAnswer: 1,
      points: 10,
      explanation: "The 50/30/20 rule suggests allocating 50% of income to needs, 30% to wants, and 20% to savings."
    },
    {
      id: 2,
      question: "What is compound interest?",
      options: [
        "Interest paid only on the principal amount",
        "Interest paid on both principal and accumulated interest",
        "Fixed interest rate that never changes"
      ],
      correctAnswer: 1,
      points: 10,
      explanation: "Compound interest is earned on both the original principal and previously earned interest."
    }
  ];

  const createQuizAttemptMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/quiz-attempts", {
        quizId: 1, // Sample quiz ID
      });
      return response.json();
    },
    onSuccess: (data) => {
      setQuizAttemptId(data.id);
    }
  });

  const updateQuizAttemptMutation = useMutation({
    mutationFn: async (data: { 
      attemptId: number; 
      answers: number[]; 
      score: number; 
      correctAnswers: number;
      completed: boolean;
    }) => {
      return await apiRequest("PATCH", `/api/quiz-attempts/${data.attemptId}`, {
        answers: data.answers,
        score: data.score,
        correctAnswers: data.correctAnswers,
        totalQuestions: mockQuestions.length,
        completed: data.completed,
        timeSpent: 120 // Sample time in seconds
      });
    },
    onSuccess: () => {
      setCurrentView("result");
    }
  });

  const startQuiz = () => {
    setCurrentView("map");
    createQuizAttemptMutation.mutate();
  };

  const startQuizQuestion = () => {
    setCurrentView("question");
    setCurrentQuestion(0);
    setSelectedAnswers([]);
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
        return count + (answer === mockQuestions[index].correctAnswer ? 1 : 0);
      }, 0);
      
      const score = Math.round((correctAnswers / mockQuestions.length) * 100);
      
      if (quizAttemptId) {
        updateQuizAttemptMutation.mutate({
          attemptId: quizAttemptId,
          answers: selectedAnswers,
          score,
          correctAnswers,
          completed: true
        });
      }
    }
  };

  // Quiz Home View
  if (currentView === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <MobileHeader showBackButton onBackClick={() => setLocation("/")} />
        
        <div className="p-6 text-center h-full flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex justify-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">?</span>
              </div>
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-lg">?</span>
              </div>
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-sm">?</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Interesting QUIZ</h2>
            <h3 className="text-xl font-semibold mb-2">Awaits You</h3>
            <p className="text-sm opacity-90">Find your financial strength and get custom advice</p>
          </div>
          
          <Button 
            onClick={startQuiz}
            className="bg-white text-purple-600 py-4 px-8 rounded-2xl font-semibold text-lg mb-8 hover:bg-gray-100"
            disabled={createQuizAttemptMutation.isPending}
          >
            {createQuizAttemptMutation.isPending ? "Starting..." : "Start Quiz"}
          </Button>
        </div>
      </div>
    );
  }

  // Quiz Map View
  if (currentView === "map") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <div className="p-6">
          <Button 
            variant="ghost" 
            className="mb-6 text-white hover:bg-white/20"
            onClick={() => setCurrentView("home")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold">Map 1</h2>
          </div>

          <div className="flex flex-col items-center space-y-8 min-h-96">
            <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center text-2xl font-bold">
              <Home className="w-8 h-8" />
            </div>
            
            <div className="w-1 h-16 bg-white bg-opacity-30"></div>
            
            <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-2xl font-bold border-4 border-white">
              1
            </div>
            
            <div className="w-1 h-16 bg-white bg-opacity-30"></div>
            
            <Button 
              onClick={startQuizQuestion}
              className="w-16 h-16 bg-white text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold hover:bg-gray-100"
            >
              1
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Question View
  if (currentView === "question") {
    const question = mockQuestions[currentQuestion];
    const selectedAnswer = selectedAnswers[currentQuestion];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <div className="p-6">
          <Button 
            variant="ghost" 
            className="mb-6 text-white hover:bg-white/20"
            onClick={() => setCurrentView("map")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="text-center mb-8">
            <h2 className="text-lg font-semibold mb-4">Question {currentQuestion + 1}</h2>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mb-4">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((currentQuestion + 1) / mockQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card className="mb-6 bg-white text-gray-800">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">?</span>
                </div>
                <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
              </div>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full p-4 text-left hover:bg-primary hover:text-white transition-colors h-auto ${
                      selectedAnswer === index ? 'ring-2 ring-primary bg-primary text-white' : ''
                    }`}
                    onClick={() => selectAnswer(index)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full bg-white text-purple-600 py-3 rounded-xl font-semibold hover:bg-gray-100"
            onClick={nextQuestion}
            disabled={selectedAnswer === undefined || updateQuizAttemptMutation.isPending}
          >
            {currentQuestion < mockQuestions.length - 1 ? "Next Question" : 
             updateQuizAttemptMutation.isPending ? "Submitting..." : "Finish Quiz"}
          </Button>
        </div>
      </div>
    );
  }

  // Quiz Result View
  if (currentView === "result") {
    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return count + (answer === mockQuestions[index].correctAnswer ? 1 : 0);
    }, 0);
    
    const score = Math.round((correctAnswers / mockQuestions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <div className="p-6 text-center h-full flex flex-col justify-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Nice Work</h2>
            <p className="text-lg opacity-90 mb-4">You finished with {score} pts!</p>
            
            <div className="flex justify-center mb-6">
              {[1, 2, 3].map((star) => (
                <Star 
                  key={star}
                  className={`w-8 h-8 mx-1 ${score >= star * 33 ? 'text-yellow-400 fill-current' : 'text-white opacity-30'}`}
                />
              ))}
            </div>
          </div>
          
          <Button 
            onClick={() => setLocation("/")}
            className="bg-white text-purple-600 py-4 px-8 rounded-2xl font-semibold text-lg mb-4 hover:bg-gray-100"
          >
            Go to Dashboard
          </Button>
          
          <Button 
            onClick={() => {
              setCurrentView("home");
              setCurrentQuestion(0);
              setSelectedAnswers([]);
              setQuizAttemptId(null);
            }}
            variant="outline"
            className="border-white text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:bg-white/20"
          >
            Do It Again
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
