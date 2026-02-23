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
            },
            fontFamily: {
                "display": ["Inter", "Space Grotesk", "Pretendard", "sans-serif"],
                "body": ["Inter", "Pretendard", "sans-serif"],
                "sans": ["Inter", "Pretendard", "sans-serif"],
                "mono": ["Inter", "JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"]
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
