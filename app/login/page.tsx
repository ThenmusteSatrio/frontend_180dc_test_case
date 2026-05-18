"use client"
import { LoginForm } from "@/components/auth/login-form";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    if (getToken()) {
      router.back()
    }
  }, [])
  return (
    <main>
      <LoginForm />
    </main>
  )
}