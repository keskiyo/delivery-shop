import { getDB } from '@/lib/api-routes'
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { NextRequest } from 'next/server'
import { isPasswordValid } from '../../../../../utils/validation/passwordValid'

/**
 * @swagger
 * /api/auth/set-password:
 *   post:
 *     tags: [Auth]
 *     summary: Завершить регистрацию — задать пароль и профиль после OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, sessionToken, password, name, surname, birthdayDate, region, location, gender]
 *             properties:
 *               userId: { type: string }
 *               sessionToken: { type: string }
 *               password: { type: string, format: password }
 *               name: { type: string }
 *               surname: { type: string }
 *               birthdayDate: { type: string, format: date }
 *               region: { type: string }
 *               location: { type: string }
 *               gender: { type: string }
 *               card: { type: string }
 *               hasCard: { type: boolean }
 *     responses:
 *       200:
 *         description: Регистрация завершена
 *       400:
 *         description: Некорректные данные
 *       401:
 *         description: Сессия регистрации истекла
 *       404:
 *         description: Подтверждённый пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
export async function POST(request: NextRequest) {
	try {
		const {
			userId,
			sessionToken,
			password,
			name,
			surname,
			birthdayDate,
			region,
			location,
			gender,
			card,
			hasCard,
		} = await request.json()

		if (
			typeof userId !== 'string' ||
			!ObjectId.isValid(userId) ||
			typeof sessionToken !== 'string' ||
			!sessionToken ||
			typeof password !== 'string' ||
			!isPasswordValid(password) ||
			typeof name !== 'string' ||
			!name.trim() ||
			typeof surname !== 'string' ||
			!surname.trim() ||
			typeof birthdayDate !== 'string' ||
			Number.isNaN(Date.parse(birthdayDate)) ||
			typeof region !== 'string' ||
			!region.trim() ||
			typeof location !== 'string' ||
			!location.trim() ||
			typeof gender !== 'string' ||
			!gender.trim() ||
			(card !== undefined && typeof card !== 'string') ||
			(hasCard !== undefined && typeof hasCard !== 'boolean')
		) {
			return Response.json(
				{ error: 'Некорректные данные регистрации' },
				{ status: 400 },
			)
		}

		const db = await getDB()
		const session = await db.collection('session').findOne({
			token: sessionToken,
			$or: [
				{ userId },
				{ userId: ObjectId.createFromHexString(userId) },
			],
		})
		const sessionExpiresAt = session?.expiresAt
			? new Date(session.expiresAt)
			: null

		if (
			!session ||
			!sessionExpiresAt ||
			Number.isNaN(sessionExpiresAt.getTime()) ||
			sessionExpiresAt <= new Date()
		) {
			return Response.json(
				{ error: 'Сессия регистрации истекла' },
				{ status: 401 },
			)
		}

		const passwordHash = await bcrypt.hash(password, 10)
		const now = new Date()

		const result = await db.collection('user').updateOne(
			{
				_id: ObjectId.createFromHexString(userId),
				phoneNumberVerified: true,
			},
			{
				$set: {
					password: passwordHash,
					name: name.trim(),
					surname: surname.trim(),
					birthdayDate: new Date(birthdayDate),
					region: region.trim(),
					location: location.trim(),
					gender: gender.trim(),
					card: card?.trim() || '',
					hasCard: hasCard ?? false,
					updatedAt: now,
				},
			},
		)

		if (result.matchedCount === 0) {
			return Response.json(
				{ error: 'Подтверждённый пользователь не найден' },
				{ status: 404 },
			)
		}

		await db.collection('account').updateOne(
			{
				userId: ObjectId.createFromHexString(userId),
				providerId: 'credential',
			},
			{
				$set: {
					accountId: userId,
					providerId: 'credential',
					userId: ObjectId.createFromHexString(userId),
					password: passwordHash,
					updatedAt: now,
				},
				$setOnInsert: {
					createdAt: now,
				},
			},
			{ upsert: true },
		)

		return Response.json({ success: true }, { status: 200 })
	} catch (error) {
		console.error('Ошибка завершения регистрации:', error)
		return Response.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 },
		)
	}
}
