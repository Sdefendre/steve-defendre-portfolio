export default function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      data-testid="animated-background"
      className="spatial-environment pointer-events-none fixed inset-0 z-0 bg-[var(--background)]"
    >
      <span className="spatial-orb spatial-orb--one" />
      <span className="spatial-orb spatial-orb--two" />
      <span className="spatial-orb spatial-orb--three" />
      <span className="spatial-horizon" />
    </div>
  );
}
