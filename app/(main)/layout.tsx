"use client";

import React, { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Spin } from "antd";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { CallProvider, useCall } from "@/contexts/CallContext";

function MainLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { callActive } = useCall();
  const router = useRouter();
  const pathname = usePathname();

  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathnameRef.current)}`);
    } else if (!loading && user && !user.onboardingCompleted) {
      router.replace("/onboarding");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  if (loading || !user || !user.onboardingCompleted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const isHome = pathname === "/";
  const isCourseDetail = /^\/courses\/[^/]+$/.test(pathname);
  const hideBottomNav = isCourseDetail || callActive;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-16 pb-16 md:pb-0">{children}</main>
      <div className={!isHome ? "hidden md:block" : undefined}>
        <Footer />
      </div>
      {!hideBottomNav && <BottomNav />}
    </>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <CallProvider>
      <MainLayoutInner>{children}</MainLayoutInner>
    </CallProvider>
  );
}
