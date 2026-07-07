


import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

/**
 * @swagger
 * /api/auth/{path}:
 *   get:
 *     tags: [Auth]
 *     summary: Catch-all better-auth (GET)
 *     description: >
 *       Все GET-эндпоинты better-auth: get-session, ok, list-sessions,
 *       verify-email, callback и т.д. Путь подставляется вместо {path}.
 *     parameters:
 *       - in: path
 *         name: path
 *         required: true
 *         schema: { type: string }
 *         example: get-session
 *     responses:
 *       200: { description: Ответ better-auth }
 *   post:
 *     tags: [Auth]
 *     summary: Catch-all better-auth (POST)
 *     description: >
 *       POST-эндпоинты better-auth: sign-in/email, sign-up/email, sign-out,
 *       phone-number/send-otp, phone-number/verify, forget-password,
 *       reset-password, change-email, delete-user, admin/* и т.д.
 *     parameters:
 *       - in: path
 *         name: path
 *         required: true
 *         schema: { type: string }
 *         example: sign-in/email
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200: { description: Ответ better-auth }
 *       401: { description: Не авторизован }
 */
export const { POST, GET } = toNextJsHandler(auth)
