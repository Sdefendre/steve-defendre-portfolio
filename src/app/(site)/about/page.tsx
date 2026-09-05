import {
  LightBulbIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { ExternalLink } from "@/components/ExternalLink";
import { aboutFacts } from "@/data/about";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "About Steve Defendre | Veteran software builder",
  description:
    "Steve Defendre is a military veteran, CS graduate, and founder of Defendre Solutions. He builds software for small teams that need a usable product.",
  canonical: "/about",
});

const principleIcons = {
  "Start with the outcome": ShieldCheckIcon,
  "Ship the next usable version": WrenchScrewdriverIcon,
  "Own it after launch": LightBulbIcon,
} as const;

export default function About() {
  return (
    <div className="space-y-20 lg:space-y-28">
      <header className="spatial-window spatial-reveal relative overflow-hidden rounded-[2rem] p-5 sm:p-8 lg:p-10">
        <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(16rem,0.72fr)_minmax(0,1.28fr)] lg:gap-12">
          <div className="spatial-glass relative order-2 mx-auto aspect-[4/5] w-full max-w-[16rem] overflow-hidden rounded-[2rem] border border-[var(--border)] lg:order-1 lg:aspect-auto lg:max-w-none lg:min-h-[36rem]">
            <Image
              src="/headshot.jpg"
              alt="Steve Defendre, founder of Defendre Solutions"
              fill
              sizes="(max-width: 1023px) calc(100vw - 3rem), 34vw"
              className="object-cover object-top"
              priority
            />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-[color-mix(in_oklab,var(--background)_76%,transparent)] p-4 backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                Right now
              </p>
              <p className="mt-2 text-sm font-bold leading-6 text-[var(--foreground)]">
                I turn a rough need into software a small team can run without me in the room.
              </p>
            </div>
          </div>

          <div className="order-1 flex flex-col justify-between py-1 lg:order-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                Veteran, CS graduate, product engineer
              </p>
              <h1 className="mt-4 max-w-[10ch] font-display text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.94] tracking-[-0.05em] text-[var(--foreground)]">
                About me
              </h1>
              <div className="mt-7 max-w-[62ch] space-y-5 text-base leading-8 text-[var(--muted-foreground)]">
                <p>
                  I&apos;m Steve Defendre, a military veteran, CS graduate, and
                  founder of{" "}
                  <ExternalLink
                    href="https://defendresolutions.com"
                    className="focus-ring rounded-sm font-bold text-[var(--foreground)] underline decoration-[var(--accent)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--accent)]"
                  >
                    Defendre Solutions
                  </ExternalLink>
                  . I build for founders and small businesses that need someone
                  who can take a messy request and ship a product they can use.
                </p>
                <p>
                  I do the product calls and the engineering. I scope the work,
                  design the path, build the UI, wire the backend, and leave
                  something you can maintain after launch.
                </p>
              </div>
            </div>

            <dl className="mt-10 grid border-t border-[var(--border)] sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {aboutFacts.proofPoints.map((point) => (
                <div
                  key={point.label}
                  className="border-b border-[var(--border)] py-5 sm:border-b-0 sm:border-r sm:px-4 sm:last:border-r-0 sm:first:pl-0 lg:border-b lg:border-r-0 lg:px-0 xl:border-b-0 xl:border-r xl:px-4 xl:first:pl-0"
                >
                  <dt className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                    {point.label}
                  </dt>
                  <dd className="mt-2 text-sm font-bold leading-6 text-[var(--foreground)]">
                    {point.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      <section aria-labelledby="mission-path-heading" className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
            How I build
          </p>
          <h2
            id="mission-path-heading"
            className="mt-3 max-w-[10ch] font-display text-[clamp(2.5rem,5vw,4.75rem)] font-medium leading-none tracking-[-0.04em] text-[var(--foreground)]"
          >
            How I take a project.
          </h2>
          <p className="mt-5 max-w-[42ch] text-base leading-7 text-[var(--muted-foreground)]">
            I stay on the work from the first call through launch, including the
            parts that usually get handed off.
          </p>
        </div>

        <ol className="relative space-y-6 before:absolute before:bottom-8 before:left-[1.45rem] before:top-8 before:w-px before:bg-[var(--border)]">
          {aboutFacts.principles.map((principle, index) => {
            const PrincipleIcon = principleIcons[principle.title];

            return (
              <li key={principle.title} className="spatial-reveal relative grid grid-cols-[3rem_1fr] gap-4">
                <div className="spatial-glass z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] text-[var(--accent)] shadow-[0_12px_30px_var(--shadow-warm)]">
                  <PrincipleIcon aria-hidden="true" className="h-5 w-5" />
                </div>
                <div className="spatial-glass rounded-[1.75rem] border border-[var(--border)] p-5 sm:p-6">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                    Phase {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-medium tracking-[-0.03em] text-[var(--foreground)]">
                    {principle.title}
                  </h3>
                  <p className="mt-3 max-w-[58ch] text-sm leading-7 text-[var(--muted-foreground)]">
                    {principle.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="capabilities-heading">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
            What I work with
          </p>
          <h2
            id="capabilities-heading"
            className="mt-3 font-display text-[clamp(2.5rem,5vw,4.75rem)] font-medium leading-none tracking-[-0.04em] text-[var(--foreground)]"
          >
            What I use
          </h2>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--border)] md:grid-cols-2">
          {aboutFacts.capabilities.map((capability, index) => (
            <article
              key={capability.name}
              className="spatial-glass min-h-64 p-6 sm:p-8"
            >
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                0{index + 1}
              </p>
              <h3 className="mt-4 font-display text-3xl font-medium tracking-[-0.04em] text-[var(--foreground)]">
                {capability.name}
              </h3>
              <p className="mt-3 max-w-[40ch] text-sm leading-7 text-[var(--muted-foreground)]">
                {capability.description}
              </p>
              <ul className="mt-7 flex flex-wrap gap-x-4 gap-y-3" aria-label={`${capability.name} skills`}>
                {capability.skills.map((skill) => (
                  <li key={skill} className="text-sm font-bold text-[var(--foreground)]">
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
