export const projectCardFields = `
  _id,
  title,
  "slug": slug.current,
  description,
  tag,
  featured,
  coverImage,
  coverImageUrl,
  year,
  role,
  client,
  tools,
  publishedAt
`

export const projectDetailFields = `
  ${projectCardFields},
  coverImageUrl,
  seo,
  content[] {
    ...,
    _type == "richTextBlock" => {
      ...,
      body[] {
        ...,
        markDefs[] {
          ...,
          _type == "link" => { href }
        }
      }
    }
  }
`

export const allProjectsQuery = `
  *[_type == "project" && defined(slug.current)] | order(publishedAt desc) {
    ${projectCardFields}
  }
`

export const featuredProjectsQuery = `
  *[_type == "project" && featured == true && defined(slug.current)] | order(publishedAt desc) {
    ${projectCardFields}
  }
`

export const projectBySlugQuery = `
  *[_type == "project" && slug.current == $slug][0] {
    ${projectDetailFields}
  }
`

export const blogPostCardFields = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  tag,
  coverImage,
  publishedAt
`

export const blogPostDetailFields = `
  ${blogPostCardFields},
  body,
  seo
`

export const allPostsQuery = `
  *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
    ${blogPostCardFields}
  }
`

export const postBySlugQuery = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    ${blogPostDetailFields}
  }
`
