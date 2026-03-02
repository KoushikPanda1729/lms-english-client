"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AudioOutlined,
  AudioMutedOutlined,
  PhoneOutlined,
  StarFilled,
  GlobalOutlined,
  TeamOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  SoundOutlined,
  SendOutlined,
  MessageOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useAudioCall } from "@/hooks/useAudioCall";

/* ══════════════════════════════════════════
   Format seconds → MM:SS
   ══════════════════════════════════════════ */
function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* ══════════════════════════════════════════
   Audio Call Modal — WhatsApp-style full screen
   ══════════════════════════════════════════ */
function AudioCallModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    phase,
    partner,
    errorMsg,
    muted,
    duration,
    messages,
    speakerOn,
    videoEnabled,
    remoteVideoEnabled,
    localVideoStreamRef,
    remoteVideoStreamRef,
    startSearch,
    cancelSearch,
    endCall,
    toggleMute,
    toggleVideo,
    toggleSpeaker,
    sendMessage,
  } = useAudioCall();

  const [chatInput, setChatInput] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [videoRequestDismissed, setVideoRequestDismissed] = useState(false);
  const [prevRemoteVideoEnabled, setPrevRemoteVideoEnabled] = useState(false);

  // During-render derived state update (React docs recommended pattern — no effect needed)
  // When partner freshly enables camera, reset the dismissed flag
  if (prevRemoteVideoEnabled !== remoteVideoEnabled) {
    setPrevRemoteVideoEnabled(remoteVideoEnabled);
    if (remoteVideoEnabled) setVideoRequestDismissed(false);
  }
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Start searching when modal opens
  useEffect(() => {
    if (open) startSearch();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current && chatOpen) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, chatOpen]);

  // Sync local video stream → <video> element
  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = videoEnabled ? localVideoStreamRef.current : null;
    }
  }, [videoEnabled, localVideoStreamRef]);

  // Sync remote video stream → <video> element
  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteVideoEnabled ? remoteVideoStreamRef.current : null;
    }
  }, [remoteVideoEnabled, remoteVideoStreamRef]);

  const handleEndOrCancel = () => {
    if (phase === "searching" || phase === "matched") cancelSearch();
    else endCall();
    onClose();
  };

  if (!open) return null;

  const showVideo = phase === "connected" && (videoEnabled || remoteVideoEnabled);
  // Show unread dot only when partner sent a message and chat is closed
  const hasUnread = !chatOpen && messages.some((m) => !m.fromMe);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(160deg,#16163a 0%,#0a0a18 55%,#0c0c20 100%)" }}
    >
      {/* ══ SEARCHING ══ */}
      {(phase === "idle" || phase === "searching" || phase === "matched") && (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
          {/* Pulsing search orb */}
          <div className="relative flex h-36 w-36 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-indigo-500/15 [animation-duration:2s]" />
            <span className="absolute inset-3 animate-ping rounded-full bg-indigo-500/10 [animation-delay:0.5s] [animation-duration:2s]" />
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white/10 text-5xl ring-1 ring-white/15 backdrop-blur-sm">
              🔍
            </div>
          </div>

          <div>
            <p className="text-2xl font-bold text-white">
              {phase === "matched" ? "Connecting..." : "Finding Partner"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/40">
              {phase === "matched"
                ? "Match found! Setting up the call..."
                : "Matching you with a native English speaker"}
            </p>
          </div>

          <div className="flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="h-2 w-2 animate-bounce rounded-full bg-white/30"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>

          <button
            onClick={handleEndOrCancel}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 shadow-2xl shadow-red-500/40 transition-transform hover:scale-105 active:scale-95"
          >
            <PhoneOutlined className="rotate-[135deg] text-2xl text-white" />
          </button>
          <p className="text-xs text-white/30">Tap to cancel</p>
        </div>
      )}

      {/* ══ CONNECTING / CONNECTED ══ */}
      {(phase === "connecting" || phase === "connected") && partner && (
        <>
          {/* ── Top bar: status + partner info ── */}
          <div className="flex flex-col items-center px-6 pt-12 pb-4 text-center">
            <div className="mb-2 flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${
                  phase === "connected"
                    ? "animate-pulse bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]"
                    : "bg-yellow-400"
                }`}
              />
              <p className="text-xs font-semibold tracking-widest text-white/50 uppercase">
                {phase === "connected" ? "Connected" : "Connecting..."}
              </p>
            </div>
            <p className="text-[22px] leading-tight font-bold text-white">{partner.displayName}</p>
            {partner.level && (
              <p className="mt-1 text-sm text-white/35 capitalize">{partner.level} Level</p>
            )}
            {phase === "connected" && (
              <div className="mt-3 flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 ring-1 ring-white/10">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                <span className="font-mono text-sm font-bold text-white tabular-nums">
                  {formatDuration(duration)}
                </span>
              </div>
            )}
          </div>

          {/* ── Middle: avatar (audio) or video ── */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden">
            {showVideo ? (
              // ── Video layout ──
              <>
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="absolute inset-0 h-full w-full bg-black object-contain"
                />
                {/* Fallback: partner hasn't enabled video yet */}
                {!remoteVideoEnabled && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                    {partner.avatarUrl ? (
                      <Image
                        src={partner.avatarUrl}
                        alt={partner.displayName}
                        width={96}
                        height={96}
                        className="mb-2 rounded-full object-cover"
                      />
                    ) : (
                      <div className="mb-2 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-5xl">
                        👤
                      </div>
                    )}
                    <p className="text-sm text-white/40">Camera off</p>
                  </div>
                )}
                {/* Local preview (picture-in-picture) */}
                {videoEnabled && (
                  <div className="absolute right-4 bottom-4 h-28 w-20 overflow-hidden rounded-2xl border border-white/20 shadow-xl">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </>
            ) : (
              // ── Audio layout: large avatar + waveform ──
              <div className="flex flex-col items-center gap-8">
                <div className="relative h-44 w-44">
                  {phase === "connected" && (
                    <>
                      <span className="absolute inset-[-20px] animate-ping rounded-full bg-indigo-500/10 [animation-duration:3s]" />
                      <span className="absolute inset-[-10px] animate-ping rounded-full bg-indigo-500/15 [animation-delay:0.6s] [animation-duration:2.5s]" />
                    </>
                  )}
                  <div className="relative h-full w-full overflow-hidden rounded-full bg-white/10 shadow-2xl ring-[3px] shadow-indigo-900/40 ring-white/20">
                    {partner.avatarUrl ? (
                      <Image
                        src={partner.avatarUrl}
                        alt={partner.displayName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-7xl">
                        👤
                      </div>
                    )}
                  </div>
                  {phase === "connected" && (
                    <span className="absolute right-2.5 bottom-2.5 h-5 w-5 rounded-full border-[3px] border-[#0a0a18] bg-emerald-400 shadow-lg shadow-emerald-500/50" />
                  )}
                </div>

                {/* Waveform bars */}
                {phase === "connected" && (
                  <div className="flex h-10 items-end justify-center gap-[3px]">
                    {Array.from({ length: 26 }).map((_, i) => (
                      <span
                        key={i}
                        className="w-[3px] rounded-full"
                        style={{
                          height: `${12 + Math.sin(i * 0.75) * 10}px`,
                          background: `rgba(255,255,255,${0.18 + Math.sin(i * 0.5) * 0.15})`,
                          animation: `waveBar 1.4s ease-in-out ${(i * 0.055) % 0.7}s infinite alternate`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── WhatsApp-style video request overlay ── */}
          {phase === "connected" &&
            remoteVideoEnabled &&
            !videoEnabled &&
            !videoRequestDismissed && (
              <div
                className="mx-5 mb-3 overflow-hidden rounded-2xl backdrop-blur-md"
                style={{
                  background: "rgba(20,20,45,0.85)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                  {/* Avatar / camera icon */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                    <VideoCameraOutlined className="text-lg text-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-tight font-semibold text-white">
                      {partner?.displayName}
                    </p>
                    <p className="mt-0.5 text-xs text-white/45">wants to switch to video</p>
                  </div>
                </div>
                <div className="flex border-t border-white/10">
                  {/* Decline */}
                  <button
                    onClick={() => setVideoRequestDismissed(true)}
                    className="flex flex-1 items-center justify-center gap-2 border-r border-white/10 py-3 text-sm font-semibold text-red-400 transition hover:bg-white/5 active:scale-95"
                  >
                    Decline
                  </button>
                  {/* Accept */}
                  <button
                    onClick={() => {
                      toggleVideo();
                      setVideoRequestDismissed(true);
                    }}
                    className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-white/5 active:scale-95"
                  >
                    <VideoCameraOutlined className="text-base" />
                    Accept
                  </button>
                </div>
              </div>
            )}

          {/* ── Chat slide-up panel ── */}
          {phase === "connected" && (
            <div
              className={`overflow-hidden border-t transition-all duration-300 ease-in-out ${
                chatOpen
                  ? "max-h-72 border-white/[0.08] opacity-100"
                  : "max-h-0 border-transparent opacity-0"
              }`}
              style={{ background: "rgba(5,5,20,0.75)" }}
            >
              {/* Messages list */}
              <div
                ref={chatScrollRef}
                className="h-44 space-y-3 overflow-y-auto px-4 pt-4 pb-2 text-left"
              >
                {messages.length === 0 ? (
                  <p className="pt-8 text-center text-xs text-white/25">
                    Say something to your partner...
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[78%] px-3.5 py-2 text-sm leading-snug ${
                          msg.fromMe
                            ? "rounded-2xl rounded-br-[4px] bg-indigo-500 font-medium text-white"
                            : "rounded-2xl rounded-bl-[4px] bg-white/15 text-white"
                        }`}
                      >
                        {!msg.fromMe && (
                          <p className="mb-0.5 text-[10px] font-bold text-indigo-300">
                            {msg.senderName}
                          </p>
                        )}
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {/* Input bar */}
              <div className="flex items-center gap-3 border-t border-white/10 px-4 py-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && chatInput.trim()) {
                      sendMessage(chatInput.trim());
                      setChatInput("");
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                />
                <button
                  onClick={() => {
                    if (chatInput.trim()) {
                      sendMessage(chatInput.trim());
                      setChatInput("");
                    }
                  }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500 transition hover:bg-indigo-400 active:scale-95"
                >
                  <SendOutlined className="text-sm text-white" />
                </button>
              </div>
            </div>
          )}

          {/* ── Bottom controls ── */}
          <div className="px-6 pt-4 pb-10">
            {/* Secondary row: Video + Chat (connected only) */}
            {phase === "connected" && (
              <div className="mb-5 flex items-center justify-center gap-10">
                {/* Video toggle */}
                <button onClick={toggleVideo} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                      videoEnabled ? "bg-white" : "border-2 border-white bg-white/25"
                    }`}
                  >
                    <VideoCameraOutlined
                      className={`text-[17px] ${videoEnabled ? "text-zinc-800" : "text-white"}`}
                    />
                    {/* Green dot when partner has video on but ours is off */}
                    {remoteVideoEnabled && !videoEnabled && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full border-2 border-[#0a0a18] bg-emerald-400" />
                    )}
                  </div>
                  <span className="text-[10px] text-white/50">
                    {videoEnabled ? "Video on" : "Video"}
                  </span>
                </button>

                {/* Chat toggle */}
                <button
                  onClick={() => setChatOpen((v) => !v)}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                      chatOpen ? "bg-white" : "border-2 border-white bg-white/25"
                    }`}
                  >
                    <MessageOutlined
                      className={`text-[17px] ${chatOpen ? "text-zinc-800" : "text-white"}`}
                    />
                    {hasUnread && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-[#0a0a18] bg-emerald-400" />
                    )}
                  </div>
                  <span className="text-[10px] text-white/50">{chatOpen ? "Close" : "Chat"}</span>
                </button>
              </div>
            )}

            {/* Primary row: Mute · End Call · Speaker */}
            <div className="flex items-center justify-center gap-8">
              {/* Mute */}
              <button onClick={toggleMute} className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition-all ${
                    muted ? "bg-white" : "border-2 border-white bg-white/25"
                  }`}
                >
                  {muted ? (
                    <AudioMutedOutlined className="text-[20px] text-zinc-800" />
                  ) : (
                    <AudioOutlined className="text-[20px] text-white" />
                  )}
                </div>
                <span className="text-[11px] text-white/50">{muted ? "Unmute" : "Mute"}</span>
              </button>

              {/* End Call */}
              <button onClick={handleEndOrCancel} className="flex flex-col items-center gap-2">
                <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-red-500 shadow-2xl shadow-red-500/50 transition-transform hover:scale-105 active:scale-95">
                  <PhoneOutlined className="rotate-[135deg] text-2xl text-white" />
                </div>
                <span className="text-[11px] text-white/35">End</span>
              </button>

              {/* Speaker */}
              <button onClick={toggleSpeaker} className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition-all ${
                    speakerOn ? "bg-white" : "border-2 border-white bg-white/25"
                  }`}
                >
                  <SoundOutlined
                    className={`text-[20px] ${speakerOn ? "text-zinc-800" : "text-white"}`}
                  />
                </div>
                <span className="text-[11px] text-white/50">Speaker</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ══ ENDED ══ */}
      {phase === "ended" && (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-5xl">
            {errorMsg ? "⚠️" : "👋"}
          </div>
          <p className="mb-2 text-2xl font-bold text-white">{errorMsg ? "Oops!" : "Call Ended"}</p>
          <p className="mb-8 text-sm leading-relaxed text-white/50">
            {errorMsg || `Duration: ${formatDuration(duration)}`}
          </p>
          <div className="flex w-full max-w-xs flex-col gap-3">
            {errorMsg?.toLowerCase().includes("username") ||
            errorMsg?.toLowerCase().includes("english level") ? (
              <Link
                href="/settings"
                onClick={onClose}
                className="w-full rounded-2xl bg-white px-6 py-3 text-center text-sm font-semibold text-indigo-700 no-underline shadow-lg transition hover:bg-indigo-50"
              >
                Complete Profile →
              </Link>
            ) : (
              <button
                onClick={() => startSearch()}
                className="w-full rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
              >
                Find New Partner
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full rounded-2xl bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes waveBar {
          from {
            transform: scaleY(0.5);
            opacity: 0.45;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════
   Main Partners Page
   ══════════════════════════════════════════ */
export default function PartnersPage() {
  const [modalOpen, setModalOpen] = React.useState(false);

  const stats = [
    { icon: <TeamOutlined />, value: "10K+", label: "Conversations" },
    { icon: <GlobalOutlined />, value: "50+", label: "Countries" },
    { icon: <StarFilled />, value: "4.9", label: "Avg Rating" },
    { icon: <ClockCircleOutlined />, value: "<5s", label: "Match Time" },
  ];

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left */}
            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                128 native speakers online now
              </div>
              <h1 className="mb-5 text-4xl leading-tight font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-[52px]">
                Practice speaking with{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  native partners
                </span>
              </h1>
              <p className="mb-8 max-w-md text-lg leading-relaxed text-zinc-500">
                One tap to connect with a real English speaker. No scheduling, no awkward silences —
                just genuine conversation that builds your fluency.
              </p>
              <ul className="mb-10 space-y-2.5 text-sm text-zinc-500">
                {[
                  "Instant matching with native speakers from 50+ countries",
                  "Audio-only calls — comfortable, low-pressure practice",
                  "Completely free — no credit card required",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircleFilled className="text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0"
              >
                <PhoneOutlined className="text-lg" />
                Connect Now — It&apos;s Free
              </button>
            </div>

            {/* Right — iPhone mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative h-[520px] w-[260px]">
                <Image
                  src="/iphone-call-mockup.png"
                  alt="SpeakEasy audio call interface"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-zinc-100 bg-zinc-50/60 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="mb-1 text-2xl text-indigo-500">{s.icon}</div>
                <p className="text-2xl font-extrabold text-zinc-900">{s.value}</p>
                <p className="text-sm text-zinc-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-zinc-900">How it works</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                emoji: "👆",
                title: "Press Connect",
                desc: "Tap the button to enter the matching queue.",
              },
              {
                step: "2",
                emoji: "🔗",
                title: "Get Matched",
                desc: "Our system pairs you with a speaker in seconds.",
              },
              {
                step: "3",
                emoji: "🗣️",
                title: "Start Talking",
                desc: "Jump straight into a real English conversation.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="relative rounded-2xl border border-zinc-100 bg-white p-7 text-center shadow-sm transition-all hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
                  {s.emoji}
                </div>
                <div className="mb-2 text-3xl font-black text-indigo-600">{s.step}</div>
                <h3 className="mb-1.5 text-base font-bold text-zinc-900">{s.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-indigo-50/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-10 text-center text-3xl font-bold text-zinc-900">
            Built for real practice
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { emoji: "🎧", title: "Audio Only", desc: "No video pressure. Just talk naturally." },
              {
                emoji: "🔒",
                title: "Private & Safe",
                desc: "Encrypted calls. Anonymous matching.",
              },
              { emoji: "⚡", title: "Instant Match", desc: "No scheduling. Connect in under 5s." },
              { emoji: "🌍", title: "Global Network", desc: "Speakers from 50+ countries." },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl bg-white p-6 text-center shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-3 text-4xl">{f.emoji}</div>
                <h3 className="mb-1 text-sm font-bold text-zinc-900">{f.title}</h3>
                <p className="text-xs leading-relaxed text-zinc-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-zinc-900 sm:text-4xl">Ready to practice?</h2>
          <p className="mb-8 text-base text-zinc-500">
            Join thousands of learners having real English conversations every day.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-10 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
          >
            <PhoneOutlined className="text-lg" />
            Start a Free Call
          </button>
        </div>
      </section>

      {/* ── Audio Call Modal ── */}
      <AudioCallModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
