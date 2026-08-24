"use client";

import { useState } from "react";

/** Vizuelna newsletter forma — bez backend logike (demo režim). Na tamnoj pozadini. */
export function NewsletterForm({
  placeholder,
  buttonLabel,
  successLabel,
}: {
  placeholder: string;
  buttonLabel: string;
  successLabel: string;
}) {
  const [sent, setSent] = useState(false);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
          setTimeout(() => setSent(false), 4000);
        }}
        className="flex overflow-hidden rounded-full border border-white/20 bg-white/10 focus-within:border-brand-300"
      >
        <input
          type="email"
          required
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/75"
        />
        <button
          type="submit"
          className="shrink-0 bg-brand-600 px-4 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-650"
        >
          {buttonLabel}
        </button>
      </form>
      {/* Povratna informacija i za čitače ekrana (demo režim) */}
      <p role="status" className="mt-2 min-h-5 text-xs text-brand-200">
        {sent ? successLabel : ""}
      </p>
    </div>
  );
}
