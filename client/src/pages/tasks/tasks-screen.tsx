import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Edit3 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import MobileHeader from "@/components/mobile-header";
import BottomNavigation from "@/components/bottom-navigation";
import type { Task } from "@shared/schema";

export default function TasksScreen() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["/api/tasks"],
  });

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = currentDate.getDate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      
      <div className="p-6">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">{currentMonth}</h2>
          <Link href="/tasks/create">
            <Button className="bg-primary hover:bg-purple-600 text-sm">
              <Plus className="w-4 h-4 mr-1" />
              ADD TASK
            </Button>
          </Link>
        </div>

        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-1 mb-4 text-center text-sm text-gray-500">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-6 text-center text-sm">
          {calendarDays.map((day, index) => (
            <div 
              key={index} 
              className={`p-2 ${
                day === today ? 'bg-primary text-white rounded' : 
                day ? 'hover:bg-gray-100 cursor-pointer' : ''
              }`}
            >
              {day || ''}
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4">Tasks</h3>
        
        {tasks.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <Edit3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">No tasks yet</h4>
              <p className="text-gray-500 mb-4">Create your first task to get started with better time management</p>
              <Link href="/tasks/create">
                <Button className="bg-primary hover:bg-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 mb-20">
            {tasks.map((task: Task) => (
              <Card key={task.id} className="shadow-sm border border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Edit3 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      {task.description && (
                        <p className="text-gray-500 text-sm mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        {task.dueDate && (
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        )}
                        {task.startTime && task.endTime && (
                          <span>{task.startTime} - {task.endTime}</span>
                        )}
                        {task.category && (
                          <span className="px-2 py-1 bg-gray-100 rounded-full">{task.category}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {task.completed && (
                        <span className="text-green-500 text-xs">✓</span>
                      )}
                      <span className={`w-3 h-3 rounded-full ${
                        task.priority === 'high' ? 'bg-red-500' : 
                        task.priority === 'medium' ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}></span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
