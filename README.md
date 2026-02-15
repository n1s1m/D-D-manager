# D&D Character Manager

A microfrontends application for managing Dungeons & Dragons characters, items, spells, and shop—built with Next.js and Vercel Microfrontends.

**Live demo:** [https://d-d-manager-characters.vercel.app/](https://d-d-manager-characters.vercel.app/)

---

## English

### Description

This monorepo contains a multi-zone microfrontends setup: **characters** is the default app (auth, home, login/signup, and character management); **catalog** is a single zone serving both **shop** (`/shop`) and **spells** (`/spells`). Data and auth are backed by Supabase.

### Features

- **Authentication** — Login/signup (email + password, optional Google OAuth), protected routes, session via Supabase Auth. Characters app requires an authenticated user.
- **Characters** — List, create, view, and edit characters; ability scores, skills, inventory (equip/unequip, drop, sell, use consumables), description & notes; avatar upload; “What would my character do?” action; dice roller.
- **Shop** — Browse items, view details, buy items for a character; embeddable shop modal from the character page.
- **Spells** — Browse spells catalog, view spell details, add spells to character.
- **Shared UX** — Tailwind + shadcn/ui, React Query, shared types and UI components across apps.

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Microfrontends**: Vercel Microfrontends (multi-zone)
- **Database & Auth**: Supabase
- **Forms**: React Hook Form + Zod (auth in characters app)
- **Styling**: Tailwind CSS, shadcn/ui (`@repo/ui-components`)
- **Monorepo**: Turborepo, pnpm workspaces

**Libraries:** React 19, TypeScript · **@tanstack/react-query** (data/cache) · **@tanstack/react-table** (shop, spells tables) · **react-hook-form**, **@hookform/resolvers**, **zod** (forms & validation) · **Tailwind CSS**, **tailwindcss-animate**, **class-variance-authority**, **clsx**, **tailwind-merge** · **Radix UI** (primitives: label, separator, slot, dialog, dropdown, tooltip, etc.) · **lucide-react** (icons) · **sonner** (toasts) · **axios** (characters) · **@vercel/analytics**, **@vercel/speed-insights**, **@vercel/toolbar** · internal: **supabase-client**, **shared-types**, **@repo/domain**, **@repo/query-provider**, **@repo/ui-components**

### Local Setup

**Prerequisites:** Node.js 20.x, pnpm 9.4.0, a Supabase project.

1. **Clone and install**
   ```bash
   cd microfrontends/nextjs-multi-zones
   pnpm install
   ```

2. **Environment**
   - Copy `env.example` to `.env.local` in the repo root (or into each app if you run them separately).
   - Set:
     - `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key  
   - Optional: `SUPABASE_SERVICE_ROLE_KEY` for seeding; `APIFREE_API_KEY` for character AI action.

3. **Run all apps**
   ```bash
   pnpm dev
   ```
   - Characters (default): http://localhost:3000  
   - Catalog (shop + spells): http://localhost:3002  

   Use the characters app (3000) to log in and navigate to characters, shop, and spells (catalog is proxied for `/shop` and `/spells` when using the default app).

4. **Run a single app** (from repo root)
   ```bash
   cd apps/characters && pnpm dev  # default app on 3000
   cd apps/catalog && pnpm dev     # catalog (shop + spells) on 3002
   ```

5. **Build**
   ```bash
   pnpm build
   ```

6. **Tests** (characters app)
   ```bash
   cd apps/characters && pnpm test
   ```
   Uses Vitest; covers auth validation schemas (login/signup). Run `pnpm test:watch` for watch mode.

7. **Auth & errors**
   - Unauthenticated visits to `/characters` or `/characters/*` are redirected to `/login?redirectTo=...` via middleware (`@supabase/ssr`). After login, the user is sent back to the original path.
   - Root `error.tsx` in characters and catalog catch React errors and show a "Something went wrong" UI with "Try again" and a link home / to shop.

### Project Structure

```
apps/
├── characters/     # Default app: auth, home, login/signup, character management, inventory, skills
├── catalog/       # Shop (/shop) + Spells (/spells): items catalog, purchase, embed; spells catalog, add to character

packages/
├── shared-types/   # Shared TypeScript types & schemas
├── supabase-client/
├── domain/         # Query keys, domain logic
├── query-provider/
├── ui-components/  # shadcn-based UI
└── eslint-config-custom, ts-config, etc.
```

---

## Українська

### Опис

Монорепо з мультизонною архітектурою мікрофронтендів: **characters** — головний застосунок (авторизація, домашня сторінка, персонажі); **catalog** — одна зона для магазину (`/shop`) та заклинаннь (`/spells`). Дані та авторизація — Supabase.

### Можливості

- **Авторизація** — Вхід/реєстрація (email + пароль, опційно Google OAuth), захищені маршрути, сесія через Supabase Auth. Застосунок characters доступний лише авторизованим користувачам.
- **Персонажі** — Список, створення, перегляд і редагування; характеристики, навички, інвентар (обладнання/зняти, викинути, продати, використати витратні); опис і нотатки; завантаження аватара; дія «Що б зробив мій персонаж?»; кидання кубиків.
- **Магазин** — Каталог предметів, перегляд деталей, купівля для персонажа; вбудоване модальне вікно магазину зі сторінки персонажа.
- **Заклинання** — Каталог заклинаннь, перегляд деталей, додавання заклинаннь персонажу.
- **Спільний UX** — Tailwind, shadcn/ui, React Query, спільні типи та UI-компоненти.

### Стек

- **Фреймворк**: Next.js 16 (App Router)
- **Мікрофронтенди**: Vercel Microfrontends (multi-zone)
- **БД та авторизація**: Supabase
- **Форми**: React Hook Form + Zod (авторизація в characters)
- **Стилі**: Tailwind CSS, shadcn/ui (`@repo/ui-components`)
- **Монорепо**: Turborepo, pnpm workspaces

**Бібліотеки:** React 19, TypeScript · **@tanstack/react-query** (дані, кеш) · **@tanstack/react-table** (таблиці в shop, spells) · **react-hook-form**, **@hookform/resolvers**, **zod** (форми та валідація) · **Tailwind CSS**, **tailwindcss-animate**, **class-variance-authority**, **clsx**, **tailwind-merge** · **Radix UI** (примітиви: label, separator, slot, dialog, dropdown, tooltip тощо) · **lucide-react** (іконки) · **sonner** (тости) · **axios** (characters) · **@vercel/analytics**, **@vercel/speed-insights**, **@vercel/toolbar** · внутрішні: **supabase-client**, **shared-types**, **@repo/domain**, **@repo/query-provider**, **@repo/ui-components**

### Локальний запуск

**Потрібно:** Node.js 20.x, pnpm 9.4.0, проект Supabase.

1. **Клонування та встановлення**
   ```bash
   cd microfrontends/nextjs-multi-zones
   pnpm install
   ```

2. **Середовище**
   - Скопіюйте `env.example` у `.env.local` в корені репозиторію (або в кожен застосунок, якщо запускаєте їх окремо).
   - Вкажіть:
     - `NEXT_PUBLIC_SUPABASE_URL` — URL проекту Supabase
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon-ключ Supabase  
   - За бажанням: `SUPABASE_SERVICE_ROLE_KEY` для seed-скриптів; `APIFREE_API_KEY` для AI-дії персонажа.

3. **Запуск усіх застосунків**
   ```bash
   pnpm dev
   ```
   - Characters (головний): http://localhost:3000  
   - Catalog (магазин + заклинання): http://localhost:3002  

   Через застосунок characters (3000) виконуйте вхід і переходи до characters, shop та spells.

4. **Запуск одного застосунку** (з кореня репо)
   ```bash
   cd apps/characters && pnpm dev
   cd apps/catalog && pnpm dev
   ```

5. **Збірка**
   ```bash
   pnpm build
   ```

### Структура проєкту

```
apps/
├── characters/     # Головний застосунок: авторизація, домашня, персонажі, інвентар, навички
├── catalog/        # Магазин (/shop) + Заклинання (/spells): каталог предметів і заклинаннь

packages/
├── shared-types/
├── supabase-client/
├── domain/
├── query-provider/
├── ui-components/
└── ...
```
