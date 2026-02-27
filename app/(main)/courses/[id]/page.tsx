"use client";

import React from "react";
import Link from "next/link";
import { Button, Collapse, Divider, Tag } from "antd";
import {
  ArrowLeftOutlined,
  BookOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  PlayCircleOutlined,
  StarFilled,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
} from "@ant-design/icons";

const courseData: Record<
  string,
  {
    title: string;
    desc: string;
    level: string;
    levelColor: string;
    rating: number;
    students: number;
    lessons: number;
    duration: string;
    instructor: string;
    emoji: string;
    price: string;
    modules: { title: string; lessons: string[] }[];
    skills: string[];
  }
> = {
  "1": {
    title: "English for Beginners",
    desc: "Start your English journey with fundamental grammar, vocabulary, and basic conversation skills. This course covers everything from greetings to building simple sentences.",
    level: "Beginner",
    levelColor: "green",
    rating: 4.9,
    students: 2340,
    lessons: 24,
    duration: "12 hours",
    instructor: "Sarah Johnson",
    emoji: "📚",
    price: "Free",
    modules: [
      {
        title: "Getting Started",
        lessons: ["Introduction to English", "The Alphabet & Pronunciation", "Basic Greetings"],
      },
      {
        title: "Building Vocabulary",
        lessons: ["Numbers & Colors", "Family Members", "Common Objects"],
      },
      {
        title: "Grammar Basics",
        lessons: ["Simple Present Tense", "Articles (a, an, the)", "Singular & Plural"],
      },
    ],
    skills: [
      "Basic grammar foundation",
      "Essential vocabulary (500+ words)",
      "Everyday conversation starters",
      "Proper pronunciation basics",
      "Reading simple texts",
    ],
  },
  "2": {
    title: "Business English Mastery",
    desc: "Master professional English for meetings, presentations, emails, and corporate communication. Designed for working professionals.",
    level: "Intermediate",
    levelColor: "blue",
    rating: 4.8,
    students: 1890,
    lessons: 32,
    duration: "16 hours",
    instructor: "Michael Chen",
    emoji: "💼",
    price: "$49",
    modules: [
      {
        title: "Professional Communication",
        lessons: ["Email Writing", "Meeting Vocabulary", "Phone Etiquette"],
      },
      { title: "Presentations", lessons: ["Structuring Your Talk", "Visual Aids", "Q&A Handling"] },
      {
        title: "Negotiations",
        lessons: ["Persuasion Techniques", "Making Offers", "Closing Deals"],
      },
    ],
    skills: [
      "Write professional emails",
      "Lead meetings confidently",
      "Deliver powerful presentations",
      "Negotiate in English",
      "Network effectively",
    ],
  },
};

const defaultCourse = {
  title: "English Course",
  desc: "A comprehensive English learning course designed to help you improve your skills.",
  level: "Beginner",
  levelColor: "green",
  rating: 4.8,
  students: 1500,
  lessons: 24,
  duration: "12 hours",
  instructor: "Expert Teacher",
  emoji: "📚",
  price: "Free",
  modules: [
    { title: "Module 1", lessons: ["Lesson 1", "Lesson 2", "Lesson 3"] },
    { title: "Module 2", lessons: ["Lesson 4", "Lesson 5", "Lesson 6"] },
  ],
  skills: [
    "Core grammar skills",
    "Vocabulary building",
    "Conversation practice",
    "Reading comprehension",
  ],
};

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const course = courseData[id] || defaultCourse;

  return (
    <div className="py-10">
      <div className="mx-auto max-w-6xl px-6">
        {/* Back link */}
        <Link
          href="/courses"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 no-underline hover:text-zinc-900 dark:hover:text-white"
        >
          <ArrowLeftOutlined /> Back to Courses
        </Link>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left column — 2 cols */}
          <div className="lg:col-span-2">
            {/* Hero */}
            <div className="mb-8 overflow-hidden rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-indigo-50 to-violet-50 dark:border-zinc-800 dark:from-indigo-950/20 dark:to-violet-950/20">
              <div className="flex h-48 items-center justify-center">
                <span className="text-7xl">{course.emoji}</span>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Tag color={course.levelColor} className="rounded-full border-0 text-xs">
                {course.level}
              </Tag>
              <div className="flex items-center gap-1 text-sm">
                <StarFilled className="text-amber-400" />
                <span className="font-bold text-zinc-900 dark:text-white">{course.rating}</span>
                <span className="text-zinc-400">({course.students.toLocaleString()} students)</span>
              </div>
            </div>

            <h1 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-white">
              {course.title}
            </h1>
            <p className="mb-6 text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
              {course.desc}
            </p>

            <div className="mb-8 flex flex-wrap items-center gap-5 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <UserOutlined /> {course.instructor}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOutlined /> {course.lessons} lessons
              </span>
              <span className="flex items-center gap-1.5">
                <ClockCircleOutlined /> {course.duration}
              </span>
            </div>

            {/* What you'll learn */}
            <div className="mb-8 rounded-2xl border border-zinc-200/80 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                What you&apos;ll learn
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {course.skills.map((s) => (
                  <div
                    key={s}
                    className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                  >
                    <CheckCircleFilled className="mt-0.5 text-emerald-500" />
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Curriculum</h2>
            <Collapse
              items={course.modules.map((m, i) => ({
                key: String(i),
                label: (
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {m.title}
                  </span>
                ),
                children: (
                  <div className="space-y-2">
                    {m.lessons.map((l) => (
                      <div
                        key={l}
                        className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                      >
                        <PlayCircleOutlined className="text-indigo-500" /> {l}
                      </div>
                    ))}
                  </div>
                ),
              }))}
              defaultActiveKey={["0"]}
              className="rounded-xl border-zinc-200 dark:border-zinc-800"
            />
          </div>

          {/* Right sidebar */}
          <div>
            <div className="sticky top-20 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-lg shadow-black/5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 text-3xl font-bold text-indigo-600">{course.price}</div>
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                block
                className="mb-3 h-11 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/25"
              >
                {course.price === "Free" ? "Enroll for Free" : "Enroll Now"}
              </Button>
              <Divider className="my-4" />
              <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BookOutlined /> Lessons
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-white">
                    {course.lessons}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ClockCircleOutlined /> Duration
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-white">
                    {course.duration}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <TrophyOutlined /> Level
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-white">{course.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <TeamOutlined /> Students
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-white">
                    {course.students.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
