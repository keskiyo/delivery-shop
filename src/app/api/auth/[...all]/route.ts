// Назначение: API-маршрут auth/[...all].
// Как работает: Методы определяются экспортированными обработчиками файла. Валидирует входные данные, обращается к нужным сервисам и возвращает JSON-ответ.

import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { POST, GET } = toNextJsHandler(auth)
