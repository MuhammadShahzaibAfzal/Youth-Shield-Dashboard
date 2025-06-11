import { logo } from "@/assets";
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
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[400px] max-w-[90%]">
        <CardHeader className="text-center">
          <img src={logo} className={"w-56 mx-auto mb-4 object-contain"} alt="Logo" />
          <CardTitle className="text-xl">Forgot your password?</CardTitle>
          <CardDescription>Enter your email to reset it.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" required />
                </div>
                <Button type="submit" className="w-full">
                  Send Reset Link
                </Button>
                <div className="my-3 flex justify-center ">
                  <span className="text-sm">
                    Back to{" "}
                    <Link to="/" className="ml-auto text-sm underline">
                      Login
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
