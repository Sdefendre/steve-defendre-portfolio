"use client";

import {
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { flushSync } from "react-dom";
import { useEffect, useId, useRef, useState } from "react";
import type { ChangeEventHandler, FormEvent, ReactNode } from "react";
import { primaryContactEmail } from "@/data/socials";
import { trackAnalyticsEvent } from "@/utils/analytics";
const NAME_MAX_LENGTH = 80;
const EMAIL_MAX_LENGTH = 254;
const MESSAGE_MAX_LENGTH = 1000;
const MAILTO_URL_MAX_LENGTH = 2000;
const PREPARING_STATUS_DURATION_MS = 300;

const PROJECT_TYPE_OPTIONS = [
  { value: "new-website", label: "New website" },
  { value: "portfolio-refresh", label: "Portfolio refresh" },
  { value: "cleanup", label: "Cleanup or rescue" },
  { value: "internal-tool", label: "Internal tool" },
  { value: "other", label: "Something else" },
] as const;

const BUDGET_RANGE_OPTIONS = [
  { value: "under-5k", label: "Under $5k" },
  { value: "5k-10k", label: "$5k - $10k" },
  { value: "10k-25k", label: "$10k - $25k" },
  { value: "25k-plus", label: "$25k+" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

type ContactFieldName = "name" | "email" | "projectType" | "budgetRange" | "message";

export interface ContactComposerValues {
  name: string;
  email: string;
  projectType: string;
  budgetRange: string;
  message: string;
}

type ContactComposerErrors = Partial<Record<ContactFieldName, string>>;
type ContactComposerTouched = Partial<Record<ContactFieldName, boolean>>;

type OptionValue = { value: string; label: string };

const INITIAL_VALUES: ContactComposerValues = {
  name: "",
  email: "",
  projectType: "",
  budgetRange: "",
  message: "",
};

export function buildContactMailtoUrl(values: ContactComposerValues): string {
  const projectTypeLabel = getOptionLabel(PROJECT_TYPE_OPTIONS, values.projectType) ?? values.projectType;
  const budgetRangeLabel = getOptionLabel(BUDGET_RANGE_OPTIONS, values.budgetRange) ?? values.budgetRange;
  const subject = `Project inquiry: ${values.projectType ? projectTypeLabel : "New conversation"}`;
  const body = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Project type: ${projectTypeLabel}`,
    `Budget range: ${budgetRangeLabel}`,
    "",
    "Message:",
    values.message,
    "",
    "This draft was prepared from the Steve Defendre portfolio contact form.",
  ].join("\r\n");

  return `mailto:${primaryContactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ContactComposer() {
  const statusId = useId();
  const nameId = useId();
  const emailId = useId();
  const projectTypeId = useId();
  const budgetRangeId = useId();
  const messageId = useId();
  const readyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [values, setValues] = useState<ContactComposerValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ContactComposerErrors>({});
  const [touched, setTouched] = useState<ContactComposerTouched>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "preparing" | "ready" | "validation-error" | "handoff-error"
  >("idle");

  useEffect(() => {
    return () => {
      if (readyTimer.current) {
        clearTimeout(readyTimer.current);
      }
    };
  }, []);

  const showError = (field: ContactFieldName) => Boolean((submitAttempted || touched[field]) && errors[field]);

  function updateField(field: ContactFieldName, value: string) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);

    if (submitAttempted || touched[field]) {
      applyFieldError(field, value, nextValues);
    }
  }

  function handleBlur(field: ContactFieldName) {
    setTouched((current) => ({ ...current, [field]: true }));
    applyFieldError(field, values[field], values);
  }

  function applyFieldError(
    field: ContactFieldName,
    value: string,
    nextValues: ContactComposerValues,
  ) {
    setErrors((current) => ({
      ...current,
      [field]: validateField(field, value) ?? undefined,
    }));

    // Drop the stale "check the highlighted fields" banner once the form is valid again.
    if (status === "validation-error" && !hasFormErrors(validateContactForm(nextValues))) {
      setStatus("idle");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "preparing") {
      return;
    }

    if (readyTimer.current) {
      clearTimeout(readyTimer.current);
      readyTimer.current = null;
    }

    setSubmitAttempted(true);

    const trimmedValues: ContactComposerValues = {
      name: values.name.trim(),
      email: values.email.trim(),
      projectType: values.projectType,
      budgetRange: values.budgetRange,
      message: values.message.trim(),
    };

    const nextErrors = validateContactForm(trimmedValues);
    setErrors(nextErrors);

    const firstInvalidField = (Object.keys(INITIAL_VALUES) as ContactFieldName[]).find(
      (field) => nextErrors[field],
    );

    if (firstInvalidField) {
      setStatus("validation-error");
      setTouched({
        name: true,
        email: true,
        projectType: true,
        budgetRange: true,
        message: true,
      });
      focusField(firstInvalidField, {
        nameId,
        emailId,
        projectTypeId,
        budgetRangeId,
        messageId,
      });
      return;
    }

    const mailtoUrl = buildContactMailtoUrl(trimmedValues);

    if (mailtoUrl.length > MAILTO_URL_MAX_LENGTH) {
      setErrors((current) => ({
        ...current,
        message: "Shorten your message or use fewer special characters so the email draft works across mail apps.",
      }));
      setTouched((current) => ({ ...current, message: true }));
      setStatus("validation-error");
      focusField("message", {
        nameId,
        emailId,
        projectTypeId,
        budgetRangeId,
        messageId,
      });
      return;
    }

    // Keep the mailto click in the original user gesture while committing the
    // busy UI first, so browsers do not treat the handoff as a popup.
    flushSync(() => setStatus("preparing"));
    trackAnalyticsEvent("contact_mailto_draft", {
      project_type: trimmedValues.projectType,
      budget_range: trimmedValues.budgetRange,
    });

    try {
      const draftLink = document.createElement("a");
      draftLink.href = mailtoUrl;
      draftLink.rel = "noreferrer noopener";
      draftLink.click();
      readyTimer.current = setTimeout(() => {
        readyTimer.current = null;
        setStatus("ready");
      }, PREPARING_STATUS_DURATION_MS);
    } catch {
      setStatus("handoff-error");
    }
  }

  const statusMessage =
    status === "preparing"
      ? "Preparing your email draft."
      : status === "ready"
        ? "Email draft requested. Nothing was sent. If no mail app opened, use Email Steve or copy the address above."
        : status === "validation-error"
          ? "Check the highlighted fields and try again."
          : status === "handoff-error"
            ? "The email draft could not be opened. Nothing was sent; use Email Steve or copy the address above."
          : "This form prepares an email draft in your mail app. Nothing is sent automatically.";

  const statusTone =
    status === "validation-error" || status === "handoff-error"
        ? "text-rose-300"
        : "text-[var(--muted-foreground)]";

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-busy={status === "preparing"}
      className="spatial-glass rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Your name"
          required
          id={nameId}
          value={values.name}
          error={showError("name") ? errors.name : undefined}
          hint="Use the name you want in the subject line."
          onBlur={() => handleBlur("name")}
          onChange={(value) => updateField("name", value)}
        >
          {(fieldProps) => (
            <input type="text" autoComplete="name" maxLength={NAME_MAX_LENGTH} {...fieldProps} />
          )}
        </Field>

        <Field
          label="Email address"
          required
          id={emailId}
          value={values.email}
          error={showError("email") ? errors.email : undefined}
          hint="I use this to reply directly."
          onBlur={() => handleBlur("email")}
          onChange={(value) => updateField("email", value)}
        >
          {(fieldProps) => (
            <input
              type="email"
              autoComplete="email"
              inputMode="email"
              maxLength={EMAIL_MAX_LENGTH}
              {...fieldProps}
            />
          )}
        </Field>

        <Field
          label="Project type"
          required
          id={projectTypeId}
          value={values.projectType}
          error={showError("projectType") ? errors.projectType : undefined}
          hint="Choose the closest match."
          onBlur={() => handleBlur("projectType")}
          onChange={(value) => updateField("projectType", value)}
        >
          {(fieldProps) => (
            <select {...fieldProps}>
              <option value="" disabled>
                Select a project type
              </option>
              {PROJECT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field
          label="Budget range"
          required
          id={budgetRangeId}
          value={values.budgetRange}
          error={showError("budgetRange") ? errors.budgetRange : undefined}
          hint="A rough range is enough."
          onBlur={() => handleBlur("budgetRange")}
          onChange={(value) => updateField("budgetRange", value)}
        >
          {(fieldProps) => (
            <select {...fieldProps}>
              <option value="" disabled>
                Select a budget range
              </option>
              {BUDGET_RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field
          label="Message"
          required
          id={messageId}
          value={values.message}
          error={showError("message") ? errors.message : undefined}
          hint={`A few sentences about the work is enough. ${values.message.length}/${MESSAGE_MAX_LENGTH}`}
          onBlur={() => handleBlur("message")}
          onChange={(value) => updateField("message", value)}
          className="md:col-span-2"
        >
          {(fieldProps) => <textarea rows={6} maxLength={MESSAGE_MAX_LENGTH} {...fieldProps} />}
        </Field>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-[var(--muted-foreground)]">
          The button below prepares a `mailto:` draft to {primaryContactEmail}.
        </p>

        <button
          type="submit"
          disabled={status === "preparing"}
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 text-sm font-bold text-[var(--accent-foreground)] shadow-[0_18px_45px_var(--shadow-warm)] transition-[transform,filter,opacity] duration-300 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 disabled:cursor-wait disabled:opacity-80"
        >
          {status === "preparing" ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[currentColor] border-r-transparent" />
              Preparing draft
            </>
          ) : (
            <>
              <PaperAirplaneIcon aria-hidden="true" className="h-4 w-4" />
              Prepare email draft
            </>
          )}
        </button>
      </div>

      <p
        id={statusId}
        role={status === "validation-error" || status === "handoff-error" ? "alert" : "status"}
        aria-live={status === "validation-error" || status === "handoff-error" ? "assertive" : "polite"}
        aria-atomic="true"
        className={`mt-4 min-h-6 text-sm leading-6 ${statusTone}`}
      >
        {statusMessage}
      </p>
    </form>
  );
}

interface FieldProps {
  label: string;
  required?: boolean;
  id: string;
  value: string;
  error?: string;
  hint: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  className?: string;
  children: (fieldProps: {
    id: string;
    name: string;
    value: string;
    onBlur: () => void;
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
    "aria-invalid": boolean;
    "aria-describedby"?: string;
    className: string;
    required?: boolean;
  }) => ReactNode;
}

function Field({
  label,
  required,
  id,
  value,
  error,
  hint,
  onBlur,
  onChange,
  className,
  children,
}: FieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hintId, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
        {label}
        {required ? <span aria-hidden="true" className="text-[var(--accent)]"> *</span> : null}
      </label>

      {children({
        id,
        name: id,
        value,
        onBlur,
        onChange: (event) => onChange(event.currentTarget.value),
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy || undefined,
        className: [
          "focus-ring block w-full min-h-11 rounded-2xl border bg-[var(--surface-elevated)] px-4 py-3 text-sm text-[var(--foreground)] shadow-[0_1px_0_rgba(255,255,255,0.02)] outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-[var(--muted)] focus-visible:bg-[var(--surface)]",
          error
            ? "border-rose-300 focus-visible:border-rose-300"
            : "border-[var(--border)] focus-visible:border-[color-mix(in_oklab,var(--accent)_55%,var(--border))]",
        ].join(" "),
        required,
      })}

      <p id={hintId} className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">
        {hint}
      </p>

      {error ? (
        <p id={errorId} className="mt-2 text-xs font-medium leading-5 text-rose-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function validateContactForm(values: ContactComposerValues): ContactComposerErrors {
  return {
    name: validateField("name", values.name) ?? undefined,
    email: validateField("email", values.email) ?? undefined,
    projectType: validateField("projectType", values.projectType) ?? undefined,
    budgetRange: validateField("budgetRange", values.budgetRange) ?? undefined,
    message: validateField("message", values.message) ?? undefined,
  };
}

function validateField(
  field: ContactFieldName,
  value: string,
): string | null {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return field === "email"
      ? "Enter your email address."
      : field === "message"
        ? "Add a short message so I can prepare the draft."
        : field === "projectType"
          ? "Choose the kind of project you want help with."
          : field === "budgetRange"
            ? "Choose the budget range that fits best."
            : "Enter your name.";
  }

  if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
    return "Enter a valid email address.";
  }

  if (field === "name" && trimmedValue.length > NAME_MAX_LENGTH) {
    return `Keep your name to ${NAME_MAX_LENGTH} characters or fewer.`;
  }

  if (field === "email" && trimmedValue.length > EMAIL_MAX_LENGTH) {
    return `Keep your email address to ${EMAIL_MAX_LENGTH} characters or fewer.`;
  }

  if (field === "projectType" && !getOptionLabel(PROJECT_TYPE_OPTIONS, trimmedValue)) {
    return "Choose the kind of project you want help with.";
  }

  if (field === "budgetRange" && !getOptionLabel(BUDGET_RANGE_OPTIONS, trimmedValue)) {
    return "Choose the budget range that fits best.";
  }

  if (field === "message" && trimmedValue.length < 10) {
    return "Add a bit more detail so I can prepare the draft.";
  }

  if (field === "message" && trimmedValue.length > MESSAGE_MAX_LENGTH) {
    return `Keep your message to ${MESSAGE_MAX_LENGTH} characters or fewer.`;
  }

  return null;
}

function getOptionLabel(options: readonly OptionValue[], value: string) {
  return options.find((option) => option.value === value)?.label;
}

function hasFormErrors(errors: ContactComposerErrors) {
  return (Object.keys(INITIAL_VALUES) as ContactFieldName[]).some((field) => Boolean(errors[field]));
}

function focusField(
  field: ContactFieldName,
  ids: Record<"nameId" | "emailId" | "projectTypeId" | "budgetRangeId" | "messageId", string>,
) {
  const fieldId =
    field === "name"
      ? ids.nameId
      : field === "email"
        ? ids.emailId
        : field === "projectType"
          ? ids.projectTypeId
          : field === "budgetRange"
            ? ids.budgetRangeId
            : ids.messageId;

  document.getElementById(fieldId)?.focus();
}
