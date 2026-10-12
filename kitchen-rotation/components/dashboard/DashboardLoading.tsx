"use client";

import { useEffect, useState } from "react";
import { SprayCan, Sparkles, House } from "lucide-react";

const messages = [
  "Getting your household in order...",
  "Checking today's cleaning duties...",
  "Making sure everything is up to date...",
  "Almost ready to get things sparkling...",
];

export default function DashboardLoading() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const messageTimer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % messages.length);
    }, 4500);

    const elapsedTimer = window.setInterval(() => {
      setElapsed((current) => current + 1);
    }, 1000);

    return () => {
      window.clearInterval(messageTimer);
      window.clearInterval(elapsedTimer);
    };
  }, []);

  return (
    <main className="flex min-h-[70vh] items-center justify-center h-screen bg-[#FAFBF8] px-5 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-[#E7EAE2] bg-white px-6 py-10 text-center shadow-[0_8px_40px_rgba(31,45,33,0.05)] sm:px-10">
          {/* Cleaning-themed animated illustration */}
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 animate-pulse rounded-[2rem] bg-[#E8EFE5]" />

            <div className="absolute inset-2 rounded-[1.5rem] border border-[#CAD8C5]" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#244C3A] text-white shadow-lg shadow-[#244C3A]/15">
              <SprayCan size={32} strokeWidth={1.6} />
            </div>

            {/* Floating sparkle */}
            <div className="absolute -right-1 -top-1 flex h-8 w-8 animate-bounce items-center justify-center rounded-full border-4 border-white bg-[#DDE9D7] text-[#315B40]">
              <Sparkles size={14} />
            </div>

            {/* Small home icon */}
            <div className="absolute -bottom-1 -left-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-[#F0F4EC] text-[#63806A]">
              <House size={14} />
            </div>
          </div>

          {/* Welcome message */}
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-[#63806A]">
            Your household
          </p>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#202A22] sm:text-3xl">
            A tidy home starts here
          </h1>

          <p
            key={messageIndex}
            className="mt-3 min-h-6 animate-pulse text-sm leading-6 text-[#7B847A]"
            aria-live="polite"
          >
            {messages[messageIndex]}
          </p>

          {/* Animated progress indicator */}
          <div
            className="mx-auto mt-7 h-1.5 max-w-[220px] overflow-hidden rounded-full bg-[#E9ECE5]"
            role="progressbar"
            aria-label="Loading your household dashboard"
            aria-valuetext={
              elapsed < 10
                ? "Connecting to your household"
                : "Still connecting to your household"
            }
          >
            <div className="h-full w-1/3 animate-loading-bar rounded-full bg-[#315B40]" />
          </div>

          {/* Reassuring status text */}
          <p className="mt-5 text-xs leading-5 text-[#849083]">
            {elapsed < 10
              ? "Just a moment while we get everything ready."
              : elapsed < 30
                ? "We're taking a little longer than usual. Thanks for waiting!"
                : "Still working on the connection. Your dashboard will appear when it's ready."}
          </p>
        </div>
      </div>
    </main>
  );
}
