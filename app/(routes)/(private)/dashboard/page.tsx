"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserInfo from "@/hooks/use-userinfo";

export default function DashboardPage() {
  const router = useRouter();
  const { info } = useUserInfo();

  useEffect(() => {
    if (info) {
      router.push("/dashboard/home");
    } else {
      router.push("/");
    }
  }, [router]);

  return null;
}
