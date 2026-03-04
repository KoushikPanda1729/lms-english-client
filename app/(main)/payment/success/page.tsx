"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircleFilled } from "@ant-design/icons";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircleFilled className="text-5xl text-emerald-500" />
      </div>
      <h1 className="mb-3 text-2xl font-bold text-zinc-900">Payment Successful!</h1>
      <p className="mb-2 max-w-sm text-zinc-500">
        You&apos;ve been enrolled in the course. Start learning right away!
      </p>
      {sessionId && <p className="mb-8 font-mono text-xs text-zinc-400">Ref: {sessionId}</p>}
      <div className="flex w-full max-w-xs flex-col gap-3">
        <Link
          href="/courses"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white no-underline shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700"
        >
          Go to Courses
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
