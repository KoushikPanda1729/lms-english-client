"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Progress, Spin, Timeline } from "antd";
import {
  BookOutlined,
  ClockCircleOutlined,
  FireOutlined,
  RightOutlined,
  TeamOutlined,
  CalendarOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuth } from "@/contexts/AuthContext";
import { userService, type UserProfile } from "@/lib/services/user";
import { courseService, type Course } from "@/lib/services/course";
import { sessionService, type SessionHistory } from "@/lib/services/session";

dayjs.extend(relativeTime);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function courseEmoji(level: Course["level"]): string {
  if (level === "beginner") return "📚";
  if (level === "intermediate") return "💼";
  if (level === "advanced") return "🎓";
  return "📖";
}

function getPartnerName(session: SessionHistory, myId: string): string {
  const partner = session.userAId === myId ? session.userB : session.userA;
  if (!partner) return "someone";
  return partner.profile?.displayName || partner.email.split("@")[0];
}

function buildActivity(
  sessions: SessionHistory[],
  enrolled: Course[],
  myId: string,
): { color: string; text: string; time: string }[] {
  const items: { color: string; text: string; time: Date }[] = [];

  for (const s of sessions) {
    if (s.endedAt) {
      items.push({
        color: "blue",
        text: `Speaking session with ${getPartnerName(s, myId)}`,
        time: new Date(s.startedAt),
      });
    }
  }

  for (const c of enrolled) {
    if (c.enrollment) {
      items.push({
        color: "purple",
        text: `Enrolled in ${c.title}`,
        time: new Date(c.enrollment.enrolledAt),
      });
      if (c.enrollment.completedAt) {
        items.push({
          color: "green",
          text: `Completed ${c.title}`,
          time: new Date(c.enrollment.completedAt),
        });
      }
    }
  }

  return items
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 5)
    .map((i) => ({ color: i.color, text: i.text, time: dayjs(i.time).fromNow() }));
}

// ─── Achievements ─────────────────────────────────────────────────────────────

