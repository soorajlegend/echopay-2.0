"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserInfo from "@/hooks/use-userinfo";

export default function UserMiddleware() {
  const router = useRouter();
  const { info } = useUserInfo();

  useEffect(() => {
    if (!info) {
      router.push("/");
    }
  }, [info]);

  return null;
}
