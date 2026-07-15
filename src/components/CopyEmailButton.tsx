"use client";

import {
  CheckCircleIcon,
  ClipboardDocumentIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useId, useRef, useState } from "react";

interface CopyEmailButtonProps {
  email: string;
  className?: string;
}

export function CopyEmailButton({ email, className }: CopyEmailButtonProps) {
  const statusId = useId();
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
    };
  }, []);

  async function handleCopy() {
    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
    }

    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      setStatus("error");
      return;
    }

    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
      resetTimer.current = setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
    }
  }

  const isCopied = status === "copied";
  const isError = status === "error";
  const statusMessage = isCopied
    ? `${email} copied to clipboard.`
    : isError
      ? "Email copy failed. Select the address above and copy it manually."
      : "Copy the email address to keep it handy.";

  return (
    <div className="flex min-w-0 flex-col items-stretch gap-2 sm:items-center">
      <button
        type="button"
        onClick={handleCopy}
        aria-describedby={statusId}
        className={`focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 text-sm font-bold text-[var(--foreground)] transition-[transform,background-color] duration-300 hover:-translate-y-1 hover:bg-[var(--surface-elevated)] active:translate-y-0 ${className ?? ""}`}
      >
        {isCopied ? (
          <CheckCircleIcon aria-hidden="true" className="h-5 w-5 text-emerald-400" />
        ) : isError ? (
          <ExclamationCircleIcon aria-hidden="true" className="h-5 w-5 text-amber-400" />
        ) : (
          <ClipboardDocumentIcon aria-hidden="true" className="h-5 w-5" />
        )}
        <span>{isCopied ? "Copied" : isError ? "Try copy again" : "Copy email"}</span>
      </button>
      <p
        id={statusId}
        role="status"
        aria-live="polite"
        className={cx(
          "max-w-xs text-center text-xs leading-5",
          isCopied && "text-emerald-300",
          isError && "text-amber-300",
          status === "idle" && "text-[var(--muted)]",
        )}
      >
        {statusMessage}
      </p>
    </div>
  );
}

function cx(...classes: Array<string | false>) {
  return classes.filter(Boolean).join(" ");
}
