import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import MobileHeader from "@/components/mobile-header";

export default function CalculatorsScreen() {
  const [, setLocation] = useLocation();

  const calculators = [
    {
      id: "budget",
      title: "Budget Planner",
      description: "Smart expense tracking",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=80&h=80",
      link: "/calculators/budget"
    },
    {
      id: "emi",
      title: "EMI Calculator",
      description: "Loan payment calculator",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=80&h=80",
      link: "/calculators/emi"
    },
    {
      id: "tax",
      title: "Tax Estimator",
      description: "Income tax calculation",
      image: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=80&h=80",
      link: "/calculators/tax"
    },
    {
      id: "investment",
      title: "Investment Calculator",
      description: "ROI & compound interest",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=80&h=80",
      link: "/calculators/investment"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-800 text-white p-6">
        <Button 
          variant="ghost" 
          className="mb-4 text-white hover:bg-white/20"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-semibold">Financial Calculators</h2>
      </div>

      <div className="p-6">
        <p className="text-gray-600 mb-6">{calculators.length} Calculators</p>
        <p className="text-sm text-gray-500 mb-8">
          Easy Tax Calculator along with steps to use tools. This is why a 5 year review plan is crucial and different elements.
        </p>

        <div className="space-y-4">
          {calculators.map((calculator) => (
            <Link key={calculator.id} href={calculator.link}>
              <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center space-x-4">
                  <img 
                    src={calculator.image} 
                    alt={calculator.title}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{calculator.title}</h3>
                    <p className="text-gray-500 text-sm">{calculator.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-primary" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
