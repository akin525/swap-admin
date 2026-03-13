import type { Config } from "tailwindcss";

const config: Config = {
    // 1. Enable class-based dark mode
    darkMode: "class",

    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],

    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            // 2. Custom Color Palette based on your Design
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",

                // Your Specific Brand Colors
                brand: {
                    midnight: "#0E0627",  // The deep navy sidebar active state
                    purple: "#7C5CFF",    // The primary action color
                    cyan: "#A5F3FC",      // The secondary accent
                    dark: "#0B0B15",      // The main dark mode background
                    card: "#13131F",      // Dark mode card background
                },

                // Semantic colors for charts/status
                success: {
                    DEFAULT: "#10B981",
                    50: "#ECFDF5",
                },
                warning: {
                    DEFAULT: "#F59E0B",
                    50: "#FFFBEB",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
            },

            // 3. Custom Keyframes for the Dashboard "Entry" Animations
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                // Fade in animation
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                // Slide up animation
                "slide-in-from-bottom": {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
            },

            // 4. Animation Utility Classes
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.5s ease-out",
                "slide-up": "slide-in-from-bottom 0.5s ease-out forwards",
            },

            fontFamily: {
                // Assuming you are using Inter or standard sans
                sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
            },
        },
    },

    // 5. Plugins
    plugins: [
        require("tailwindcss-animate"), // Handles the 'animate-in' classes
        require("tailwind-scrollbar")({ nocompatible: true }), // Handles 'scrollbar-hide' / 'scrollbar-thin'
    ],
};

export default config;