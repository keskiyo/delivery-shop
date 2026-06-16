


export type ApiValidationResult<T> =
	| { ok: true; value: T }
	| { ok: false; message: string }

export const isRecord = (value: unknown): value is Record<string, unknown> => {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export const getRequiredString = (
	data: Record<string, unknown>,
	field: string,
	message: string,
): ApiValidationResult<string> => {
	const value = data[field]

	if (typeof value !== 'string') {
		return { ok: false, message }
	}

	const trimmed = value.trim()

	if (!trimmed) {
		return { ok: false, message }
	}

	return { ok: true, value: trimmed }
}

export const getOptionalString = (
	data: Record<string, unknown>,
	field: string,
	defaultValue = '',
): string => {
	const value = data[field]

	return typeof value === 'string' ? value.trim() : defaultValue
}

export const getOptionalBoolean = (
	data: Record<string, unknown>,
	field: string,
	defaultValue = false,
): boolean => {
	const value = data[field]

	return typeof value === 'boolean' ? value : defaultValue
}

export const getStringArray = (
	value: unknown,
	separator = ',',
): string[] => {
	if (Array.isArray(value)) {
		return value
			.map(item => (typeof item === 'string' ? item : String(item)))
			.map(item => item.trim())
			.filter(Boolean)
	}

	if (typeof value === 'string') {
		return value
			.split(separator)
			.map(item => item.trim())
			.filter(Boolean)
	}

	return []
}

export const getRequiredNumber = (
	data: Record<string, unknown>,
	field: string,
	message: string,
): ApiValidationResult<number> => {
	const value = data[field]

	if (value === undefined || value === null || value === '') {
		return { ok: false, message }
	}

	const numberValue =
		typeof value === 'number'
			? value
			: typeof value === 'string'
				? Number(value)
				: Number.NaN

	if (!Number.isFinite(numberValue)) {
		return { ok: false, message }
	}

	return { ok: true, value: numberValue }
}

export const getOptionalNumber = (
	data: Record<string, unknown>,
	field: string,
	defaultValue = 0,
): ApiValidationResult<number> => {
	const value = data[field]

	if (value === undefined || value === null || value === '') {
		return { ok: true, value: defaultValue }
	}

	const numberValue =
		typeof value === 'number'
			? value
			: typeof value === 'string'
				? Number(value)
				: Number.NaN

	if (!Number.isFinite(numberValue)) {
		return {
			ok: false,
			message: `Поле ${field} должно быть числом`,
		}
	}

	return { ok: true, value: numberValue }
}
