import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { Trophy, Clock, Star, Play, Zap } from "lucide-react";
import MobileHeader from "@/components/mobile-header";
import BottomNavigation from "@/components/bottom-navigation";

export default function GamesScreen() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const games = [
    {
      id: "budget-hero",
      title: "Budget Hero",
      description: "Master budgeting skills by managing virtual finances",
      category: "budgeting",
      difficulty: "Easy",
      duration: "5 min",
      points: 50,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop",
      completed: false
    },
    {
      id: "fraud-detective",
      title: "Fraud Detective",
      description: "Spot and prevent financial fraud in real scenarios",
      category: "security",
      difficulty: "Medium",
      duration: "10 min",
      points: 100,
      image: "https://images.unsplash.com/photo-1551808525-51a94da548ce?w=300&h=200&fit=crop",
      completed: true
    },
    {
      id: "investment-tycoon",
      title: "Investment Tycoon",
      description: "Build wealth through smart investment decisions",
      category: "investing",
      difficulty: "Hard",
      duration: "15 min",
      points: 150,
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop",
      completed: false
    },
    {
      id: "savings-challenge",
      title: "Savings Challenge",
      description: "Complete daily savings goals and build habits",
      category: "savings",
      difficulty: "Easy",
      duration: "3 min",
      points: 30,
      image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=300&h=200&fit=crop",
      completed: false
    },
    {
      id: "crypto-quiz",
      title: "Crypto Quiz Master",
      description: "Test your knowledge of cryptocurrency basics",
      category: "crypto",
      difficulty: "Medium",
      duration: "8 min",
      points: 80,
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=300&h=200&fit=crop",
      completed: false
    },
    {
      id: "tax-ninja",
      title: "Tax Ninja",
      description: "Navigate tax scenarios and maximize deductions",
      category: "taxes",
      difficulty: "Hard",
      duration: "12 min",
      points: 120,
      image: "https://images.unsplash.com/photo-1554224154-26032fced8bd?w=300&h=200&fit=crop",
      completed: false
    }
  ];

  const categories = [
    { id: "all", name: "All Games", count: games.length },
    { id: "budgeting", name: "Budgeting", count: games.filter(g => g.category === "budgeting").length },
    { id: "security", name: "Security", count: games.filter(g => g.category === "security").length },
    { id: "investing", name: "Investing", count: games.filter(g => g.category === "investing").length },
    { id: "savings", name: "Savings", count: games.filter(g => g.category === "savings").length },
  ];

  const filteredGames = selectedCategory === "all" 
    ? games 
    : games.filter(game => game.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      
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

      {/* Categories */}
      <div className="px-6 -mt-4 relative z-10">
        <div className="flex space-x-3 overflow-x-auto pb-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`whitespace-nowrap ${
                selectedCategory === category.id
                  ? "bg-purple-600 text-white"
                  : "bg-white border-gray-200"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
              <Badge variant="secondary" className="ml-2">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      <div className="px-6 mt-6 mb-20">
        <div className="grid gap-4">
          {filteredGames.map((game) => (
            <Card key={game.id} className="overflow-hidden shadow-sm border border-gray-100">
              <div className="flex">
                <img 
                  src={game.image} 
                  alt={game.title}
                  className="w-24 h-24 object-cover"
                />
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
                    disabled={game.completed}
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