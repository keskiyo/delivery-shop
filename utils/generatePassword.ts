export const generatePassword = (length: number = 8): string => {
	const lowercase = 'abcdefghijklmnopqrstuvwxyz'
	const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const digits = '0123456789'
	const allChars = lowercase + uppercase + digits

	const passwordChars: string[] = [
		lowercase[Math.floor(Math.random() * lowercase.length)],
		uppercase[Math.floor(Math.random() * uppercase.length)],
		digits[Math.floor(Math.random() * digits.length)],
	]

	for (let i = passwordChars.length; i < length; i++) {
		passwordChars.push(
			allChars[Math.floor(Math.random() * allChars.length)],
		)
	}

	for (let i = passwordChars.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[passwordChars[i], passwordChars[j]] = [
			passwordChars[j],
			passwordChars[i],
		]
	}

	return passwordChars.join('')
}
