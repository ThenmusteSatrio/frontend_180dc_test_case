"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { loginSchema } from "@/lib/validator";
import { login } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues, e?: React.BaseSyntheticEvent) {
    if (e) e.preventDefault();
    try {
      const response = await login(values);
      const token = response.data.access_token || response.data.token;
      localStorage.setItem("token", token);
      toast.success("Login berhasil");
      router.push("/products");
    } catch (error: any) {
      const statusCode = error?.response?.data?.statusCode;

      if (statusCode != 500) {
        toast.error("Email atau password salah");
      }else{
        toast.error("Terjadi kesalahan pada server");
      }
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#143A52] via-[#3D6E8A] to-[#5BAAB8] p-4"
    >
      <Card
        className="w-full max-w-[480px] rounded-3xl border-0 p-8 shadow-2xl
      "
      >
        <div className="mb-8 text-center">
          <h1
            className="text-3xl font-bold text-[#143A52]"
          >
            DC Product
          </h1>

          <p
            className="mt-2 text-sm text-muted-foreground"
          >
            Login ke akun anda
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              {...register("email")}
            />

            {errors.email && (
              <p
                className="text-sm text-red-500"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="******"
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <p
                className="text-sm text-red-500"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#143A52] hover:bg-[#1b4d6d] text-white"
          >
            {isSubmitting ? "Loading..." : "Login"}
          </Button>
        </form>

        <p
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-medium text-[#143A52] hover:text-[#5BAAB8]"
          >
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}
