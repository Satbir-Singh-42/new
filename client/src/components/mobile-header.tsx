import { useEffect, useState } from "react";
import { Signal, Wifi, Battery } from "lucide-react";

interface MobileHeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export default function MobileHeader({ showBackButton, onBackClick }: MobileHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

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

  return (
    <div className="bg-white px-4 py-2 flex justify-between items-center text-sm font-medium border-b border-gray-100">
      <span className="font-semibold">{formatTime(currentTime)}</span>
      <div className="flex items-center space-x-1">
        <Signal className="w-4 h-4 text-gray-900" />
        <Wifi className="w-4 h-4 text-gray-900" />
        <Battery className="w-4 h-4 text-gray-900" />
      </div>
    </div>
  );
}
