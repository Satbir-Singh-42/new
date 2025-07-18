import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/components/language-provider";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import LanguageSelection from "@/pages/onboarding/language-selection";
import KnowledgeAssessment from "@/pages/onboarding/knowledge-assessment";
import DailyGoal from "@/pages/onboarding/daily-goal";
import AgeSelection from "@/pages/onboarding/age-selection";
import QuizScreen from "@/pages/quiz/quiz-screen";
import CalculatorsScreen from "@/pages/calculators/calculators-screen";
import BudgetCalculator from "@/pages/calculators/budget-calculator";
import TaxCalculator from "@/pages/calculators/tax-calculator";
import EMICalculator from "@/pages/calculators/emi-calculator";
import InvestmentCalculator from "@/pages/calculators/investment-calculator";
import TasksScreen from "@/pages/tasks/tasks-screen";
import CreateTask from "@/pages/tasks/create-task";
import ProfileScreen from "@/pages/profile/profile-screen";
import TransactionsScreen from "@/pages/transactions/transactions-screen";
import AddTransaction from "@/pages/transactions/add-transaction";
import LessonsScreen from "@/pages/lessons/lessons-screen";
import NotificationsScreen from "@/pages/notifications/notifications-screen";
import AIChatScreen from "@/pages/ai-chat/ai-chat-screen";
import { useAuth } from "@/hooks/useAuth";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-shield-alt text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold mb-2">Face2Finance</h1>
          <p className="opacity-90">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/onboarding/*" component={Landing} />
        </>
      ) : !user?.onboardingCompleted ? (
        <>
          <Route path="/" component={LanguageSelection} />
          <Route path="/onboarding/language" component={LanguageSelection} />
          <Route path="/onboarding/knowledge" component={KnowledgeAssessment} />
          <Route path="/onboarding/goal" component={DailyGoal} />
          <Route path="/onboarding/age" component={AgeSelection} />
        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/quiz" component={QuizScreen} />
          <Route path="/calculators" component={CalculatorsScreen} />
          <Route path="/calculators/budget" component={BudgetCalculator} />
          <Route path="/calculators/tax" component={TaxCalculator} />
          <Route path="/calculators/emi" component={EMICalculator} />
          <Route path="/calculators/investment" component={InvestmentCalculator} />
          <Route path="/tasks" component={TasksScreen} />
          <Route path="/tasks/create" component={CreateTask} />
          <Route path="/profile" component={ProfileScreen} />
          <Route path="/transactions" component={TransactionsScreen} />
          <Route path="/transactions/add" component={AddTransaction} />
          <Route path="/lessons" component={LessonsScreen} />
          <Route path="/notifications" component={NotificationsScreen} />
          <Route path="/ai-chat" component={AIChatScreen} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <div className="max-w-md mx-auto bg-white min-h-screen relative overflow-hidden">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
