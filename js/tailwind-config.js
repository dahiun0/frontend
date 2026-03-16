window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        "primary": "#22c55e",
        "primary-black": "#000000",
        "primary-hover": "#16a34a",
        "secondary-gray": "#6b7280",
        "border-light": "#e5e7eb",
        "background-light": "#ffffff",
        "emerald-brand": "#10B981",
        "emerald-dark": "#059669",
        "border-subtle": "#f3f4f6",
        "text-placeholder": "#d1d5db",
        "level-0": "#f1f5f9", "level-1": "#d1fae5", "level-2": "#6ee7b7", "level-3": "#34d399", "level-4": "#10b981", "level-5": "#047857",
      },
      fontFamily: {
        "display": ["Space Grotesk", "Pretendard", "sans-serif"],
        "body": ["Inter", "Pretendard", "sans-serif"],
        "sans": ["Inter", "Pretendard", "sans-serif"],
        "mono": ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "md": "0.375rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
    },
  },
};
