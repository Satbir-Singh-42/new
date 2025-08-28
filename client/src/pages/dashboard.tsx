import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Search, Menu, CloudSun, MessageCircle, Bot, X, HelpCircle, User, LogOut } from "lucide-react";
import { Link } from "wouter";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

import AIChatWidget from "@/components/mobile-ai-chat-widget";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/navbar";
import ValidationCard from "@/components/validation-card";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'energy-dashboard' | 'energy-trading'>('energy-dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showValidationCard, setShowValidationCard] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"success" | "error" | "warning">("warning");
  const { user, logoutMutation, healthStatus } = useAuth();

  // Check URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab === 'energy-trading') {
      setActiveTab('energy-trading');
    } else if (tab === 'energy-dashboard') {
      setActiveTab('energy-dashboard');
    }
  }, []);

  // Show server unavailability message only for authenticated users who lose session
  useEffect(() => {
    // Only show server error if user was authenticated and server/database is down
    // Don't show for AI service issues (quota limits) - only for actual server/database problems
    if (healthStatus && user && (!healthStatus.server || !healthStatus.database) && healthStatus.message) {
      setValidationMessage(healthStatus.message);
      setValidationType("error");
      setShowValidationCard(true);
      setTimeout(() => {
        setShowValidationCard(false);
      }, 8000);
    }
  }, [healthStatus, user]);

  // Show logout success message after page reload
  useEffect(() => {
    const logoutSuccess = localStorage.getItem("logoutSuccess");
    if (logoutSuccess === "true") {
      localStorage.removeItem("logoutSuccess");
      setValidationMessage("You have logged out successfully.");
      setValidationType("success");
      setShowValidationCard(true);
      setTimeout(() => {
        setShowValidationCard(false);
      }, 3000);
    }
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar 
        currentPage="dashboard" 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.history.pushState({}, '', `/?tab=${tab}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Hero Section - Now visible on all devices */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-white pb-6 sm:pb-8 md:pb-10 lg:pb-12 xl:pb-16" style={{ paddingTop: '3.75rem' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center flex flex-col justify-center items-center min-h-[150px] sm:min-h-[160px] md:min-h-[170px] lg:min-h-[180px] xl:min-h-[190px] pt-6 sm:pt-8 md:pt-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 lg:mb-8">SolarSense: Intelligent Energy Solutions</h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 px-2 max-w-4xl mx-auto">
              Decentralized energy trading platform for a sustainable future
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Tabs - Positioned below hero section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex border-b border-border">
            <button
              onClick={() => {
                setActiveTab('energy-dashboard');
                window.history.pushState({}, '', '/?tab=energy-dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'energy-dashboard'
                  ? 'text-primary border-b-2 border-primary bg-blue-50'
                  : 'text-secondary-custom hover:text-primary hover:bg-gray-50'
              }`}
            >
              <Home className="inline mr-1 sm:mr-2" size={16} />
              <span>Energy</span>
              <span className="hidden sm:inline"> Dashboard</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('energy-trading');
                window.history.pushState({}, '', '/?tab=energy-trading');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'energy-trading'
                  ? 'text-primary border-b-2 border-primary bg-blue-50'
                  : 'text-secondary-custom hover:text-primary hover:bg-gray-50'
              }`}
            >
              <Search className="inline mr-1 sm:mr-2" size={16} />
              <span>Energy</span>
              <span className="hidden sm:inline"> Trading</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Application Interface */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Content Sections */}
        {activeTab === 'energy-dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Total Households</h3>
                <p className="text-3xl font-bold text-primary">0</p>
                <p className="text-sm text-gray-600">Connected to your network</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Active Trades</h3>
                <p className="text-3xl font-bold text-green-600">0</p>
                <p className="text-sm text-gray-600">Energy exchanges in progress</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Energy Produced</h3>
                <p className="text-3xl font-bold text-blue-600">0 kWh</p>
                <p className="text-sm text-gray-600">Total solar generation today</p>
              </Card>
            </div>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Getting Started with SolarSense</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-2">1. Register Your Household</h4>
                  <p className="text-sm text-gray-600">Add your solar installation and battery details to join the energy trading network.</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-2">2. Monitor Energy Flow</h4>
                  <p className="text-sm text-gray-600">Track your energy production, consumption, and battery levels in real-time.</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-2">3. Trade Energy</h4>
                  <p className="text-sm text-gray-600">Buy and sell surplus energy with neighbors for optimal grid balance.</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-2">4. AI Optimization</h4>
                  <p className="text-sm text-gray-600">Let our AI optimize energy distribution and trading opportunities for you.</p>
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {activeTab === 'energy-trading' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Energy Trading Marketplace</h2>
              <Button>
                <span className="mr-2">⚡</span>
                Create Trade Offer
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Available Energy Offers</h3>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded text-center text-gray-500">
                    No energy offers available yet. Be the first to create one!
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Energy Demand Requests</h3>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded text-center text-gray-500">
                    No energy requests at the moment. Check back during peak hours.
                  </div>
                </div>
              </Card>
            </div>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">How Energy Trading Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <h4 className="font-semibold mb-2">Surplus Generation</h4>
                  <p className="text-sm text-gray-600">When your solar panels produce more energy than you consume, create a sell offer.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <h4 className="font-semibold mb-2">Smart Matching</h4>
                  <p className="text-sm text-gray-600">Our AI automatically matches energy offers with nearby demand for optimal distribution.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h4 className="font-semibold mb-2">Instant Transfer</h4>
                  <p className="text-sm text-gray-600">Energy is transferred instantly through the smart grid with automatic billing.</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* AI Chat Widget */}
      <AIChatWidget />
      
      {/* Validation Card for Server Issues and Logout - Responsive positioning below navbar */}
      {showValidationCard && (
        <div className="fixed top-20 sm:top-24 md:top-28 right-2 sm:right-4 md:right-6 z-[10000] w-full max-w-xs sm:max-w-sm md:max-w-md px-2 sm:px-0">
          <ValidationCard
            type={validationType}
            title={validationType === "success" ? "Logout Successful" : "Server Notice"}
            description={validationMessage}
            onClose={() => setShowValidationCard(false)}
          />
        </div>
      )}
    </div>
  );
}
