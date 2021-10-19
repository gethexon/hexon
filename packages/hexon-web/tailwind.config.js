module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      lineHeight: {
        full: "100%",
        11: "3rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
