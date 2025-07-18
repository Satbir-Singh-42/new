import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Volume2, 
  Smartphone,
  LogOut,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import MobileHeader from "@/components/mobile-header";
import BottomNavigation from "@/components/bottom-navigation";
import { LanguageSelector } from "@/components/language-selector";

export default function SettingsScreen() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const settingsGroups = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          title: "Profile Information",
          description: "Update your personal details",
          action: () => {},
          showArrow: true
        },
        {
          icon: Shield,
          title: "Security & Privacy",
          description: "Manage your account security",
          action: () => {},
          showArrow: true
        },
        {
          icon: Globe,
          title: "Language",
          description: "Change app language",
          customContent: <LanguageSelector variant="inline" showIcon={false} />
        }
      ]
    },
    {
      title: "Preferences",
      items: [
        {
          icon: Bell,
          title: "Notifications",
          description: "Push notifications and alerts",
          toggle: true,
          value: notifications,
          onChange: setNotifications
        },
        {
          icon: Moon,
          title: "Dark Mode",
          description: "Switch to dark theme",
          toggle: true,
          value: darkMode,
          onChange: setDarkMode
        },
        {
          icon: Volume2,
          title: "Sound Effects",
          description: "Game and interaction sounds",
          toggle: true,
          value: soundEnabled,
          onChange: setSoundEnabled
        },
        {
          icon: Smartphone,
          title: "Biometric Login",
          description: "Use fingerprint or face ID",
          toggle: true,
          value: biometricEnabled,
          onChange: setBiometricEnabled
        }
      ]
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          title: "Help & Support",
          description: "Get help and contact support",
          action: () => {},
          showArrow: true
        },
        {
          icon: Settings,
          title: "About",
          description: "App version and information",
          action: () => {},
          showArrow: true
        }
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{t.settings}</h1>
            <p className="text-sm opacity-90">Manage your app preferences</p>
          </div>
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Settings className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="px-6 -mt-4 relative z-10">
        <Card className="shadow-sm border border-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <img 
                src={user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100"} 
                alt="Profile" 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{user?.firstName} {user?.lastName}</h3>
                <p className="text-gray-600 text-sm">{user?.email}</p>
                <p className="text-purple-600 text-sm font-medium">Premium Member</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Groups */}
      <div className="px-6 mt-6 mb-20">
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">{group.title}</h3>
            <Card className="shadow-sm border border-gray-100">
              <CardContent className="p-0">
                {group.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                      
                      {item.customContent ? (
                        <div className="ml-4">
                          {item.customContent}
                        </div>
                      ) : item.toggle ? (
                        <Switch
                          checked={item.value}
                          onCheckedChange={item.onChange}
                          className="ml-4"
                        />
                      ) : item.showArrow ? (
                        <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
                      ) : null}
                    </div>
                    {itemIndex < group.items.length - 1 && (
                      <Separator className="ml-16" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Logout Button */}
        <Card className="shadow-sm border border-gray-100">
          <CardContent className="p-4">
            <Button 
              variant="destructive"
              className="w-full flex items-center justify-center space-x-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}