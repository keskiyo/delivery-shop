import { getDB } from '@/lib/api-routes'
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { NextRequest } from 'next/server'
import { isPasswordValid } from '../../../../../utils/validation/passwordValid'

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
			userId,
			expiresAt: { $gt: new Date() },
		})

		if (!session) {
			return Response.json({ error: 'Сессия регистрации истекла' }, { status: 401 })
		}

		const passwordHash = await bcrypt.hash(password, 10)

		const result = await db
			.collection('user')
			.updateOne(
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
						updatedAt: new Date(),
					},
				},
			)

		if (result.matchedCount === 0) {
			return Response.json(
				{ error: 'Подтвержденный пользователь не найден' },
				{ status: 404 },
			)
		}

		return Response.json({ success: true }, { status: 200 })
	} catch (error) {
		console.error('Ошибка:', error)
		return Response.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 },
		)
	}
}