function computeAchievements(profile: UserProfile, enrolled: Course[]) {
  const totalCompletedLessons = enrolled.reduce(
    (sum, c) => sum + (c.enrollment?.completedLessons ?? 0),
    0,
  );
  return [
    {
      icon: "🔥",
      title: "7-Day Streak",
      desc: "Learn for 7 days straight",
      unlocked: profile.streakDays >= 7,
    },
    {
      icon: "🎯",
      title: "First Course",
      desc: "Enroll in your first course",
      unlocked: enrolled.length >= 1,
    },
    {
      icon: "💬",
      title: "Convo Star",
      desc: "Complete 10 speaking sessions",
      unlocked: profile.totalSessions >= 10,
    },
    {
      icon: "📚",
      title: "Bookworm",
      desc: "Finish 50 lessons",
      unlocked: totalCompletedLessons >= 50,
    },
  ];
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [enrolled, setEnrolled] = useState<Course[]>([]);
  const [recentSessions, setRecentSessions] = useState<SessionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userService.getMe(),
      courseService.list({ limit: 50 }),
      sessionService.getHistory(1, 5),
    ])
      .then(([prof, coursesRes, sessionsRes]) => {
        setProfile(prof);
        setEnrolled(coursesRes.courses.filter((c) => c.enrollment != null));
        setRecentSessions(sessionsRes.sessions);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const displayName = profile?.displayName || user?.name || user?.email?.split("@")[0] || "there";
  const hoursPracticed = profile ? Math.round(profile.totalPracticeMins / 60) : 0;

  const displayCourses = [...enrolled]
    .sort(
      (a, b) =>
        new Date(b.enrollment!.enrolledAt).getTime() - new Date(a.enrollment!.enrolledAt).getTime(),
    )
    .slice(0, 3);

  const achievements = profile ? computeAchievements(profile, enrolled) : [];
  const activity = buildActivity(recentSessions, enrolled, user!.id);

  const stats = [
    {
      label: "Courses Enrolled",
      value: enrolled.length,
      icon: <BookOutlined />,
      bg: "from-indigo-500 to-violet-600",
    },
    {
      label: "Hours Practiced",
      value: hoursPracticed,
      icon: <ClockCircleOutlined />,
      bg: "from-cyan-500 to-blue-600",
    },
    {
      label: "Speaking Sessions",
      value: profile?.totalSessions ?? 0,
      icon: <TeamOutlined />,
      bg: "from-emerald-500 to-teal-600",
    },
    {
      label: "Day Streak",
      value: `${profile?.streakDays ?? 0}🔥`,
      icon: <FireOutlined />,
      bg: "from-amber-500 to-orange-600",
    },
  ];

  const quickActions = [
    {
      href: "/courses",
      icon: <BookOutlined />,
      label: "Courses",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      href: "/partners",
      icon: <TeamOutlined />,
      label: "Partners",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      href: "/ai-conversation",
      icon: <RobotOutlined />,
      label: "AI Tutor",
      color: "bg-violet-50 text-violet-600",
    },
    {
      href: "/sessions",
      icon: <CalendarOutlined />,
      label: "Sessions",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="py-5 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* ── MOBILE HERO CARD ── */}
        <div className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-5 sm:hidden">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium text-white/70">Welcome back 👋</p>
              <h1 className="mt-0.5 truncate text-xl font-bold text-white">{displayName}</h1>
              <p className="mt-0.5 text-xs text-white/60">Here&apos;s your learning overview</p>
            </div>
            <div className="ml-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold text-white backdrop-blur-sm">
              {displayName[0]?.toUpperCase()}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              🔥 {profile?.streakDays ?? 0} day streak
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              📚 {enrolled.length} courses
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              ⏱ {hoursPracticed}h practiced
            </span>
          </div>
        </div>

        {/* ── DESKTOP WELCOME ── */}
        <div className="mb-8 hidden sm:block">
          <h1 className="mb-1 text-3xl font-bold tracking-tight text-zinc-900">
            Welcome back, <span className="gradient-text">{displayName}!</span> 👋
          </h1>
          <p className="text-base text-zinc-500">Here&apos;s your learning overview</p>
        </div>

        {/* ── MOBILE QUICK ACTIONS ── */}
        <div className="mb-5 sm:hidden">
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-zinc-100 bg-white py-3 no-underline shadow-sm transition active:scale-95"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-base ${a.color}`}
                >
                  {a.icon}
                </div>
                <span className="text-[10px] font-semibold text-zinc-600">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── MOBILE STATS ── */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:hidden">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white p-3.5 shadow-sm"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm text-white ${s.bg}`}
              >
                {s.icon}
              </div>
              <div>
                <div className="text-lg leading-none font-bold text-zinc-900">{s.value}</div>
                <div className="mt-0.5 text-[10px] leading-tight text-zinc-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── DESKTOP STATS ── */}
        <div className="mb-8 hidden grid-cols-4 gap-4 sm:grid">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4"
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-base text-white ${s.bg}`}
              >
                {s.icon}
              </div>
              <div>
                <div className="text-xl font-bold text-zinc-900">{s.value}</div>
                <div className="text-[11px] text-zinc-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── MOBILE MY COURSES ── */}
        <div className="mb-5 sm:hidden">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900">My Courses</h2>
            <Link
              href="/courses"
              className="flex items-center gap-0.5 text-xs font-semibold text-indigo-600 no-underline"
            >
              View All <RightOutlined style={{ fontSize: 10 }} />
            </Link>
          </div>
          {displayCourses.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-zinc-100 bg-white py-8 text-center">
              <div className="mb-2 text-3xl">📚</div>
              <p className="text-xs text-zinc-500">No courses enrolled yet</p>
              <Link href="/courses" className="mt-3">
                <Button type="primary" size="small">
                  Browse Courses
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {displayCourses.map((c) => (
                <Link
                  key={c.id}
                  href={`/courses/${c.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white p-3.5 no-underline shadow-sm transition active:scale-[0.98]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-xl">
                    {courseEmoji(c.level)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <h4 className="truncate text-sm font-semibold text-zinc-900">{c.title}</h4>
                      <span className="shrink-0 text-[10px] font-medium text-zinc-400">
                        {c.enrollment!.completedLessons}/{c.totalLessons}
                      </span>
                    </div>
                    <Progress
                      percent={c.enrollment!.progressPercent}
                      size={["100%", 5]}
                      strokeColor={{ "0%": "#6366f1", "100%": "#a78bfa" }}
                      showInfo={false}
                    />
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400">
                        {c.enrollment!.progressPercent}% complete
                      </span>
                      {c.enrollment!.progressPercent === 100 ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-600">
                          ✓ Done
                        </span>
                      ) : (
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-semibold text-indigo-600">
                          Continue →
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── MOBILE ACHIEVEMENTS ── */}
        <div className="mb-5 sm:hidden">
          <h2 className="mb-3 text-sm font-bold text-zinc-900">Achievements</h2>
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {achievements.map((a) => (
              <div
                key={a.title}
                className={`flex w-20 shrink-0 flex-col items-center gap-2 rounded-2xl border bg-white p-3 text-center shadow-sm transition-opacity ${
                  a.unlocked ? "border-amber-200 opacity-100" : "border-zinc-100 opacity-40"
                }`}
              >
                <span className="text-2xl">{a.icon}</span>
                <span className="text-[10px] leading-tight font-semibold text-zinc-700">
                  {a.title}
                </span>
                {a.unlocked && (
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[8px] font-bold tracking-wide text-emerald-600 uppercase">
                    Earned
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── MOBILE RECENT ACTIVITY ── */}
        <div className="mb-2 sm:hidden">
          <h2 className="mb-3 text-sm font-bold text-zinc-900">Recent Activity</h2>
          {activity.length === 0 ? (
            <p className="text-xs text-zinc-400">No recent activity yet</p>
          ) : (
            <div className="space-y-2">
              {activity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-white px-3.5 py-3"
                >
                  <div
                    className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                      item.color === "blue"
                        ? "bg-blue-500"
                        : item.color === "purple"
                          ? "bg-violet-500"
                          : "bg-emerald-500"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-snug font-medium text-zinc-700">{item.text}</p>
                    <p className="mt-0.5 text-[10px] text-zinc-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── DESKTOP MAIN GRID ── */}
        <div className="hidden gap-6 sm:grid lg:grid-cols-3">
          {/* Left: 2 cols */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-semibold text-zinc-900">My Courses</h2>
                <Link href="/courses">
                  <Button type="link" size="small" className="text-xs font-medium">
                    View All <RightOutlined />
                  </Button>
                </Link>
              </div>
              {displayCourses.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="mb-3 text-4xl">📚</div>
                  <p className="text-sm text-zinc-500">No courses enrolled yet</p>
                  <Link href="/courses" className="mt-3">
                    <Button type="primary" size="small">
                      Browse Courses
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {displayCourses.map((c) => (
                    <Link
                      key={c.id}
                      href={`/courses/${c.id}`}
                      className="flex items-center gap-3 no-underline"
                    >
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-xl">
                        {courseEmoji(c.level)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <h4 className="truncate text-sm font-medium text-zinc-900">{c.title}</h4>
                          <span className="flex-shrink-0 text-[11px] text-zinc-400">
                            {c.enrollment!.completedLessons}/{c.totalLessons}
                          </span>
                        </div>
                        <Progress
                          percent={c.enrollment!.progressPercent}
                          size={["100%", 8]}
                          strokeColor={{ "0%": "#6366f1", "100%": "#a78bfa" }}
                          showInfo={false}
                        />
                        <span className="text-[11px] text-zinc-500">
                          {c.enrollment!.progressPercent}% complete
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5">
              <h2 className="mb-4 text-base font-semibold text-zinc-900">Achievements</h2>
              <div className="space-y-3.5">
                {achievements.map((a) => (
                  <div
                    key={a.title}
                    className={`flex items-center gap-3 transition-opacity ${a.unlocked ? "opacity-100" : "opacity-35"}`}
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50 text-lg">
                      {a.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-900">
                        {a.title}
                        {a.unlocked && (
                          <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-emerald-600 uppercase">
                            Earned
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500">{a.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5">
              <h2 className="mb-4 text-base font-semibold text-zinc-900">Recent Activity</h2>
              {activity.length === 0 ? (
                <p className="text-sm text-zinc-400">No recent activity yet</p>
              ) : (
                <Timeline
                  items={activity.map((item) => ({
                    color: item.color,
                    content: (
                      <div>
                        <p className="text-xs text-zinc-700">{item.text}</p>
                        <p className="text-[11px] text-zinc-400">{item.time}</p>
                      </div>
                    ),
                  }))}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
