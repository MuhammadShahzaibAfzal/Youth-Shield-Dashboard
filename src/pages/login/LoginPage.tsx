import { logo, logoWhite } from "@/assets";
import { useTheme } from "@/components/customs/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { self, signin } from "@/http/auth";
import { getErrorMessage } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";

const LoginPage = () => {
  const { theme } = useTheme();
  const { setUser, setToken, user, setRefreshToken } = useAuthStore();

  const { refetch } = useQuery({
    queryKey: ["self"],
    queryFn: self,
    enabled: false,
    retry: 0,
  });
  const mutation = useMutation({
    mutationFn: signin,
    onSuccess: async (responseData) => {
      setToken(responseData?.data?.accessToken);
      setRefreshToken(responseData?.data?.refreshToken);
      const { data } = await refetch();
      setUser(data?.data?.user);
      return;
    },
    onError: (error) => {
      const { message, type } = getErrorMessage(error);
      toast.error(message, { description: type });
    },
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    try {
      mutation.mutate({ email, password });
    } catch (error) {
      console.error("Error logging in: ", error);
      toast.error("Invalid email or password");
    }
  };

  if (user) {
    const returnTo = new URLSearchParams(location.search).get("returnTo") || "/dashboard";
    return <Navigate to={returnTo} replace />;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-secondary">
      <Card className="w-[400px] max-w-[90%]">
        <CardHeader className="text-center">
          <img
            src={theme === "dark" ? logoWhite : logo}
            className={"w-32 mx-auto mb-4 object-contain"}
            alt="Logo"
          />
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    name="email"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input id="password" type="password" name="password" required />
                </div>
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? "Logging in..." : "Login"}{" "}
                  {mutation.isPending && <Loader2 className="animate-spin" />}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default LoginPage;
