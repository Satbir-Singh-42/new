import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Play, Star } from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import MobileHeader from "@/components/mobile-header";
import BottomNavigation from "@/components/bottom-navigation";
import type { LearningModule } from "@shared/schema";

export default function LessonsScreen() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ["/api/modules", selectedCategory === "all" ? undefined : selectedCategory],
  });

  const { data: userLessons = [] } = useQuery({
    queryKey: ["/api/lessons"],
  });

  const categories = [
    { id: "all", name: "All" },
    { id: "budgeting", name: "Budgeting" },
    { id: "savings", name: "Savings" },
    { id: "fraud", name: "Fraud Prevention" },
    { id: "privacy", name: "Data Privacy" },
    { id: "tips", name: "Tips" },
  ];

  // Get filtered modules from database
  const filteredModules = selectedCategory === "all" 
    ? modules 
    : modules.filter(module => module.category === selectedCategory);

  const getUserProgress = (moduleId: string) => {
    const userLesson = userLessons.find(lesson => lesson.moduleId === moduleId);
    return userLesson ? userLesson.progress : 0;
  };

  const featuredModules = [
    {
      id: 1,
      title: "Budgeting",
      description: "Budget and Tracking",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=200&h=120",
      category: "budgeting"
    },
    {
      id: 2,
      title: "Giving & Investment",
      description: "Capital Building",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=200&h=120",
      category: "savings"
    },
    {
      id: 3,
      title: "Tax Basics",
      description: "Tax filing and planning",
      image: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=200&h=120",
      category: "tax"
    },
    {
      id: 4,
      title: "Fraud Awareness",
      description: "Protect your money",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=200&h=120",
      category: "fraud"
    },
    {
      id: 5,
      title: "Data Privacy",
      description: "Protection tips and sharing",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=200&h=120",
      category: "privacy"
    },
    {
      id: 6,
      title: "Financial Calculators",
      description: "EMI, tax, budget tools",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=200&h=120",
      category: "tools"
    },
  ];

  const specialModules = [
    {
      title: "OTP Scam Explainer",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=200&h=120",
      category: "fraud"
    },
    {
      title: "Debt Card Fraud Tips",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?auto=format&fit=crop&w=200&h=120",
      category: "fraud"
    },
  ];

  const getUserLessonProgress = (moduleId: number) => {
    const userLesson = userLessons.find((lesson: any) => lesson.moduleId === moduleId);
    return userLesson ? userLesson.progress : 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      
      <div className="bg-primary text-white p-6">
        <Button 
          variant="ghost" 
          className="mb-4 text-white hover:bg-white/20"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-semibold">Ready To Learn?</h2>
        <p className="text-sm opacity-90 mt-2">Smart tutorials, fraud types, or finance tips</p>
      </div>

      <div className="p-6">
        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap ${
                  selectedCategory === category.id 
                    ? "bg-primary text-white" 
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Real Database Modules Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {filteredModules.slice(0, 6).map((module) => (
            <Card key={module._id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <img 
                src={`https://images.unsplash.com/photo-${module.category === 'fraud' ? '1563013544-824ae1b704d3' : '1554224155-6726b3ff858f'}?auto=format&fit=crop&w=200&h=120`}
                alt={module.title}
                className="w-full h-24 object-cover"
              />
              <CardContent className="p-3">
                <h4 className="font-medium text-sm mb-1">{module.title}</h4>
                <p className="text-xs text-gray-500">{module.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{module.category}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">{module.duration}min</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Play className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                  <div 
                    className="bg-primary h-1 rounded-full transition-all duration-300"
                    style={{ width: `${getUserProgress(module._id)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Popular Modules Section */}
        <h3 className="text-lg font-semibold mb-4">Popular Lessons</h3>
        <div className="grid grid-cols-1 gap-4 mb-6">
          {modules.slice(0, 3).map((module) => (
            <Card key={module._id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex">
                <img 
                  src={`https://images.unsplash.com/photo-${module.category === 'fraud' ? '1563013544-824ae1b704d3' : '1554224155-6726b3ff858f'}?auto=format&fit=crop&w=80&h=80`}
                  alt={module.title}
                  className="w-20 h-20 object-cover"
                />
                <CardContent className="p-3 flex-1">
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-500">4.8</span>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{module.title}</h4>
                  <p className="text-xs text-gray-500 mb-2">{module.category} • {module.duration} min</p>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-primary h-1 rounded-full transition-all duration-300"
                      style={{ width: `${getUserProgress(module._id)}%` }}
                    ></div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* All Modules Section */}
        <h3 className="text-lg font-semibold mb-4">All Lessons</h3>
        <div className="grid grid-cols-1 gap-4 mb-20">
          {filteredModules.map((module) => (
            <Card key={module._id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex">
                <img 
                  src={`https://images.unsplash.com/photo-${module.category === 'fraud' ? '1563013544-824ae1b704d3' : '1554224155-6726b3ff858f'}?auto=format&fit=crop&w=80&h=80`}
                  alt={module.title}
                  className="w-20 h-20 object-cover"
                />
                <CardContent className="p-3 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{module.title}</h4>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{module.duration}min</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{module.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 capitalize">{module.category}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-primary h-1 rounded-full transition-all duration-300"
                        style={{ width: `${getUserProgress(module._id)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {modules.length === 0 && (
          <Card className="p-8 text-center">
            <CardContent>
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">No lessons available</h4>
              <p className="text-gray-500 mb-4">Check back later for new learning content</p>
              <Button onClick={() => setLocation("/")} className="bg-primary hover:bg-purple-600">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
