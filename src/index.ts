import { Hono } from 'hono'
import { rewriteAttribute, rewriteContent } from './rewriters'
const app = new Hono()

app.get('/api/hello', (c) => {
  return c.html('<h1>Hello world</h1>')
})

app.get('/_obsidian/:prefix/*', async (c) => {
  const path = c.req.path.replace(/\/_obsidian\/(\d+)\//, '')
  return fetch(`https://publish-${c.req.param('prefix')}.obsidian.md/${path}`)
})

app.get('/*', async (c) => {
  return fetch(`https://notes.just-be.dev/${c.req.url}`).then((res) => {
    const { origin } = new URL(c.req.url)
    return new HTMLRewriter()
      .on('script', rewriteContent(content => {
        return content
          .replace(/https:\/\/publish-(\d+)\.obsidian\.md/g, `${origin}/_obsidian/$1`)
          .replace(encodeURI(origin).replace(/:/g, '%3A') + '/', `About%20me`)
      }))
      .transform(res)
  })
})

app.options('/*', (c) => {
  console.log('option called')
  if (c.req.headers.get("Origin") !== null &&
    c.req.headers.get("Access-Control-Request-Method") !== null &&
    c.req.headers.get("Access-Control-Request-Headers") !== null) {

    return new Response(null, {
      headers: {
        "Access-Control-Allow-Headers": c.req.headers.get("Access-Control-Request-Headers") || '',
      }
    })

  } else {
    return new Response(null, {
      headers: {
        Allow: "GET, HEAD, POST, OPTIONS",
      }
    })
  }
})

export default app
