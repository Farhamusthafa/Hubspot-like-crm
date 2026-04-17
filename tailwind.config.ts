


// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/pages/**/*.{ts,tsx}', // optional if using pages
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
