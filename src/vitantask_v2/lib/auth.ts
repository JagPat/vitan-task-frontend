// Mock authentication utilities
export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin" | "super_admin"
  avatar?: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
}

// Mock user data
export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "user",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "admin",
  },
  {
    id: "3",
    name: "Super Admin",
    email: "super.admin@example.com",
    role: "super_admin",
  },
]

// Mock auth functions
export const authService = {
  async login(email: string, password: string): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = mockUsers.find((u) => u.email === email)
    if (!user) {
      throw new Error("Invalid credentials")
    }

    return user
  },

  async loginWithGoogle(): Promise<User> {
    // Simulate Google OAuth
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return mockUsers[0]
  },

  async sendOTP(phone: string): Promise<void> {
    // Simulate OTP sending
    await new Promise((resolve) => setTimeout(resolve, 1000))
  },

  async verifyOTP(phone: string, otp: string): Promise<User> {
    // Simulate OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (otp !== "123456") {
      throw new Error("Invalid OTP")
    }

    return mockUsers[0]
  },

  async logout(): Promise<void> {
    // Simulate logout
    await new Promise((resolve) => setTimeout(resolve, 500))
  },

  getCurrentUser(): User | null {
    // In real app, this would check JWT token or session
    return mockUsers[0]
  },

  isAuthenticated(): boolean {
    // In real app, this would check JWT token validity
    return true
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.role === "admin" || user?.role === "super_admin"
  },

  isSuperAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.role === "super_admin"
  },
}
