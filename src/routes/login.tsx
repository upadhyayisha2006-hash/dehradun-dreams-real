import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { MountainSnow, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn, signUp, getCurrentUser, isMock } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  
  // Tab control
  const [activeTab, setActiveTab] = useState("login");
  
  // Auth fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        navigate({ to: "/" });
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const user = await signIn(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate({ to: "/" });
    } catch (error: any) {
      toast.error(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const user = await signUp(name, email, password);
      if (isMock) {
        toast.success(`Account created! Logged in as ${user.name}`);
        navigate({ to: "/" });
      } else {
        toast.success("Account created successfully! Check your email for validation or start browsing.");
        navigate({ to: "/" });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-tr from-background via-secondary/30 to-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary-glow)_0%,_transparent_40%)] opacity-10" />
      
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-start">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 group justify-center">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <MountainSnow className="h-6 w-6" />
            </span>
            <span className="text-2xl font-semibold tracking-tight text-foreground">
              Dehradun <span className="text-primary">Dreams Real</span>
            </span>
          </Link>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
            Welcome to Doon Real Estate
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage your saved properties and inquiries
          </p>
        </div>

        <Card className="border border-border bg-card/80 backdrop-blur shadow-elegant rounded-2xl overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-none border-b border-border">
              <TabsTrigger value="login" className="rounded-md font-medium text-sm transition-all py-2.5">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-md font-medium text-sm transition-all py-2.5">
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* LOGIN FORM */}
            <TabsContent value="login" className="mt-0 focus-visible:outline-none">
              <form onSubmit={handleLogin}>
                <CardHeader className="space-y-1.5 pt-6 pb-4">
                  <CardTitle className="text-xl">Sign in to your account</CardTitle>
                  <CardDescription>
                    Enter your email and password below to login.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pb-6">
                  {isMock && (
                    <div className="p-3 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-lg dark:text-amber-400">
                      <strong>Demo Mode</strong>: Enter any details, or use: <br/>
                      Email: <code>admin@dehradundreams.com</code> <br/>
                      Password: <code>adminpassword</code>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 h-10 border-border bg-background/50 focus-visible:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <button type="button" className="text-xs text-primary hover:underline font-medium">
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 h-10 border-border bg-background/50 focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 pt-0 pb-6">
                  <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 h-11 text-base font-medium">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Signing In...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            {/* REGISTER FORM */}
            <TabsContent value="register" className="mt-0 focus-visible:outline-none">
              <form onSubmit={handleRegister}>
                <CardHeader className="space-y-1.5 pt-6 pb-4">
                  <CardTitle className="text-xl">Create a new account</CardTitle>
                  <CardDescription>
                    Get started by entering your name, email, and password.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pb-6">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        placeholder="Rohan Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="pl-10 h-10 border-border bg-background/50 focus-visible:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 h-10 border-border bg-background/50 focus-visible:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Min. 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 h-10 border-border bg-background/50 focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 pt-0 pb-6">
                  <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 h-11 text-base font-medium">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating Account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
