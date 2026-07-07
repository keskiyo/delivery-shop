


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
 * /api/add-product:
 *   post:
 *     tags: [Products, Admin]
 *     summary: Создать товар
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
 *               img: { type: string, description: 'Необязательно; по умолчанию /images/products/img-{id}.jpeg' }
 *     responses:
 *       200:
 *         description: Товар создан (success + product)
 *       400:
 *         description: Некорректные данные
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
			'ID товара обязателен',
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

		const idNumber = idResult.value

		const productData = {
			id: idNumber,
			img:
				getOptionalString(body, 'img') ||
				`/images/products/img-${idNumber}.jpeg`,
			title: titleResult.value,
			description: descriptionResult.value,
			basePrice: basePriceResult.value,
			discountPercent: discountResult.value,
			rating: {
				count: 0,
				distribution: {
					1: 0,
					2: 0,
					3: 0,
					4: 0,
					5: 0,
				},
			},
			categories: getStringArray(categories),
			weight: weightResult.value,
			quantity: quantityResult.value,
			tags: getStringArray(tags),
			isHealthyFood: getOptionalBoolean(body, 'isHealthyFood'),
			isNonGMO: getOptionalBoolean(body, 'isNonGMO'),
			updatedAt: new Date(),
			article: getOptionalString(body, 'article'),
			brand: getOptionalString(body, 'brand'),
			manufacturer: getOptionalString(body, 'manufacturer'),
		}

		const result = await productsCollection.insertOne(productData)

		return NextResponse.json({
			success: true,
			product: { ...productData, _id: result.insertedId },
		})
	} catch (error) {
		console.error('Error adding product:', error)
		return NextResponse.json(
			{ error: 'Ошибка добавления товара' },
			{ status: 500 },
		)
	}
}
