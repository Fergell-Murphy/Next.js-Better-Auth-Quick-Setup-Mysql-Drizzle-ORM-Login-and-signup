"use client";

import { useState } from "react";

type Props = {
  code: string;
  language?: string;
};

export function CopyCode({ code, language = "plaintext" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="group relative">
      <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2 top-2 rounded-md bg-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
