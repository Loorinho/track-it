import { createMiddleware } from '@tanstack/react-start'
import { auth } from './auth'
import { redirect } from '@tanstack/react-router'

export const authMiddleware = createMiddleware().server(async ({ next, request }) => {
  // This is server side auth middleware. We can also create client side auth middleware by using

  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    throw redirect({ to: '/login' })
  }
  return await next()
})
