"use client";

import React, { useState, useEffect, useRef } from "react";
import { Modal } from "antd";
import {
  AudioOutlined,
  AudioMutedOutlined,
  MessageOutlined,
  PhoneOutlined,
  StarFilled,
  GlobalOutlined,
  TeamOutlined,
} from "@ant-design/icons";

/* ══════════════════════════════════════════
   Partner pool
   ══════════════════════════════════════════ */
const partnerPool = [
  {
    id: "1",
    name: "Emma Williams",
    avatar: "👩‍🏫",
    country: "United States",
    flag: "🇺🇸",
    rating: 4.9,
    sessions: 342,
  },
  {
    id: "2",
    name: "James Anderson",
    avatar: "👨‍💼",
    country: "United Kingdom",
    flag: "🇬🇧",
    rating: 4.8,
    sessions: 567,
  },
  {
    id: "3",
    name: "Sophia Martin",
    avatar: "👩‍🎓",
    country: "Australia",
    flag: "🇦🇺",
    rating: 4.9,
    sessions: 198,
  },
  {
    id: "4",
    name: "Daniel Thompson",
    avatar: "👨‍💻",
    country: "Canada",
    flag: "🇨🇦",
    rating: 4.7,
    sessions: 412,
  },
  {
    id: "5",
    name: "Olivia Davis",
    avatar: "👩‍🔬",
    country: "Ireland",
    flag: "🇮🇪",
    rating: 4.8,
    sessions: 289,
  },
  {
    id: "6",
    name: "Liam Harrison",
    avatar: "🧑‍🏫",
    country: "New Zealand",
    flag: "🇳🇿",
    rating: 4.6,
    sessions: 156,
  },
];
type PartnerType = (typeof partnerPool)[0];
type CallState = "idle" | "searching" | "connected";

/* ══════════════════════════════════════════
   Audio Call Modal
   ══════════════════════════════════════════ */
function AudioCallModal({
  state,
  partner,
  onClose,
  duration,
  isMuted,
  onToggleMute,
}: {
  state: CallState;
  partner: PartnerType | null;
  onClose: () => void;
  duration: number;
  isMuted: boolean;
  onToggleMute: () => void;
}) {
  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <Modal
      open={state !== "idle"}
      footer={null}
      closable={false}
      centered
      width={420}
      styles={{
        body: { padding: 0 },
        // content: { borderRadius: 24, overflow: "hidden", padding: 0 },
      }}
    >
      {state === "searching" && (
        <div className="flex flex-col items-center bg-gradient-to-b from-indigo-600 to-violet-700 px-8 py-14 text-center">
          <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
            <div className="absolute h-full w-full animate-ping rounded-full bg-white/15 [animation-duration:2s]" />
            <div className="absolute h-[85%] w-[85%] animate-ping rounded-full bg-white/15 [animation-delay:0.4s] [animation-duration:2s]" />
            <div className="absolute h-[70%] w-[70%] animate-ping rounded-full bg-white/15 [animation-delay:0.8s] [animation-duration:2s]" />
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-4xl shadow-lg backdrop-blur-sm">
              🎧
            </div>
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">Finding a partner…</h3>
          <p className="mb-6 text-sm text-indigo-200">
            Matching you with an available native speaker
          </p>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2.5 w-2.5 animate-bounce rounded-full bg-white/60"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-8 rounded-full border border-white/30 bg-white/10 px-6 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            Cancel
          </button>
        </div>
      )}

      {state === "connected" && partner && (
        <div className="flex flex-col items-center bg-gradient-to-b from-indigo-600 to-violet-700 px-8 py-10 text-center">
          <div className="relative mb-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-5xl shadow-xl backdrop-blur-sm">
              {partner.avatar}
            </div>
            <div className="absolute -right-1 bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-indigo-600 bg-emerald-500 shadow-lg">
              <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
            </div>
          </div>
          <h3 className="mb-0.5 text-xl font-bold text-white">{partner.name}</h3>
          <p className="mb-1 text-sm text-indigo-200">
            {partner.country} {partner.flag}
          </p>
          <div className="mb-5 flex items-center gap-1 text-xs text-indigo-200">
            <StarFilled className="text-amber-400" />{" "}
            <span className="font-semibold text-white">{partner.rating}</span>{" "}
            <span>· {partner.sessions} sessions</span>
          </div>
          <div className="mb-6 rounded-full bg-white/10 px-5 py-2 backdrop-blur-sm">
            <span className="font-mono text-2xl font-bold tracking-wider text-white">
              {fmt(duration)}
            </span>
          </div>
          <div className="mb-8 flex items-end justify-center gap-[3px]">
            {[18, 28, 14, 32, 20, 26, 16, 34, 22, 30, 12, 36, 24, 19, 28, 15, 33, 21, 27, 17].map(
              (h, i) => (
                <div
                  key={i}
                  className="w-[3px] animate-pulse rounded-full bg-white/50"
                  style={{
                    height: `${h}px`,
                    animationDelay: `${i * 0.08}s`,
                    animationDuration: `${0.4 + (i % 5) * 0.12}s`,
                  }}
                />
              ),
            )}
          </div>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={onToggleMute}
              className={`flex h-14 w-14 items-center justify-center rounded-full text-lg shadow-lg transition-all ${isMuted ? "bg-red-500/30 text-white hover:bg-red-500/40" : "bg-white/20 text-white hover:bg-white/30"}`}
            >
              {isMuted ? <AudioMutedOutlined /> : <AudioOutlined />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-xl text-white shadow-xl shadow-red-500/30 transition-all hover:scale-110 hover:bg-red-600"
            >
              <PhoneOutlined className="rotate-[135deg]" />
            </button>
            <button
              type="button"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-lg text-white shadow-lg transition-all hover:bg-white/30"
            >
              <MessageOutlined />
            </button>
          </div>
          <p className="mt-5 text-xs text-indigo-200">Audio only · Tap the red button to end</p>
        </div>
      )}
    </Modal>
  );
}

