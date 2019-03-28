import Typography from "typography"

const typography = new Typography({
  googleFonts: [
    {
      name: "Playfair Display",
      styles: ["400"],
    },
    {
      name: "Montserrat",
      styles: ["400"],
    },
  ],
  headerFontFamily: ["Playfair Display", "serif"],
  bodyFontFamily: ["Montserrat", "sans-serif"],
  baseFontSize: "16px",
})
const { rhythm, scale } = typography

export { rhythm, scale, typography as default }
