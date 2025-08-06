import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { whatsTaskClient } from "@/api/whatsTaskClient";
import { toast } from "sonner";
import PhoneNumberInput from "./PhoneNumberInput";

export default function LoginDialog({ open, onOpenChange, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState("whatsapp");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // WhatsApp login form
  const [whatsappForm, setWhatsappForm] = useState({
    whatsappNumber: "",
  });
  
  // Email login form
  const [emailForm, setEmailForm] = useState({
    email: "",
  });
  
  // Verification form
  const [verificationForm, setVerificationForm] = useState({
    verificationCode: "",
  });
  const [showVerification, setShowVerification] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingWhatsappNumber, setPendingWhatsappNumber] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  const handleWhatsappLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate phone number format
    const phoneNumber = whatsappForm.whatsappNumber;
    if (!phoneNumber) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    try {
      const response = await whatsTaskClient.loginWithWhatsApp(phoneNumber);
      
      if (response.success) {
        // Store token and clean user data
        localStorage.setItem('authToken', response.data.token || '');
        sessionStorage.setItem('currentUser', JSON.stringify(response.data.user));
        
        toast.success("Login successful!");
        onLoginSuccess(response.data.user);
        onOpenChange(false);
      } else {
        // Handle specific login errors
        if (response.error && response.error.includes('User not found')) {
          setError("Account not found. Please check your WhatsApp number. Try: 8320303515 (for Jagrut) or 9428120418 (for Shailesh)");
        } else if (response.error && response.error.includes('Invalid')) {
          setError("Invalid credentials. Please check your WhatsApp number.");
        } else if (response.error && response.error.includes('value too long')) {
          setError("System configuration issue. Please try again later or contact support.");
        } else if (response.error && response.error.includes('Database configuration issue')) {
          setError("System maintenance in progress. Please try again later.");
        } else {
          setError(response.error || "Login failed");
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle network or service errors
      if (error.message && error.message.includes('401')) {
        setError("Invalid credentials. Please check your WhatsApp number.");
      } else if (error.message && error.message.includes('Failed to fetch')) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate email format
    const email = emailForm.email;
    if (!email || !email.includes('@')) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      // For now, we'll simulate email OTP by using a mock response
      // In a real implementation, this would call an email OTP endpoint
      const response = await whatsTaskClient.sendEmailVerificationCode(email);
      
      if (response.success) {
        setPendingEmail(email);
        setShowEmailVerification(true);
        toast.success("Verification code sent to your email!");
      } else {
        setError(response.error || "Failed to send verification code");
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setError("Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate phone number format
    const phoneNumber = whatsappForm.whatsappNumber;
    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      setError("Please select a country and enter a valid phone number");
      setLoading(false);
      return;
    }

    try {
      const response = await whatsTaskClient.sendVerificationCode(phoneNumber);
      
      if (response.success) {
        setPendingWhatsappNumber(whatsappForm.whatsappNumber);
        setShowVerification(true);
        toast.success("Verification code sent to your WhatsApp!");
      } else {
        // Handle specific backend errors
        if (response.error && response.error.includes('Database migration required')) {
          setError("System maintenance in progress. Please try again later.");
        } else if (response.error && response.error.includes('Database connection error')) {
          setError("Service temporarily unavailable. Please try again later.");
        } else {
          setError(response.error || "Failed to send verification code");
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      
      // Handle network or service errors
      if (error.message && error.message.includes('500')) {
        setError("Service temporarily unavailable. Please try again later.");
      } else if (error.message && error.message.includes('Failed to fetch')) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("Failed to send verification code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await whatsTaskClient.verifyCode(
        pendingWhatsappNumber, 
        verificationForm.verificationCode
      );
      
      if (response.success) {
        // Store token and clean user data
        localStorage.setItem('authToken', response.data.token || '');
        sessionStorage.setItem('currentUser', JSON.stringify(response.data.user));
        
        toast.success("Account verified successfully!");
        onLoginSuccess(response.data.user);
        onOpenChange(false);
        setShowVerification(false);
        setVerificationForm({ verificationCode: "" });
        setPendingWhatsappNumber("");
      } else {
        setError(response.error || "Verification failed");
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEmailVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // For now, we'll simulate email verification
      // In a real implementation, this would call an email verification endpoint
      const response = await whatsTaskClient.verifyEmailCode(
        pendingEmail, 
        verificationForm.verificationCode
      );
      
      if (response.success) {
        // Store token and clean user data
        localStorage.setItem('authToken', response.data.token || '');
        sessionStorage.setItem('currentUser', JSON.stringify(response.data.user));
        
        toast.success("Email verified successfully!");
        onLoginSuccess(response.data.user);
        onOpenChange(false);
        setShowEmailVerification(false);
        setVerificationForm({ verificationCode: "" });
        setPendingEmail("");
      } else {
        setError(response.error || "Email verification failed");
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setError("Email verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (formType, field, value) => {
    if (formType === 'whatsapp') {
      setWhatsappForm(prev => ({ ...prev, [field]: value }));
    } else if (formType === 'email') {
      setEmailForm(prev => ({ ...prev, [field]: value }));
    } else if (formType === 'verification') {
      setVerificationForm(prev => ({ ...prev, [field]: value }));
    }
    setError(""); // Clear error when user types
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
              <DialogContent 
          className="sm:max-w-md" 
          aria-describedby="login-dialog-description" 
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Login to WhatsTask
          </DialogTitle>
          <div id="login-dialog-description" className="sr-only">
            Login dialog with WhatsApp and email authentication options
          </div>
        </DialogHeader>
        
        {!showVerification && !showEmailVerification ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>
            
            <TabsContent value="whatsapp" className="space-y-4">
              <form onSubmit={handleWhatsappLogin} className="space-y-4">
                <div className="text-sm text-gray-600 mb-2">
                  <p>Enter your WhatsApp number:</p>
                  <p className="text-xs mt-1">Example: 8320303515 (system will add +91 automatically)</p>
                </div>
                <PhoneNumberInput
                  value={whatsappForm.whatsappNumber}
                  onChange={(value) => handleInputChange('whatsapp', 'whatsappNumber', value)}
                  placeholder="8320303515"
                  label="WhatsApp Number"
                  error={error}
                  disabled={loading}
                />
                
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <DialogFooter className="gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleSendVerification}
                    disabled={loading || !whatsappForm.whatsappNumber}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Verify Account
                  </Button>
                  <Button type="submit" disabled={loading || !whatsappForm.whatsappNumber}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                    Login
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="email" className="space-y-4">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="text-sm text-gray-600 mb-2">
                  <p>Enter your email address:</p>
                  <p className="text-xs mt-1">We'll send a verification code to your email</p>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={emailForm.email}
                    onChange={(e) => handleInputChange('email', 'email', e.target.value)}
                    placeholder="user@example.com"
                    required
                    className="mt-1"
                  />
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <DialogFooter>
                  <Button type="submit" disabled={loading || !emailForm.email}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    Send Verification Code
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          </Tabs>
        ) : showVerification ? (
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-medium">Verify Your WhatsApp Account</h3>
              <p className="text-sm text-gray-600">
                We sent a verification code to {pendingWhatsappNumber}
              </p>
            </div>
            
            <form onSubmit={handleConfirmVerification} className="space-y-4">
              <div>
                <Label htmlFor="verification_code">Verification Code</Label>
                <Input
                  id="verification_code"
                  type="text"
                  value={verificationForm.verificationCode}
                  onChange={(e) => handleInputChange('verification', 'verificationCode', e.target.value)}
                  placeholder="Enter 6-digit code"
                  required
                  className="mt-1"
                  maxLength={6}
                />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <DialogFooter className="gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowVerification(false)}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button type="submit" disabled={loading || !verificationForm.verificationCode}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  Verify
                </Button>
              </DialogFooter>
            </form>
          </div>
        ) : showEmailVerification ? (
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-medium">Verify Your Email Account</h3>
              <p className="text-sm text-gray-600">
                We sent a verification code to {pendingEmail}
              </p>
            </div>
            
            <form onSubmit={handleConfirmEmailVerification} className="space-y-4">
              <div>
                <Label htmlFor="email_verification_code">Verification Code</Label>
                <Input
                  id="email_verification_code"
                  type="text"
                  value={verificationForm.verificationCode}
                  onChange={(e) => handleInputChange('verification', 'verificationCode', e.target.value)}
                  placeholder="Enter 6-digit code"
                  required
                  className="mt-1"
                  maxLength={6}
                />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <DialogFooter className="gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowEmailVerification(false)}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button type="submit" disabled={loading || !verificationForm.verificationCode}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  Verify
                </Button>
              </DialogFooter>
            </form>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
} 