"use client";

import Link from "next/link";
import { Button } from "antd";
import {
  PlayCircleOutlined,
  BookOutlined,
  StarFilled,
  SoundOutlined,
  TrophyOutlined,
  GlobalOutlined,
  ArrowRightOutlined,
  CheckCircleFilled,
  PhoneOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ═══════════════ HERO ═══════════════ */
function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
      {/* Animated gradient mesh */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-1/4 h-[600px] w-[600px] rounded-full bg-indigo-500/8 blur-[120px]" />
        <div className="absolute -bottom-40 left-0 h-[500px] w-[500px] rounded-full bg-violet-500/8 blur-[120px]" />
        <div className="absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Centered hero */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-600">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] text-white">
              ⚡
            </span>
            #1 English Learning Platform
          </div>

          <h1 className="mb-6 text-[44px] leading-[1.1] font-extrabold tracking-tight text-zinc-900 sm:text-6xl lg:text-[68px]">
            Speak English <span className="gradient-text">Confidently</span>
            <br />
            with Real Partners
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-zinc-500">
            Join 10,000+ learners mastering English through interactive courses and live 1-on-1
            speaking sessions with native speakers.
          </p>

          <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register">
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                className="h-13 rounded-2xl px-8 text-[15px] font-bold shadow-xl shadow-indigo-500/25"
              >
                Start Learning Free
              </Button>
            </Link>
            <Link href="/courses">
              <Button
                size="large"
                icon={<BookOutlined />}
                className="h-13 rounded-2xl px-8 text-[15px] font-semibold"
              >
                Browse Courses
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex -space-x-2.5">
              {["👩‍🏫", "👨‍💼", "👩‍🎓", "🧑‍💻", "👨‍🔬"].map((e, i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-[2.5px] border-white bg-indigo-50 text-base shadow-sm"
                >
                  {e}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarFilled key={i} className="text-[13px] text-amber-400" />
                ))}
                <span className="ml-1.5 text-sm font-bold text-zinc-900">4.9</span>
              </div>
              <p className="text-[13px] text-zinc-500">Loved by 10,000+ learners</p>
            </div>
          </div>
        </div>

        {/* Feature bento grid */}
        <div className="mx-auto mt-20 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <SoundOutlined />,
              title: "Live Speaking",
              desc: "Practice with native partners in real-time audio calls",
              gradient: "from-indigo-500 to-violet-600",
              bg: "bg-indigo-50",
              text: "text-indigo-600",
            },
            {
              icon: <BookOutlined />,
              title: "Expert Courses",
              desc: "200+ structured courses for every proficiency level",
              gradient: "from-cyan-500 to-blue-600",
              bg: "bg-cyan-50",
              text: "text-cyan-600",
            },
            {
              icon: <TrophyOutlined />,
              title: "Track Progress",
              desc: "Visual dashboards to measure daily improvement",
              gradient: "from-amber-500 to-orange-600",
              bg: "bg-amber-50",
              text: "text-amber-600",
            },
            {
              icon: <GlobalOutlined />,
              title: "Global Community",
              desc: "Connect with learners from 50+ countries worldwide",
              gradient: "from-emerald-500 to-teal-600",
              bg: "bg-emerald-50",
              text: "text-emerald-600",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="group rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/50"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-lg text-white shadow-lg ${c.gradient}`}
              >
                {c.icon}
              </div>
              <h3 className="mb-1.5 text-[15px] font-bold text-zinc-900">{c.title}</h3>
              <p className="text-[13px] leading-relaxed text-zinc-500">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ HOW IT WORKS ═══════════════ */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Create your free account",
      desc: "Sign up in 30 seconds with Google or email. No credit card needed.",
      icon: "🚀",
    },
    {
      num: "02",
      title: "Choose your path",
      desc: "Pick from 200+ courses or jump straight into live speaking practice.",
      icon: "🎯",
    },
    {
      num: "03",
      title: "Practice daily",
      desc: "Complete lessons, join audio calls, and build your streak.",
      icon: "📈",
    },
    {
      num: "04",
      title: "Become fluent",
      desc: "Track your progress and earn certificates as you master English.",
      icon: "🏆",
    },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <div className="mb-3 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
            <ThunderboltOutlined className="mr-1.5" /> Simple & Effective
          </div>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            How <span className="gradient-text">SpeakEasy</span> works
          </h2>
          <p className="mx-auto max-w-lg text-base text-zinc-500">
            Four simple steps to English fluency. Start in minutes, see results in days.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.num} className="group relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute top-12 right-0 hidden h-px w-[calc(100%-60px)] translate-x-[calc(50%+30px)] border-t-2 border-dashed border-zinc-200 lg:block" />
              )}
              <div className="relative rounded-2xl border border-zinc-100 bg-white p-6 transition-all duration-300 hover:shadow-lg">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-sm font-black text-indigo-600">
                    {s.num}
                  </div>
                  <span className="text-2xl">{s.icon}</span>
                </div>
                <h3 className="mb-2 text-[15px] font-bold text-zinc-900">{s.title}</h3>
                <p className="text-[13px] leading-relaxed text-zinc-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ FEATURED COURSES ═══════════════ */
function FeaturedCourses() {
  const courses = [
    {
      title: "English for Beginners",
      level: "Beginner",
      color: "bg-emerald-500",
      rating: 4.9,
      students: "2.3K",
      lessons: 24,
      duration: "12h",
      emoji: "📚",
      price: "Free",
      gradient: "from-emerald-50 to-teal-50",
    },
    {
      title: "Business English Mastery",
      level: "Intermediate",
      color: "bg-blue-500",
      rating: 4.8,
      students: "1.9K",
      lessons: 32,
      duration: "16h",
      emoji: "💼",
      price: "$49",
      gradient: "from-blue-50 to-indigo-50",
    },
    {
      title: "IELTS Preparation Pro",
      level: "Advanced",
      color: "bg-rose-500",
      rating: 4.9,
      students: "3.2K",
      lessons: 48,
      duration: "24h",
      emoji: "🎯",
      price: "$79",
      gradient: "from-rose-50 to-pink-50",
    },
  ];

  return (
    <section className="bg-zinc-50/80 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <div className="mb-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              <StarFilled className="mr-1.5" /> Top Rated
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Start your <span className="gradient-text">learning journey</span>
            </h2>
          </div>
          <Link href="/courses" className="hidden md:block">
            <Button type="link" className="text-sm font-semibold">
              View All Courses <ArrowRightOutlined />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Link key={c.title} href="/courses" className="no-underline">
              <div className="group h-full overflow-hidden rounded-2xl border border-zinc-100 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-zinc-200/50">
                {/* Thumbnail */}
                <div
                  className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${c.gradient}`}
                >
                  <span className="text-7xl transition-transform duration-500 group-hover:scale-110">
                    {c.emoji}
                  </span>
                  {/* Price badge */}
                  <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-zinc-900 shadow-sm backdrop-blur-sm">
                    {c.price}
                  </div>
                </div>
                {/* Content */}
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white ${c.color}`}
                    >
                      {c.level}
                    </span>
                    <div className="flex items-center gap-1 text-xs">
                      <StarFilled className="text-amber-400" />
                      <span className="font-bold text-zinc-900">{c.rating}</span>
                      <span className="text-zinc-400">({c.students})</span>
                    </div>
                  </div>
                  <h3 className="mb-3 text-base font-bold text-zinc-900">{c.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <BookOutlined /> {c.lessons} lessons
                    </span>
                    <span className="flex items-center gap-1">⏱ {c.duration}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/courses">
            <Button type="primary" className="rounded-xl px-6 font-semibold">
              View All Courses <ArrowRightOutlined />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ TESTIMONIALS ═══════════════ */
function Testimonials() {
  const reviews = [
    {
      name: "Maria Gonzalez",
      country: "🇧🇷 Brazil",
      avatar: "👩‍🎓",
      text: "SpeakEasy helped me go from barely speaking to acing my IELTS in 4 months. The live sessions are amazing!",
      score: "IELTS 8.5",
    },
    {
      name: "Yuki Tanaka",
      country: "🇯🇵 Japan",
      avatar: "👨‍💻",
      text: "The business English course transformed how I communicate at work. My presentations are 10x more confident.",
      score: "Promoted to Lead",
    },
    {
      name: "Ahmed Hassan",
      country: "🇪🇬 Egypt",
      avatar: "🧑‍🏫",
      text: "Practicing with native speakers daily made all the difference. I can now hold any conversation naturally.",
      score: "Fluent in 6mo",
    },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <div className="mb-3 inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
            ❤️ Loved by Learners
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Real results from <span className="gradient-text">real learners</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="rounded-2xl border border-zinc-100 bg-white p-6 transition-all duration-300 hover:shadow-lg"
            >
              <div className="mb-4 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarFilled key={i} className="text-sm text-amber-400" />
                ))}
              </div>
              <p className="mb-5 text-sm leading-relaxed text-zinc-600">&ldquo;{r.text}&rdquo;</p>
              <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-xl">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{r.name}</p>
                    <p className="text-[11px] text-zinc-400">{r.country}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                  {r.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ CTA ═══════════════ */
function CTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-8 py-16 text-center shadow-2xl shadow-indigo-500/20 sm:px-16 lg:px-24 lg:py-20">
          {/* Decorative */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />
          </div>
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Ready to speak English
              <br />
              fluently?
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-indigo-100">
              Join thousands of learners who improved their English with SpeakEasy. Start free today
              — no credit card required.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button
                  size="large"
                  className="h-13 rounded-2xl border-0 bg-white px-8 text-[15px] font-bold text-indigo-600 shadow-xl hover:bg-indigo-50"
                >
                  Get Started Free <ArrowRightOutlined />
                </Button>
              </Link>
              <Link href="/partners">
                <Button
                  size="large"
                  className="h-13 rounded-2xl border-2 border-white/30 bg-transparent px-8 text-[15px] font-bold text-white shadow-lg hover:bg-white/10"
                >
                  <PhoneOutlined /> Try Live Call
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-indigo-200">
              {["Free forever plan", "No credit card", "Cancel anytime"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircleFilled className="text-emerald-300" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <Hero />
        <HowItWorks />
        <FeaturedCourses />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
