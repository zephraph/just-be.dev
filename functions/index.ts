import { Hono } from 'hono'
const app = new Hono()

app.get('/api/hello', (c) => {
  return c.html('<h1>Hello world</h1>')
})

app.get('/*', (c) => {
  console.log(c.req.url)
  return fetch(`https://notes.just-be.dev/${c.req.url}`)
})

export default app
