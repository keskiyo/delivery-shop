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

// ! При входе email и password, phone и OTP сессия создается от better-auth
// ! При входе через phone и password сессия создается кастомно ( в таком же ввиде как и от better-auth)
// ! Кастомное создание сессии в api/auth/login

export const auth = betterAuth({
	database: mongodbAdapter(db),

	session: {
		expiresIn: 60 * 60 * 24 * 30,
		updateAge: 60 * 60 * 24,
	},

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		resetPasswordTokenExpiresIn: 86400, // 1 day
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
		expiresIn: 86400, // 1 day
		autoSignInAfterVerification: false,
	},

	plugins: [
		phoneNumber({
			sendOTP: async ({ phoneNumber, code }) => {
				console.log(`[DEBUG] Отправка OTP: ${code} для ${phoneNumber}`)
			},

			// sendOTP: async ({ phoneNumber, code }) => {
			// 	try {
			// 		const response = await fetch(
			// 			`https://sms.ru/sms/send?api_id=${process.env.SMS_API_ID}&to=${phoneNumber}&msg=Ваш код подтверждения от "Фудмаркета": ${code}&json=1`,
			// 		)

			// 		const result = await response.json()

			// 		if (result.status !== 'OK') {
			// 			throw new Error(result.status || 'Ошибка отправки SMS')
			// 		}
			// 	} catch (error) {
			// 		console.error('Ошибка отправки SMS:', error)
			// 		throw error
			// 	}
			// },

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

// ! ТЕСТОВЫЙ КОД nodemailer
// ! для теста maildev http://localhost:1080

// import { betterAuth } from 'better-auth'
// import { mongodbAdapter } from 'better-auth/adapters/mongodb'
// import { phoneNumber } from 'better-auth/plugins'
// import { MongoClient } from 'mongodb'
// import nodemailer from 'nodemailer'
// import { CONFIG } from '../../config/config'

// const client = new MongoClient(process.env.FOOD_DELIVERY_DB_URL!)
// const db = client.db('deliveryshop')

// // Локальный SMTP транспорт для разработки
// const localTransporter = nodemailer.createTransport({
// 	host: 'localhost',
// 	port: 1025,
// 	secure: false,
// 	ignoreTLS: true,
// })

// // Функции для отправки email через nodemailer
// async function sendVerificationEmail({
// 	user,
// 	url,
// }: {
// 	user: { email: string; name: string }
// 	url: string
// }) {
// 	await localTransporter.sendMail({
// 		from: 'Фудмаркет <dev@localhost.com>',
// 		to: user.email,
// 		subject: 'Подтвердите email',
// 		html: `
//       <!DOCTYPE html>
//       <html lang="ru">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Подтвердите email</title>
//       </head>
//       <body>
//         <h1>Подтвердите Ваш email</h1>
//         <p>Спасибо, ${user.name}, за регистрацию!</p>
//         <p>Для подтверждения email перейдите по ссылке: <a href="${url}">${url}</a></p>
//       </body>
//       </html>
//     `,
// 		text: `Подтвердите Ваш email\n\nСпасибо, ${user.name}, за регистрацию!\n\nДля подтверждения перейдите по ссылке: ${url}`,
// 	})

// 	console.log('Email отправлен через MailDev. Preview: http://localhost:1080')
// }

// async function sendResetPasswordEmail({
// 	user,
// 	url,
// }: {
// 	user: { email: string; name: string }
// 	url: string
// }) {
// 	await localTransporter.sendMail({
// 		from: 'Фудмаркет <dev@localhost.com>',
// 		to: user.email,
// 		subject: 'Сброс пароля для Фудмаркета',
// 		html: `
//       <!DOCTYPE html>
//       <html lang="ru">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Сброс пароля</title>
//       </head>
//       <body>
//         <h1>Сброс пароля</h1>
//         <p>Здравствуйте, ${user.name}!</p>
//         <p>Для сброса пароля перейдите по ссылке: <a href="${url}">${url}</a></p>
//       </body>
//       </html>
//     `,
// 		text: `Сброс пароля\n\nЗдравствуйте, ${user.name}!\n\nДля сброса пароля перейдите по ссылке: ${url}`,
// 	})

// 	console.log(
// 		'Email сброса пароля отправлен через MailDev. Preview: http://localhost:1080',
// 	)
// }

// async function sendChangeEmailVerification({
// 	user,
// 	newEmail,
// 	url,
// }: {
// 	user: { email: string; name: string }
// 	newEmail: string
// 	url: string
// }) {
// 	await localTransporter.sendMail({
// 		from: 'Фудмаркет <dev@localhost.com>',
// 		to: user.email,
// 		subject: 'Подтверждение смены email в Фудмаркете',
// 		html: `
//       <!DOCTYPE html>
//       <html lang="ru">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Подтверждение смены email</title>
//       </head>
//       <body>
//         <h1>Подтверждение смены email</h1>
//         <p>Здравствуйте, ${user.name}!</p>
//         <p>Вы запросили смену email с ${user.email} на ${newEmail}.</p>
//         <p>Для подтверждения перейдите по ссылке: <a href="${url}">${url}</a></p>
//       </body>
//       </html>
//     `,
// 		text: `Подтверждение смены email\n\nЗдравствуйте, ${user.name}!\n\nВы запросили смену email с ${user.email} на ${newEmail}.\n\nДля подтверждения перейдите по ссылке: ${url}`,
// 	})

// 	console.log(
// 		'Email смены email отправлен через MailDev. Preview: http://localhost:1080',
// 	)
// }

// export const auth = betterAuth({
// 	database: mongodbAdapter(db),
// 	session: {
// 		expiresIn: 60 * 60 * 24 * 30,
// 		updateAge: 60 * 60 * 24,
// 	},
// 	emailAndPassword: {
// 		enabled: true,
// 		requireEmailVerification: true,
// 		resetPasswordTokenExpiresIn: 86400,
// 		sendResetPassword: sendResetPasswordEmail,
// 	},
// 	emailVerification: {
// 		sendVerificationEmail: sendVerificationEmail,
// 		expiresIn: 86400,
// 		autoSignInAfterVerification: false,
// 	},
// 	plugins: [
// 		phoneNumber({
// 			sendOTP: async ({ phoneNumber, code }) => {
// 				console.log(`[DEBUG] Отправка OTP: ${code} для ${phoneNumber}`)
// 			},
// 			signUpOnVerification: {
// 				getTempEmail: phoneNumber => {
// 					return `${phoneNumber}${CONFIG.TEMPORARY_EMAIL_DOMAIN}`
// 				},
// 				getTempName: phoneNumber => {
// 					return phoneNumber
// 				},
// 			},
// 			allowedAttempts: 3,
// 			otpLength: 4,
// 			expiresIn: 300,
// 			requireVerification: true,
// 		}),
// 	],
// 	user: {
// 		changeEmail: {
// 			enabled: true,
// 			requireEmailVerification: false,
// 			sendChangeEmailVerification: sendChangeEmailVerification,
// 		},
// 		additionalFields: {
// 			phoneNumber: { type: 'string', input: true, required: true },
// 			surname: { type: 'string', input: true, required: true },
// 			birthdayDate: { type: 'date', input: true, required: true },
// 			region: { type: 'string', input: true, required: true },
// 			location: { type: 'string', input: true, required: true },
// 			gender: { type: 'string', input: true, required: true },
// 			card: { type: 'string', input: true, required: false },
// 			hasCard: { type: 'boolean', input: true, required: false },
// 		},
// 	},
// })
