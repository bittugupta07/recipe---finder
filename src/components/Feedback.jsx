export function Spinner({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-stone-500" role="status">
      <span className="h-6 w-6 animate-spin rounded-full border-4 border-stone-200 border-t-brand-500" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      ⚠️ {message}
    </div>
  );
}

export function EmptyState({ emoji, title, children }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="mb-3 text-5xl">{emoji}</div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-stone-500">{children}</p>
    </div>
  );
}
