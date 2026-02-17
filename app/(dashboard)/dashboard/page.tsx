"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRoot() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/login");
      return;
    }

    const { role, schoolId } = session.user;

    if (!schoolId) {
      router.replace("/dashboard/onboarding");
    } else if (role === "MANAGER" || role === "ADMIN") {
      router.replace("/dashboard/manager");
    } else {
      router.replace("/dashboard/user");
    }
  }, [status, session, router]);

  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
    </div>
  );
}
