import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import api from "../API"

export function ForgetPassword({
}: React.ComponentProps<"div">) {

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [verifyingEmail, setVerifyingEmail] = useState(false)

  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Verify email exists in database
  const verifyEmailExists = async (email: string) => {
    if (!email || !validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      setIsEmailValid(false)
      setIsEmailVerified(false)
      return
    }
    setVerifyingEmail(true)
    setEmailError('')
    try {
      const response = await axios.post(`${api}/users/verify-email`, { email })

      if (response.status === 200) {
        setIsEmailValid(true)
        setIsEmailVerified(true)
        setEmailError('')
      } else {
        setEmailError('No account found with this email address')
        setIsEmailValid(false)
        setIsEmailVerified(false)
      }
    } catch (err: any) {
      setEmailError('Unable to verify email. Please try again.')
      setIsEmailValid(false)
      setIsEmailVerified(false)
    } finally {
      setVerifyingEmail(false)
    }
  }

  // Handle email blur event
  const handleEmailBlur = () => {
    if (email.trim()) {
      verifyEmailExists(email.trim())
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isEmailVerified) {
      setError('Please enter a valid email address that exists in our system')
      return
    }
    setLoading(true)
    const payload = {
      email: email
    }
    try {
      const response = await axios.post(`${api}/users/forgot-password`, payload);
      Swal.fire({
        title:response.data.message || "Password Reset Email Sent!",
        text: "Please check your email for password reset instructions. The link will expire in 15 minutes.",
        icon: "success",
        confirmButtonText: "OK"
      });

      // Optionally redirect to login page after successful submission
      setTimeout(() => {
        navigate("/login")
      }, 2000)
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong'
      setError(errorMessage)
      
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Try Again"
      });
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center p-8 w-full'>
      <Card className="overflow-hidden mt-5 h-120 p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Forgot Password</h1>
                <p className="text-muted-foreground">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </div>

              <div className="grid gap-3 mt-5">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setEmailError('')
                      setIsEmailValid(false)
                      setIsEmailVerified(false)
                    }}
                    onBlur={handleEmailBlur}
                    className={cn(
                      "pr-10",
                      emailError && "border-red-500 focus:border-red-500",
                      isEmailVerified && "border-green-500 focus:border-green-500"
                    )}
                    disabled={verifyingEmail}
                  />
                  
                  {/* Status indicator */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {verifyingEmail && (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                    )}
                    {!verifyingEmail && isEmailVerified && (
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    {!verifyingEmail && emailError && email && (
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Email validation messages */}
                {emailError && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {emailError}
                  </p>
                )}
                
                {isEmailVerified && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Email verified successfully
                  </p>
                )}
              </div>

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !isEmailVerified || verifyingEmail}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending Reset Link...
                  </div>
                ) : (
                  'Send Password Reset Email'
                )}
              </Button>

              <div className="text-center text-sm space-y-2">
                <div>
                  Remember your password?{' '}
                  <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                    Back to Login
                  </Link>
                </div>
                <div>
                  Don&apos;t have an account?{' '}
                  <Link to="/signup" className="underline underline-offset-4 hover:text-primary">
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </form>
          
          <div className="bg-muted relative flex items-center justify-center">
            <img
              src="/auth.png"
              alt="Password Reset"
              className="flex items-center justify-center inset-0 h-auto w-full p-5 object-cover dark:brightness-[0.9]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}