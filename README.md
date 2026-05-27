# Delivery Shop

Full-stack приложение для доставки еды: витрина с каталогом, корзиной и заказами, личный кабинет пользователя, админ-панель и CMS для управления категориями, товарами, заказами и SEO.

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4, shadcn/Radix UI, Lucide Icons, Framer Motion
- MongoDB, Better Auth
- Zustand, Redux Toolkit, React Context
- React Email, Resend

## Features

- Каталог с категориями, поиском, фильтрами, карточками товаров и страницами продукта.
- Корзина, оформление заказа, бонусы, минимальная сумма заказа и выбор времени доставки.
- Авторизация по email/паролю и телефону, профиль, история заказов, избранное и покупки.
- Админка для товаров, пользователей, заказов, календаря заказов и слотов доставки.
- CMS для категорий: сортировка, изображения, SEO-поля, рекомендации и пагинация.
- Email-шаблоны для подтверждений, восстановления пароля и смены email.
- Cron endpoint для обновления доступных дат доставки.

## Quick Start

```bash
npm install
npm run dev
```

Dev server: `http://localhost:3000`

## Scripts

```bash
npm run dev                    # development server
npm run build                  # production build
npm run start                  # start production server
npm run lint                   # ESLint
npm run update-delivery-dates  # call delivery dates cron endpoint
```

## Environment

Проект ожидает следующие переменные окружения:

```env
FOOD_DELIVERY_DB_URL=
FOOD_DELIVERY_DB_NAME=
RESEND_API_KEY=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
SMS_API_ID=
CRON_SECRET=
```

Для локальной MongoDB обычно используется база `deliveryshop`.

## Project Structure

```text
src/app/                 routes, layouts, API routes
src/actions/             server actions
src/components/          shared UI and layout components
src/contexts/            React contexts
src/hooks/               reusable hooks
src/lib/                 auth, db and utility code
src/store/               Zustand and Redux state
src/types/               shared TypeScript types
src/data/                static app data
```

## Build

```bash
npm run lint
npm run build
```
