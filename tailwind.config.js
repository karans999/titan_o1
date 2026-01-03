/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                obsidian: {
                    bg: '#0a0a0a',
                    surface: '#161616',
                    surfaceHighlight: '#1f1f1f',
                    border: '#262626',
                    text: '#ededed',
                    muted: '#737373',
                    primary: '#00ff9d', // Neon green for signals
                    secondary: '#3b82f6', // Electric blue for data
                    accent: '#f59e0b', // Amber for warnings/highlights
                    danger: '#ef4444',
                    success: '#10b981',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
}
