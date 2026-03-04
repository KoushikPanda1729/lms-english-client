"use client";

import React from "react";
import Link from "next/link";
import { CloseCircleFilled } from "@ant-design/icons";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
        <CloseCircleFilled className="text-5xl text-red-400" />
      </div>
      <h1 className="mb-3 text-2xl font-bold text-zinc-900">Payment Cancelled</h1>
      <p className="mb-8 max-w-sm text-zinc-500">
        Your payment was cancelled and you have not been charged. You can try again anytime.
      </p>
      <div className="flex w-full max-w-xs flex-col gap-3">
        <Link
          href="/courses"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white no-underline shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700"
        >
          Back to Courses
        </Link>
      </div>
    </div>
  );
}
