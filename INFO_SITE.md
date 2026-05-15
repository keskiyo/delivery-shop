# Delivery Shop Project Structure Documentation

## Project Overview

This is a Next.js 16 food delivery e-commerce application built with MongoDB, better-auth for authentication, Zustand/Redux for state management, and Tailwind CSS v4 for styling. The app features product catalog, shopping cart, order management, user profiles, and admin panel.

## Directory Structure

### Root Level Files

| File | Description |
|------|-------------|
| `package.json` | Project dependencies and scripts (npm run dev, build, lint) |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.js` | Tailwind CSS configuration |
| `.env` | Environment variables (DB URL, API keys, secrets) |
| `AGENTS.md` | Agent instructions for OpenCode sessions |

---

### config/ - Configuration Files

| File | Description |
|------|-------------|
| **config.ts** | Application configuration constants: pagination sizes, discount percentages, bonus rates, min order price, site URLs, OTP settings |

---

### migrations/ - Database Migrations

| File | Description |
|------|-------------|
| **20260218115601-articles.js** | MongoDB migration for articles collection |
| **20260218130417-users.js** | MongoDB migration for users collection |
| **20260220173627-products.js** | MongoDB migration for products collection |
| **articlesData.json** | Initial articles data for seeding |
| **usersData.json** | Initial users data for seeding |
| **productsData.json** | Initial products data for seeding |
| **catalogData.json** | Initial catalog/categories data for seeding |

---

### public/ - Static Assets

| Path | Description |
|------|-------------|
| **robots.txt** | SEO robots rules |
| **web-app-manifest-192x192.png** | PWA manifest icon (192x192) |
| **web-app-manifest-512x512.png** | PWA manifest icon (512x512) |
| **images/products/** | Product images (130+ JPG files: img-1.jpeg through img-127.jpeg) |
| **images/categories/** | Category icons (13 PNG files: img-1.png through img-13.png) |
| **images/graphics/** | Graphic assets: banners (slide-1.jpeg, slide-2.jpeg), patterns, default avatars |
| **images/banners/** | Banner images |
| **images/articles/** | Article images |
| **icons-footer/** | Footer icons (SVG): instargam.svg, OK.svg, phone.svg, telegram.svg, VK.svg, wa.svg |
| **icons-orders/** | Order status icons (SVG): icon-alert-circle.svg, icon-alert-triangle.svg, icon-arrow.svg, icon-bag.svg, icon-check-circle.svg, icon-check.svg, icon-clock.svg, icon-delivery.svg, icon-home.svg, icon-message-empty.svg, icon-message.svg, icon-phone.svg, icon-upload.svg |
| **images/icon-arrow.svg** | Arrow icon |

---

### src/ - Source Code

---

#### src/actions/ - Server Actions (Next.js)

| File | Description |
|------|-------------|
| **addToCartActions.ts** | Server action for adding items to cart (getOrderCartAction) |
| **orderActions.ts** | Server action for order operations |

---

#### src/app/ - Application Routes and Layouts

##### Root Layout (src/app/)

| File | Description |
|------|-------------|
| **layout.tsx** | Root layout with providers |
| **provider.tsx** | Redux Provider wrapper (creates store instance) |
| **globals.css** | Global styles with Tailwind CSS v4, theme definitions, animations |
| **manifest.json** | PWA manifest configuration |
| **icon.png** | Application icon |
| **sitemap.ts** | Dynamic sitemap generation for SEO |

##### Context Providers (src/app/contexts/)

| File | Description |
|------|-------------|
| **ProductContext.tsx** | Product page title state (title, setTitle) - used for SEO |
| **RegFormContext.tsx** | Registration form state management with initial data and reset |

---

### Route Groups (src/app/(root)/)

#### (admin)/administrator/ - Admin Panel

| Path | Description |
|------|-------------|
| **administrator/page.tsx** | Admin dashboard main page |
| **administrator/layout.tsx** | Admin layout wrapper |
| **administrator/styles.ts** | Admin page styles |

**Subdirectories:**

| Path | Description |
|------|-------------|
| **users-list/** | User management |
| users-list/page.tsx | User listing with filtering, pagination |
| users-list/_components/ | Table components (UsersTable, TableRow, TableHeader, Pagination, Filters, Role, Register, Phone, Email, Age, Person, NavAndInfo, UserId) |
| **admin-orders/** | Order management with Excel export |
| admin-orders/page.tsx | Order listing with filters |
| admin-orders/_components/ | Order components (AdminOrderCard, OrderChatModal, Calendar, CalendarOrderModal, OrderDetails, AdminOrdersHeader, TimeSlotGroup, TimeSlotSection, CityFilterButtons, StatusDropdown, UserAvatar, DateSelector, OrderProductsLoader) |
| admin-orders/utils/ | Order utilities (excelGenerator, exportOrderToExcel, getMappedStatus, getPaymentStatusText, formatDeliveryDateTime, getEnglishStatuses, getRoleDisplayName, getUniqueCities, getStatusColorClass, formatPhoneNumber, customerStatuses, formatDisplayDate) |
| admin-orders/daypicker.css | Date picker styles |
| **delivery-times/** | Delivery time slot configuration |
| delivery-times/page.tsx | Delivery schedule management (3-day schedule) |
| delivery-times/_components/ | Schedule components (ScheduleTable, ScheduleTableRow, ScheduleTableHeader, AddTimeSlotForm, SaveButton, MessageAlert) |
| delivery-times/utils/ | Schedule utilities (getDaysDates, sortTimeSlots, dateFormatters, convertTimeToMinuts) |
| **products/** | Product CRUD operations |
| products/page.tsx | Products main page |
| products/add-product/page.tsx | Add new product page |
| products/edit-product/[id]/page.tsx | Edit product page |
| products/products-list/page.tsx | Product listing with search |
| products/products-list/_components/ | Search components (SearchProductsResult, SearchInput, SearchHeader, SearchStates, DeleteConfirmModal) |
| products/_components/ | Product form components (ImageUploadSection, ImageUploader, CheckboxGroup, CustomCheckbox, Tags, Categories, SuccessCreatedMessage, Manufacturer, Brand, Weight, Quantity, Discount, BasePrice, Description, Article, Title) |

---

#### (articles)/articles/ - Blog Articles

| Path | Description |
|------|-------------|
| articles/page.tsx | Blog listing page |
| Articles.tsx | Articles display component |
| ArticleCard.tsx | Article card component |
| ArticlesSection.tsx | Articles section for homepage |
| fetchArticles.ts | Articles data fetching |

---

#### (auth)/auth/ - Authentication Pages

| Path | Description |
|------|-------------|
| **login/** | Email/password and phone login |
| **register/** | Phone/email registration with OTP |
| **(forgot-pass)/** | Password reset initiation |
| **(update-pass)/** | Password update with phone verification |
| _components/ | Auth components (PasswordInput, PhoneInput, OTPResendButton, Tooltip, CloseButton, AuthFormLayout) |
| styles.ts | Auth page styles |

---

#### (cart)/cart/ - Shopping Cart

| Path | Description |
|------|-------------|
| cart/page.tsx | Cart page with items list |
| cart/_components/ | Cart components (CartHeader, CartItem, CartControls, CartSummary, CartSideBar, PriceSummary, QuantitySelector, CheckoutButton, CheckoutForm, DeliveryTime, DeliveryAddress, PaymentsButtons, OrderSuccessMessage, BonusSection, MinimumOrderWarning, ProductImage, SelectionCheckbox, PriceDisplay, DiscountBadge, CartSkeleton, DeliveryTimeSkeleton) |
| cart/utils/ | Cart utilities (orderHelpers, formatTimeSlot, isTimeSlotPassed) |
| cart/styles.ts | Cart page styles |

---

#### (catalog)/catalog/ - Product Catalog

| Path | Description |
|------|-------------|
| catalog/page.tsx | Main catalog page with filters and sorting |
| CatalogGrid.tsx | Catalog grid component |
| CatalogPage.tsx | Catalog page wrapper |
| CatalogAdminControls.tsx | Admin controls for catalog |
| GridCategoryBlock.tsx | Category block grid |

**Category Page:**

| Path | Description |
|------|-------------|
| **[category]/** | Dynamic category route |
| **[category]/page.tsx** | Category page |
| **[category]/fetchCategory.ts** | Category data fetching |

**Product Detail Page:**

| Path | Description |
|------|-------------|
| **[category]/(productPage)/[slug]/** | Product detail route |
| **_components/** | Product page components (ProductTitle, ReviewsWrapper, SimilarProducts, UserAvatar, ProductReviews, RatingDistribution, SameBrandProducts, ShareButton) |

---

#### (payment)/payment/ - Payment Processing

| Path | Description |
|------|-------------|
| PaymentSuccessModal.tsx | Payment success notification modal |
| FakePaymentModal.tsx | Payment mockup modal (for testing) |

---

#### (products)/products/ - Product Listings

| Path | Description |
|------|-------------|
| actions/page.tsx | Special offers page |
| new/page.tsx | New products page |
| Actions.tsx | Actions section component |
| NewProducts.tsx | New products section component |
| ProductsSections.tsx | Product sections for homepage |

---

#### (search)/search/ - Search

| Path | Description |
|------|-------------|
| search/page.tsx | Search results page with filters |

---

#### (user)/user/ - User Account Features

| Path | Description |
|------|-------------|
| **favorites/** | Favorite products |
| favorites/page.tsx | Favorites page |
| favorites/fetchFavorites.ts | Favorites data fetching |
| **purchases/** | Purchase history |
| purchases/page.tsx | Purchases page |
| Purchases.tsx | Purchases display component |
| fetchPurchases.ts | Purchase data fetching |

---

#### (user-orders)/user-orders/ - Order History

| Path | Description |
|------|-------------|
| user-orders/page.tsx | Orders list page |
| user-orders/_components/ | Order components (OrderCard, OrderHeader, OrderDetails, OrderActions, DeliveryInfo, DeliveryDatePicker, UserOrdersList, RepeatOrderSection, PriceComparisonAlert, PricePreservedAlert, RepeatOrderSuccessAlert, StockWarningsAlert) |
| user-orders/utils/ | Order utilities (getAvailableTimeSlots, formatOrderDate, formatDisplayDate, getStatusColor, getStatusText, getAvailableDates) |

---

#### (user-profile)/user-profile/ - User Profile

| Path | Description |
|------|-------------|
| user-profile/page.tsx | Main profile page |
| goodbye/page.tsx | Account deletion confirmation page |
| _components/ | Profile components (ProfileCard, ProfileHeader, ProfileAvatar, ProfileEmail, ProfilePassword, LocationSection, SecuritySection, DeleteAccountModal, ConfirmAvatarModal, AlertMessage, SuccessChangeEmail, EmailChangeVerification) |
| profile-phone/ | Phone verification subdirectory |
| profile-phone/ProfilePhoneSettings.tsx | Phone settings main component |
| profile-phone/ProfilePhoneInput.tsx | Phone input component |
| profile-phone/PhoneEditView.tsx | Phone edit view |
| profile-phone/PhoneVerifyView.tsx | Phone verification view |
| profile-phone/EditButton.tsx | Edit button component |

---

### API Routes (src/app/api/)

| Path | Description |
|------|-------------|
| **cart/route.ts** | GET cart items, POST update cart |
| **orders/route.ts** | POST create order, GET user orders |
| orders/update-status/route.ts | Update order status (admin) |
| orders/update-after-payment/route.ts | Update after payment |
| orders/clear-cart/route.ts | Clear cart after order |
| users/purchases/route.ts | Get user purchases |
| users/favorites/route.ts | Add/remove favorites |
| users/favorites/products/route.ts | Get favorite products |
| users/update-card/route.ts | Update loyalty card |
| search-full/route.ts | Full-text search |
| search/route.ts | Simple search fallback |
| search-products/route.ts | Product search |
| catalog/route.ts | Catalog listing with filters |
| category/route.ts | Category data |
| sitemap-data/route.ts | Sitemap generation data |
| products/route.ts | Products listing |
| products/[id]/route.ts | Get product by ID |
| products/[id]/reviews/route.ts | Product reviews |
| products/brand/route.ts | Brand filtering |
| products/similar-products/route.ts | Similar products |
| update-product/route.ts | Update product (admin) |
| delete-product/route.ts | Delete product (admin) |
| upload-image/route.ts | Image upload (Cloudinary) |
| delivery-times/route.ts | Delivery times data |
| admin/users/route.ts | Admin user listing |
| admin/users/orders/route.ts | Admin order listing |
| admin/users/[id]/role/route.ts | Update user role |
| articles/route.ts | Articles CRUD |
| auth/[...all]/route.ts | Better-auth proxy |
| auth/login/route.ts | Custom login (phone+password) |
| auth/set-password/route.ts | Set password |
| auth/update-phone/route.ts | Update phone |
| auth/update-email/route.ts | Update email |
| auth/location/route.ts | Update location |
| auth/upload-avatar/route.ts | Upload avatar |
| auth/check-phone/route.ts | Check phone exists |
| auth/check-login/route.ts | Check login exists |
| auth/check-session/route.ts | Check session valid |
| auth/logout/route.ts | Logout |
| auth/reset-phone-pass/route.ts | Reset phone password |
| auth/delete-account/route.ts | Delete account |
| auth/user/route.ts | Get user data |
| auth/avatar/[userId]/route.ts | Get/verify avatar |
| auth/avatar/[userId]/check/route.ts | Check avatar exists |
| cron/update-delivery-dates/route.ts | Update delivery schedule (cron) |

---

### src/components/ - Reusable UI Components

#### features/ - Feature-specific components

| Path | Description |
|------|-------------|
| **common/** | |
| common/Breadcrumbs.tsx | Navigation trail component |
| common/ErrorComponent.tsx | Error display component |
| common/loader.tsx | Loading spinner component |
| common/providers.tsx | Context providers wrapper |
| **slider/** | |
| slider/Slider.tsx | Auto-playing banner slider with animations |
| slider/SlideOne.tsx | First slide (special offers) |
| slider/SlideTwo.tsx | Second slide (delivery info) |
| **SpacialOffers.tsx** | Special offers section on homepage |
| **Maps.tsx** | Interactive map with store locations (Yandex Maps) |

#### layout/ - Layout structure components

| Path | Description |
|------|-------------|
| **header/** | |
| header/Header.tsx | Main header with logo and menus |
| header/TopMenu.tsx | Top menu links |
| header/UserBlock.tsx | User authorization/status block |
| header/SearchBlock.tsx | Search functionality wrapper |
| header/Profile.tsx | Profile dropdown menu |
| header/HighlightText.tsx | Text highlighting component |
| header/CatalogDropMenu/ | Product catalog dropdown |
| CatalogDropMenu/CatalogMenuWrapper.tsx | Catalog menu wrapper |
| CatalogDropMenu/CatalogMenu.tsx | Catalog menu component |
| header/inputSearch/ | Search input with autocomplete |
| inputSearch/SearchInput.tsx | Search input component |
| inputSearch/SearchResults.tsx | Search results dropdown |
| inputSearch/InputBlock.tsx | Input block component |
| **footer/** | |
| footer/Footer.tsx | Site footer with social links and navigation |

#### shared/ - Generic reusable components

| Path | Description |
|------|-------------|
| ProductCard.tsx | Product display card |
| AddToCartButton.tsx | Add to cart control |
| FavoriteButton.tsx | Add to favorites toggle |
| StarRating.tsx | Review rating display |
| InStockToggle.tsx | Stock status indicator |
| Pagination.tsx | Pagination controls |
| PaginationWrapper.tsx | Wrapper for pagination |
| GenericListPage.tsx | Generic list page template |
| ViewAllLink.tsx | "View all" link |
| **filterComponents/** | Filtering system |
| filterComponents/PriceFilter.tsx | Price filter container |
| filterComponents/FilterButtons.tsx | Filter toggle buttons |
| filterComponents/PriceFilterHeader.tsx | Price filter header |
| filterComponents/PriceRangeSlider.tsx | Price range slider |
| filterComponents/PriceInputs.tsx | Price range inputs |
| filterComponents/FilterControls.tsx | Filter action controls |
| filterComponents/DropFilter.tsx | Dropdown filter |

#### ui/ - UI primitives (shadcn + Radix)

| Path | Description |
|------|-------------|
| ui/container.tsx | Content container with max-width |
| **theme/** | Theme management |
| theme/ThemeProvider.tsx | Theme context provider |
| theme/ThemeToggle.tsx | Dark/light mode toggle |

#### svg/ - SVG Icons

| File | Description |
|------|-------------|
| IconNotice.tsx | Notice icon |
| IconVision.tsx | Vision icon |
| IconStar.tsx | Star icon |
| iconCart.tsx | Cart icon |
| IconBox.tsx | Box icon |
| IconHeart.tsx | Heart icon |
| IconAvatarChange.tsx | Avatar change icon |
| IconMenuMob.tsx | Mobile menu icon |

---

### src/store/ - State Management

#### Redux (src/store/redux/)

| File | Description |
|------|-------------|
| **index.ts** | Redux store configuration with middleware (thunk) |
| **api/ordersApi.ts** | Orders API slice with CRUD operations |
| **api/chatApi.ts** | Chat API slice for messaging |

#### Zustand (src/store/)

| File | Description |
|------|-------------|
| **cartStore.ts** | Shopping cart state: cartItems, totalItems, pricing, fetchCart, clearCart |
| **authStore.ts** | Authentication state: isAuth, user, isLoading, checkAuth, login, logout |
| **StatesProvider.tsx** | Client-side state initialization |

---

### src/types/ - TypeScript Type Definitions

| File | Description |
|------|-------------|
| product.ts | Product interface (ProductCardProps, ProductRating) |
| cart.ts | Cart item structure |
| order.ts | Order interface |
| userOrder.ts | User order display type |
| userData.ts | User data structure |
| catalog.ts | Catalog structure |
| categories.ts | Category types |
| articles.ts | Article types |
| articlesSections.ts | Article section types |
| filterState.ts | Filter state structure |
| pricingProps.ts | Pricing calculation properties |
| deliverySchedule.ts | Delivery schedule types |
| availableDate.ts | Available date types |
| searchProduct.ts | Search results product type |
| paginationProps.ts | Pagination types |
| genericListPageProps.ts | Generic list page types |
| categoryBlockProps.ts | Category block props |
| errorProps.ts | Error props |
| sitemap.ts | Sitemap type definitions |
| addProductTypes.ts | Admin product types |
| productsSections.ts | Product sections types |
| regFormData.ts | Registration form data |
| excel.ts | Excel export types |
| chat.ts | Chat types |
| shops.ts | Shop types |
| payment.ts | Payment types |
| storeStates.ts | Store state types |
| reduxApi.ts | Redux API types |

---

### src/hooks/ - Custom React Hooks

| File | Description |
|------|-------------|
| useFavorite.ts | Favorite products management |
| useAvatar.ts | Avatar upload/download |
| useTimer.ts | Countdown timer |
| usePriceComparison.ts | Price change comparison |
| useOrderProductsData.ts | Order data fetching |
| userOrderProducts.ts | User order products hook |
| userOrderPricing.ts | Order pricing calculations |
| useDeliveryData.ts | Delivery data fetching |
| useRepeatOrder.ts | Repeat order functionality |
| useDeliverySchedule.ts | Delivery schedule management |
| usePricing.ts | Pricing calculations (cart, discounts, bonuses) |
| redux.ts | Redux hooks (useAppDispatch, useAppSelector) |

---

### src/lib/ - Library Files

| File | Description |
|------|-------------|
| **auth.ts** | Server-side better-auth configuration: MongoDB adapter, email/password, phone OTP, admin plugin, email templates |
| **auth-client.ts** | Client-side auth client |
| **api-routes.ts** | API helper utilities (getDB - singleton MongoDB connection) |
| **utils.ts** | Utility function (cn: class name merging with twMerge) |

---

### src/data/ - Static Data

| File | Description |
|------|-------------|
| columnsUsersList.ts | Admin users table columns configuration |
| city.ts | City list |
| regions.ts | Region list |
| locations.ts | Location/address data |

---

### src/constants/ - Configuration Constants

| File | Description |
|------|-------------|
| RegFormData.ts | Initial registration form data |
| addProductFormData.ts | Product form configuration |

---

### utils/ - Root Utility Functions

#### Authentication & Auth

| File | Description |
|------|-------------|
| getServerUserId.ts | Get user ID from server-side session (supports better-auth and custom sessions) |
| auth-helpers.ts | Auth session helpers (getBetterAuthSession, getCustomSessionToken, validateCustomSession) |
| deleteUserAvatar.ts | Remove avatar file |

#### Formatting & Display

| File | Description |
|------|-------------|
| formatPrice.ts | Format price (1234,50) |
| formatDateToLocalYYYYMMDD.ts | Format date (YYYY-MM-DD) |
| formatWeight.ts | Format weight (g/kg) |
| getWordEnding.ts | Get word endings (plural forms) |
| baseUrl.ts | Get base URL for API calls |

#### Calculations

| File | Description |
|------|-------------|
| calcPrices.ts | Price calculations: calculateFinalPrice, calculatePriceByCard |

#### Validation

| File | Description |
|------|-------------|
| validation/form.ts | Form validation |
| validation/passwordValid.ts | Password strength check |
| validation/validProfileCard.ts | Profile card validation |
| validation/validateBirthDate.ts | Birth date validation |

#### Admin Utilities

| File | Description |
|------|-------------|
| admin/birthdaySoon.ts | Upcoming birthdays (next 7 days) |
| admin/calculateAge.ts | Calculate age from birth date |
| admin/formatBirthday.ts | Format birthday display |
| admin/getShortDecimalId.ts | Short ID format (last 5 digits) |
| admin/maskPhone.ts | Mask phone number |
| admin/rolesUtils.ts | Role display functions |

#### Image & Avatar

| File | Description |
|------|-------------|
| getAvatar.ts | Get user avatar from Cloudinary |
| avatarUtils.ts | Avatar utilities |
| optimizeImage.ts | Image optimization utility |

#### Strings & Slugs

| File | Description |
|------|-------------|
| createSlug.ts | Create URL-friendly slug |
| transliterate.ts | Cyrillic to Latin transliteration |
| translations.ts | URL segment to Russian translation map |
| getSitemapData.ts | Sitemap data processing |

#### Arrays & Data

| File | Description |
|------|-------------|
| shuffleArray.ts | Random array shuffling |
| debounce.ts | Debounce function |

#### Specialized

| File | Description |
|------|-------------|
| proxy-redirects.ts | Route redirect handlers (old products, catalog) |
| generatePassword.ts | Random password generation |

---

### src/proxy.ts - Next.js Middleware

| File | Description |
|------|-------------|
| proxy.ts | Next.js middleware for route redirects and auth protection |

---

### Additional Notes

1. **Authentication**: Dual system - Better-auth (email+password, phone+OTP) + custom session (phone+password)
2. **Database**: MongoDB with single client connection in api-routes.ts
3. **State Management**: Redux Toolkit for users/orders, Zustand for cart, React Context for product title
4. **Styling**: Tailwind CSS v4 with shadcn, Radix UI components
5. **Payment**: Mock payment system (FakePaymentModal) - not connected to real payment provider
6. **SMS**: Currently commented out - OTP codes printed to console only