# Delivery Shop - справка по проекту

Обновлено: 15 июня 2026.

Этот файл описывает структуру и ключевые особенности проекта `delivery-shop`.

## Краткое описание

`delivery-shop` - интернет-магазин доставки продуктов на Next.js. В приложении есть витрина товаров, каталог с категориями, карточки товаров, корзина, оформление заказов, личный кабинет, избранное, история покупок, админ-панель и отдельный CMS-раздел для управления контентом и SEO-настройками.

## Новинки (обновление от 15 июня 2026)

Раздел описывает функциональность, добавленную в последнем цикле работ. Подробности по каждой подсистеме — в таблицах ниже.

### Система комментариев блога

Полноценные комментарии к статьям блога: древовидные ответы, лайки, сортировка, дозагрузка, редактирование и удаление собственных комментариев, модалка правил перед первой публикацией.

| Путь                                                   | Комментарий                                                                                                                                                                                                          |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `(blog)/blog/[category]/[slug]/_components/comments/`  | Публичный UI комментариев: `Comments`, `CommentItem`, `CommentForm`, `CommentReplies`, `CommentEditForm`, `CommentAction`, `CommentSortButtons`, `CommentAvatar`, `CommentHeader`, `LoadMoreComments`, `RulesModal`. |
| `(blog)/blog/types/comments.types.ts`                  | Тип `IComment` и связанные типы публичных комментариев.                                                                                                                                                              |
| `(blog)/blog/[category]/utils/getAuthorBadges.ts`      | Бейджи автора комментария (роль, статус).                                                                                                                                                                            |
| `(blog)/blog/[category]/utils/getReplayWord.ts`        | Склонение слова «ответ» по количеству.                                                                                                                                                                               |
| `(blog)/blog/[category]/utils/getDeleteButtonTitle.ts` | Подпись кнопки удаления комментария.                                                                                                                                                                                 |
| `src/store/commentsStore.ts`                           | Zustand store комментариев: список, пагинация, статусы банов авторов (`bannedUsers`).                                                                                                                                |
| `src/app/api/comments/route.ts`                        | `GET` комментариев статьи по `articleId`, `POST` создание комментария/ответа.                                                                                                                                        |
| `src/app/api/comments/[id]/route.ts`                   | `PATCH` редактирование, `DELETE` удаление комментария.                                                                                                                                                               |
| `src/app/api/comments/[id]/like/route.ts`              | Лайк/снятие лайка комментария.                                                                                                                                                                                       |

### Модерация комментариев в CMS

Отдельный раздел CMS для просмотра, фильтрации и модерации всех комментариев сайта с возможностью бана автора.

| Путь                                   | Комментарий                                                                             |
| -------------------------------------- | --------------------------------------------------------------------------------------- |
| `cms/comments/page.tsx`                | Страница модерации комментариев.                                                        |
| `cms/comments/_components/`            | `CommentsList`, `CommentRow`, `CommentsFilters`, `CommentsTableHeader`, `BanUserModal`. |
| `cms/comments/types/comments.types.ts` | Типы CMS-комментариев и параметры загрузки (`LoadCommentsParams`).                      |
| `cms/comments/utils/banOptions.ts`     | Пресеты сроков бана.                                                                    |
| `cms/comments/utils/getDayWord.ts`     | Склонение слова «день» для срока бана.                                                  |
| `cms/api/comments/route.ts`            | CMS API: список комментариев с фильтрами и пагинацией.                                  |
| `cms/api/comments/[id]/route.ts`       | CMS API: операции над конкретным комментарием.                                          |

### Бан пользователей

Временный (на N дней) или бессрочный бан пользователя. Хранится в полях `bannedUntil` и `bannedAt` коллекции `user`.

| Путь                                        | Комментарий                                                                                             |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `src/actions/userBanActions.ts`             | Server actions `banUser(userId, banDays)`, `unbanUser`, `checkBanStatus`. `banDays = null` — бессрочно. |
| `cms/comments/_components/BanUserModal.tsx` | Модалка выбора срока бана.                                                                              |
| `utils/formatBanDate.ts`                    | Форматирование даты окончания бана.                                                                     |
| `utils/formatDate.ts`                       | Общий хелпер форматирования дат.                                                                        |

### Правила блога и ознакомление

Страница правил блога и фиксация факта ознакомления пользователя (поле `rulesAcceptedAt` в `user`) перед первой публикацией комментария.

| Путь                                  | Комментарий                                                                       |
| ------------------------------------- | --------------------------------------------------------------------------------- |
| `(blog)/blog/rules/page.tsx`          | Публичная страница правил блога; контакты админа берутся через `getAdminContact`. |
| `src/actions/acceptRules.ts`          | Server actions `acceptRules(userId)` и `checkRulesAccepted(userId)`.              |
| `comments/_components/RulesModal.tsx` | Модалка правил перед первым комментарием.                                         |

### Карты лояльности (админ-раздел)

Новый раздел админки для управления картами лояльности: список с фильтрами и поиском, добавление карты, пагинация.

| Путь                                          | Комментарий                                                                             |
| --------------------------------------------- | --------------------------------------------------------------------------------------- |
| `administrator/cards/page.tsx`                | Страница управления картами.                                                            |
| `administrator/cards/_components/`            | `CardTable`, `FilterBar`, `AddCardForm`.                                                |
| `administrator/cards/types/cards.types.ts`    | Типы карты и параметров загрузки.                                                       |
| `administrator/cards/utils/CONFIG_CRADS.ts`   | Конфигурация раздела карт (имя файла содержит опечатку `CRADS`, но это рабочий импорт). |
| `administrator/cards/utils/getFilterLabel.ts` | Подписи фильтров.                                                                       |
| `src/store/useCardsStore.ts`                  | Zustand store карт: список, фильтры, поиск, пагинация.                                  |

### Контакты администратора

| Путь                             | Комментарий                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------ |
| `src/actions/getAdminContact.ts` | Server action: email и телефон пользователя с ролью `admin` (с fallback-значениями). |

### Общие админ-компоненты

Пагинация и выбор размера страницы вынесены в общий слой админки (ранее жили в CMS).

