"use client";

import { useEffect, useRef, useState } from "react";
import { Form, Input, Select, Button, message, Spin, Avatar, Divider } from "antd";
import {
  UserOutlined,
  CameraOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  FireOutlined,
  ClockCircleOutlined,
  VideoCameraOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { userService, UserProfile } from "@/lib/services/user";
import { useAuth } from "@/contexts/AuthContext";

const ENGLISH_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "elementary", label: "Elementary" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const LEARNING_GOALS = [
  { value: "fluency", label: "General Fluency" },
  { value: "business", label: "Business English" },
  { value: "travel", label: "Travel & Everyday Life" },
  { value: "exam", label: "Exam Preparation" },
  { value: "academic", label: "Academic English" },
  { value: "interview", label: "Job Interviews" },
];

const LANGUAGES = [
  "Afrikaans",
  "Albanian",
  "Amharic",
  "Arabic",
  "Armenian",
  "Azerbaijani",
  "Basque",
  "Bengali",
  "Bosnian",
  "Bulgarian",
  "Burmese",
  "Catalan",
  "Chinese (Cantonese)",
  "Chinese (Mandarin)",
  "Croatian",
  "Czech",
  "Danish",
  "Dutch",
  "Estonian",
  "Farsi",
  "Filipino",
  "Finnish",
  "French",
  "Georgian",
  "German",
  "Greek",
  "Gujarati",
  "Hausa",
  "Hebrew",
  "Hindi",
  "Hungarian",
  "Icelandic",
  "Igbo",
  "Indonesian",
  "Italian",
  "Japanese",
  "Javanese",
  "Kannada",
  "Kazakh",
  "Khmer",
  "Korean",
  "Kurdish",
  "Kyrgyz",
  "Lao",
  "Latvian",
  "Lithuanian",
  "Macedonian",
  "Malay",
  "Malayalam",
  "Marathi",
  "Mongolian",
  "Nepali",
  "Norwegian",
  "Oromo",
  "Pashto",
  "Polish",
  "Portuguese",
  "Punjabi",
  "Romanian",
  "Russian",
  "Serbian",
  "Sinhalese",
  "Slovak",
  "Slovenian",
  "Somali",
  "Spanish",
  "Swahili",
  "Swedish",
  "Tagalog",
  "Tamil",
  "Telugu",
  "Thai",
  "Tibetan",
  "Turkish",
  "Turkmen",
  "Ukrainian",
  "Urdu",
  "Uzbek",
  "Vietnamese",
  "Welsh",
  "Yoruba",
  "Zulu",
].map((l) => ({ value: l, label: l }));

const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bangladesh",
  "Belarus",
  "Belgium",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Brazil",
  "Bulgaria",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Congo",
  "Croatia",
  "Cuba",
  "Czech Republic",
  "Denmark",
  "Ecuador",
  "Egypt",
  "Ethiopia",
  "Finland",
  "France",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Guatemala",
  "Honduras",
  "Hungary",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Latvia",
  "Lebanon",
  "Libya",
  "Lithuania",
  "Malaysia",
  "Mexico",
  "Moldova",
  "Mongolia",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Nigeria",
  "Norway",
  "Pakistan",
  "Palestine",
  "Panama",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Romania",
  "Russia",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Singapore",
  "Slovakia",
  "Somalia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zimbabwe",
].map((c) => ({ value: c, label: c }));

