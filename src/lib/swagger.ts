import { createSwaggerSpec } from 'next-swagger-doc'
import swaggerDefinition from './swagger-definition.json'

export const getApiDocs = () => {
	const spec = createSwaggerSpec({
		apiFolder: 'src/app/api',
		definition: swaggerDefinition,
	})

	return spec
}
