


import { getDB } from '@/lib/api-routes'
import { NextRequest, NextResponse } from 'next/server'
import {
	getOptionalBoolean,
	getOptionalNumber,
	getOptionalString,
	getRequiredNumber,
	getRequiredString,
	getStringArray,
	isRecord,
} from '../../../../utils/apiValidation'

/**
 * @swagger
 * /api/update-product:
 *   post:
 *     tags: [Products, Admin]
 *     summary: Обновить товар по id
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, title, description, basePrice, weight, quantity]
 *             properties:
 *               id: { type: integer }
 *               title: { type: string }
 *               description: { type: string }
 *               basePrice: { type: number }
 *               weight: { type: number }
 *               quantity: { type: integer }
 *               discountPercent: { type: integer }
 *               categories: { type: array, items: { type: string } }
 *               tags: { type: array, items: { type: string } }
 *               isHealthyFood: { type: boolean }
 *               isNonGMO: { type: boolean }
 *               article: { type: string }
 *               brand: { type: string }
 *               manufacturer: { type: string }
 *     responses:
 *       200:
 *         description: Товар обновлён
 *       400:
 *         description: Некорректные данные
 *       404:
 *         description: Продукт не найден
 *       500:
 *         description: Ошибка сервера
 */
export async function POST(request: NextRequest) {
	try {
		const db = await getDB()
		const productsCollection = db.collection('products')

		const body: unknown = await request.json()

		if (!isRecord(body)) {
			return NextResponse.json(
				{ error: 'Некорректные данные товара' },
				{ status: 400 },
			)
		}

		const { categories, tags } = body

		const idResult = getRequiredNumber(
			body,
			'id',
			'ID продукта обязателен',
		)
		if (!idResult.ok) {
			return NextResponse.json(
				{ error: idResult.message },
				{ status: 400 },
			)
		}

		const titleResult = getRequiredString(
			body,
			'title',
			'Название товара обязательно',
		)
		const descriptionResult = getRequiredString(
			body,
			'description',
			'Описание товара обязательно',
		)
		const basePriceResult = getRequiredNumber(
			body,
			'basePrice',
			'Базовая цена должна быть числом',
		)
		const weightResult = getRequiredNumber(
			body,
			'weight',
			'Вес должен быть числом',
		)
		const quantityResult = getRequiredNumber(
			body,
			'quantity',
			'Количество должно быть числом',
		)
		const discountResult = getOptionalNumber(body, 'discountPercent')

		if (!titleResult.ok) {
			return NextResponse.json(
				{ error: titleResult.message },
				{ status: 400 },
			)
		}

		if (!descriptionResult.ok) {
			return NextResponse.json(
				{ error: descriptionResult.message },
				{ status: 400 },
			)
		}

		if (!basePriceResult.ok) {
			return NextResponse.json(
				{ error: basePriceResult.message },
				{ status: 400 },
			)
		}

		if (!weightResult.ok) {
			return NextResponse.json(
				{ error: weightResult.message },
				{ status: 400 },
			)
		}

		if (!quantityResult.ok) {
			return NextResponse.json(
				{ error: quantityResult.message },
				{ status: 400 },
			)
		}

		if (!discountResult.ok) {
			return NextResponse.json(
				{ error: discountResult.message },
				{ status: 400 },
			)
		}

		const updateData = {
			title: titleResult.value,
			description: descriptionResult.value,
			basePrice: basePriceResult.value,
			discountPercent: discountResult.value,
			weight: weightResult.value,
			quantity: quantityResult.value,
			article: getOptionalString(body, 'article'),
			brand: getOptionalString(body, 'brand'),
			manufacturer: getOptionalString(body, 'manufacturer'),
			isHealthyFood: getOptionalBoolean(body, 'isHealthyFood'),
			isNonGMO: getOptionalBoolean(body, 'isNonGMO'),
			categories: getStringArray(categories),
			tags: getStringArray(tags),
			updatedAt: new Date(),
		}

		const result = await productsCollection.updateOne(
			{ id: idResult.value },
			{ $set: updateData },
		)

		if (result.matchedCount === 0) {
			return NextResponse.json(
				{ error: 'Продукт не найден' },
				{ status: 404 },
			)
		}

		return NextResponse.json({
			success: true,
			message: 'Продукт успешно обновлен',
		})
	} catch (error) {
		console.error('Error updating product:', error)
		return NextResponse.json(
			{ error: 'Ошибка обновления товара' },
			{ status: 500 },
		)
	}
}
