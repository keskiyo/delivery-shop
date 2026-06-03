/**
 * Конфигурация аутентификации через better-auth
 *
 * Настройки:
 * - Сессия: 30 дней (expiresIn), обновление каждые 24ч (updateAge)
 * - Email/password: с подтверждением email, сброс пароля на 1 день
 * - Phone: OTP на 4 цифры, 3 попытки, срок 5 минут
 * - Доп. поля: phoneNumber, surname, birthdayDate, region, location, gender, card, role
 *
 * Важные примечания:
 * - При входе email+password: сессия создается от better-auth
 * - При входе phone+password: сессия создается кастомно (см. api/auth/login)
 * - SMS отправка закомментирована, OTP выводится в консоль
 * - Email отправляется через Resend (нужен API ключ в .env)
 *
 * База данных: MongoDB 'deliveryshop'
 * Адаптер: mongodbAdapter из better-auth/adapters/mongodb
 */
import VerifyEmail from '@/app/(root)/(auth)/(reg)/_components/VerifyEmail'
import PasswordResetEmail from '@/app/(root)/(auth)/(update-pass)/_components/PasswordResetEmail'
import EmailChangeVerification from '@/app/(root)/(user-profile)/_components/EmailChangeVerification'
import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { admin, phoneNumber } from 'better-auth/plugins'
import { MongoClient } from 'mongodb'
import { Resend } from 'resend'
import { CONFIG } from '../../config/config'
import { deleteUserAvatar } from '../../utils/deleteUserAvatar'

const client = new MongoClient(process.env.FOOD_DELIVERY_DB_URL!)
const db = client.db('deliveryshop')
const resend = new Resend(process.env.RESEND_API_KEY)





export const auth = betterAuth({
	database: mongodbAdapter(db),

	session: {
		expiresIn: 60 * 60 * 24 * 30,
		updateAge: 60 * 60 * 24,
	},

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		resetPasswordTokenExpiresIn: 86400,
		sendResetPassword: async ({ user, url }) => {
			await resend.emails.send({
				from: 'Acme <onboarding@resend.dev>',
				to: user.email,
				subject: 'Сброс пароля для аккаунта "Фудмаркета"',
				react: PasswordResetEmail({
					username: user.name,
					resetUrl: url,
				}),
			})
		},
	},

	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			await resend.emails.send({
				from: 'Acme <onboarding@resend.dev>',
				to: user.email,
				subject: 'Подтвердите email',
				react: VerifyEmail({
					username: user.name,
					verifyUrl: url,
				}),
			})
		},
		expiresIn: 86400,
		autoSignInAfterVerification: false,
	},

	plugins: [
		phoneNumber({
			sendOTP: async ({ phoneNumber, code }) => {
				console.log(`[DEBUG] Отправка OTP: ${code} для ${phoneNumber}`)
			},


















			signUpOnVerification: {
				getTempEmail: phoneNumber => {
					return `${phoneNumber}${CONFIG.TEMPORARY_EMAIL_DOMAIN}`
				},
				getTempName: phoneNumber => {
					return phoneNumber
				},
			},
			allowedAttempts: 3,
			otpLength: 4,
			expiresIn: 300,
			requireVerification: true,
		}),
		admin(),
	],

	user: {
		changeEmail: {
			enabled: true,
			sendChangeEmailVerificationEmail: async ({
				user,
				newEmail,
				url,
			}: {
				user: {
					name: string
					email: string
				}
				newEmail: string
				url: string
			}) => {
				await resend.emails.send({
					from: 'Фудмаркет <onboarding@resend.dev>',
					to: user.email,
					subject: 'Подтвердите изменение email в Фудмаркете',
					react: EmailChangeVerification({
						username: user.name,
						currentEmail: user.email,
						newEmail,
						verificationUrl: url,
					}),
				})
			},
		},
		deleteUser: {
			enabled: true,
			afterDelete: async user => {
				await deleteUserAvatar(user.id)
			},
		},
		additionalFields: {
			phoneNumber: { type: 'string', input: true, required: true },
			surname: { type: 'string', input: true, required: true },
			birthdayDate: { type: 'date', input: true, required: true },
			region: { type: 'string', input: true, required: true },
			location: { type: 'string', input: true, required: true },
			gender: { type: 'string', input: true, required: true },
			card: { type: 'string', input: true, required: false },
			hasCard: { type: 'boolean', input: true, required: false },
			role: {
				type: 'string',
				input: false,
				required: false,
				default: 'user',
			},
		},
	},
})




















































































































































































