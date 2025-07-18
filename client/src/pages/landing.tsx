import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Shield, ArrowLeft, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Landing() {
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    email: "", 
    password: "", 
    confirmPassword: "",
    firstName: "", 
    lastName: "",
    phoneNumber: "",
    agreeToTerms: false
  });
  
  const { login, register, isLoggingIn, isRegistering } = useAuth();
  const { toast } = useToast();

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.querySelector(`input[data-otp-index="${index + 1}"]`) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-otp-index="${index - 1}"]`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  // Splash Screen
  if (currentScreen === "splash") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 text-white flex flex-col items-center justify-center p-8">
        <div className="mb-8">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Face2Finance</h1>
        <p className="text-center text-lg opacity-90 mb-8">Learn Your Way</p>
        <p className="text-center text-sm opacity-75 mb-12 max-w-xs">Get protection for financial literacy, not tools, not body, not body</p>
        
        <div className="flex justify-between w-full mt-auto">
          <Button 
            variant="ghost" 
            className="text-white"
            onClick={() => setCurrentScreen("login")}
          >
            Back
          </Button>
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
            <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
          </div>
          <Button 
            variant="ghost" 
            className="text-white"
            onClick={() => setCurrentScreen("login")}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  // Login Screen
  if (currentScreen === "login") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Face2Finance</h2>
          <Button 
            variant="ghost" 
            className="text-primary text-sm font-medium"
            onClick={() => setForgotPasswordOpen(true)}
          >
            FORGOT PASSWORD ?...
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Welcome Back</h3>
              <p className="text-gray-600">Login to continue</p>
            </div>

            <form className="space-y-4">
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Enter your username or phone number</Label>
                <Input 
                  type="email" 
                  placeholder="lazy@gmail.com" 
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                />
              </div>
              
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Password</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password@1234567890"
                    className="pr-10"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="text-right">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="text-primary text-sm font-medium p-0"
                  onClick={() => setForgotPasswordOpen(true)}
                >
                  Forgot Password?
                </Button>
              </div>

              <Button 
                type="button" 
                className="w-full bg-primary hover:bg-purple-600"
                onClick={async () => {
                  if (!loginData.email || !loginData.password) {
                    toast({ 
                      title: "Validation Error", 
                      description: "Please fill in all fields",
                      variant: "destructive"
                    });
                    return;
                  }
                  try {
                    await login(loginData);
                    toast({ title: "Success", description: "Logged in successfully!" });
                    // Force a reload to ensure authentication state is properly updated
                    setTimeout(() => {
                      window.location.reload();
                    }, 500);
                  } catch (error: any) {
                    toast({ 
                      title: "Login Failed", 
                      description: error.message || "Please check your credentials",
                      variant: "destructive"
                    });
                  }
                }}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "LOGGING IN..." : "LOG IN"}
              </Button>
            </form>

            <div className="text-center mt-4">
              <span className="text-gray-600">Don't have an account? </span>
              <Button 
                variant="ghost" 
                className="text-primary font-medium p-0"
                onClick={() => setCurrentScreen("signup")}
              >
                Sign up
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Forgot Password Modal */}
        <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
          <DialogContent className="sm:max-w-md bottom-0 sm:bottom-auto">
            <DialogHeader>
              <DialogTitle>Forgot your Password?</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">Enter your Phone number and we will Share a OTP to create a new password</p>
              <Input type="tel" placeholder="Enter your contact number" />
              <Button 
                className="w-full"
                onClick={() => {
                  setForgotPasswordOpen(false);
                  setCurrentScreen("otp");
                }}
              >
                Send
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // OTP Screen
  if (currentScreen === "otp") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => setCurrentScreen("login")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">Enter the verify code</h2>
          <p className="text-gray-600">Verify your contact number</p>
          <p className="text-gray-400 text-sm">+91936749208</p>
        </div>

        <div className="flex justify-center space-x-3 mb-8">
          {otpValues.map((value, index) => (
            <Input
              key={index}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              data-otp-index={index}
              className="w-12 h-12 text-center text-lg font-semibold"
            />
          ))}
        </div>

        <Button 
          className="w-full mb-4"
          onClick={() => setCurrentScreen("resetPassword")}
        >
          SUBMIT CODE
        </Button>

        <div className="text-center">
          <p className="text-gray-500 text-sm mb-2">The verify code will expire in 00:59</p>
          <Button variant="ghost" className="text-primary font-medium">Resend Code</Button>
        </div>
      </div>
    );
  }

  // Reset Password Screen
  if (currentScreen === "resetPassword") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => setCurrentScreen("otp")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">Reset password</h2>
        </div>

        <form className="space-y-4 mb-6">
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">New Password</Label>
            <Input type="password" />
          </div>
          
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Confirm New Password</Label>
            <Input type="password" />
          </div>

          <Button 
            type="button" 
            className="w-full"
            onClick={() => setSuccessModalOpen(true)}
          >
            Submit
          </Button>
        </form>

        {/* Success Modal */}
        <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
          <DialogContent className="sm:max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <DialogTitle className="mb-2">
                {currentScreen === "resetPassword" ? "Password reset successful!" : "Account created successfully!"}
              </DialogTitle>
              <p className="text-gray-600 text-sm mb-6">
                {currentScreen === "resetPassword" 
                  ? "You can now login with your new password" 
                  : "Complete your onboarding to get personalized financial tips"}
              </p>
              
              <Button 
                className="w-full"
                onClick={() => {
                  setSuccessModalOpen(false);
                  if (currentScreen === "resetPassword") {
                    setCurrentScreen("login");
                  } else {
                    // Redirect to onboarding
                    window.location.href = "/onboarding/language";
                  }
                }}
              >
                {currentScreen === "resetPassword" ? "Proceed" : "CONTINUE"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Signup Screen
  if (currentScreen === "signup") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Face2Finance</h2>
          <p className="text-primary font-medium">Create An Account</p>
        </div>

        <form className="space-y-4 mb-6">
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Email</Label>
            <Input 
              type="email" 
              placeholder="example@gmail.com"
              value={signupData.email}
              onChange={(e) => setSignupData({...signupData, email: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm text-gray-600 mb-2 block">First Name</Label>
              <Input 
                type="text" 
                placeholder="John"
                value={signupData.firstName}
                onChange={(e) => setSignupData({...signupData, firstName: e.target.value})}
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600 mb-2 block">Last Name</Label>
              <Input 
                type="text" 
                placeholder="Doe"
                value={signupData.lastName}
                onChange={(e) => setSignupData({...signupData, lastName: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Phone Number</Label>
            <Input 
              type="tel" 
              placeholder="+91 787885505"
              value={signupData.phoneNumber}
              onChange={(e) => setSignupData({...signupData, phoneNumber: e.target.value})}
            />
          </div>
          
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Password</Label>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="***"
                className="pr-10"
                value={signupData.password}
                onChange={(e) => setSignupData({...signupData, password: e.target.value})}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Confirm Password</Label>
            <div className="relative">
              <Input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="***"
                className="pr-10"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms" 
              checked={signupData.agreeToTerms}
              onCheckedChange={(checked) => setSignupData({...signupData, agreeToTerms: !!checked})}
            />
            <Label htmlFor="terms" className="text-sm text-gray-600">
              Agree with <span className="text-primary">terms & conditions</span>
            </Label>
          </div>

          <Button 
            type="button" 
            className="w-full"
            onClick={async () => {
              // Validation
              if (!signupData.email || !signupData.password || !signupData.firstName || !signupData.lastName) {
                toast({ 
                  title: "Validation Error", 
                  description: "Please fill in all required fields",
                  variant: "destructive"
                });
                return;
              }
              
              if (signupData.password !== signupData.confirmPassword) {
                toast({ 
                  title: "Validation Error", 
                  description: "Passwords do not match",
                  variant: "destructive"
                });
                return;
              }
              
              if (!signupData.agreeToTerms) {
                toast({ 
                  title: "Validation Error", 
                  description: "Please agree to terms and conditions",
                  variant: "destructive"
                });
                return;
              }

              try {
                await register({
                  email: signupData.email,
                  password: signupData.password,
                  firstName: signupData.firstName,
                  lastName: signupData.lastName,
                  phoneNumber: signupData.phoneNumber,
                });
                
                toast({ title: "Success", description: "Account created successfully!" });
                // Force a reload to ensure authentication state is properly updated
                setTimeout(() => {
                  window.location.reload();
                }, 500);
              } catch (error: any) {
                toast({ 
                  title: "Registration Failed", 
                  description: error.message || "Please try again",
                  variant: "destructive"
                });
              }
            }}
            disabled={isRegistering}
          >
            {isRegistering ? "CREATING ACCOUNT..." : "SIGN UP"}
          </Button>
        </form>

        <div className="text-center">
          <span className="text-gray-600">Have an account already? </span>
          <Button 
            variant="ghost" 
            className="text-primary font-medium p-0"
            onClick={() => setCurrentScreen("login")}
          >
            Log in
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
