import { Home, PlayCircle, Calendar, CreditCard, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export default function BottomNavigation() {
  const [location] = useLocation();
  const { t } = useLanguage();

  const navItems = [
    {
      icon: Home,
      label: t.dashboard,
      path: "/",
      active: location === "/"
    },
    {
      icon: PlayCircle,
      label: t.lessons,
      path: "/lessons",
      active: location === "/lessons"
    },
    {
      icon: Calendar,
      label: t.tasks,
      path: "/tasks",
      active: location === "/tasks"
    },
    {
      icon: CreditCard,
      label: t.transactions,
      path: "/transactions",
      active: location === "/transactions"
    },
    {
      icon: User,
      label: t.profile,
      path: "/profile",
      active: location === "/profile"
    },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md w-full bg-white border-t border-gray-200 px-6 py-3 z-50">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <Button
              variant="ghost"
              className={`flex flex-col items-center space-y-1 h-auto p-2 min-w-0 ${
                item.active 
                  ? "text-primary" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
