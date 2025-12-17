// src/app.ts
import Koa from 'koa'
import Router from 'koa-router'

const app = new Koa()
const router = new Router()

router.post('/ping', async (ctx) => {
  ctx.body = {
    message: 'pong',
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
  console.log('Mock server running at http://localhost:3000')
})