| Путь                                                | Комментарий                                                                         |
| --------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `administrator/_components/Pagination.tsx`          | Общая пагинация админ-списков. Заменяет удалённый `cms/_components/Pagination.tsx`. |
| `administrator/_components/ItemPerPageSelector.tsx` | Выбор размера страницы. Заменяет удалённый CMS-вариант.                             |

### Реструктуризация публичного API блога

Маршруты блога перенесены с `/api/blog/category/[category]/...` на плоскую схему `/api/blog/[category]/...`. Старые роуты `category/[category]/route.ts` и `category/[category]/[slug]/route.ts` удалены.

| Путь                                          | Комментарий                |
| --------------------------------------------- | -------------------------- |
| `src/app/api/blog/[category]/route.ts`        | Статьи категории блога.    |
| `src/app/api/blog/[category]/[slug]/route.ts` | Детальная статья блога.    |
| `src/app/api/blog/user/[id]/route.ts`         | Статьи конкретного автора. |
| `src/app/api/blog/categories/route.ts`        | Список категорий блога.    |
| `src/app/api/blog/search/route.ts`            | Поиск по статьям блога.    |

Комментарий: при изменениях комментариев начинайте с `commentsStore.ts`, `(blog)/.../comments/_components/Comments.tsx` и API `/api/comments`. Для модерации и банов смотрите `cms/comments` + `userBanActions.ts`. Поля `bannedUntil`/`bannedAt`/`rulesAcceptedAt` хранятся в коллекции `user` — учитывайте их при изменениях read-путей пользователя.

## Быстрый старт

| Команда                         | Комментарий                                                                                                                      |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                   | Запускает Next.js dev server. По умолчанию сайт доступен на `http://localhost:3000`.                                             |
| `npm run build`                 | Собирает production-версию приложения.                                                                                           |
| `npm run start`                 | Запускает собранное production-приложение.                                                                                       |
| `npm run lint`                  | Запускает ESLint. Перед сборкой лучше сначала выполнять эту команду.                                                             |
| `npm audit`                     | Проверяет зависимости на известные уязвимости. Сейчас audit должен возвращать `found 0 vulnerabilities`.                         |
| `npm run update-delivery-dates` | Дергает cron endpoint обновления дат доставки. В скрипте уже указан `secret`, но для окружений лучше использовать `CRON_SECRET`. |

Рекомендуемый порядок проверки перед сдачей изменений: `npm run lint`, затем `npm audit`, затем `npm run build`.

## Технологический стек

| Область           | Используется                                 | Комментарий                                                                            |
| ----------------- | -------------------------------------------- | -------------------------------------------------------------------------------------- |
| Фреймворк         | Next.js 16, React 19, TypeScript             | Приложение построено на App Router с route groups.                                     |
| Стили             | Tailwind CSS 4, shadcn, Radix UI             | Глобальные стили лежат в `src/app/globals.css`; UI-примитивы - в `src/components/ui`.  |
| Анимации и иконки | Framer Motion, motion, Lucide React          | Иконки лучше брать из `lucide-react`, если подходящая иконка уже есть.                 |
| Данные            | MongoDB, MongoDB driver, Mongoose            | Основные API routes используют общий helper `getDB()` из `src/lib/api-routes.ts`.      |
| Авторизация       | Better Auth, кастомная phone+password сессия | В проекте одновременно существуют две схемы сессий. Это важно при проверках доступа.   |
| State management  | Zustand, Redux Toolkit, React Context        | Корзина и auth - Zustand; заказы и чат - Redux Toolkit; product title - React Context. |
| Почта             | Resend, react-email                          | Почтовые интеграции завязаны на `RESEND_API_KEY`.                                      |
| Экспорт           | ExcelJS                                      | Используется в админке заказов для выгрузки в Excel.                                   |
| Уведомления       | React-Toastify                               | Общие toast helpers лежат в `src/lib/showToast.ts`.                                    |

## Комментарии по светлой и темной теме

Основная практика для этого проекта: не прописывать цвета прямо в компонентах, а использовать семантические токены из `src/app/globals.css`. Компонент должен говорить не "серый" или "оранжевый", а какую роль выполняет цвет: `bg-card`, `bg-surface`, `text-foreground`, `text-text-soft`, `border-border`, `bg-brand`, `bg-promo`, `bg-success`, `bg-warning`, `bg-danger`.

Для лаконичной светлой и темной темы важно держать одну визуальную систему:

1. Фоны строятся слоями: `background` для страницы, `surface` для секций, `card` для карточек и модалок, `surface-hover` для наведения.
2. Акцент используется дозированно: `brand` для основных действий и выбранных состояний, `promo` для коммерческих акцентов и рейтинга, статусы только через `success`, `warning`, `danger`.
3. Header и footer остаются на `site-chrome` токенах. Их структуру и тени лучше не менять без явной причины, чтобы не ломать узнаваемость сайта.
4. Существующие тени сохраняются, если они уже дают нужную глубину. При новых элементах лучше сначала использовать границу и слой фона, а тень добавлять только когда элемент должен визуально отделяться.
5. SVG-иконки должны брать цвет из `currentColor` или CSS-переменных (`var(--promo)`, `var(--text-soft)`, `var(--danger)`), а не из hex/rgb. Тогда они не становятся слишком яркими или слишком бледными при переключении темы.
6. Email-шаблоны можно оставлять с email-safe цветами, потому что почтовые клиенты хуже поддерживают CSS-переменные и темизацию.

Комментарий по внедрению: если появляется новый компонент, сначала проверьте, хватает ли существующих токенов. Новый токен стоит добавлять только для повторяющейся роли, а не под один конкретный блок.

## Переменные окружения

| Переменная              | Комментарий                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------- |
| `FOOD_DELIVERY_DB_URL`  | URL MongoDB. Для локальной разработки часто используется `mongodb://localhost:27017`. |
| `FOOD_DELIVERY_DB_NAME` | Имя базы данных. В проекте ожидается `deliveryshop`.                                  |
| `RESEND_API_KEY`        | Ключ Resend для отправки email.                                                       |
| `BETTER_AUTH_SECRET`    | Секрет Better Auth.                                                                   |
| `BETTER_AUTH_URL`       | Базовый URL Better Auth. Для dev обычно соответствует локальному адресу.              |
| `SMS_API_ID`            | Ключ SMS.ru. Сейчас SMS-отправка отключена, OTP выводится в консоль.                  |
| `CRON_SECRET`           | Секрет для `/api/cron/update-delivery-dates`.                                         |

