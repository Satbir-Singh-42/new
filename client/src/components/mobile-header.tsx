import { useEffect, useState } from "react";
import { Signal, Wifi, Battery, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface MobileHeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  title?: string;
}

export default function MobileHeader({ showBackButton, onBackClick, title }: MobileHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      setLocation("/");
    }
  };

  return (
    <div className="bg-white px-4 py-2 flex justify-between items-center text-sm font-medium border-b border-gray-100">
      <div className="flex items-center space-x-2">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleBackClick}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <span className="font-semibold">{title || formatTime(currentTime)}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Signal className="w-4 h-4 text-gray-900" />
        <Wifi className="w-4 h-4 text-gray-900" />
        <Battery className="w-4 h-4 text-gray-900" />
      </div>
    </div>
  );
}
