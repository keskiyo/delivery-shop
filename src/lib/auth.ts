import VerifyEmail from '@/app/(root)/(auth)/(reg)/_components/VerifyEmail'
import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { MongoClient } from 'mongodb'
import { Resend } from 'resend'

const client = new MongoClient(process.env.FOOD_DELIVERY_DB_URL!)

const db = client.db('deliveryshop')
const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
	database: mongodbAdapter(db),

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
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
	user: {
		additionalFields: {
			phoneNumber: { type: 'string', input: true, required: true },
			surname: { type: 'string', input: true, required: true },
			birthdayDate: { type: 'date', input: true, required: true },
			region: { type: 'string', input: true, required: true },
			location: { type: 'string', input: true, required: true },
			gender: { type: 'string', input: true, required: true },
			card: { type: 'string', input: true, required: false },
			hasCard: { type: 'boolean', input: true, required: false },
		},
	},
})
