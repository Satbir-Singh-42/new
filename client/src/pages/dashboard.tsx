import { useQuery } from "@tanstack/react-query";
import { Bell, Search, Calculator, PiggyBank, Shield, Lock, Lightbulb, Target, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MobileHeader from "@/components/mobile-header";
import BottomNavigation from "@/components/bottom-navigation";
import CategoryGrid from "@/components/category-grid";
import ProgressCard from "@/components/progress-card";

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: progress } = useQuery({
    queryKey: ["/api/progress"],
  });

  const categories = [
    {
      id: "budgeting",
      name: "Budgeting",
      icon: Calculator,
      color: "bg-blue-100 text-blue-600",
      link: "/lessons?category=budgeting"
    },
    {
      id: "savings",
      name: "Saving & Investment",
      icon: PiggyBank,
      color: "bg-green-100 text-green-600",
      link: "/lessons?category=savings"
    },
    {
      id: "fraud",
      name: "Cyber Fraud Types",
      icon: Shield,
      color: "bg-orange-100 text-orange-600",
      link: "/lessons?category=fraud"
    },
    {
      id: "privacy",
      name: "Data Privacy & Protection",
      icon: Lock,
      color: "bg-blue-100 text-blue-600",
      link: "/lessons?category=privacy"
    },
    {
      id: "calculators",
      name: "Calculators",
      icon: Calculator,
      color: "bg-red-100 text-red-600",
      link: "/calculators"
    },
    {
      id: "tips",
      name: "Tips",
      icon: Lightbulb,
      color: "bg-yellow-100 text-yellow-600",
      link: "/lessons?category=tips"
    },
    {
      id: "quiz",
      name: "Quiz",
      icon: Target,
      color: "bg-green-100 text-green-600",
      link: "/quiz"
    },
    {
      id: "goals",
      name: "Goals",
      icon: Target,
      color: "bg-pink-100 text-pink-600",
      link: "/profile?tab=goals"
    },
  ];

  const progressCards = [
    {
      title: "Lessons Completed",
      value: progress?.lessonsCompleted || 0,
      color: "from-green-400 to-green-500"
    },
    {
      title: "Modules in Progress",
      value: progress?.modulesInProgress || 0,
      color: "from-orange-400 to-orange-500"
    },
    {
      title: "Goals Being Tracked",
      value: progress?.goalsTracked || 0,
      color: "from-pink-400 to-pink-500"
    },
    {
      title: "Quizzes Attempted",
      value: progress?.quizzesAttempted || 0,
      color: "from-blue-400 to-blue-500"
    },
  ];

  const featuredModules = [
    {
      title: "OTP Scam Explainer",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
      link: "/lessons/otp-scam"
    },
    {
      title: "Debt Card Fraud Tips",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
      link: "/lessons/card-fraud"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm opacity-90">Monday</p>
            <h2 className="text-lg font-semibold">25 October</h2>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/notifications">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
            <img 
              src={user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100"} 
              alt="User profile" 
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold mb-1">Hi, {user?.firstName || "User"}</h1>
          <p className="text-sm opacity-90">Welcome to Face2Finance</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 -mt-6 relative z-10">
        <Card className="shadow-sm border border-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Search className="h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Search tutorials, fraud types, or finance tips..." 
                className="border-0 focus-visible:ring-0 p-0"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      <div className="px-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
        <CategoryGrid categories={categories} />
      </div>

      {/* Progress Section */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Progress</h3>
          <Link href="/profile?tab=progress">
            <Button variant="ghost" className="text-primary text-sm font-medium p-0">
              More
            </Button>
          </Link>
        </div>
        
        <div className="space-y-4 mb-4">
          <Card className="shadow-sm border border-gray-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Design Changes</h4>
                  <p className="text-gray-500 text-sm">3 Days ago</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border border-gray-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Design Changes</h4>
                  <p className="text-gray-500 text-sm">1 Day ago</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Monthly Preview Cards */}
      <div className="px-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Preview</h3>
        <div className="grid grid-cols-2 gap-4">
          {progressCards.map((card, index) => (
            <ProgressCard key={index} {...card} />
          ))}
        </div>
      </div>

      {/* Featured Modules */}
      <div className="px-6 mt-6 mb-20">
        <h3 className="text-lg font-semibold mb-4">Featured Modules Lessons</h3>
        <div className="grid grid-cols-2 gap-4">
          {featuredModules.map((module, index) => (
            <Link key={index} href={module.link}>
              <Card className="overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <img 
                  src={module.image} 
                  alt={module.title}
                  className="w-full h-24 object-cover"
                />
                <CardContent className="p-3">
                  <div className="flex items-center space-x-1 mb-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-xs text-gray-500">{module.rating}</span>
                  </div>
                  <h4 className="font-medium text-sm">{module.title}</h4>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
