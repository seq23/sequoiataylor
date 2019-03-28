module.exports = {
  siteMetadata: {
    title: "Sequoia Taylor",
    subtitle: "The best education is the one you give yourself.",
    paragraph: "Coming in 2019",
    description:
      "Achieving goals via manifestation and finding creative ways to give, education has been my ticket to a better life.",
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/components/typography`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#fdb552`,
        theme_color: `#fdb552`,
        display: `minimal-ui`,
      },
    },
  ],
}