## Важные настройки

Основные бизнес-настройки лежат в `config/config.ts`.

| Настройка                      |            Значение | Комментарий                                                 |
| ------------------------------ | ------------------: | ----------------------------------------------------------- |
| `ITEMS_PER_PAGE`               |                 `3` | Размер страницы для поиска и фильтрации товаров.            |
| `ITEMS_PER_PAGE_MAIN_PRODUCTS` |                 `4` | Количество товаров в главных блоках на витрине.             |
| `ITEMS_PER_PAGE_MAIN_ARTICLES` |                 `3` | Количество статей на главной странице.                      |
| `ITEMS_PER_PAGE_CATEGORY`      |                 `6` | Размер страницы категории каталога.                         |
| `ITEMS_PER_ORDERS_PAGE`        |                 `4` | Пагинация заказов пользователя.                             |
| `ARTICLES_PER_BLOG_PAGE`       |                 `3` | Пагинация блога.                                            |
| `COMMENTS_PER_ARTICLE_PAGE`    |                 `5` | Пагинация комментариев к статье.                            |
| `CARD_DISCOUNT_PERCENT`        |                 `6` | Скидка по карте лояльности.                                 |
| `BONUSES_PERCENT`              |                 `5` | Начисление бонусов от суммы заказа.                         |
| `MAX_BONUSES_PERCENT`          |                `10` | Максимальная часть заказа, которую можно оплатить бонусами. |
| `MIN_ORDER_PRICE`              |               `700` | Минимальная сумма заказа в рублях.                          |
| `TEMPORARY_EMAIL_DOMAIN`       | `@delivery-shop.ru` | Временный email для регистрации по телефону.                |
| `MAX_ATTEMPTS`                 |                 `3` | Максимум попыток ввода OTP.                                 |
| `TIMEOUT_PERIOD`               |               `180` | Время жизни OTP в секундах.                                 |
| `DEFAULT_PAGE_SIZE`            |                 `5` | Общий размер страницы для универсальных списков.            |

## Корневая структура

