import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Calendar as CalendarIcon, Search } from "lucide-react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { InsertTask } from "@shared/schema";

export default function CreateTask() {
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "general",
      priority: "medium",
      startTime: "",
      endTime: "",
      completed: false,
      tags: [],
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: InsertTask) => {
      return await apiRequest("POST", "/api/tasks", {
        ...data,
        dueDate: selectedDate,
        tags: selectedTags,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Task created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setLocation("/tasks");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const predefinedTags = [
    "design", "meeting", "coding", "art", "writing", "others"
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const onSubmit = (data: InsertTask) => {
    createTaskMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-primary text-white">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20"
            onClick={() => setLocation("/tasks")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold">Create a Task</h2>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label className="block text-sm mb-2">Name</Label>
            <Input
              {...form.register("title")}
              className="bg-transparent border-white/30 text-white placeholder-white/70"
              placeholder="Enter task name"
            />
            {form.formState.errors.title && (
              <p className="text-red-300 text-sm mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div>
            <Label className="block text-sm mb-2">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-transparent border-white/30 text-white hover:bg-white/20",
                    !selectedDate && "text-white/70"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-sm mb-2">Start Time</Label>
              <Input
                type="time"
                {...form.register("startTime")}
                className="bg-transparent border-white/30 text-white"
              />
            </div>
            <div>
              <Label className="block text-sm mb-2">End Time</Label>
              <Input
                type="time"
                {...form.register("endTime")}
                className="bg-transparent border-white/30 text-white"
              />
            </div>
          </div>

          <div>
            <Label className="block text-sm mb-2">Category</Label>
            <Select 
              value={form.watch("category")} 
              onValueChange={(value) => form.setValue("category", value)}
            >
              <SelectTrigger className="bg-transparent border-white/30 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="study">Study</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-sm mb-2">Priority</Label>
            <Select 
              value={form.watch("priority")} 
              onValueChange={(value) => form.setValue("priority", value)}
            >
              <SelectTrigger className="bg-transparent border-white/30 text-white">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-sm mb-2">Description</Label>
            <Textarea
              {...form.register("description")}
              className="bg-transparent border-white/30 text-white placeholder-white/70 resize-none"
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div>
            <Label className="block text-sm mb-2">Tags</Label>
            <div className="flex flex-wrap gap-2">
              {predefinedTags.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "border-white/30 text-white hover:bg-white/20",
                    selectedTags.includes(tag) && "bg-white/20"
                  )}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-white text-primary hover:bg-gray-100 font-semibold"
            disabled={createTaskMutation.isPending}
          >
            {createTaskMutation.isPending ? "Creating..." : "Create Task"}
          </Button>
        </form>
      </div>
    </div>
  );
}
