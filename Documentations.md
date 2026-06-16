# Delivery Shop Documentation

Обновлено: 16 июня 2026.

`delivery-shop` - интернет-магазин доставки продуктов на Next.js с публичным каталогом, корзиной, оформлением заказов, личным кабинетом, блогом, CMS и административной панелью.

## Стек

| Часть      | Используется                                             |
| ---------- | -------------------------------------------------------- |
| Frontend   | Next.js 16 App Router, React 19, TypeScript              |
| Styling    | TailwindCSS 4, SASS, CSS tokens из `src/app/globals.css` |
| Database   | MongoDB через native `mongodb` driver                    |
| Auth       | Better Auth + кастомная phone/password session           |
| State      | Redux Toolkit/RTK Query, Zustand, React Context          |
| Rich text  | TipTap, DOMPurify                                        |
| UI helpers | Lucide React, React Toastify, Framer Motion              |
| Maps       | Yandex Maps через `@iminside/react-yandex-maps`          |

Mongoose указан в зависимостях, но в проекте не используется. Новые Mongoose-модели добавлять не нужно.

## Быстрый Старт

```bash
npm install
npx migrate-mongo up
npx ts-node seed-db.ts
npm run dev
```

Локальный адрес по умолчанию: `http://localhost:3000`.

Минимальные проверки перед деплоем:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Переменные Окружения

Основные переменные лежат в `.env`, файл не должен попадать в git.

