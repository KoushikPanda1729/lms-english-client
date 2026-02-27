"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input, Select, Empty } from "antd";
import {
  BookOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  StarFilled,
  UserOutlined,
  FilterOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

const allCourses = [
  {
    id: "1",
    title: "English for Beginners",
    desc: "Start your English journey with fundamental grammar, vocabulary, and basic conversation skills.",
    level: "Beginner",
    color: "bg-emerald-500",
    ring: "ring-emerald-100",
    rating: 4.9,
    students: 2340,
    lessons: 24,
    duration: "12h",
    instructor: "Sarah Johnson",
    emoji: "📚",
    price: "Free",
    gradient: "from-emerald-50 to-teal-50",
    badge: "bg-emerald-50 text-emerald-700",
  },
  {
    id: "2",
    title: "Business English Mastery",
    desc: "Master professional English for meetings, presentations, emails, and corporate communication.",
    level: "Intermediate",
    color: "bg-blue-500",
    ring: "ring-blue-100",
    rating: 4.8,
    students: 1890,
    lessons: 32,
    duration: "16h",
    instructor: "Michael Chen",
    emoji: "💼",
    price: "$49",
    gradient: "from-blue-50 to-indigo-50",
    badge: "bg-blue-50 text-blue-700",
  },
  {
    id: "3",
    title: "IELTS Preparation Pro",
    desc: "Comprehensive preparation for all IELTS modules — Reading, Writing, Listening & Speaking.",
    level: "Advanced",
    color: "bg-rose-500",
    ring: "ring-rose-100",
    rating: 4.9,
    students: 3210,
    lessons: 48,
    duration: "24h",
    instructor: "Dr. Emily Roberts",
    emoji: "🎯",
    price: "$79",
    gradient: "from-rose-50 to-pink-50",
    badge: "bg-rose-50 text-rose-700",
  },
  {
    id: "4",
    title: "Everyday Conversations",
    desc: "Learn practical phrases and expressions for daily situations — shopping, travel, dining.",
    level: "Beginner",
    color: "bg-emerald-500",
    ring: "ring-emerald-100",
    rating: 4.7,
    students: 1560,
    lessons: 20,
    duration: "10h",
    instructor: "Jessica Lee",
    emoji: "💬",
    price: "Free",
    gradient: "from-violet-50 to-purple-50",
    badge: "bg-emerald-50 text-emerald-700",
  },
  {
    id: "5",
    title: "Pronunciation Mastery",
    desc: "Perfect your accent with phonetics training, stress patterns, and intonation exercises.",
    level: "Intermediate",
    color: "bg-blue-500",
    ring: "ring-blue-100",
    rating: 4.8,
    students: 980,
    lessons: 18,
    duration: "9h",
    instructor: "David Wilson",
    emoji: "🗣️",
    price: "$39",
    gradient: "from-amber-50 to-orange-50",
    badge: "bg-blue-50 text-blue-700",
  },
  {
    id: "6",
    title: "Academic Writing Excellence",
    desc: "Master essay writing, research papers, and academic discourse for university-level English.",
    level: "Advanced",
    color: "bg-rose-500",
    ring: "ring-rose-100",
    rating: 4.6,
    students: 720,
    lessons: 28,
    duration: "14h",
    instructor: "Prof. James Miller",
    emoji: "✍️",
    price: "$59",
    gradient: "from-cyan-50 to-sky-50",
    badge: "bg-rose-50 text-rose-700",
  },
  {
    id: "7",
    title: "English Grammar Bootcamp",
    desc: "Intensive grammar training covering tenses, articles, prepositions, and conditionals.",
    level: "Beginner",
    color: "bg-emerald-500",
    ring: "ring-emerald-100",
    rating: 4.8,
    students: 2100,
    lessons: 30,
    duration: "15h",
    instructor: "Anna Thompson",
    emoji: "📖",
    price: "$29",
    gradient: "from-lime-50 to-green-50",
    badge: "bg-emerald-50 text-emerald-700",
  },
  {
    id: "8",
    title: "TOEFL Preparation Complete",
    desc: "Full TOEFL preparation with practice tests, strategies, and expert tips for top scores.",
    level: "Advanced",
    color: "bg-rose-500",
    ring: "ring-rose-100",
    rating: 4.9,
    students: 1450,
    lessons: 42,
    duration: "21h",
    instructor: "Robert Brown",
    emoji: "🏆",
    price: "$89",
    gradient: "from-indigo-50 to-violet-50",
    badge: "bg-rose-50 text-rose-700",
  },
];

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");

  const filtered = allCourses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase());
    const matchLevel = level === "all" || c.level === level;
    return matchSearch && matchLevel;
  });

  const counts = {
    all: allCourses.length,
    Beginner: allCourses.filter((c) => c.level === "Beginner").length,
    Intermediate: allCourses.filter((c) => c.level === "Intermediate").length,
    Advanced: allCourses.filter((c) => c.level === "Advanced").length,
  };

  return (
    <div className="py-10">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Explore <span className="gradient-text">Courses</span>
          </h1>
          <p className="max-w-lg text-base text-zinc-500">
            200+ expert-crafted courses from beginner to advanced. Learn at your pace, earn
            certificates.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              size="large"
              placeholder="Search courses..."
              prefix={<SearchOutlined className="text-zinc-400" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl sm:w-72"
              allowClear
            />
            <Select
              size="large"
              value={level}
              onChange={setLevel}
              className="min-w-[180px]"
              suffixIcon={<FilterOutlined />}
              options={[
                { value: "all", label: `All Levels (${counts.all})` },
                { value: "Beginner", label: `🟢 Beginner (${counts.Beginner})` },
                { value: "Intermediate", label: `🔵 Intermediate (${counts.Intermediate})` },
                { value: "Advanced", label: `🔴 Advanced (${counts.Advanced})` },
              ]}
            />
          </div>
          <p className="text-sm text-zinc-400">
            {filtered.length} course{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c) => (
              <Link key={c.id} href={`/courses/${c.id}`} className="no-underline">
                <div className="group h-full overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-zinc-200/50">
                  {/* Thumbnail */}
                  <div
                    className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${c.gradient}`}
                  >
                    <span className="text-6xl transition-transform duration-500 group-hover:scale-110">
                      {c.emoji}
                    </span>
                    {/* Price */}
                    <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-zinc-900 shadow-sm backdrop-blur-sm">
                      {c.price}
                    </div>
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/10 group-hover:opacity-100">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-indigo-600 shadow-lg backdrop-blur-sm">
                        <PlayCircleOutlined className="text-xl" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${c.badge}`}
                      >
                        {c.level}
                      </span>
                      <div className="flex items-center gap-1 text-xs">
                        <StarFilled className="text-amber-400" />
                        <span className="font-bold text-zinc-900">{c.rating}</span>
                        <span className="text-zinc-400">({c.students.toLocaleString()})</span>
                      </div>
                    </div>

                    <h3 className="mb-2 text-sm leading-snug font-bold text-zinc-900">{c.title}</h3>
                    <p className="mb-4 line-clamp-2 text-[12px] leading-relaxed text-zinc-500">
                      {c.desc}
                    </p>

                    <div className="mb-3 flex items-center gap-4 text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1">
                        <BookOutlined /> {c.lessons} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockCircleOutlined /> {c.duration}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 border-t border-zinc-50 pt-3 text-[11px] text-zinc-500">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-[10px]">
                        <UserOutlined />
                      </div>
                      {c.instructor}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-20">
            <Empty
              description={
                <span className="text-zinc-400">No courses found matching your search</span>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
