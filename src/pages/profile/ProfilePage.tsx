/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateProfile } from "@/http/auth";
import { avatar } from "@/assets";

const ProfilePage = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    imageURL: File | null | string;
  }>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    imageURL: user?.imageURL || null,
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutation({
    mutationFn: (data: FormData) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["self"],
      });
      toast.success("Profile updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: any) => {
      toast.error("Failed to update profile", {
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataObj = new FormData();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    formDataObj.append("firstName", formData.firstName);
    formDataObj.append("lastName", formData.lastName);
    formDataObj.append("email", formData.email);

    if (newPassword) {
      formDataObj.append("password", newPassword);
    }

    if (formData.imageURL instanceof File) {
      formDataObj.append("image", formData.imageURL);
    } else if (formData.imageURL === null) {
      formDataObj.append("removeImage", "true");
    }

    mutation.mutate(formDataObj);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center mb-8">
          <img
            src={user.imageURL || avatar}
            className="w-32 h-32 rounded-full border-secondary border  p-2 mb-4"
            alt=""
          />
          <h2 className="text-xl font-semibold">
            {user.firstName} {user.lastName}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