| Переменная                                                            | Назначение                                  |
| --------------------------------------------------------------------- | ------------------------------------------- |
| `FOOD_DELIVERY_DB_URL`                                                | MongoDB connection string                   |
| `FOOD_DELIVERY_DB_NAME`                                               | Имя базы данных                             |
| `BETTER_AUTH_SECRET`                                                  | Секрет Better Auth                          |
| `BETTER_AUTH_URL`                                                     | Base URL для Better Auth                    |
| `NEXT_PUBLIC_BASE_URL`                                                | Публичный URL сайта                         |
| `RESEND_API_KEY`                                                      | API key для email, если используется Resend |
| `CRON_SECRET`                                                         | Секрет cron endpoints                       |
| `NEXT_PUBLIC_YANDEX_MAPS_API_KEY`                                     | Ключ Яндекс Карт                            |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM_*` | SMTP-отправка писем                         |
| `SMS_API_ID`                                                          | SMS.ru API key                              |

## Архитектура

Основной код находится в `src`.

| Путь               | Назначение                                |
| ------------------ | ----------------------------------------- |
| `src/app`          | App Router страницы, layouts и API routes |
| `src/app/(root)`   | Публичные и административные route groups |
| `src/app/api`      | Публичные и служебные API routes          |
| `src/components`   | Общие UI и feature-компоненты             |
| `src/store`        | Zustand stores и Redux Toolkit API        |
| `src/hooks`        | Переиспользуемые React hooks              |
| `src/lib`          | Auth, DB helpers, toast helpers, utils    |
| `src/data`         | Статические данные                        |
| `src/types`        | Общие TypeScript-типы                     |
| `utils`            | Shared server/client утилиты              |
| `config/config.ts` | Бизнес-константы                          |
| `public`           | Статические ассеты                        |

Комментарии из кода удалены для подготовки к деплою. Описание проекта и подсказки для разработчиков должны храниться в `.md` файлах.

## Основные Маршруты

| Маршрут                      | Назначение                  |
| ---------------------------- | --------------------------- |
| `/`                          | Главная страница            |
| `/catalog`                   | Каталог                     |
| `/catalog/[category]`        | Категория товаров           |
| `/catalog/[category]/[slug]` | Страница товара             |
| `/cart`                      | Корзина и оформление заказа |
| `/user-profile`              | Профиль пользователя        |
| `/user-orders`               | Заказы пользователя         |
| `/favorites`                 | Избранное                   |
| `/purchases`                 | Покупки                     |
| `/blog`                      | Блог                        |
| `/blog/[category]`           | Категория блога             |
| `/blog/[category]/[slug]`    | Статья                      |
| `/blog/rules`                | Правила сообщества          |
| `/contacts`                  | Контакты и карта магазинов  |
| `/about-us`                  | О компании                  |
| `/vacancies`                 | Вакансии                    |
| `/privacy-policy`            | Политика обработки данных   |
| `/administrator`             | Административная панель     |
| `/administrator/cms`         | CMS                         |
| `/administrator/cards`       | Карты лояльности            |

## Авторизация

В проекте есть две схемы авторизации:

| Схема                 | Где используется                                                   |
| --------------------- | ------------------------------------------------------------------ |
| Better Auth           | Email/password, email verification, phone OTP plugin, admin plugin |
| Custom session cookie | Phone/password login через `/api/auth/login`                       |

Для серверной проверки пользователя используйте существующие helpers, например `getServerUserId`, вместо ручного чтения cookies в каждом месте.

## Данные И MongoDB

Проект использует native MongoDB driver. Общий helper подключения находится в `src/lib/api-routes.ts`.

Основные коллекции:

| Коллекция           | Назначение                                     |
| ------------------- | ---------------------------------------------- |
| `products`          | Товары                                         |
| `category`          | Категории каталога                             |
| `orders`            | Заказы                                         |
| `cart`              | Корзины                                        |
| `user`              | Пользователи Better Auth и дополнительные поля |
| `articles`          | Статьи CMS/блога                               |
| `articleCategories` | Категории блога                                |
| `comments`          | Комментарии к статьям                          |
| `siteSettings`      | SEO и настройки сайта                          |
| `cards`             | Карты лояльности                               |
| `deliveryTimes`     | Слоты доставки                                 |

Миграции находятся в `migrations`, конфиг миграций - `migrate-mongo-config.js`.

## CMS И Блог

CMS находится в route group:

```text
src/app/(root)/(admin)/administrator/(cms)/cms
```

Основные возможности:

| Раздел                        | Возможности                                                |
| ----------------------------- | ---------------------------------------------------------- |
| `articles/editor`             | TipTap-редактор статей, таблицы, изображения, HTML preview |
| `articles/articlesManagement` | Список, фильтры, статусы, reorder, featured                |
| `categories`                  | Категории блога и SEO-метаданные                           |
| `comments`                    | Модерация комментариев и бан пользователей                 |
| `semantic-core`               | SEO-настройки сайта                                        |

Публичный блог использует API:

```text
/api/blog/[category]
/api/blog/[category]/[slug]
/api/blog/categories
/api/blog/search
```

Старые вложенные маршруты вида `/api/blog/category/...` не используются.

## Комментарии

Комментарии к статьям поддерживают:

| Функция        | Где находится                                                       |
| -------------- | ------------------------------------------------------------------- |
| Публичный UI   | `src/app/(root)/(blog)/blog/[category]/[slug]/_components/comments` |
| Store          | `src/store/commentsStore.ts`                                        |
| Public API     | `src/app/api/comments`                                              |
| Like API       | `src/app/api/comments/[id]/like`                                    |
| CMS moderation | `administrator/(cms)/cms/comments`                                  |

Перед первой публикацией комментария пользователь должен принять правила сообщества. Факт принятия хранится в поле `rulesAcceptedAt`.

## Карты Лояльности

Админ-раздел карт находится в:

```text
src/app/(root)/(admin)/administrator/cards
```

Карты хранятся в коллекции `cards`. У пользователя флаг наличия карты хранится в поле `hasCard`. При активации карты обновляются данные карты и пользовательское поле `hasCard`.

Для уведомлений используется React Toastify через helpers из `src/lib/showToast.ts`.

## Изображения

Правила хранения:

| Тип                           | Путь                      |
| ----------------------------- | ------------------------- |
| Временные изображения статей  | `public/temp`             |
| Постоянные изображения статей | `public/uploads/articles` |
| Изображения категорий CMS     | `public/blogCategories`   |
| Общие картинки сайта          | `public/images`           |
| Иконки                        | `public/icons-*`          |

`next.config.ts` содержит local image patterns для `next/image`. Если добавляется новый публичный путь для изображений, проверьте конфиг.

## UI И Темы

Темы управляются через `ThemeProvider` и CSS tokens. Переключатель тем поддерживает `dark`, `light`, `system`.

Основные токены:

| Токен                                             | Назначение        |
| ------------------------------------------------- | ----------------- |
| `bg-card`                                         | Фон карточек      |
| `bg-input`                                        | Фон input         |
| `border-border`                                   | Границы           |
| `text-foreground`                                 | Основной текст    |
| `text-muted-foreground`                           | Вторичный текст   |
| `hover:bg-surface-hover`                          | Hover-фон         |
| `bg-brand`, `bg-promo`, `bg-success`, `bg-danger` | Цветные состояния |

Для ярких зелёных и оранжевых фонов используйте `text-white`, чтобы текст был читаемым в светлой и тёмной теме.

## Confirm И Toast

Стандартный `window.confirm` заменён на общий компонент подтверждения:

```text
src/components/ui/confirm/ConfirmProvider.tsx
```

Провайдер подключён в `src/components/features/common/providers.tsx`.

Уведомления централизованы:

```text
src/lib/showToast.ts
```

Для async-действий используйте `showPromiseToast`.

## Корзина И Заказы

Основные части:

| Путь                          | Назначение                     |
| ----------------------------- | ------------------------------ |
| `src/app/(root)/(cart)/cart`  | UI корзины                     |
| `src/actions/orderActions.ts` | Server actions корзины/заказов |
| `src/store/cartStore.ts`      | Zustand store корзины          |
| `src/hooks/usePricing.ts`     | Расчёты цен, скидок, бонусов   |
| `src/app/api/orders`          | API заказов                    |
| `src/app/api/delivery-times`  | Слоты доставки                 |

Оплата сейчас имитируется. Для реальной оплаты нужна серверная валидация платежа и обработка callbacks от провайдера.

## Админка

Основные разделы:

| Путь                            | Назначение          |
| ------------------------------- | ------------------- |
| `/administrator/products`       | Управление товарами |
| `/administrator/admin-orders`   | Управление заказами |
| `/administrator/users-list`     | Пользователи        |
| `/administrator/delivery-times` | Слоты доставки      |
| `/administrator/cards`          | Карты лояльности    |
| `/administrator/cms`            | CMS                 |

Общие компоненты пагинации и выбора размера страницы вынесены в:

```text
src/app/(root)/(admin)/administrator/_components
```

## Константы

Бизнес-значения должны храниться в `config/config.ts`, а не дублироваться в компонентах или API routes.

Там находятся:

| Группа     | Примеры                                       |
| ---------- | --------------------------------------------- |
| Pagination | Размеры страниц каталога, избранного, покупок |
| Discounts  | Скидка по карте, бонусы                       |
| Prices     | Минимальная сумма заказа, диапазон цен        |
| Auth/OTP   | Таймеры, количество попыток                   |
| CMS        | Лимиты и настройки                            |

## Документация

| Файл                | Назначение                                                 |
| ------------------- | ---------------------------------------------------------- |
| `README.md`         | Обзор для GitHub                                           |
| `Documentations.md` | Подробная документация проекта                             |
| `INFO_STEK.md`      | Описание зависимостей из `package.json`                    |
| `AGENTS.md`         | Локальные инструкции для AI-агентов, файл игнорируется git |

## Известные Особенности

| Особенность         | Детали                                                                 |
| ------------------- | ---------------------------------------------------------------------- |
| Две auth-схемы      | Better Auth и custom session существуют параллельно                    |
| OTP/SMS             | SMS API подключён через `SMS_API_ID`, в dev возможен режим логирования |
| Mongo singleton     | API routes должны использовать общий helper подключения                |
| Article images      | Временные и постоянные изображения статей лежат в разных папках        |
| Comments moderation | Бан пользователя влияет на возможность оставлять комментарии           |
| Excel export        | Выгрузка заказов использует ExcelJS                                    |
| Code comments       | Комментарии из кода удалены, документацию держать в `.md`              |

## Практические Правила

1. При изменении авторизации проверяйте Better Auth config, custom login API и `getServerUserId`.
2. При изменении корзины проверяйте `cartStore`, `orderActions`, `/api/cart`, `/api/orders`, `usePricing`.
3. При изменении товаров проверяйте типы в `src/types/product.ts`, API товаров и публичные карточки.
4. При изменении CMS-статей проверяйте editor, articles management, upload routes и `processArticleImages`.
5. При изменении изображений статей соблюдайте разделение `public/temp` и `public/uploads/articles`.
6. При изменении SEO проверяйте sitemap, `/api/sitemap-data`, metadata helpers и CMS semantic-core.
7. При добавлении UI используйте токены темы, а не прямые цвета Tailwind, если это не осознанный акцент.
8. Перед деплоем запускайте `npx tsc --noEmit`, `npm run lint`, `npm run build`.