const TIMEZONES = [
  { value: "Pacific/Midway", label: "(UTC-11:00) Midway Island" },
  { value: "Pacific/Honolulu", label: "(UTC-10:00) Hawaii" },
  { value: "America/Anchorage", label: "(UTC-09:00) Alaska" },
  { value: "America/Los_Angeles", label: "(UTC-08:00) Pacific Time (US & Canada)" },
  { value: "America/Denver", label: "(UTC-07:00) Mountain Time (US & Canada)" },
  { value: "America/Chicago", label: "(UTC-06:00) Central Time (US & Canada)" },
  { value: "America/New_York", label: "(UTC-05:00) Eastern Time (US & Canada)" },
  { value: "America/Caracas", label: "(UTC-04:30) Caracas" },
  { value: "America/Halifax", label: "(UTC-04:00) Atlantic Time (Canada)" },
  { value: "America/Sao_Paulo", label: "(UTC-03:00) Brasilia" },
  { value: "America/Argentina/Buenos_Aires", label: "(UTC-03:00) Buenos Aires" },
  { value: "Atlantic/South_Georgia", label: "(UTC-02:00) Mid-Atlantic" },
  { value: "Atlantic/Azores", label: "(UTC-01:00) Azores" },
  { value: "Europe/London", label: "(UTC+00:00) London, Dublin, Lisbon" },
  { value: "Europe/Paris", label: "(UTC+01:00) Paris, Berlin, Amsterdam" },
  { value: "Europe/Rome", label: "(UTC+01:00) Rome, Vienna, Warsaw" },
  { value: "Europe/Athens", label: "(UTC+02:00) Athens, Helsinki, Kiev" },
  { value: "Asia/Istanbul", label: "(UTC+03:00) Istanbul, Moscow" },
  { value: "Asia/Tehran", label: "(UTC+03:30) Tehran" },
  { value: "Asia/Dubai", label: "(UTC+04:00) Abu Dhabi, Dubai, Muscat" },
  { value: "Asia/Kabul", label: "(UTC+04:30) Kabul" },
  { value: "Asia/Karachi", label: "(UTC+05:00) Islamabad, Karachi" },
  { value: "Asia/Kolkata", label: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi" },
  { value: "Asia/Kathmandu", label: "(UTC+05:45) Kathmandu" },
  { value: "Asia/Dhaka", label: "(UTC+06:00) Dhaka, Almaty" },
  { value: "Asia/Rangoon", label: "(UTC+06:30) Yangon" },
  { value: "Asia/Bangkok", label: "(UTC+07:00) Bangkok, Hanoi, Jakarta" },
  { value: "Asia/Shanghai", label: "(UTC+08:00) Beijing, Shanghai, Singapore" },
  { value: "Asia/Seoul", label: "(UTC+09:00) Seoul, Tokyo" },
  { value: "Australia/Adelaide", label: "(UTC+09:30) Adelaide, Darwin" },
  { value: "Australia/Sydney", label: "(UTC+10:00) Sydney, Melbourne, Brisbane" },
  { value: "Pacific/Auckland", label: "(UTC+12:00) Auckland, Wellington" },
];

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const skipDirtyRef = useRef(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const { user, setUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    userService
      .getMe()
      .then((p) => {
        setProfile(p);
        skipDirtyRef.current = true;
        form.setFieldsValue({
          username: p.username ?? "",
          displayName: p.displayName ?? user?.name ?? "",
          bio: p.bio ?? "",
          englishLevel: p.englishLevel ?? undefined,
          nativeLanguage: p.nativeLanguage ?? undefined,
          learningGoal: p.learningGoal ?? undefined,
          country: p.country ?? undefined,
          timezone: p.timezone ?? undefined,
        });
        skipDirtyRef.current = false;
      })
      .catch(() => messageApi.error("Failed to load profile"))
      .finally(() => setLoadingProfile(false));
  }, [form, messageApi, user]);

  const handleSave = async (values: {
    username: string;
    displayName: string;
    bio: string;
    englishLevel: "beginner" | "elementary" | "intermediate" | "advanced";
    nativeLanguage: string;
    learningGoal: string;
    country: string;
    timezone: string;
  }) => {
    setSaving(true);
    try {
      const updated = await userService.updateMe({
        username: values.username || undefined,
        displayName: values.displayName || undefined,
        bio: values.bio || undefined,
        englishLevel: values.englishLevel,
        nativeLanguage: values.nativeLanguage || undefined,
        learningGoal: values.learningGoal || undefined,
        country: values.country || undefined,
        timezone: values.timezone || undefined,
      });
      setProfile(updated);
      setIsDirty(false);
      messageApi.success("Profile saved!");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to save profile";
      messageApi.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      messageApi.error("Image must be under 5 MB");
      return;
    }
    setAvatarUploading(true);
    try {
      const updated = await userService.uploadAvatar(file);
      setProfile(updated);
      if (user) setUser({ ...user, avatarUrl: updated.avatarUrl ?? null });
      messageApi.success("Avatar updated!");
    } catch {
      messageApi.error("Failed to upload avatar");
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAvatar = async () => {
    setAvatarUploading(true);
    try {
      const updated = await userService.deleteAvatar();
      setProfile(updated);
      if (user) setUser({ ...user, avatarUrl: null });
      messageApi.success("Avatar removed");
    } catch {
      messageApi.error("Failed to remove avatar");
    } finally {
      setAvatarUploading(false);
    }
  };

  const displayName = profile?.displayName ?? user?.name ?? "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-zinc-50">
      {contextHolder}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />

      {/* ── MOBILE LAYOUT ── */}
      <div className="sm:hidden">
        {/* Profile hero */}
        <div className="relative">
          {/* Cover — background image with dark overlay */}
          <div
            className="relative h-32 overflow-hidden"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/35" />
            <Link
              href="/dashboard"
              className="relative z-10 inline-flex items-center gap-1.5 px-4 pt-4 text-sm font-medium text-white/90 no-underline"
            >
              <ArrowLeftOutlined style={{ fontSize: 12 }} /> Dashboard
            </Link>
          </div>

          {/* White card below, overlapping cover */}
          <div className="bg-white px-4 pb-5">
            {/* Avatar — centered, overlapping cover */}
            <div className="flex flex-col items-center">
              <div className="relative -mt-10 mb-3">
                {avatarUploading ? (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-zinc-100 shadow-lg">
                    <LoadingOutlined className="text-xl text-indigo-500" />
                  </div>
                ) : (
                  <Avatar
                    size={80}
                    src={profile?.avatarUrl ?? undefined}
                    style={{
                      backgroundColor: "#6366f1",
                      fontSize: 26,
                      fontWeight: 700,
                      border: "4px solid white",
                      boxShadow: "0 8px 24px rgba(99,102,241,0.2)",
                    }}
                  >
                    {!profile?.avatarUrl && initials}
                  </Avatar>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-indigo-600 shadow transition active:scale-95"
                >
                  <CameraOutlined style={{ fontSize: 10, color: "#fff" }} />
                </button>
              </div>

              <h2 className="text-[17px] font-bold text-zinc-900">{displayName}</h2>
              {profile?.username && (
                <p className="mt-0.5 text-xs text-zinc-400">@{profile.username}</p>
              )}
              {profile?.avatarUrl && (
                <button
                  type="button"
                  onClick={handleDeleteAvatar}
                  disabled={avatarUploading}
                  className="mt-1.5 text-[11px] text-red-400 underline underline-offset-2 disabled:opacity-40"
                >
                  Remove photo
                </button>
              )}
            </div>

            {/* Stats cards row */}
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              {[
                {
                  value: profile?.streakDays ?? 0,
                  label: "Streak",
                  emoji: "🔥",
                  bg: "bg-orange-50",
                  text: "text-orange-500",
                },
                {
                  value: profile?.totalSessions ?? 0,
                  label: "Sessions",
                  emoji: "💬",
                  bg: "bg-indigo-50",
                  text: "text-indigo-500",
                },
                {
                  value: profile?.totalPracticeMins ?? 0,
                  label: "Mins",
                  emoji: "⏱",
                  bg: "bg-emerald-50",
                  text: "text-emerald-500",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-zinc-100 py-3 shadow-sm"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl text-base ${s.bg}`}
                  >
                    {s.emoji}
                  </span>
                  <span className="text-lg leading-none font-extrabold text-zinc-900">
                    {s.value}
                  </span>
                  <span className="text-[10px] font-semibold tracking-wide text-zinc-400 uppercase">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form area */}
        {loadingProfile ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : (
          <div
            className="bg-zinc-50 px-4 py-5 pb-36"
            onChange={() => {
              if (!skipDirtyRef.current) setIsDirty(true);
            }}
          >
            {(!profile?.username || !profile?.englishLevel) && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs text-amber-700">
                <span>⚠️</span>
                <span>
                  <strong>Username</strong> and <strong>English level</strong> are required to find
                  speaking partners.
                </span>
              </div>
            )}

            <Form form={form} layout="vertical" onFinish={handleSave} requiredMark={false}>
              {/* Public Profile */}
              <div className="mb-4 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
                <p className="mb-4 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  Public Profile
                </p>
                <Form.Item
                  name="username"
                  label={
                    <span className="text-sm font-medium text-zinc-700">
                      Username <span className="text-red-500">*</span>
                    </span>
                  }
                  rules={[
                    { required: true, message: "Username is required" },
                    { min: 3, message: "Minimum 3 characters" },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: "Letters, numbers, underscores only" },
                  ]}
                  className="mb-3"
                >
                  <Input
                    prefix={<UserOutlined className="text-zinc-400" />}
                    placeholder="e.g. john_doe"
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  name="displayName"
                  label={<span className="text-sm font-medium text-zinc-700">Display Name</span>}
                  className="mb-3"
                >
                  <Input placeholder="Your full name" size="large" />
                </Form.Item>
                <Form.Item
                  name="bio"
                  label={<span className="text-sm font-medium text-zinc-700">Bio</span>}
                  className="mb-0"
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Tell others a little about yourself…"
                    maxLength={300}
                    showCount
                  />
                </Form.Item>
              </div>

              {/* Learning Preferences */}
              <div className="mb-4 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
                <p className="mb-4 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  Learning Preferences
                </p>
                <Form.Item
                  name="englishLevel"
                  label={
                    <span className="text-sm font-medium text-zinc-700">
                      English Level <span className="text-red-500">*</span>
                    </span>
                  }
                  rules={[{ required: true, message: "Please select your English level" }]}
                  className="mb-3"
                >
                  <Select placeholder="Select your level" size="large" options={ENGLISH_LEVELS} />
                </Form.Item>
                <Form.Item
                  name="learningGoal"
                  label={<span className="text-sm font-medium text-zinc-700">Learning Goal</span>}
                  className="mb-3"
                >
                  <Select
                    placeholder="What do you want to improve?"
                    size="large"
                    allowClear
                    options={LEARNING_GOALS}
                  />
                </Form.Item>
                <Form.Item
                  name="nativeLanguage"
                  label={<span className="text-sm font-medium text-zinc-700">Native Language</span>}
                  className="mb-3"
                >
                  <Select
                    showSearch
                    placeholder="Select your native language"
                    size="large"
                    allowClear
                    options={LANGUAGES}
                    filterOption={(input, opt) =>
                      (opt?.label as string)?.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="country"
                  label={<span className="text-sm font-medium text-zinc-700">Country</span>}
                  className="mb-0"
                >
                  <Select
                    showSearch
                    placeholder="Select your country"
                    size="large"
                    allowClear
                    options={COUNTRIES}
                    filterOption={(input, opt) =>
                      (opt?.label as string)?.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              </div>

              {/* Regional */}
              <div className="mb-4 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
                <p className="mb-4 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  Regional
                </p>
                <Form.Item
                  name="timezone"
                  label={<span className="text-sm font-medium text-zinc-700">Timezone</span>}
                  className="mb-0"
                >
                  <Select
                    showSearch
                    placeholder="Select your timezone"
                    size="large"
                    allowClear
                    options={TIMEZONES}
                    filterOption={(input, opt) =>
                      (opt?.label as string)?.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              </div>

              {/* Sticky save button */}
              <div className="fixed right-0 bottom-16 left-0 z-30 border-t border-zinc-100 bg-white/95 px-4 py-3 backdrop-blur-sm">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={saving}
                  disabled={!isDirty}
                  className="h-12 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/25"
                  style={
                    isDirty
                      ? {
                          background: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)",
                          border: "none",
                        }
                      : undefined
                  }
                >
                  Save Changes
                </Button>
              </div>
            </Form>
          </div>
        )}
      </div>

      {/* ── DESKTOP LAYOUT (unchanged) ── */}
      <div className="hidden py-8 sm:block">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="mb-3 inline-flex items-center gap-1.5 text-sm text-zinc-400 no-underline hover:text-zinc-700"
            >
              <ArrowLeftOutlined /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-zinc-900">Profile Settings</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Manage your profile, preferences and avatar.
            </p>
          </div>

          {loadingProfile ? (
            <div className="flex justify-center py-24">
              <Spin size="large" />
            </div>
          ) : (
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              <div className="flex flex-col gap-4 lg:w-64 lg:shrink-0">
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <p className="mb-4 text-xs font-semibold tracking-widest text-zinc-400 uppercase">
                    Avatar
                  </p>
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      {avatarUploading ? (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100">
                          <LoadingOutlined className="text-2xl text-indigo-500" />
                        </div>
                      ) : (
                        <Avatar
                          size={96}
                          src={profile?.avatarUrl ?? undefined}
                          className="bg-indigo-500 text-xl font-bold"
                        >
                          {!profile?.avatarUrl && initials}
                        </Avatar>
                      )}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white shadow-md transition hover:bg-indigo-700"
                      >
                        <CameraOutlined className="text-xs" />
                      </button>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-zinc-800">{displayName}</p>
                      {profile?.username && (
                        <p className="text-sm text-zinc-400">@{profile.username}</p>
                      )}
                    </div>
                    <div className="flex w-full flex-col gap-2">
                      <Button
                        block
                        icon={<CameraOutlined />}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={avatarUploading}
                      >
                        Upload Photo
                      </Button>
                      {profile?.avatarUrl && (
                        <Button
                          block
                          danger
                          icon={<DeleteOutlined />}
                          onClick={handleDeleteAvatar}
                          disabled={avatarUploading}
                        >
                          Remove Photo
                        </Button>
                      )}
                    </div>
                    <p className="text-center text-xs text-zinc-400">JPG, PNG or GIF · max 5 MB</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <p className="mb-4 text-xs font-semibold tracking-widest text-zinc-400 uppercase">
                    Stats
                  </p>
                  <div className="flex flex-col gap-4">
                    {[
                      {
                        icon: <FireOutlined className="text-orange-500" />,
                        bg: "bg-orange-50",
                        value: profile?.streakDays ?? 0,
                        label: "Day streak",
                      },
                      {
                        icon: <VideoCameraOutlined className="text-indigo-500" />,
                        bg: "bg-indigo-50",
                        value: profile?.totalSessions ?? 0,
                        label: "Sessions",
                      },
                      {
                        icon: <ClockCircleOutlined className="text-green-500" />,
                        bg: "bg-green-50",
                        value: profile?.totalPracticeMins ?? 0,
                        label: "Minutes practiced",
                      },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.bg}`}
                        >
                          {s.icon}
                        </div>
                        <div>
                          <p className="text-lg leading-none font-bold text-zinc-900">{s.value}</p>
                          <p className="text-xs text-zinc-400">{s.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                {(!profile?.username || !profile?.englishLevel) && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    <span className="text-base">⚠️</span>
                    <span>
                      <strong>Username</strong> and <strong>English level</strong> are required
                      before you can find speaking partners.
                    </span>
                  </div>
                )}
                <Form form={form} layout="vertical" onFinish={handleSave} requiredMark={false}>
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <p className="mb-5 text-xs font-semibold tracking-widest text-zinc-400 uppercase">
                      Public Profile
                    </p>
                    <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                      <Form.Item
                        name="username"
                        label={
                          <span className="font-medium text-zinc-700">
                            Username <span className="text-red-500">*</span>
                          </span>
                        }
                        rules={[
                          { required: true, message: "Username is required" },
                          { min: 3, message: "Minimum 3 characters" },
                          {
                            pattern: /^[a-zA-Z0-9_]+$/,
                            message: "Letters, numbers, underscores only",
                          },
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined className="text-zinc-400" />}
                          placeholder="e.g. john_doe"
                          size="large"
                        />
                      </Form.Item>
                      <Form.Item
                        name="displayName"
                        label={<span className="font-medium text-zinc-700">Display Name</span>}
                      >
                        <Input placeholder="Your full name" size="large" />
                      </Form.Item>
                    </div>
                    <Form.Item
                      name="bio"
                      label={<span className="font-medium text-zinc-700">Bio</span>}
                    >
                      <Input.TextArea
                        rows={3}
                        placeholder="Tell others a little about yourself…"
                        maxLength={300}
                        showCount
                      />
                    </Form.Item>
                  </div>
                  <Divider className="my-0" />
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <p className="mb-5 text-xs font-semibold tracking-widest text-zinc-400 uppercase">
                      Learning Preferences
                    </p>
                    <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                      <Form.Item
                        name="englishLevel"
                        label={
                          <span className="font-medium text-zinc-700">
                            English Level <span className="text-red-500">*</span>
                          </span>
                        }
                        rules={[{ required: true, message: "Please select your English level" }]}
                      >
                        <Select
                          placeholder="Select your level"
                          size="large"
                          options={ENGLISH_LEVELS}
                        />
                      </Form.Item>
                      <Form.Item
                        name="learningGoal"
                        label={<span className="font-medium text-zinc-700">Learning Goal</span>}
                      >
                        <Select
                          placeholder="What do you want to improve?"
                          size="large"
                          allowClear
                          options={LEARNING_GOALS}
                        />
                      </Form.Item>
                      <Form.Item
                        name="nativeLanguage"
                        label={<span className="font-medium text-zinc-700">Native Language</span>}
                      >
                        <Select
                          showSearch
                          placeholder="Select your native language"
                          size="large"
                          allowClear
                          options={LANGUAGES}
                          filterOption={(input, opt) =>
                            (opt?.label as string)?.toLowerCase().includes(input.toLowerCase())
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        name="country"
                        label={<span className="font-medium text-zinc-700">Country</span>}
                      >
                        <Select
                          showSearch
                          placeholder="Select your country"
                          size="large"
                          allowClear
                          options={COUNTRIES}
                          filterOption={(input, opt) =>
                            (opt?.label as string)?.toLowerCase().includes(input.toLowerCase())
                          }
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <Divider className="my-0" />
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <p className="mb-5 text-xs font-semibold tracking-widest text-zinc-400 uppercase">
                      Regional
                    </p>
                    <Form.Item
                      name="timezone"
                      label={<span className="font-medium text-zinc-700">Timezone</span>}
                    >
                      <Select
                        showSearch
                        placeholder="Select your timezone"
                        size="large"
                        allowClear
                        options={TIMEZONES}
                        filterOption={(input, opt) =>
                          (opt?.label as string)?.toLowerCase().includes(input.toLowerCase())
                        }
                      />
                    </Form.Item>
                  </div>
                  <div className="mt-4">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={saving}
                      className="h-12 min-w-40 rounded-xl px-8 text-[15px] font-bold shadow-lg shadow-indigo-500/25"
                    >
                      Save Changes
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
