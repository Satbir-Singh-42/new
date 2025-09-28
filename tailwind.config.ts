module.exports = {
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "wwwiplt-2-0comanakiwa": "var(--wwwiplt-2-0comanakiwa)",
        "wwwiplt-2-0combunting": "var(--wwwiplt-2-0combunting)",
        "wwwiplt-2-0comcrimson": "var(--wwwiplt-2-0comcrimson)",
        "wwwiplt-2-0comflamingo": "var(--wwwiplt-2-0comflamingo)",
        "wwwiplt-2-0comsupernova": "var(--wwwiplt-2-0comsupernova)",
        "wwwiplt-2-0comwhite": "var(--wwwiplt-2-0comwhite)",
        "wwwiplt20comblack-3": "var(--wwwiplt20comblack-3)",
        "wwwiplt20comchathams-blue": "var(--wwwiplt20comchathams-blue)",
        "wwwiplt20comcod-gray": "var(--wwwiplt20comcod-gray)",
        "wwwiplt20comconcrete-80": "var(--wwwiplt20comconcrete-80)",
        "wwwiplt20comdaisy-bush": "var(--wwwiplt20comdaisy-bush)",
        "wwwiplt20comdeep-sea-green": "var(--wwwiplt20comdeep-sea-green)",
        "wwwiplt20comfalu-red": "var(--wwwiplt20comfalu-red)",
        "wwwiplt20comprussian-blue": "var(--wwwiplt20comprussian-blue)",
        "wwwiplt20comregal-blue": "var(--wwwiplt20comregal-blue)",
        "wwwiplt20comtory-blue": "var(--wwwiplt20comtory-blue)",
        "wwwiplt20comwhite-10": "var(--wwwiplt20comwhite-10)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
  darkMode: ["class"],
};
