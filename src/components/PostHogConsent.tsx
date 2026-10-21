"use client";

import { useEffect } from "react";
import { PostHogConsentBar } from "./PostHogConsentBar";
import {
  consentValues,
  getPostHogConfig,
  readConsentChoice,
  writeConsentChoice,
  type ConsentChoice,
} from "@/lib/posthog-consent";
import { initPostHogIfAllowed } from "@/lib/posthog-init";

export function PostHogConsent() {
  useEffect(() => {
    const choice = readConsentChoice();
    void initPostHogIfAllowed(choice, getPostHogConfig());

    const bar = document.getElementById("posthog-consent");
    if (bar && choice === null) bar.hidden = false;
  }, []);

  function rememberChoice(choice: ConsentChoice) {
    writeConsentChoice(choice);
    const bar = document.getElementById("posthog-consent");
    if (bar) bar.hidden = true;
    void initPostHogIfAllowed(choice, getPostHogConfig());
  }

  return (
    <div
      onClick={(event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;

        const button = target.closest("[data-consent]");
        if (!(button instanceof HTMLElement)) return;

        const action = button.dataset.consent;
        if (action === "accept") rememberChoice(consentValues.accepted);
        if (action === "decline") rememberChoice(consentValues.declined);
      }}
    >
      <PostHogConsentBar />
    </div>
  );
}
