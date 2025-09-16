"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/lib/api"
import { MessageCircle, Send, Bot, User, CheckCircle2, Clock, AlertCircle, Smartphone } from "lucide-react"

interface Message {
  id: string
  type: "incoming" | "outgoing"
  content: string
  timestamp: Date
  status?: "sent" | "delivered" | "read"
  taskCreated?: boolean
  taskId?: string
}

export default function WhatsAppPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "incoming",
      content: "Hi! I need to create a task for reviewing the project proposal",
      timestamp: new Date(Date.now() - 300000),
      taskCreated: true,
      taskId: "task-123",
    },
    {
      id: "2",
      type: "outgoing",
      content: 'Task created successfully! "Review project proposal" has been added to your task list.',
      timestamp: new Date(Date.now() - 299000),
      status: "read",
    },
    {
      id: "3",
      type: "incoming",
      content: "Can you show me my pending tasks?",
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: "4",
      type: "outgoing",
      content:
        "You have 3 pending tasks:\n1. Review project proposal (High priority)\n2. Update team documentation (Medium)\n3. Schedule client meeting (Low)",
      timestamp: new Date(Date.now() - 119000),
      status: "delivered",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const { toast } = useToast()

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "incoming",
      content: newMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")
    setIsTyping(true)

    // Simulate AI processing
    setTimeout(async () => {
      try {
        // Mock API call for intent detection and task creation
        const response = await apiService.sendWhatsAppMessage({
          message: newMessage,
          userId: "current-user",
        })

        let botResponse = ""
        let taskCreated = false
        let taskId = ""

        // Simple intent detection simulation
        if (
          newMessage.toLowerCase().includes("create task") ||
          newMessage.toLowerCase().includes("add task") ||
          newMessage.toLowerCase().includes("new task")
        ) {
          botResponse = "Task created successfully! I've added it to your task list."
          taskCreated = true
          taskId = response.data?.taskId || "task-" + Date.now()
        } else if (
          newMessage.toLowerCase().includes("show tasks") ||
          newMessage.toLowerCase().includes("my tasks") ||
          newMessage.toLowerCase().includes("pending tasks")
        ) {
          botResponse =
            "Here are your current tasks:\n1. Setup project infrastructure (In Progress)\n2. Design user interface (Open)\n3. Review documentation (Pending)"
        } else if (newMessage.toLowerCase().includes("help")) {
          botResponse =
            "I can help you with:\n• Creating tasks\n• Viewing your tasks\n• Updating task status\n• Project management\n\nJust tell me what you need!"
        } else {
          botResponse =
            'I understand you want to: "' +
            newMessage +
            '". This feature is coming soon! For now, try asking me to create a task or show your tasks.'
        }

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "outgoing",
          content: botResponse,
          timestamp: new Date(),
          status: "sent",
          taskCreated,
          taskId,
        }

        setMessages((prev) => [...prev, botMessage])

        if (taskCreated) {
          toast({
            title: "Task Created",
            description: "New task has been added to your task list.",
          })
        }
      } catch (error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "outgoing",
          content: "Sorry, I'm having trouble processing your request right now. Please try again later.",
          timestamp: new Date(),
          status: "sent",
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsTyping(false)
      }
    }, 1500)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
      case "delivered":
        return <CheckCircle2 className="h-3 w-3 text-blue-500" />
      case "read":
        return <CheckCircle2 className="h-3 w-3 text-green-500" />
      default:
        return <Clock className="h-3 w-3 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">WhatsApp Integration</h1>
        <p className="text-muted-foreground">Manage tasks through WhatsApp-like chat interface</p>
      </div>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>Integration Status</span>
          </CardTitle>
          <CardDescription>WhatsApp integration for task management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                <AlertCircle className="mr-1 h-3 w-3" />
                Coming Soon
              </Badge>
              <span className="text-sm text-muted-foreground">Integration in development</span>
            </div>
            <Button variant="outline" disabled>
              Configure WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Task Assistant</span>
            <Badge variant="outline">Demo Mode</Badge>
          </CardTitle>
          <CardDescription>Try the chat interface - create tasks, check status, and more</CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "outgoing" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.type === "outgoing" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === "incoming" ? (
                        <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {message.taskCreated && (
                          <Badge variant="secondary" className="mt-2">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Task Created
                          </Badge>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                          {message.type === "outgoing" && <div className="ml-2">{getStatusIcon(message.status)}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Type a message... (try 'create task' or 'show my tasks')"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isTyping}
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim() || isTyping} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This is a demo interface. Real WhatsApp integration coming soon!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Feature Preview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Task Creation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create tasks by sending messages like "Create task: Review proposal"
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Status Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Update task status with messages like "Mark task 123 as completed"
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Ask "Show my pending tasks" or "What's due today?"</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
