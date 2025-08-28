import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@shared/schema";
import { z } from "zod";
import { CloudSun, Mail, Lock, User, UserPlus, Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/navbar";
import ValidationCard from "@/components/validation-card";

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { user, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [showValidationCard, setShowValidationCard] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"error" | "success">("error");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [showPasswordHelp, setShowPasswordHelp] = useState(false);

  // Check if password meets requirements
  const isPasswordValid = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 8;
    return hasUpperCase && hasLowerCase && hasNumber && hasMinLength;
  };

  // Handle password input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordValue(value);
    
    // Show help text only if password is not empty and doesn't meet requirements
    if (value.length > 0 && !isPasswordValid(value)) {
      setShowPasswordHelp(true);
    } else {
      setShowPasswordHelp(false);
    }
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  // Handle registration errors including server issues
  useEffect(() => {
    if (registerMutation.isError) {
      const errorMessage = registerMutation.error?.message || "";
      
      // Handle server errors
      if (errorMessage.includes("Server is currently unavailable") || errorMessage.includes("Failed to fetch")) {
        setValidationMessage("Server is down. Please try again later.");
        setValidationType("error");
        setShowValidationCard(true);
        setTimeout(() => {
          setShowValidationCard(false);
        }, 5000);
      } else {
        // Handle registration errors
        if (errorMessage.includes("Email already registered")) {
          setValidationMessage("This email is already registered. Please use a different email or try logging in instead.");
        } else if (errorMessage.includes("Username already taken")) {
          setValidationMessage("This username is already taken. Please choose a different username.");
        } else {
          setValidationMessage("Registration failed. Please check your information and try again.");
        }
        setValidationType("error");
        setShowValidationCard(true);
        setTimeout(() => {
          setShowValidationCard(false);
        }, 5000);
      }
    }
  }, [registerMutation.isError, registerMutation.error]);

  // Handle successful registration - show success card then redirect to dashboard
  useEffect(() => {
    if (registerMutation.isSuccess) {
      setValidationMessage("Account created successfully! Welcome to SolarScope AI.");
      setValidationType("success");
      setShowValidationCard(true);
      setTimeout(() => {
        setShowValidationCard(false);
        setLocation("/");
      }, 2500);
    }
  }, [registerMutation.isSuccess, setLocation]);

  // If user is already authenticated, redirect to dashboard (but not during registration process)
  useEffect(() => {
    if (user && !registerMutation.isPending && !registerMutation.isError && !registerMutation.isSuccess) {
      setLocation("/");
    }
  }, [user, setLocation, registerMutation.isPending, registerMutation.isError, registerMutation.isSuccess]);

  const onSubmit = (data: SignupForm) => {
    registerMutation.mutate(data);
  };



  return (
    <>
      
      {/* Validation Card - Positioned lower below navbar */}
      {showValidationCard && (
        <div className="fixed top-20 sm:top-24 md:top-28 right-2 sm:right-4 md:right-6 z-[10000] w-full max-w-xs sm:max-w-sm md:max-w-md px-2 sm:px-0">
          <ValidationCard
            type={validationType}
            title={validationType === "success" ? "Account Created" : "Registration Failed"}
            description={validationMessage}
            onClose={() => setShowValidationCard(false)}
          />
        </div>
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8" style={{ paddingTop: '5rem' }}>
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 space-y-8">
          
          {/* Hero Section - Top */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Join SolarSense AI
              </h1>
              <p className="text-xl sm:text-2xl text-gray-800 font-medium leading-relaxed">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-semibold">
                  Energy Trading & Simulation Platform
                </span>
              </p>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Join the decentralized energy marketplace. Trade surplus solar energy with neighbors and simulate grid scenarios.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 max-w-2xl mx-auto">
                <p className="text-sm sm:text-base text-blue-800 font-medium">
                  🔑 Demo Access: Use <strong>demo@solarsense.com</strong> / <strong>demo123</strong> to explore features instantly
                </p>
              </div>
            </div>
            
            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mt-8">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 bg-green-100 rounded-full">
                  <CloudSun className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800">Real Energy Trading</h3>
                <p className="text-xs text-gray-600">Trade surplus solar energy with verified households</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 bg-blue-100 rounded-full">
                  <UserPlus className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800">Grid Simulation</h3>
                <p className="text-xs text-gray-600">Test energy scenarios with AI-powered simulations</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800">AI Energy Advisor</h3>
                <p className="text-xs text-gray-600">Get personalized optimization recommendations</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800">Secure Data Storage</h3>
                <p className="text-xs text-gray-600">Data securely stored and accessible across devices</p>
              </div>
            </div>
          </div>
          
          {/* Signup Form - Center */}
          <div className="flex justify-center">
          <Card className="w-full max-w-sm sm:max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="space-y-1 text-center px-4 sm:px-6 py-4 sm:py-6">
              <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                  <CloudSun className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">
                Create Account
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600">
                Join thousands of solar professionals
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      className="pl-10 h-10 sm:h-11 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...register("username")}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-sm text-red-600">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-10 sm:h-11 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="pl-10 pr-10 h-10 sm:h-11 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...register("password", {
                        onChange: handlePasswordChange
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                  {showPasswordHelp && (
                    <p className="text-xs text-red-500">
                      Password must be at least 8 characters with uppercase, lowercase, and number
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 h-10 sm:h-11 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Trading Profile Section */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1-555-0123 (for trade verification)"
                      className="h-10 sm:h-11 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                        State <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue placeholder="Select your state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Alabama">Alabama</SelectItem>
                              <SelectItem value="Alaska">Alaska</SelectItem>
                              <SelectItem value="Arizona">Arizona</SelectItem>
                              <SelectItem value="Arkansas">Arkansas</SelectItem>
                              <SelectItem value="California">California</SelectItem>
                              <SelectItem value="Colorado">Colorado</SelectItem>
                              <SelectItem value="Connecticut">Connecticut</SelectItem>
                              <SelectItem value="Delaware">Delaware</SelectItem>
                              <SelectItem value="Florida">Florida</SelectItem>
                              <SelectItem value="Georgia">Georgia</SelectItem>
                              <SelectItem value="Hawaii">Hawaii</SelectItem>
                              <SelectItem value="Idaho">Idaho</SelectItem>
                              <SelectItem value="Illinois">Illinois</SelectItem>
                              <SelectItem value="Indiana">Indiana</SelectItem>
                              <SelectItem value="Iowa">Iowa</SelectItem>
                              <SelectItem value="Kansas">Kansas</SelectItem>
                              <SelectItem value="Kentucky">Kentucky</SelectItem>
                              <SelectItem value="Louisiana">Louisiana</SelectItem>
                              <SelectItem value="Maine">Maine</SelectItem>
                              <SelectItem value="Maryland">Maryland</SelectItem>
                              <SelectItem value="Massachusetts">Massachusetts</SelectItem>
                              <SelectItem value="Michigan">Michigan</SelectItem>
                              <SelectItem value="Minnesota">Minnesota</SelectItem>
                              <SelectItem value="Mississippi">Mississippi</SelectItem>
                              <SelectItem value="Missouri">Missouri</SelectItem>
                              <SelectItem value="Montana">Montana</SelectItem>
                              <SelectItem value="Nebraska">Nebraska</SelectItem>
                              <SelectItem value="Nevada">Nevada</SelectItem>
                              <SelectItem value="New Hampshire">New Hampshire</SelectItem>
                              <SelectItem value="New Jersey">New Jersey</SelectItem>
                              <SelectItem value="New Mexico">New Mexico</SelectItem>
                              <SelectItem value="New York">New York</SelectItem>
                              <SelectItem value="North Carolina">North Carolina</SelectItem>
                              <SelectItem value="North Dakota">North Dakota</SelectItem>
                              <SelectItem value="Ohio">Ohio</SelectItem>
                              <SelectItem value="Oklahoma">Oklahoma</SelectItem>
                              <SelectItem value="Oregon">Oregon</SelectItem>
                              <SelectItem value="Pennsylvania">Pennsylvania</SelectItem>
                              <SelectItem value="Rhode Island">Rhode Island</SelectItem>
                              <SelectItem value="South Carolina">South Carolina</SelectItem>
                              <SelectItem value="South Dakota">South Dakota</SelectItem>
                              <SelectItem value="Tennessee">Tennessee</SelectItem>
                              <SelectItem value="Texas">Texas</SelectItem>
                              <SelectItem value="Utah">Utah</SelectItem>
                              <SelectItem value="Vermont">Vermont</SelectItem>
                              <SelectItem value="Virginia">Virginia</SelectItem>
                              <SelectItem value="Washington">Washington</SelectItem>
                              <SelectItem value="West Virginia">West Virginia</SelectItem>
                              <SelectItem value="Wisconsin">Wisconsin</SelectItem>
                              <SelectItem value="Wyoming">Wyoming</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.state && (
                        <p className="text-sm text-red-600">{errors.state.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="district" className="text-sm font-medium text-gray-700">
                        District <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="district"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue placeholder="Select your district" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                              <SelectItem value="New York City">New York City</SelectItem>
                              <SelectItem value="Chicago">Chicago</SelectItem>
                              <SelectItem value="Houston">Houston</SelectItem>
                              <SelectItem value="Phoenix">Phoenix</SelectItem>
                              <SelectItem value="Philadelphia">Philadelphia</SelectItem>
                              <SelectItem value="San Antonio">San Antonio</SelectItem>
                              <SelectItem value="San Diego">San Diego</SelectItem>
                              <SelectItem value="Dallas">Dallas</SelectItem>
                              <SelectItem value="San Jose">San Jose</SelectItem>
                              <SelectItem value="Austin">Austin</SelectItem>
                              <SelectItem value="Jacksonville">Jacksonville</SelectItem>
                              <SelectItem value="Fort Worth">Fort Worth</SelectItem>
                              <SelectItem value="Columbus">Columbus</SelectItem>
                              <SelectItem value="Charlotte">Charlotte</SelectItem>
                              <SelectItem value="San Francisco">San Francisco</SelectItem>
                              <SelectItem value="Indianapolis">Indianapolis</SelectItem>
                              <SelectItem value="Seattle">Seattle</SelectItem>
                              <SelectItem value="Denver">Denver</SelectItem>
                              <SelectItem value="Washington DC">Washington DC</SelectItem>
                              <SelectItem value="Boston">Boston</SelectItem>
                              <SelectItem value="El Paso">El Paso</SelectItem>
                              <SelectItem value="Nashville">Nashville</SelectItem>
                              <SelectItem value="Detroit">Detroit</SelectItem>
                              <SelectItem value="Oklahoma City">Oklahoma City</SelectItem>
                              <SelectItem value="Portland">Portland</SelectItem>
                              <SelectItem value="Las Vegas">Las Vegas</SelectItem>
                              <SelectItem value="Memphis">Memphis</SelectItem>
                              <SelectItem value="Louisville">Louisville</SelectItem>
                              <SelectItem value="Baltimore">Baltimore</SelectItem>
                              <SelectItem value="Milwaukee">Milwaukee</SelectItem>
                              <SelectItem value="Albuquerque">Albuquerque</SelectItem>
                              <SelectItem value="Tucson">Tucson</SelectItem>
                              <SelectItem value="Fresno">Fresno</SelectItem>
                              <SelectItem value="Sacramento">Sacramento</SelectItem>
                              <SelectItem value="Kansas City">Kansas City</SelectItem>
                              <SelectItem value="Mesa">Mesa</SelectItem>
                              <SelectItem value="Virginia Beach">Virginia Beach</SelectItem>
                              <SelectItem value="Atlanta">Atlanta</SelectItem>
                              <SelectItem value="Colorado Springs">Colorado Springs</SelectItem>
                              <SelectItem value="Omaha">Omaha</SelectItem>
                              <SelectItem value="Raleigh">Raleigh</SelectItem>
                              <SelectItem value="Miami">Miami</SelectItem>
                              <SelectItem value="Long Beach">Long Beach</SelectItem>
                              <SelectItem value="Oakland">Oakland</SelectItem>
                              <SelectItem value="Minneapolis">Minneapolis</SelectItem>
                              <SelectItem value="Tampa">Tampa</SelectItem>
                              <SelectItem value="Cleveland">Cleveland</SelectItem>
                              <SelectItem value="Wichita">Wichita</SelectItem>
                              <SelectItem value="Arlington">Arlington</SelectItem>
                              <SelectItem value="New Orleans">New Orleans</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.district && (
                        <p className="text-sm text-red-600">{errors.district.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Solar System Configuration */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="space-y-2">
                    <Label htmlFor="householdName" className="text-sm font-medium text-gray-700">
                      Household Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="householdName"
                      type="text"
                      placeholder="e.g., Smith Family Solar Home"
                      className="h-10 sm:h-11 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...register("householdName")}
                    />
                    {errors.householdName && (
                      <p className="text-sm text-red-600">{errors.householdName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                      Physical Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="123 Solar Street, City, State (for energy grid mapping)"
                      className="h-10 sm:h-11 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...register("address")}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="solarCapacity" className="text-sm font-medium text-gray-700">
                        Solar Capacity (Watts) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="solarCapacity"
                        type="number"
                        placeholder="8000 (8kW typical)"
                        className="h-10 sm:h-11 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        {...register("solarCapacity")}
                      />
                      {errors.solarCapacity && (
                        <p className="text-sm text-red-600">{errors.solarCapacity.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="batteryCapacity" className="text-sm font-medium text-gray-700">
                        Battery Storage (kWh) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="batteryCapacity"
                        type="number"
                        placeholder="15 (Tesla Powerwall)"
                        className="h-10 sm:h-11 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        {...register("batteryCapacity")}
                      />
                      {errors.batteryCapacity && (
                        <p className="text-sm text-red-600">{errors.batteryCapacity.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Data Accuracy Confirmation */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="dataAccuracyConfirmed"
                      {...register("dataAccuracyConfirmed")}
                      data-testid="checkbox-data-accuracy"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="dataAccuracyConfirmed"
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        I confirm that all the details provided are accurate and understand that actions will be taken based on this information <span className="text-red-500">*</span>
                      </Label>
                    </div>
                  </div>
                  {errors.dataAccuracyConfirmed && (
                    <p className="text-sm text-red-600 mt-2">{errors.dataAccuracyConfirmed.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full h-10 sm:h-11 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl touch-manipulation"
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <div className="text-center pt-4">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login">
                      <span className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors duration-200">
                        Sign in here
                      </span>
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </>
  );
}