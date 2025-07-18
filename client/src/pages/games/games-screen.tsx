import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { Trophy, Clock, Star, Play, Zap, CheckCircle, XCircle } from "lucide-react";
import MobileHeader from "@/components/mobile-header";
import BottomNavigation from "@/components/bottom-navigation";

export default function GamesScreen() {
  const { t } = useLanguage();

  const [currentGame, setCurrentGame] = useState(null);
  const [gameState, setGameState] = useState("menu"); // menu, playing, results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const games = [
    {
      id: "budget-hero",
      title: "Budget Hero",
      description: "Master budgeting skills by managing virtual finances",
      category: "budgeting",
      difficulty: "Easy",
      duration: "5 min",
      points: 50,
      completed: false,
      questions: [
        {
          question: "What is the 50/30/20 rule in budgeting?",
          options: [
            "50% savings, 30% rent, 20% food",
            "50% needs, 30% wants, 20% savings",
            "50% investment, 30% debt, 20% rent",
            "50% food, 30% savings, 20% entertainment"
          ],
          correct: 1,
          explanation: "The 50/30/20 rule allocates 50% of income to needs, 30% to wants, and 20% to savings and debt repayment."
        },
        {
          question: "Which expense is considered a 'need' in budgeting?",
          options: [
            "Streaming subscriptions",
            "Dining out",
            "Rent/mortgage",
            "Gaming purchases"
          ],
          correct: 2,
          explanation: "Rent or mortgage payments are essential housing costs and considered 'needs' in budgeting."
        },
        {
          question: "What's the first step in creating a budget?",
          options: [
            "Set financial goals",
            "Track your expenses",
            "Calculate your income",
            "Open a savings account"
          ],
          correct: 2,
          explanation: "You need to know how much money you have coming in before you can allocate it effectively."
        }
      ]
    },
    {
      id: "fraud-detective",
      title: "Fraud Detective",
      description: "Spot and prevent financial fraud in real scenarios",
      category: "security",
      difficulty: "Medium",
      duration: "10 min",
      points: 100,
      completed: true,
      questions: [
        {
          question: "What is a common sign of a phishing email?",
          options: [
            "Professional email address",
            "Urgent language requesting immediate action",
            "Proper grammar and spelling",
            "Company logo"
          ],
          correct: 1,
          explanation: "Phishing emails often use urgent language to pressure you into acting quickly without thinking."
        },
        {
          question: "What should you do if you receive a suspicious call asking for bank details?",
          options: [
            "Provide the information if they know your name",
            "Ask for their employee ID number",
            "Hang up and call your bank directly",
            "Transfer to a manager first"
          ],
          correct: 2,
          explanation: "Always hang up and call your bank directly using the number on your card or statement."
        }
      ]
    },
    {
      id: "investment-tycoon",
      title: "Investment Tycoon",
      description: "Build wealth through smart investment decisions",
      category: "investing",
      difficulty: "Hard",
      duration: "15 min",
      points: 150,
      completed: false,
      questions: [
        {
          question: "What is compound interest?",
          options: [
            "Interest paid only on the principal amount",
            "Interest earned on both principal and previous interest",
            "Interest that compounds monthly",
            "Interest that decreases over time"
          ],
          correct: 1,
          explanation: "Compound interest means you earn interest on both your original investment and previously earned interest."
        },
        {
          question: "What does diversification mean in investing?",
          options: [
            "Investing all money in one stock",
            "Spreading investments across different assets",
            "Only investing in tech companies",
            "Investing only in bonds"
          ],
          correct: 1,
          explanation: "Diversification spreads risk by investing in various assets, sectors, or geographic regions."
        }
      ]
    }
  ];

  const filteredGames = games;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const startGame = (game: any) => {
    setCurrentGame(game);
    setGameState("playing");
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === currentGame.questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < currentGame.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameState("results");
    }
  };

  const resetGame = () => {
    setCurrentGame(null);
    setGameState("menu");
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  // Game Menu Screen
  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader showBackButton={true} title="Games" />
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-b-3xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{t.games}</h1>
              <p className="text-sm opacity-90">Learn finance through fun games</p>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span className="font-bold">1,250</span>
            </div>
          </div>
        </div>



        {/* Games Grid */}
        <div className="px-6 mt-6 mb-20">
          <div className="grid gap-4">
            {filteredGames.map((game) => (
              <Card key={game.id} className="overflow-hidden shadow-sm border border-gray-100">
                <div className="flex">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <div className="text-white text-2xl">
                      {game.category === "budgeting" && "💰"}
                      {game.category === "security" && "🔒"}
                      {game.category === "investing" && "📈"}
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{game.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{game.description}</p>
                      </div>
                      {game.completed && (
                        <Badge className="bg-green-500 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {game.duration}
                      </div>
                      <Badge className={getDifficultyColor(game.difficulty)}>
                        {game.difficulty}
                      </Badge>
                      <div className="flex items-center text-sm text-purple-600">
                        <Zap className="w-4 h-4 mr-1" />
                        {game.points} pts
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => startGame(game)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {game.completed ? "Play Again" : "Play Now"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  // Game Playing Screen
  if (gameState === "playing") {
    const currentQ = currentGame.questions[currentQuestion];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
        <MobileHeader showBackButton={true} title="Playing Game" onBackClick={resetGame} />
        
        {/* Header */}
        <div className="text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <div className="text-sm opacity-90">Question {currentQuestion + 1} of {currentGame.questions.length}</div>
              <div className="text-lg font-bold">{currentGame.title}</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Score</div>
              <div className="text-lg font-bold">{score}/{currentGame.questions.length}</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / currentGame.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="px-6 mt-6">
          <Card className="p-6 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">?</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{currentQ.question}</h2>
            </div>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full p-4 h-auto text-left justify-start ${
                    selectedAnswer === index
                      ? showResult
                        ? index === currentQ.correct
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-red-500 text-white border-red-500"
                        : "bg-purple-500 text-white border-purple-500"
                      : showResult && index === currentQ.correct
                      ? "bg-green-100 border-green-500"
                      : "bg-white border-gray-200"
                  }`}
                  onClick={() => !showResult && selectAnswer(index)}
                  disabled={showResult}
                >
                  <div className="flex items-center">
                    {showResult && (
                      <div className="mr-3">
                        {index === currentQ.correct ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : selectedAnswer === index ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : null}
                      </div>
                    )}
                    <span className="text-sm">{option}</span>
                  </div>
                </Button>
              ))}
            </div>
            
            {showResult && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 mb-4">
                  <strong>Explanation:</strong> {currentQ.explanation}
                </p>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={nextQuestion}
                >
                  {currentQuestion < currentGame.questions.length - 1 ? "Next Question" : "View Results"}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  // Results Screen
  if (gameState === "results") {
    const percentage = Math.round((score / currentGame.questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
        <MobileHeader showBackButton={true} title="Game Results" onBackClick={resetGame} />
        
        <div className="text-white p-6 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Nice Work!</h1>
            <p className="text-lg opacity-90">You finished the quiz</p>
          </div>
          
          <Card className="p-6 mx-auto max-w-sm">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {score}/{currentGame.questions.length}
              </div>
              <div className="text-lg text-gray-600 mb-4">
                {percentage}% Correct
              </div>
              
              <div className="flex justify-center space-x-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-6 h-6 ${
                      i < Math.floor(percentage / 20) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`} 
                  />
                ))}
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => startGame(currentGame)}
                >
                  Play Again
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={resetGame}
                >
                  Back to Games
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}