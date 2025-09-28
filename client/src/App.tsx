import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { ElementLight } from "@/pages/ElementLight";
import { TeamDashboard } from "@/pages/TeamDashboard";
import { TeamsListing } from "@/pages/TeamsListing";

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/" component={ElementLight} />
      <Route path="/team" component={TeamsListing} />
      <Route path="/team/:teamId" component={TeamDashboard} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
