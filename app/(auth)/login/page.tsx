"use client";

import React, { useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Checkbox, Divider, Form, Input, message, Spin } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useGoogleLogin } from "@react-oauth/google";
import { authService } from "@/lib/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import { setOnboardingCookie } from "@/lib/onbCookie";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" className="mr-2">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59a14.5 14.5 0 010-9.18l-7.98-6.19a24.01 24.01 0 000 21.56l7.98-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function BannedModal({ onClose, email }: { onClose: () => void; email?: string }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [contactEmail, setContactEmail] = useState(email || "");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!contactEmail.trim() || !message.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5503"}/support/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: contactEmail.trim(), message: message.trim() }),
        },
      );
      if (!res.ok) throw new Error("Failed");
      setSent(true);
    } catch {
      setError("Could not send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl">
            🚫
          </div>
          <h2 className="text-lg font-bold text-white">Account Suspended</h2>
          <p className="mt-1 text-sm text-white/80">
            Your account has been suspended by an administrator.
          </p>
        </div>

        <div className="p-6">
          <p className="mb-5 text-center text-sm text-zinc-500">
            If you believe this is a mistake, please contact our support team and we will look into
            it as soon as possible.
          </p>

          {/* Contact Support section */}
          {!chatOpen ? (
            <button
              onClick={() => setChatOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-90 active:scale-95"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              Contact Support
            </button>
          ) : sent ? (
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">
                ✓
              </div>
              <p className="text-sm font-semibold text-zinc-800">Message sent!</p>
              <p className="mt-1 text-xs text-zinc-500">
                Our team will review your case and get back to you.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-zinc-200">
              {/* Form header */}
              <div
                className="flex items-center justify-between px-4 py-2.5"
                style={{ background: "linear-gradient(135deg,#6C5CE7,#a29bfe)" }}
              >
                <span className="text-sm font-semibold text-white">SpeakEasy Support</span>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-xs text-white/70 hover:text-white"
                >
                  ✕
                </button>
              </div>
              {/* Form fields */}
              <div className="flex flex-col gap-3 bg-zinc-50 px-4 py-4">
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none placeholder:text-zinc-400 focus:border-indigo-400"
                />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your situation..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none placeholder:text-zinc-400 focus:border-indigo-400"
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                  onClick={handleSend}
                  disabled={!contactEmail.trim() || !message.trim() || sending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-40"
                >
                  {sending ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  )}
                  Send Message
                </button>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-3 w-full rounded-2xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginContent() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [banned, setBanned] = useState(false);
  const [bannedEmail, setBannedEmail] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const { setUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const handleLogin = async (values: { email: string; password: string; remember: boolean }) => {
    setLoading(true);
    try {
      const user = await authService.login(values.email, values.password);
      setUser(user);
      if (user.onboardingCompleted) setOnboardingCookie();
      router.replace(user.onboardingCompleted ? redirectTo : "/onboarding");
    } catch (err: unknown) {
      const data = (
        err as { response?: { data?: { error?: { message?: string }; message?: string } } }
      )?.response?.data;
      const msg = data?.error?.message || data?.message || "Invalid credentials";
      if (msg.toLowerCase().includes("suspended") || msg.toLowerCase().includes("banned")) {
        setBannedEmail(values.email);
        setBanned(true);
      } else {
        messageApi.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (accessToken: string) => {
    setGoogleLoading(true);
    try {
      const user = await authService.googleSignIn(accessToken);
      setUser(user);
      if (user.onboardingCompleted) setOnboardingCookie();
      router.replace(user.onboardingCompleted ? redirectTo : "/onboarding");
    } catch (err: unknown) {
      const data = (
        err as { response?: { data?: { error?: { message?: string }; message?: string } } }
      )?.response?.data;
      const msg = data?.error?.message || data?.message || "Google sign-in failed";
      if (msg.toLowerCase().includes("suspended") || msg.toLowerCase().includes("banned")) {
        try {
          const info = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }).then((r) => r.json());
          if (info?.email) setBannedEmail(info.email);
        } catch {
          /* ignore */
        }
        setBanned(true);
      } else {
        messageApi.error(msg);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: (res) => handleGoogleSuccess(res.access_token),
    onError: () => messageApi.error("Google sign-in failed"),
  });

  return (
    <>
      {contextHolder}
      {banned && <BannedModal onClose={() => setBanned(false)} email={bannedEmail} />}

      {/* Mobile logo — only visible on small screens */}
      <div className="mb-8 text-center lg:hidden">
        <Link href="/" className="inline-flex items-center gap-2 no-underline">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-base font-bold text-white shadow-lg shadow-indigo-500/30">
            S
          </div>
          <span className="text-xl font-bold text-zinc-900">
            Speak<span className="gradient-text">Easy</span>
          </span>
        </Link>
      </div>

      <div>
        <h1 className="mb-1 text-2xl font-bold text-zinc-900">Welcome back</h1>
        <p className="mb-7 text-sm text-zinc-500">Log in to continue your learning journey</p>

        {/* Google button */}
        <button
          type="button"
          disabled={googleLoading}
          onClick={() => triggerGoogleLogin()}
          className="flex h-11 w-full items-center justify-center rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md disabled:opacity-60"
        >
          {googleLoading ? (
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700" />
          ) : (
            <GoogleIcon />
          )}
          Continue with Google
        </button>

        <Divider className="text-xs text-zinc-400">or</Divider>

        {/* Login form */}
        <Form
          layout="vertical"
          size="large"
          requiredMark={false}
          onFinish={handleLogin}
          initialValues={{ remember: true }}
        >
          <Form.Item
            label={<span className="text-sm font-medium text-zinc-700">Email</span>}
            name="email"
            rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
          >
            <Input
              prefix={<MailOutlined className="text-zinc-400" />}
              placeholder="you@example.com"
              className="rounded-xl"
            />
          </Form.Item>
          <Form.Item
            label={<span className="text-sm font-medium text-zinc-700">Password</span>}
            name="password"
            rules={[{ required: true, message: "Enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-zinc-400" />}
              placeholder="Enter your password"
              className="rounded-xl"
            />
          </Form.Item>

          <div className="mb-5 flex items-center justify-between">
            <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 0 }}>
              <Checkbox className="text-sm text-zinc-600">Remember me</Checkbox>
            </Form.Item>
            <Link
              href="#"
              className="text-sm font-medium text-indigo-600 no-underline hover:text-indigo-500"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            className="h-11 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/25"
          >
            Log In
          </Button>
        </Form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-indigo-600 no-underline hover:text-indigo-500"
          >
            Sign up free
          </Link>
        </p>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <Spin size="large" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
