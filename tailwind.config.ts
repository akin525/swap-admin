// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class", // Add this line!
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: "#8B5CF6",
            },
        },
    },
    plugins: [],
};
export default config;