| Путь                      | Комментарий                                                                                                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`            | Скрипты проекта и зависимости.                                                                                                                                             |
| `tsconfig.json`           | Конфигурация TypeScript.                                                                                                                                                   |
| `next.config.ts`          | Конфигурация Next.js.                                                                                                                                                      |
| `eslint.config.mjs`       | Конфигурация ESLint. CommonJS configs/migrations исключены из `no-require-imports`; `react-hooks/set-state-in-effect` отключен как шумное правило для текущей архитектуры. |
| `tailwind.config.js`      | Дополнительная конфигурация Tailwind.                                                                                                                                      |
| `postcss.config.mjs`      | PostCSS-конфигурация для Tailwind CSS 4.                                                                                                                                   |
| `components.json`         | Конфигурация shadcn.                                                                                                                                                       |
| `INFO_SITE.md`            | Этот файл с обзором проекта.                                                                                                                                               |
| `migrate-mongo-config.js` | Конфигурация миграций MongoDB.                                                                                                                                             |
| `seed-db*.ts`             | Скрипты наполнения базы начальными данными.                                                                                                                                |

## `config/`

| Путь               | Комментарий                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| `config/config.ts` | Централизованные настройки пагинации, скидок, бонусов, OTP, минимальной суммы заказа и домена временных email. |

Комментарий: если меняется бизнес-логика скидок, бонусов или пагинации, сначала проверьте, не достаточно ли изменить `CONFIG`, а не размазывать новые числа по компонентам.

## `migrations/`

| Путь                         | Комментарий                            |
| ---------------------------- | -------------------------------------- |
| `20260218115601-articles.js` | Миграция для коллекции статей.         |
| `20260218130417-users.js`    | Миграция для коллекции пользователей.  |
| `20260220173627-products.js` | Миграция для коллекции товаров.        |
| `articlesData.json`          | Начальные данные статей.               |
| `usersData.json`             | Начальные данные пользователей.        |
| `productsData.json`          | Начальные данные товаров.              |
| `catalogData.json`           | Начальные данные каталога и категорий. |

## `public/`

| Путь                                  | Комментарий                                                                           |
| ------------------------------------- | ------------------------------------------------------------------------------------- |
| `public/robots.txt`                   | Правила индексации для поисковых роботов.                                             |
| `public/og-image.jpeg`                | Изображение для Open Graph.                                                           |
| `public/web-app-manifest-192x192.png` | Иконка PWA manifest.                                                                  |
| `public/images/products/`             | Изображения товаров.                                                                  |
| `public/images/categories/`           | Изображения категорий.                                                                |
| `public/images/graphics/`             | Слайдеры, фоны, дефолтные аватары и графика.                                          |
| `public/images/banners/`              | Баннеры для промо-блоков.                                                             |
| `public/images/articles/`             | Изображения статей.                                                                   |
| `public/temp/`                        | Временные изображения HTML/Tiptap-редактора статей до сохранения статьи.              |
| `public/uploads/articles/`            | Постоянные изображения, которые переносятся из `public/temp` после сохранения статьи. |
| `public/blogCategories/`              | Загруженные изображения категорий блога/CMS.                                          |
| `public/icons-footer/`                | SVG-иконки футера.                                                                    |
| `public/icons-orders/`                | SVG-иконки статусов и действий по заказам.                                            |

Комментарий: временные картинки редактора статей доступны как `/temp/...`. После сохранения статьи `processArticleImages.ts` переносит их в `public/uploads/articles` и заменяет URL на `/uploads/articles/...`. Не смешивайте временные и постоянные загрузки без явной причины.

## `src/app/` - маршруты и layouts

| Путь                    | Комментарий                                                                     |
| ----------------------- | ------------------------------------------------------------------------------- |
| `src/app/layout.tsx`    | Корневой layout приложения. Подключает базовые провайдеры и глобальную обвязку. |
| `src/app/provider.tsx`  | Redux Provider.                                                                 |
| `src/app/globals.css`   | Глобальные стили, Tailwind CSS 4, темы и базовые анимации.                      |
| `src/app/manifest.json` | PWA manifest.                                                                   |
| `src/app/sitemap.ts`    | Генерация sitemap.                                                              |
| `src/app/favicon.ico`   | Иконка сайта.                                                                   |

### `src/app/contexts/`

| Путь                 | Комментарий                                                          |
| -------------------- | -------------------------------------------------------------------- |
| `ProductContext.tsx` | Контекст заголовка товара. Используется в product page и SEO-логике. |
| `RegFormContext.tsx` | Состояние регистрационной формы и сброс начальных данных.            |

## Route groups в `src/app/(root)/`

| Группа           | Комментарий                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| `(root)`         | Общая публичная обвязка сайта: header, breadcrumbs, footer и главная страница.        |
| `(admin)`        | Админ-панель, управление пользователями, заказами, временем доставки, товарами и CMS. |
| `(auth)`         | Login, registration, OTP, reset password и общие auth-компоненты.                     |
| `(cart)`         | Корзина, оформление заказа, выбор адреса, времени доставки и оплаты.                  |
| `(catalog)`      | Каталог, категории, карточка товара, отзывы, похожие товары.                          |
| `(articles)`     | Старый публичный блок статей и карточки для главной.                                  |
| `(blog)`         | Новый публичный блог: список категорий, страницы категорий и детальные статьи.        |
| `(products)`     | Подборки товаров: акции, новинки и общие product sections.                            |
| `(search)`       | Страница результатов поиска.                                                          |
| `(user)`         | Избранное и покупки пользователя.                                                     |
| `(user-orders)`  | История заказов и повтор заказа.                                                      |
| `(user-profile)` | Профиль, безопасность, email, телефон, адрес, удаление аккаунта.                      |
| `(payment)`      | Модальные окна успешной и тестовой оплаты.                                            |

## Главная публичная часть

| Путь                                        | Комментарий                                                                                                                   |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `src/app/(root)/layout.tsx`                 | Layout публичной части с header, breadcrumbs и footer.                                                                        |
| `src/app/(root)/page.tsx`                   | Главная страница.                                                                                                             |
| `src/components/layout/header/`             | Header, top menu, profile menu, поиск и выпадающий каталог.                                                                   |
| `src/components/layout/footer/Footer.tsx`   | Footer сайта.                                                                                                                 |
| `src/components/features/slider/`           | Слайдер на главной.                                                                                                           |
| `src/components/features/SpacialOffers.tsx` | Блок специальных предложений. Название файла содержит опечатку `Spacial`, но сейчас это существующий импортируемый компонент. |
| `src/components/features/Maps.tsx`          | Карты магазинов через Yandex Maps.                                                                                            |

## Админ-панель

| Путь                                              | Комментарий                                                    |
| ------------------------------------------------- | -------------------------------------------------------------- |
| `src/app/(root)/(admin)/administrator/page.tsx`   | Главная страница админки.                                      |
| `src/app/(root)/(admin)/administrator/layout.tsx` | Layout админки. Проверяет роль `admin` или `manager`.          |
| `src/app/(root)/(admin)/administrator/styles.ts`  | Общие стили админ-страниц.                                     |
| `administrator/users-list/`                       | Управление пользователями: фильтры, таблица, роли, пагинация.  |
| `administrator/admin-orders/`                     | Управление заказами, календарь, статусы, чат, экспорт в Excel. |
| `administrator/delivery-times/`                   | Управление слотами доставки.                                   |
| `administrator/products/`                         | Добавление, редактирование, поиск и удаление товаров.          |

Комментарий: менеджер и администратор имеют доступ к админке, но отдельные экраны и действия могут проверять роль точечно. При добавлении новой админской функции проверяйте both UI access и API access.

## CMS в админке

CMS находится в `src/app/(root)/(admin)/administrator/(cms)/cms/`.

| Путь                                                 | Комментарий                                                                                     |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `cms/page.tsx`                                       | Главная страница CMS.                                                                           |
| `cms/layout.tsx`                                     | Layout CMS-раздела.                                                                             |
| `cms/CONFIG_BLOG.ts`                                 | Конфигурация CMS/блога.                                                                         |
| `cms/_components/`                                   | Dashboard cards, header, pagination, SEO recommendations, stats и skeleton states.              |
| `cms/categories/page.tsx`                            | Управление категориями.                                                                         |
| `cms/categories/_components/`                        | Форма категории, таблица, drag-and-drop, поиск, фильтры, статистика, desktop/mobile карточки.   |
| `cms/semantic-core/page.tsx`                         | Управление SEO/семантическим ядром и настройками сайта.                                         |
| `cms/semantic-core/_components/`                     | SEOForm, CurrentSettings, FormField и кнопки формы.                                             |
| `cms/sidebarMenu/`                                   | Компоненты бокового меню CMS.                                                                   |
| `cms/hooks/`                                         | Хуки категорий, формы категории, настроек сайта и статистики.                                   |
| `cms/types/`                                         | Типы моделей, таблиц, форм, UI, DnD, dashboard и sidebar.                                       |
| `cms/utils/`                                         | SEO limits, рекомендации, dashboard cards, menu items, статистика, цвета, сортировка и фильтры. |
| `cms/api/categories/route.ts`                        | API списка и создания категорий CMS.                                                            |
| `cms/api/categories/[id]/route.ts`                   | API конкретной категории.                                                                       |
| `cms/api/categories/reorder/route.ts`                | API сохранения порядка категорий.                                                               |
| `cms/api/categories/upload/route.ts`                 | API загрузки изображений категорий.                                                             |
| `cms/api/site-settings/route.ts`                     | API настроек сайта и SEO.                                                                       |
| `cms/articles/page.tsx`                              | Входная страница CMS-статей.                                                                    |
| `cms/articles/editor/page.tsx`                       | Страница создания/редактирования статьи.                                                        |
| `cms/articles/editor/_components/`                   | Форма статьи, выбор категории, submit-блок и Tiptap/HTML-редактор.                              |
| `cms/articles/editor/_components/tiptap-components/` | Панели форматирования, таблицы, списки, изображения, HTML-редактор и модалки предпросмотра.     |
| `cms/articles/editor/_components/css/`               | Стили редактора: таблицы, изображения, предпросмотр HTML, модалки и тулбар.                     |
| `cms/articles/articlesManagement/page.tsx`           | Управление списком статей: фильтры, поиск, сортировка, reorder, desktop/mobile отображение.     |
| `cms/articles/articlesManagement/_components/`       | Таблица, строки, карточки, advanced filters, search bar, stats и empty state.                   |
| `cms/articles/hooks/`                                | Хуки формы статьи, списка статей, загрузки изображений и порядка тулбара.                       |
| `cms/articles/utils/`                                | Конфиг тулбара, цвета, размеры шрифта, загрузка и перенос изображений статьи.                   |
| `cms/api/articles/route.ts`                          | API создания и получения CMS-статей.                                                            |
| `cms/api/articles/upload/temp-image/route.ts`        | Загрузка временной картинки статьи в `public/temp`.                                             |
| `cms/api/articles/upload/route.ts`                   | Загрузка постоянной картинки статьи в `public/uploads/articles`.                                |
| `cms/api/articles/articles-management/*`             | API списка, статусов, featured, reorder и операций над статьями в менеджере статей.             |

Комментарий: в CMS сейчас много логики разделено на маленькие компоненты и типы. При изменениях категорий начинайте с `useCategories.ts`, `categoryStore.ts`, `CategoryTable.tsx` и API `cms/api/categories`. При изменениях статей сначала смотрите `cms/articles/editor`, `cms/articles/articlesManagement` и API `cms/api/articles`.

## Авторизация

| Путь                                      | Комментарий                                                                                           |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `src/lib/auth.ts`                         | Настройка Better Auth, phone plugin, admin plugin, email/password и дополнительные поля пользователя. |
| `src/lib/auth-client.ts`                  | Клиент Better Auth с `phoneNumberClient`.                                                             |
| `utils/getServerUserId.ts`                | Унифицированное получение user id на сервере. Проверяет Better Auth и кастомную сессию.               |
| `utils/auth-helpers.ts`                   | Helper-функции для Better Auth session и кастомного `session` cookie.                                 |
| `src/store/authStore.ts`                  | Zustand-состояние авторизации на клиенте.                                                             |
| `src/proxy.ts`                            | Middleware/Proxy для защиты маршрутов и редиректов.                                                   |
| `src/app/api/auth/[...all]/route.ts`      | Better Auth proxy route.                                                                              |
| `src/app/api/auth/login/route.ts`         | Кастомный вход по телефону и паролю.                                                                  |
| `src/app/api/auth/check-session/route.ts` | Проверка текущей сессии.                                                                              |
| `src/app/api/auth/logout/route.ts`        | Выход из Better Auth и кастомной сессии.                                                              |

Комментарии по auth:

1. В проекте есть две схемы сессий: `better-auth.session_token` и кастомная cookie `session`.
2. Регистрация по телефону использует временный email вида `phoneNumber@delivery-shop.ru`.
3. OTP сейчас не отправляется через SMS, а выводится в консоль в `src/lib/auth.ts`.
4. При добавлении server-side проверки пользователя используйте `getServerUserId()`, если нужно поддержать обе схемы авторизации.

## Корзина и заказы

| Путь                                               | Комментарий                                                                            |
| -------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `src/store/cartStore.ts`                           | Zustand store корзины: товары, суммы, загрузка, очистка.                               |
| `src/actions/addToCartActions.ts`                  | Server action для добавления товаров в корзину.                                        |
| `src/actions/orderActions.ts`                      | Server actions для заказов.                                                            |
| `src/app/(root)/(cart)/cart/page.tsx`              | Страница корзины.                                                                      |
| `src/app/(root)/(cart)/cart/_components/`          | Компоненты корзины: товары, summary, checkout, адрес, время, оплата, бонусы, skeleton. |
| `src/app/api/cart/route.ts`                        | API корзины.                                                                           |
| `src/app/api/orders/route.ts`                      | Создание и получение заказов.                                                          |
| `src/app/api/orders/update-status/route.ts`        | Изменение статуса заказа.                                                              |
| `src/app/api/orders/update-after-payment/route.ts` | Обновление заказа после оплаты.                                                        |
| `src/app/api/orders/clear-cart/route.ts`           | Очистка корзины после заказа.                                                          |

Комментарий: для администраторов и менеджеров корзина очищается в `src/store/StatesProvider.tsx`, потому что эти роли не оформляют заказы как покупатели.

## Каталог и товары

| Путь                                                                            | Комментарий                                                                             |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `src/app/(root)/(catalog)/catalog/page.tsx`                                     | Главная страница каталога.                                                              |
| `src/app/(root)/(catalog)/CatalogPage.tsx`                                      | Обертка каталога с фильтрами и состояниями.                                             |
| `src/app/(root)/(catalog)/CatalogGrid.tsx`                                      | Сетка категорий/товаров каталога.                                                       |
| `src/app/(root)/(catalog)/GridCategoryBlock.tsx`                                | Блок категории в сетке.                                                                 |
| `src/app/(root)/(catalog)/catalog/[category]/page.tsx`                          | Страница категории.                                                                     |
| `src/app/(root)/(catalog)/catalog/[category]/fetchCategory.ts`                  | Загрузка данных категории.                                                              |
| `src/app/(root)/(catalog)/catalog/[category]/(productPage)/[slug]/page.tsx`     | Страница товара.                                                                        |
| `src/app/(root)/(catalog)/catalog/[category]/(productPage)/getProduct.ts`       | Загрузка товара.                                                                        |
| `src/app/(root)/(catalog)/catalog/[category]/(productPage)/[slug]/_components/` | Карточка товара, изображения, отзывы, рейтинг, похожие товары, кнопка корзины, sharing. |
| `src/app/api/catalog/route.ts`                                                  | API каталога.                                                                           |
| `src/app/api/category/route.ts`                                                 | API категории.                                                                          |
| `src/app/api/products/route.ts`                                                 | API списка товаров.                                                                     |
| `src/app/api/products/[id]/route.ts`                                            | API товара по ID.                                                                       |
| `src/app/api/products/[id]/reviews/route.ts`                                    | API отзывов товара.                                                                     |
| `src/app/api/products/brand/route.ts`                                           | Фильтрация по бренду.                                                                   |
| `src/app/api/products/similar-products/route.ts`                                | Похожие товары.                                                                         |
| `src/app/api/add-product/route.ts`                                              | Добавление товара из админки.                                                           |
| `src/app/api/update-product/route.ts`                                           | Обновление товара.                                                                      |
| `src/app/api/delete-product/route.ts`                                           | Удаление товара.                                                                        |
| `src/app/api/upload-image/route.ts`                                             | Загрузка изображений товара.                                                            |

## Поиск

| Путь                                           | Комментарий                                                |
| ---------------------------------------------- | ---------------------------------------------------------- |
| `src/app/(root)/(search)/search/page.tsx`      | Страница результатов поиска.                               |
| `src/components/layout/header/SearchBlock.tsx` | Обертка поиска в header.                                   |
| `src/components/layout/header/inputSearch/`    | Search input, dropdown результатов и подсветка совпадений. |
| `src/app/api/search/route.ts`                  | Простой search fallback.                                   |
| `src/app/api/search-full/route.ts`             | Полнотекстовый поиск.                                      |
| `src/app/api/search-products/route.ts`         | Поиск товаров.                                             |

## Пользовательские разделы

| Путь                                                    | Комментарий                                                             |
| ------------------------------------------------------- | ----------------------------------------------------------------------- |
| `src/app/(root)/(user-profile)/user-profile/page.tsx`   | Профиль пользователя.                                                   |
| `src/app/(root)/(user-profile)/_components/`            | Аватар, email, телефон, пароль, адрес, безопасность, удаление аккаунта. |
| `src/app/(root)/(user-profile)/goodbye/page.tsx`        | Страница после удаления аккаунта.                                       |
| `src/app/(root)/(user-orders)/user-orders/page.tsx`     | История заказов.                                                        |
| `src/app/(root)/(user-orders)/user-orders/_components/` | Карточки заказов, повтор заказа, предупреждения, выбор даты доставки.   |
| `src/app/(root)/(user)/favorites/page.tsx`              | Избранные товары.                                                       |
| `src/app/(root)/(user)/purchases/page.tsx`              | Покупки пользователя.                                                   |
| `src/app/api/users/favorites/route.ts`                  | Добавление и удаление избранного.                                       |
| `src/app/api/users/favorites/products/route.ts`         | Получение товаров из избранного.                                        |
| `src/app/api/users/purchases/route.ts`                  | История покупок.                                                        |
| `src/app/api/users/update-card/route.ts`                | Обновление карты лояльности.                                            |

## Статьи

| Путь                                                               | Комментарий                                                                             |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `src/app/(root)/(articles)/articles/page.tsx`                      | Старый публичный список статей.                                                         |
| `src/app/(root)/(articles)/Articles.tsx`                           | Компонент отображения списка статей на старом маршруте.                                 |
| `src/app/(root)/(articles)/ArticleCard.tsx`                        | Карточка статьи для главной и публичных подборок; должна переживать пустые поля автора. |
| `src/app/(root)/(articles)/ArticlesSection.tsx`                    | Блок статей на главной.                                                                 |
| `src/app/(root)/(articles)/fetchArticles.ts`                       | Загрузка статей для старого публичного блока.                                           |
| `src/app/(root)/(blog)/blog/page.tsx`                              | Главная страница блога с поиском и ссылкой на категории.                                |
| `src/app/(root)/(blog)/blog/BlogSearch.tsx`                        | Поиск по статьям блога с темизированными стилями.                                       |
| `src/app/(root)/(blog)/blog/categories/`                           | Страница всех категорий блога, sidebar, карточки, анимации и helpers.                   |
| `src/app/(root)/(blog)/blog/[category]/page.tsx`                   | Страница категории блога со списком опубликованных статей.                              |
| `src/app/(root)/(blog)/blog/[category]/_components/`               | Header категории, изображение, статистика, список статей и empty state.                 |
| `src/app/(root)/(blog)/blog/[category]/utils/`                     | Получение категории, статьи и связанных статей.                                         |
| `src/app/(root)/(blog)/blog/[category]/[slug]/page.tsx`            | Детальная страница статьи блога.                                                        |
| `src/app/(root)/(blog)/blog/[category]/[slug]/_components/`        | Заголовок, meta, автор, изображение, контент, edit-link и archive notice.               |
| `src/app/(root)/(blog)/blog/[category]/[slug]/css/page.module.css` | CSS для HTML-контента статьи, включая таблицы и обтекание изображений.                  |
| `src/app/api/articles/route.ts`                                    | Публичный API статей.                                                                   |

## Оплата

| Путь                                               | Комментарий                                                      |
| -------------------------------------------------- | ---------------------------------------------------------------- |
| `src/app/(root)/(payment)/FakePaymentModal.tsx`    | Тестовое окно оплаты. Реальный платежный провайдер не подключен. |
| `src/app/(root)/(payment)/PaymentSuccessModal.tsx` | Модальное окно успешной оплаты.                                  |

Комментарий: платежная логика сейчас mock-based. Перед подключением реального провайдера нужно отдельно проверить статусы заказа, повторные callbacks и защиту от повторного списания.

## API routes

| Группа      | Основные маршруты                                                                   | Комментарий                                                                                                |
| ----------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Auth        | `/api/auth/*`                                                                       | Better Auth, кастомный login/logout, avatar, reset password, update email/phone/location.                  |
| Cart        | `/api/cart`                                                                         | Получение и обновление корзины.                                                                            |
| Orders      | `/api/orders/*`                                                                     | Создание заказа, смена статуса, обновление после оплаты, очистка корзины.                                  |
| Admin users | `/api/admin/users/*`                                                                | Пользователи, роли, заказы пользователей.                                                                  |
| Admin chat  | `/api/admin/chat/*`                                                                 | Чат по заказам, read/unread state.                                                                         |
| Catalog     | `/api/catalog`, `/api/category`                                                     | Каталог и категории.                                                                                       |
| Products    | `/api/products/*`, `/api/add-product`, `/api/update-product`, `/api/delete-product` | Товары, отзывы, бренды, похожие товары и CRUD админки.                                                     |
| Search      | `/api/search`, `/api/search-full`, `/api/search-products`                           | Поиск по сайту и товарам.                                                                                  |
| Articles    | `/api/articles`, CMS `/cms/api/articles/*`                                          | Публичное чтение статей и CMS CRUD/менеджер статей.                                                        |
| Users       | `/api/users/*`                                                                      | Избранное, покупки, карта лояльности.                                                                      |
| Delivery    | `/api/delivery-times`                                                               | Слоты доставки.                                                                                            |
| Cron        | `/api/cron/update-delivery-dates`                                                   | Обновление дат доставки, требуется `secret`.                                                               |
| Sitemap     | `/api/sitemap-data`                                                                 | Данные для sitemap.                                                                                        |
| Upload      | `/api/upload-image`, `/api/uploads/[...path]`, CMS upload routes                    | Загрузка товаров, fallback старых uploads и изображения статей из `public/temp`/`public/uploads/articles`. |

## `src/components/`

| Путь                                        | Комментарий                                                                                   |
| ------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `src/components/features/common/`           | Breadcrumbs, ErrorComponent, loader, providers. В `providers.tsx` подключен `ToastContainer`. |
| `src/components/features/slider/`           | Компоненты слайдера главной страницы.                                                         |
| `src/components/features/Maps.tsx`          | Карта магазинов.                                                                              |
| `src/components/features/SpacialOffers.tsx` | Блок спецпредложений.                                                                         |
| `src/components/layout/header/`             | Header, меню, профиль, поиск и выпадающий каталог.                                            |
| `src/components/layout/footer/`             | Footer сайта.                                                                                 |
| `src/components/shared/`                    | ProductCard, AddToCartButton, FavoriteButton, Pagination, GenericListPage и общие фильтры.    |
| `src/components/shared/filterComponents/`   | PriceFilter, PriceRangeSlider, DropFilter, кнопки фильтров и controls.                        |
| `src/components/ui/`                        | UI-примитивы и тема.                                                                          |
| `src/components/svg/`                       | Локальные SVG React-компоненты.                                                               |

Комментарий: для новых общих компонентов сначала проверьте `shared` и `ui`. Если компонент привязан к конкретному экрану, лучше держать его рядом с route group в `_components`.

## `src/store/`

| Путь                               | Комментарий                                    |
| ---------------------------------- | ---------------------------------------------- |
| `src/store/cartStore.ts`           | Zustand store корзины.                         |
| `src/store/authStore.ts`           | Zustand store авторизации.                     |
| `src/store/categoryStore.ts`       | Store категорий CMS.                           |
| `src/store/StatesProvider.tsx`     | Клиентская инициализация глобальных состояний. |
| `src/store/redux/index.ts`         | Конфигурация Redux store.                      |
| `src/store/redux/api/ordersApi.ts` | RTK Query/API slice заказов.                   |
| `src/store/redux/api/chatApi.ts`   | RTK Query/API slice чата.                      |

## `src/hooks/`

| Путь                      | Комментарий                                           |
| ------------------------- | ----------------------------------------------------- |
| `useFavorite.ts`          | Управление избранными товарами.                       |
| `useAvatar.ts`            | Загрузка и получение аватара.                         |
| `useTimer.ts`             | Таймер обратного отсчета.                             |
| `usePriceComparison.ts`   | Сравнение цен при повторе заказа.                     |
| `useOrderProductsData.ts` | Получение данных товаров заказа.                      |
| `userOrderProducts.ts`    | Данные товаров пользовательского заказа.              |
| `userOrderPricing.ts`     | Расчеты стоимости пользовательского заказа.           |
| `useDeliveryData.ts`      | Получение данных доставки.                            |
| `useDeliverySchedule.ts`  | Работа с расписанием доставки.                        |
| `useRepeatOrder.ts`       | Повтор заказа.                                        |
| `usePricing.ts`           | Расчеты корзины, скидок, бонусов и минимальной суммы. |
| `redux.ts`                | Типизированные Redux hooks.                           |

Комментарий: в папках `api`, `hooks` и `utils` у файлов есть короткий верхний блок `// Назначение` и `// Как работает`. Это рабочая подсказка для разработчика, а не место для длинной документации.

## `src/lib/`

| Путь             | Комментарий                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------- |
| `auth.ts`        | Server-side Better Auth config, Mongo adapter, phone OTP, admin plugin, email templates. |
| `auth-client.ts` | Client-side Better Auth client.                                                          |
| `api-routes.ts`  | Helper `getDB()` с singleton MongoClient.                                                |
| `showToast.ts`   | Общие helpers уведомлений: `showToast` и `showPromiseToast` на базе React-Toastify.      |
| `utils.ts`       | `cn()` для merge классов через `clsx` и `tailwind-merge`.                                |

Комментарий: API routes должны использовать `getDB()` вместо создания нового `MongoClient` в каждом обработчике. Для новых уведомлений используйте `showToast()` или `showPromiseToast()`, а не прямые вызовы `toast.*` в компонентах.

## `src/types/`

| Группа                                                            | Комментарий                                        |
| ----------------------------------------------------------------- | -------------------------------------------------- |
| `product.ts`, `cart.ts`, `order.ts`, `userOrder.ts`               | Основные доменные типы товаров, корзины и заказов. |
| `userData.ts`, `regFormData.ts`                                   | Типы пользователя и регистрации.                   |
| `catalog.ts`, `categories.ts`, `categoryBlockProps.ts`            | Типы каталога и категорий.                         |
| `articles.ts`, `articlesSections.ts`                              | Типы статей и секций статей.                       |
| `deliverySchedule.ts`, `availableDate.ts`                         | Типы расписания доставки.                          |
| `filterState.ts`, `paginationProps.ts`, `genericListPageProps.ts` | Типы фильтров, пагинации и универсальных списков.  |
| `pricingProps.ts`, `payment.ts`                                   | Типы расчетов стоимости и оплаты.                  |
| `excel.ts`, `chat.ts`, `reduxApi.ts`, `storeStates.ts`            | Типы админских выгрузок, чата, Redux API и stores. |
| `sitemap.ts`, `searchProduct.ts`, `shops.ts`, `errorProps.ts`     | SEO, поиск, магазины и ошибки.                     |

## `utils/`

| Путь                                                                                    | Комментарий                                                                |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `getServerUserId.ts`                                                                    | Получение user id из Better Auth или кастомной сессии.                     |
| `auth-helpers.ts`                                                                       | Проверка и получение сессий.                                               |
| `deleteUserAvatar.ts`, `getAvatar.ts`, `avatarUtils.ts`, `optimizeImage.ts`             | Работа с аватарами и изображениями.                                        |
| `formatPrice.ts`, `formatWeight.ts`, `formatDateToLocalYYYYMMDD.ts`, `getWordEnding.ts` | Форматирование отображаемых значений.                                      |
| `calcPrices.ts`                                                                         | Расчеты цены, скидки и цены по карте.                                      |
| `baseUrl.ts`                                                                            | Получение базового URL для API.                                            |
| `createSlug.ts`, `transliterate.ts`, `translations.ts`                                  | Slug, транслитерация и переводы URL-сегментов.                             |
| `getSitemapData.ts`, `generateSiteMetadata.ts`, `getSiteMetadata.ts`                    | SEO metadata и sitemap.                                                    |
| `shuffleArray.ts`, `debounce.ts`, `generatePassword.ts`                                 | Общие утилиты.                                                             |
| `proxy-redirects.ts`                                                                    | Редиректы старых маршрутов.                                                |
| `validation/`                                                                           | Валидация форм, пароля, карты профиля и даты рождения.                     |
| `admin/`                                                                                | Утилиты админки: дни рождения, возраст, короткий ID, маска телефона, роли. |

## Данные

| Путь                                  | Комментарий                                 |
| ------------------------------------- | ------------------------------------------- |
| `src/data/city.ts`                    | Список городов.                             |
| `src/data/regions.ts`                 | Список регионов.                            |
| `src/data/locations.ts`               | Адресные данные.                            |
| `src/data/columnsUsersList.ts`        | Конфигурация колонок таблицы пользователей. |
| `src/constants/RegFormData.ts`        | Начальные данные формы регистрации.         |
| `src/constants/addProductFormData.ts` | Конфигурация формы добавления товара.       |

## Практические комментарии для разработки

1. Если нужно получить текущего пользователя на сервере, используйте `getServerUserId()` или существующие auth helpers. Это снижает риск забыть одну из двух сессионных схем.
2. Если меняете роли или доступы, проверяйте `src/proxy.ts`, layout админки и API route, потому что UI-защиты недостаточно.
3. Если меняете корзину, проверяйте `cartStore.ts`, `/api/cart`, `usePricing.ts` и server actions. Там распределена логика количества, цены, скидок и бонусов.
4. Если меняете повтор заказа, смотрите `useRepeatOrder.ts`, `usePriceComparison.ts`, компоненты `user-orders` и API заказов.
5. Если меняете каталог или карточку товара, проверьте API товара, типы `src/types/product.ts`, общую карточку `ProductCard.tsx` и product page components.
6. Если меняете CMS категории, проверьте `categoryStore.ts`, `cms/hooks/useCategories.ts`, `cms/categories/_components/*` и CMS API routes.
7. Если меняете CMS статьи, проверяйте `cms/articles/editor`, `cms/articles/articlesManagement`, `cms/api/articles/*` и `processArticleImages.ts`.
8. Если добавляете изображения в редактор статьи, временные файлы должны идти в `public/temp`, а после сохранения статьи - в `public/uploads/articles`.
9. Если меняете публичный блог, проверяйте сразу `/blog`, `/blog/categories`, `/blog/[category]`, `/blog/[category]/[slug]` и CSS HTML-контента статьи.
10. Если меняете SEO, проверьте `src/app/sitemap.ts`, `/api/sitemap-data`, `utils/getSitemapData.ts`, CMS `semantic-core` и site metadata helpers.
11. Если включаете реальную SMS-отправку, раскомментируйте/обновите `sendOTP` в `src/lib/auth.ts` и проверьте `SMS_API_ID`.
12. Если подключаете реальную оплату, не полагайтесь на текущий `FakePaymentModal`; нужна отдельная серверная валидация платежа и идемпотентность callbacks.
13. Если добавляете уведомление, используйте `src/lib/showToast.ts`. Для фоновых async-действий предпочтителен `showPromiseToast()` с состояниями `pending`, `success`, `error`.
14. Если меняете Excel-выгрузку, используйте `exceljs`. Пакет `xlsx` удален из зависимостей из-за advisory и отсутствия использования.

## Известные особенности

| Особенность             | Комментарий                                                                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Две auth-системы        | Better Auth и кастомная phone+password сессия живут параллельно.                                                                    |
| Временные email         | Для phone registration используется домен `@delivery-shop.ru`.                                                                      |
| OTP в консоли           | SMS отправка отключена, код пишется в server console.                                                                               |
| Mock payment            | Оплата имитируется, реального платежного провайдера нет.                                                                            |
| Admin/manager           | Обе роли видят админку, но бизнес-доступы могут различаться.                                                                        |
| Mongo singleton         | Для API routes используется общий `MongoClient` через `getDB()`.                                                                    |
| CMS активно развивается | В CMS есть новые компоненты фильтрации, сортировки и reorder категорий.                                                             |
| Blog route migration    | В проекте есть старый `(articles)` и новый `(blog)/blog`; перед удалением старого маршрута проверьте главную страницу и SEO-ссылки. |
| Article image storage   | Временные изображения статей лежат в `public/temp`, постоянные - в `public/uploads/articles`.                                       |
| Toast notifications     | Уведомления централизованы через React-Toastify и helpers в `src/lib/showToast.ts`.                                                 |
| Excel export            | Выгрузка заказов работает через ExcelJS; зависимость `xlsx` не используется.                                                        |

## Проверка после изменений

Минимальная проверка:

```bash
npm run lint
npm audit
npm run build
```

Для ручной проверки:

```bash
npm run dev
```

Затем открыть `http://localhost:3000` и пройти затронутый сценарий: каталог, корзина, заказ, профиль, админка или CMS.
