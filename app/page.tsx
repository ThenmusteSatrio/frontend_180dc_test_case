"use client";
import { getToken } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.replace("/products");
    } else {
      router.replace("/login");
    }
  }, [router]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#143A52]" />
        <p className="text-[#143A52] font-medium animate-pulse">
          Mengarahkan Anda...
        </p>
      </div>
    </div>
  );
}
