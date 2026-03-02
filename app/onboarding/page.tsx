"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Steps, Button, Form, Input, Select, Radio, message, Spin } from "antd";
import {
  UserOutlined,
  GlobalOutlined,
  AimOutlined,
  BookOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { onboardingService, OnboardingQuestion } from "@/lib/services/onboarding";
import { authService } from "@/lib/services/auth";
import { useAuth } from "@/contexts/AuthContext";

const { Option } = Select;

const LEARNING_GOALS = [
  { value: "fluency", label: "General Fluency" },
  { value: "business", label: "Business English" },
  { value: "travel", label: "Travel" },
  { value: "exam", label: "Exam Preparation" },
];

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Brazil",
  "Mexico",
  "China",
  "Japan",
  "South Korea",
  "Indonesia",
  "Philippines",
  "Nigeria",
  "Egypt",
  "Other",
];

const LANGUAGES = [
  "Hindi",
  "Spanish",
  "Mandarin",
  "Arabic",
  "Bengali",
  "Portuguese",
  "Russian",
  "Japanese",
  "French",
  "German",
  "Korean",
  "Italian",
  "Tamil",
  "Telugu",
  "Urdu",
  "Vietnamese",
  "Turkish",
  "Persian",
  "Other",
];

export default function OnboardingPage() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState<OnboardingQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [form] = Form.useForm();

  // If already completed, redirect away
  useEffect(() => {
    if (user?.onboardingCompleted) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  // Load questions
  useEffect(() => {
    setLoading(true);
    onboardingService
      .getQuestions()
      .then(setQuestions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const steps = [
    { title: "Profile", icon: <UserOutlined /> },
    { title: "Location", icon: <GlobalOutlined /> },
    { title: "Goal", icon: <AimOutlined /> },
    { title: "Level Test", icon: <BookOutlined /> },
    { title: "Done!", icon: <CheckCircleOutlined /> },
  ];

  const handleNext = async () => {
    try {
      if (currentStep < 3) {
        await form.validateFields();
      }
      setCurrentStep((s) => s + 1);
    } catch {
      // validation failed — antd shows inline errors
    }
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
    } catch {
      return;
    }

    const values = form.getFieldsValue(true);
    const answerList = Object.entries(answers).map(([questionId, selectedIndex]) => ({
      questionId,
      selectedIndex,
    }));

    setSubmitting(true);
    try {
      const result = await onboardingService.complete({
        displayName: values.displayName,
        country: values.country,
        nativeLanguage: values.nativeLanguage,
        learningGoal: values.learningGoal,
        answers: answerList,
      });

      // Refresh auth user so onboardingCompleted = true
      const updated = await authService.self();
      setUser(updated);

      setCurrentStep(4);
      messageApi.success(`Your English level: ${result.englishLevel}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to complete onboarding";
      messageApi.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <h2 className="mb-2 text-xl font-bold text-zinc-900">What should we call you?</h2>
            <p className="mb-6 text-sm text-zinc-500">Pick a display name for your profile.</p>
            <Form.Item
              name="displayName"
              rules={[{ required: true, message: "Please enter a display name" }]}
            >
              <Input
                prefix={<UserOutlined className="text-zinc-400" />}
                placeholder="Your display name"
                size="large"
                className="rounded-xl"
              />
            </Form.Item>
          </div>
        );

      case 1:
        return (
          <div>
            <h2 className="mb-2 text-xl font-bold text-zinc-900">Where are you from?</h2>
            <p className="mb-6 text-sm text-zinc-500">
              This helps us personalise your learning experience.
            </p>
            <Form.Item
              name="country"
              rules={[{ required: true, message: "Please select your country" }]}
            >
              <Select
                size="large"
                placeholder="Select your country"
                showSearch
                className="w-full rounded-xl"
              >
                {COUNTRIES.map((c) => (
                  <Option key={c} value={c}>
                    {c}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="nativeLanguage"
              rules={[{ required: true, message: "Please select your native language" }]}
            >
              <Select
                size="large"
                placeholder="Your native language"
                showSearch
                className="w-full rounded-xl"
              >
                {LANGUAGES.map((l) => (
                  <Option key={l} value={l}>
                    {l}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="mb-2 text-xl font-bold text-zinc-900">What is your learning goal?</h2>
            <p className="mb-6 text-sm text-zinc-500">
              We&apos;ll tailor lessons around your goal.
            </p>
            <Form.Item
              name="learningGoal"
              rules={[{ required: true, message: "Please select a learning goal" }]}
            >
              <Radio.Group className="flex w-full flex-col gap-3">
                {LEARNING_GOALS.map((g) => (
                  <Radio
                    key={g.value}
                    value={g.value}
                    className="flex items-center rounded-xl border border-zinc-200 p-4 transition-colors hover:border-indigo-400"
                  >
                    <span className="text-sm font-medium text-zinc-800">{g.label}</span>
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </div>
        );

      case 3:
        if (loading) {
          return (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          );
        }
        if (!questions.length) {
          return (
            <div>
              <h2 className="mb-2 text-xl font-bold text-zinc-900">English Level Test</h2>
              <p className="mb-6 text-sm text-zinc-500">
                No questions available yet. Click Submit to complete onboarding.
              </p>
            </div>
          );
        }
        return (
          <div>
            <h2 className="mb-2 text-xl font-bold text-zinc-900">English Level Test</h2>
            <p className="mb-6 text-sm text-zinc-500">
              Answer these questions to assess your current English level. Don&apos;t worry — there
              are no wrong answers that block you!
            </p>
            <div className="flex flex-col gap-6">
              {questions.map((q, idx) => (
                <div key={q.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                  <p className="mb-3 text-sm font-semibold text-zinc-800">
                    {idx + 1}. {q.question}
                  </p>
                  <Radio.Group
                    value={answers[q.id] ?? null}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    className="flex flex-col gap-2"
                  >
                    {q.options.map((opt, i) => (
                      <Radio key={i} value={i} className="text-sm text-zinc-700">
                        {opt}
                      </Radio>
                    ))}
                  </Radio.Group>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircleOutlined className="text-3xl text-green-500" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-zinc-900">You&apos;re all set!</h2>
            <p className="mb-8 text-sm text-zinc-500">
              Your profile is ready. Start practising English today.
            </p>
            <Button
              type="primary"
              size="large"
              onClick={() => router.replace("/dashboard")}
              className="h-11 rounded-xl px-8 text-sm font-semibold shadow-lg shadow-indigo-500/25"
            >
              Go to Dashboard
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-12">
      {contextHolder}
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white shadow-lg shadow-indigo-500/30">
            S
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">
            Welcome to Speak
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Easy
            </span>
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Let&apos;s set up your profile in a few quick steps
          </p>
        </div>

        {/* Stepper */}
        {currentStep < 4 && (
          <Steps
            current={currentStep}
            items={steps.slice(0, 4).map((s) => ({ title: s.title, icon: s.icon }))}
            className="mb-8"
            size="small"
          />
        )}

        {/* Card */}
        <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-xl shadow-zinc-200/60">
          <Form form={form} layout="vertical" requiredMark={false}>
            {renderStepContent()}
          </Form>

          {/* Navigation */}
          {currentStep < 4 && (
            <div className="mt-8 flex items-center justify-between">
              <Button
                onClick={() => setCurrentStep((s) => s - 1)}
                disabled={currentStep === 0}
                className="rounded-xl"
              >
                Back
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="primary"
                  onClick={handleNext}
                  className="h-10 rounded-xl px-6 font-semibold shadow-md shadow-indigo-500/20"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  loading={submitting}
                  className="h-10 rounded-xl px-6 font-semibold shadow-md shadow-indigo-500/20"
                >
                  Submit & Finish
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
