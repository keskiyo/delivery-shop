import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createSwaggerSpec } from 'next-swagger-doc'
import swaggerDefinition from '../src/lib/swagger-definition.json' with { type: 'json' }

const rootDir = dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const outputPath = join(rootDir, 'public', 'api-docs', 'openapi.json')

const spec = createSwaggerSpec({
	apiFolder: 'src/app/api',
	definition: swaggerDefinition,
})

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, `${JSON.stringify(spec, null, '\t')}\n`)

const pathsCount = Object.keys(spec.paths || {}).length
console.log(`OpenAPI spec generated: ${outputPath} (${pathsCount} paths)`)
