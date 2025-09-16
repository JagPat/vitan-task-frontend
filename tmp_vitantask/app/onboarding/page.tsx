"use client"

import { useState } from "react"
import { CheckSquare, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

const steps = [
  {
    title: "Welcome to VitanTask",
    description: "Let's get you set up with your account",
  },
  {
    title: "Language Preferences",
    description: "Choose your preferred language and region",
  },
  {
    title: "Notification Settings",
    description: "Configure how you'd like to receive updates",
  },
  {
    title: "You're all set!",
    description: "Your account is ready to use",
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    language: "",
    timezone: "",
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
  })

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = async () => {
    setIsLoading(true)
    try {
      // Simulate saving preferences
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({
        title: "Welcome to VitanTask!",
        description: "Your account has been set up successfully",
      })
      window.location.href = "/dashboard"
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <CheckSquare className="h-6 w-6" />
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-2">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    index < currentStep
                      ? "bg-primary text-primary-foreground"
                      : index === currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-12 ${index < currentStep ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Language Preferences */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select value={formData.language} onValueChange={(value) => updateFormData("language", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={formData.timezone} onValueChange={(value) => updateFormData("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="utc+0">GMT (UTC+0)</SelectItem>
                      <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Notification Settings */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emailNotifications"
                      checked={formData.emailNotifications}
                      onCheckedChange={(checked) => updateFormData("emailNotifications", checked)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="emailNotifications"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Email notifications
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive email updates about your tasks and projects
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pushNotifications"
                      checked={formData.pushNotifications}
                      onCheckedChange={(checked) => updateFormData("pushNotifications", checked)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="pushNotifications"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Push notifications
                      </Label>
                      <p className="text-xs text-muted-foreground">Get instant notifications on your device</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="weeklyDigest"
                      checked={formData.weeklyDigest}
                      onCheckedChange={(checked) => updateFormData("weeklyDigest", checked)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="weeklyDigest"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Weekly digest
                      </Label>
                      <p className="text-xs text-muted-foreground">Receive a weekly summary of your activity</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Completion */}
            {currentStep === 3 && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check className="h-8 w-8" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Welcome aboard, {formData.firstName}!</h3>
                  <p className="text-muted-foreground">
                    Your VitanTask account is ready. You can start managing your tasks and projects right away.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2 bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext} className="flex items-center gap-2">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleFinish} disabled={isLoading} className="flex items-center gap-2">
                  {isLoading ? "Setting up..." : "Get Started"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
