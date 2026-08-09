function AppleLogo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayLogo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="#EA4335" d="M3.6 2.3c-.3.2-.6.6-.6 1.1v17.2c0 .5.3.9.6 1.1l9.7-9.7L3.6 2.3z" />
      <path fill="#FBBC04" d="M16.3 14.9l-2.9-2.9-9.8 9.8c.4.3.9.3 1.4 0l11.3-6.9z" />
      <path fill="#4285F4" d="M20.5 10.7l-2.7-1.6-3.1 3.1 3.1 3.1 2.8-1.6c.9-.5.9-1.9-.1-3z" />
      <path fill="#34A853" d="M13.4 12.2l2.9-2.9L5.1 2.4c-.5-.3-1-.2-1.4 0l9.7 9.8z" />
    </svg>
  );
}

export function AppStoreBadge({
  href,
  disabled,
}: {
  href?: string | null;
  disabled?: boolean;
}) {
  const className =
    "group flex min-w-[180px] items-center gap-3 rounded-xl bg-ink px-4 py-3 text-left text-white shadow-lg shadow-ink/20 transition hover:bg-[#414141] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal";
  const inner = (
    <>
      <AppleLogo />
      <span className="leading-tight">
        <span className="block text-[10px] uppercase tracking-wide text-white/70">
          Download on the
        </span>
        <span className="block text-lg font-semibold tracking-tight">
          App Store
        </span>
      </span>
    </>
  );

  if (disabled || !href) {
    return (
      <span className={`${className} cursor-default opacity-90`} aria-disabled>
        {inner}
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {inner}
    </a>
  );
}

export function PlayStoreBadge({
  href,
  disabled,
}: {
  href?: string | null;
  disabled?: boolean;
}) {
  const className =
    "group flex min-w-[180px] items-center gap-3 rounded-xl bg-ink px-4 py-3 text-left text-white shadow-lg shadow-ink/20 transition hover:bg-[#414141] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal";
  const inner = (
    <>
      <PlayLogo />
      <span className="leading-tight">
        <span className="block text-[10px] uppercase tracking-wide text-white/70">
          Get it on
        </span>
        <span className="block text-lg font-semibold tracking-tight">
          Google Play
        </span>
      </span>
    </>
  );

  if (disabled || !href) {
    return (
      <span className={`${className} cursor-default opacity-90`} aria-disabled>
        {inner}
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {inner}
    </a>
  );
}
