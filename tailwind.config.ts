import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                night: {
                    50: '#f8fafc',
                    100: '#e5e7eb',
                    200: '#cbd5e1',
                    300: '#94a3b8',
                    400: '#64748b',
                    500: '#475569',
                    600: '#334155',
                    700: '#1f2937',
                    800: '#151b25',
                    900: '#111827',
                    950: '#070b14',
                },
                moon: {
                    DEFAULT: '#F2CE72', // auriul din designul Solunar Mobile
                    glow: '#FFE9A8',
                },
            },
            fontFamily: {
                display: ['var(--font-outfit)', 'sans-serif'],
                body: ['var(--font-open-sans)', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
};
export default config;
