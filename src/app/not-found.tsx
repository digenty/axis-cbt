import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-2xl font-semibold text-[var(--color-text-default)]">
        Page Not Found
      </h1>
      <p className="max-w-sm text-sm text-[var(--color-text-muted)]">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/subjects"
        className="rounded-md bg-[var(--color-bg-state-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-bg-state-primary-hover)]"
      >
        Go to Home page
      </Link>
    </div>
  );
}
