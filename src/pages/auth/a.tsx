import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
// import { 
//   Select, 
//   SelectContent, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from "@/components/ui/select";
import { Toast } from "@/components/ui/use-Toast";
import { 
  registerAction, 
  loginAction, 
  loginWithOtpAction, 
  forgotPasswordAction, 
  resetPasswordAction 
} from '@/redux/authSlice';
import { useDispatch } from 'react-redux';

// Validation Schemas
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const phoneLoginSchema = z.object({
  phoneNumber: z.string().min(10, "Invalid phone number"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState('login');
  const dispatch = useDispatch();

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      address: '',
    }
  });

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const phoneLoginForm = useForm({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: {
      phoneNumber: '',
      otp: '',
    }
  });

  const handleRegister = async (data) => {
    try {
      await dispatch(registerAction(data)).unwrap();
      Toast({
        title: "Registration Successful",
        description: "Welcome to the platform!",
      });
    } catch (error) {
      Toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleLogin = async (data) => {
    try {
      await dispatch(loginAction(data)).unwrap();
      Toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error) {
      Toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handlePhoneLogin = async (data) => {
    try {
      await dispatch(loginWithOtpAction(data)).unwrap();
      Toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error) {
      Toast({
        title: "Phone Login Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Choose your authentication method</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="login" 
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            {/* Login Tab */}
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Login</Button>
                </form>
              </Form>
              <ForgotPasswordDialog />
            </TabsContent>
            
            {/* Register Tab */}
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Other registration fields similar to name */}
                  <Button type="submit" className="w-full">Register</Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
          
          {/* Phone Login Dialog */}
          <PhoneLoginDialog />
        </CardContent>
      </Card>
    </div>
  );
};

const ForgotPasswordDialog = () => {
  const dispatch = useDispatch();
  const forgotPasswordForm = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const handleForgotPassword = async (data) => {
    try {
      await dispatch(forgotPasswordAction(data)).unwrap();
      Toast({
        title: "Password Reset",
        description: "Check your email for reset instructions",
      });
    } catch (error) {
      Toast({
        title: "Password Reset Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-sm text-blue-600">Forgot Password?</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your email to receive a password reset link
          </DialogDescription>
        </DialogHeader>
        <Form {...forgotPasswordForm}>
          <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
            <FormField
              control={forgotPasswordForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Send Reset Link</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const PhoneLoginDialog = () => {
  const dispatch = useDispatch();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const phoneLoginForm = useForm({
    resolver: zodResolver(phoneLoginSchema)
  });

  const handleSendOtp = async () => {
    try {
      // Implement OTP request logic
      setIsOtpSent(true);
      Toast({
        title: "OTP Sent",
        description: "Check your phone for the OTP",
      });
    } catch (error) {
      Toast({
        title: "OTP Send Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handlePhoneLogin = async (data) => {
    try {
      await dispatch(loginWithOtpAction(data)).unwrap();
      Toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error) {
      Toast({
        title: "Phone Login Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4">Login with Phone</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Phone Login</AlertDialogTitle>
          <AlertDialogDescription>
            {!isOtpSent 
              ? "Enter your phone number to receive an OTP"
              : "Enter the OTP sent to your phone"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...phoneLoginForm}>
          <form onSubmit={phoneLoginForm.handleSubmit(handlePhoneLogin)} className="space-y-4">
            {!isOtpSent ? (
              <FormField
                control={phoneLoginForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={phoneLoginForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter 6-digit OTP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex space-x-2">
              {!isOtpSent ? (
                <Button 
                  type="button" 
                  onClick={handleSendOtp} 
                  className="w-full"
                >
                  Send OTP
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="w-full"
                >
                  Verify OTP
                </Button>
              )}
            </div>
          </form>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const resetPasswordForm = useForm({
    resolver: zodResolver(resetPasswordSchema)
  });

  const handleResetPassword = async (data) => {
    try {
      // You would typically pass the token from the URL
      await dispatch(resetPasswordAction({
        token: 'your-reset-token', 
        newPassword: data.newPassword
      })).unwrap();
      
      Toast({
        title: "Password Reset",
        description: "Your password has been successfully reset",
      });
    } catch (error) {
      Toast({
        title: "Password Reset Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...resetPasswordForm}>
            <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-4">
              <FormField
                control={resetPasswordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={resetPasswordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Reset Password</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthTabs;