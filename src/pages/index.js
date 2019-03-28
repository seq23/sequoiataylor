import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Hero from "../components/hero"

const IndexPage = () => (
  <Layout>
    <SEO
      title="Home"
      keywords={[
        "ventures",
        "education",
        "strategies",
        "investments",
        "liquidity solutions",
        "corporate finance",
      ]}
    />
    <Hero />
  </Layout>
)

export default IndexPage
