import type { Metadata } from "next";
import {
  ArrowTopRightOnSquareIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { ContactComposer } from "@/components/ContactComposer";
import { contactLinks } from "@/data/socials";
import { isSafeHref } from "@/utils/url";

export const metadata: Metadata = {
  title: "Contact Steve Defendre | Project Inquiries",
  description:
    "Start a project inquiry with Steve Defendre and Defendre Solutions, or connect through GitHub and LinkedIn.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Steve Defendre | Project Inquiries",
    description:
      "Start a project inquiry with Steve Defendre and Defendre Solutions, or connect through GitHub and LinkedIn.",
    url: "/contact",
  },
};

const primaryContact = contactLinks.find((link) => link.priority === "primary");
const secondaryContactLinks = contactLinks.filter((link) => link.priority === "secondary");
const footerContactLinks = contactLinks.filter((link) => link.priority === "footer");

function safeHref(href: string) {
  return isSafeHref(href) ? href : "#";
}

function isMailTo(href: string) {
  return href.startsWith("mailto:");
}

export default function Contact() {
  if (!primaryContact) {
    return null;
  }

  return (
    <div className="space-y-8 sm:space-y-20 lg:space-y-28">
      <header className="spatial-reveal mx-auto max-w-4xl text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)] shadow-[0_18px_45px_var(--shadow-warm)]">
          <EnvelopeIcon aria-hidden="true" className="h-6 w-6" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
          Open channel
        </p>
        <h1 className="mt-4 font-display text-[clamp(3.25rem,7vw,7rem)] font-medium leading-[0.9] tracking-[-0.055em] text-[var(--foreground)]">
          Start a project conversation.
        </h1>
        <p className="mx-auto mt-6 max-w-[60ch] text-base leading-8 text-[var(--muted-foreground)]">
          For software builds, product cleanup, and small-business web work, email
          is the fastest way to start. I read every project inquiry directly.
        </p>
      </header>

      <section
        aria-labelledby="primary-contact-heading"
        className="spatial-window spatial-reveal spatial-glow relative isolate overflow-hidden rounded-[2.25rem] p-5 text-center sm:p-8 lg:p-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color-mix(in_oklab,var(--accent)_20%,transparent)] blur-3xl"
        />
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_1rem_rgba(52,211,153,0.75)]"
            />
            Available for select new projects
          </div>

          <h2
            id="primary-contact-heading"
            className="mt-8 font-display text-3xl font-medium tracking-[-0.04em] text-[var(--foreground)] sm:text-4xl"
          >
            Project inquiry
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
            {primaryContact.description}
          </p>
          <p className="mt-8 break-all font-display text-[clamp(1.4rem,4.5vw,4.4rem)] font-medium tracking-[-0.045em] text-[var(--foreground)] sm:break-normal">
            {primaryContact.value}
          </p>

          <div className="mt-5 grid grid-cols-2 items-start gap-3 sm:mt-9 sm:flex sm:items-start sm:justify-center">
            <a
              href={safeHref(primaryContact.href)}
              className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 text-sm font-bold text-[var(--accent-foreground)] shadow-[0_18px_45px_var(--shadow-warm)] transition-[transform,filter] duration-300 hover:-translate-y-1 hover:brightness-110 active:translate-y-0"
            >
              Email Steve
              <ArrowTopRightOnSquareIcon aria-hidden="true" className="h-4 w-4" />
            </a>
            <CopyEmailButton email={primaryContact.value} />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="contact-composer-heading"
        className="spatial-window spatial-reveal grid gap-8 rounded-[2rem] border border-[var(--border)] p-5 sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:p-10"
      >
        <div className="space-y-4 lg:sticky lg:top-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
            Draft first
          </p>
          <h2
            id="contact-composer-heading"
            className="font-display text-[clamp(2.25rem,4vw,3.75rem)] font-medium leading-[0.95] tracking-[-0.045em] text-[var(--foreground)]"
          >
            Prepare an email draft without losing the thread.
          </h2>
          <p className="max-w-[42ch] text-sm leading-7 text-[var(--muted-foreground)]">
            This form prepares a properly encoded email draft in your mail app.
            Nothing sends automatically, and you still keep the copy button and
            direct contact links above if that is faster.
          </p>
        </div>

        <ContactComposer />
      </section>

      <section aria-labelledby="secondary-contact-heading">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
            Peripheral channels
          </p>
          <h2
            id="secondary-contact-heading"
            className="mt-3 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-none tracking-[-0.04em] text-[var(--foreground)]"
          >
            Other ways to connect
          </h2>
        </div>

        <ul className="grid gap-4 lg:grid-cols-3">
          {secondaryContactLinks.map((link, index) => (
            <li key={link.name} className={index === 1 ? "lg:mt-8" : ""}>
              <a
                href={safeHref(link.href)}
                target={isMailTo(link.href) ? undefined : "_blank"}
                rel={isMailTo(link.href) ? undefined : "noopener noreferrer"}
                className="spatial-glass focus-ring group flex min-h-52 h-full flex-col justify-between rounded-[1.75rem] border border-[var(--border)] p-5 transition-[transform,background-color] duration-300 hover:-translate-y-1 hover:bg-[var(--surface-elevated)] active:translate-y-0"
              >
                <div>
                  <div className="mb-8 flex items-center justify-between gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]">
                      <link.icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <ArrowTopRightOnSquareIcon
                      aria-hidden="true"
                      className="h-4 w-4 text-[var(--muted)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                  <h3 className="font-display text-2xl font-medium tracking-[-0.03em] text-[var(--foreground)]">
                    {link.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    {link.description}
                  </p>
                </div>

                <p className="mt-6 break-words text-sm font-bold text-[var(--foreground)]">
                  {"mobileValue" in link ? (
                    <>
                      <span className="sm:hidden">{link.mobileValue}</span>
                      <span className="hidden sm:inline">{link.value}</span>
                    </>
                  ) : (
                    link.value
                  )}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="spatial-glass grid gap-6 rounded-[2rem] border border-[var(--border)] p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
            Defendre Solutions
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-[-0.04em] text-[var(--foreground)]">
            Veteran-owned software development.
          </h2>
          <p className="mt-3 max-w-[58ch] text-sm leading-7 text-[var(--muted-foreground)]">
            Helping small businesses compete digitally with thoughtful products and
            dependable delivery.
          </p>
        </div>
        {footerContactLinks.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {footerContactLinks.map((link) => (
              <a
                key={link.name}
                href={safeHref(link.href)}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex min-h-11 items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-bold text-[var(--foreground)] transition-colors hover:bg-[var(--surface-elevated)]"
                aria-label={`${link.name} Defendre Solutions`}
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
