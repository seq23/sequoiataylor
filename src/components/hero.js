import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Leaf from "./leaf"
import "./hero.css"

export default () => {
  const {
    site: {
      siteMetadata: { title, subtitle, paragraph },
    },
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            subtitle
            paragraph
          }
        }
      }
    `
  )

  return (
    <section className="wrapper">
      <section>
        <h1 className="title">{title}</h1>
        <span className="lines">
          <Leaf />
        </span>
        <p className="subtitle">{subtitle}</p>
        <p className="text">{paragraph}</p>
      </section>
    </section>
  )
}
