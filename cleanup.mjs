import fs from 'fs'
import path from 'path'

const tempDir = path.join(process.cwd(), 'uploads', 'temp')
const now = Date.now()
const threeDays = 3 * 24 * 60 * 60 * 1000

if (fs.existsSync(tempDir)) {
	const files = fs.readdirSync(tempDir)

	files.forEach(file => {
		const match = file.match(/temp_(\d+)_/)
		if (match && match[1]) {
			const fileTime = parseInt(match[1])
			if (now - fileTime > threeDays) {
				try {
					fs.unlinkSync(path.join(tempDir, file))
					console.log(`Удален: ${file}`)
				} catch (error) {
					console.error(`Ошибка удаления ${file}:`, error.message)
				}
			}
		}
	})
}