/* ══════════════════════════════════════════
   Main Page
   ══════════════════════════════════════════ */
export default function PartnersPage() {
  const [callState, setCallState] = useState<CallState>("idle");
  const [callPartner, setCallPartner] = useState<PartnerType | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRandomCall = () => {
    setCallState("searching");
    setCallDuration(0);
    setIsMuted(false);
    const delay = 2000 + Math.random() * 2000;
    setTimeout(() => {
      const p = partnerPool[Math.floor(Math.random() * partnerPool.length)];
      setCallPartner(p);
      setCallState("connected");
      timerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000);
    }, delay);
  };

  const endCall = () => {
    setCallState("idle");
    setCallPartner(null);
    setCallDuration(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-16">
      <div className="mx-auto w-full max-w-2xl px-6 text-center">
        {/* Header */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-600">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          128 native speakers online
        </div>

        <h1 className="mb-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
          Practice Speaking with
          <br />
          <span className="gradient-text">Native Partners</span>
        </h1>
        <p className="mx-auto mb-12 max-w-md text-base leading-relaxed text-zinc-500">
          Press the button and instantly connect with a native English speaker for a live audio
          conversation.
        </p>

        {/* Hero connect card */}
        <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 shadow-2xl shadow-indigo-500/25">
          {/* Decorative */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative z-10 px-8 py-10 sm:px-10 sm:py-12">
            {/* Animated icon */}
            <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center">
              <div className="relative flex h-full w-full items-center justify-center">
                <div className="absolute h-full w-full animate-ping rounded-full bg-white/10 [animation-duration:3s]" />
                <div className="absolute h-3/4 w-3/4 animate-ping rounded-full bg-white/10 [animation-delay:0.5s] [animation-duration:3s]" />
                <div className="absolute h-1/2 w-1/2 animate-ping rounded-full bg-white/10 [animation-delay:1s] [animation-duration:3s]" />
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl backdrop-blur-sm">
                  🎧
                </div>
              </div>
            </div>

            <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">Random Audio Call</h2>
            <p className="mb-8 text-sm leading-relaxed text-indigo-100">
              No scheduling needed. Just hit connect and start speaking!
            </p>

            {/* CTA button */}
            <button
              type="button"
              onClick={startRandomCall}
              className="group mx-auto flex items-center gap-3 rounded-2xl border-2 border-white/20 bg-white px-8 py-4 text-[15px] font-bold text-indigo-600 shadow-xl transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl active:scale-100"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <PhoneOutlined className="text-lg text-white" />
              </div>
              Connect Now
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-4">
          {[
            {
              icon: <TeamOutlined className="text-indigo-500" />,
              value: "10K+",
              label: "Conversations",
            },
            {
              icon: <GlobalOutlined className="text-violet-500" />,
              value: "50+",
              label: "Countries",
            },
            { icon: <StarFilled className="text-amber-400" />, value: "4.9", label: "Rating" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm"
            >
              <div className="mb-2 text-lg">{s.icon}</div>
              <div className="text-xl font-bold text-zinc-900">{s.value}</div>
              <div className="text-[11px] text-zinc-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Feature pills */}
        <div className="mx-auto mt-8 flex max-w-md flex-wrap items-center justify-center gap-3">
          {[
            { emoji: "🎧", label: "Audio Only" },
            { emoji: "🔒", label: "Private & Safe" },
            { emoji: "⚡", label: "Instant Match" },
            { emoji: "🌍", label: "Native Speakers" },
          ].map((f) => (
            <span
              key={f.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-100 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-600 shadow-sm"
            >
              {f.emoji} {f.label}
            </span>
          ))}
        </div>
      </div>

      {/* Audio Call Modal */}
      <AudioCallModal
        state={callState}
        partner={callPartner}
        onClose={endCall}
        duration={callDuration}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((m) => !m)}
      />
    </div>
  );
}
