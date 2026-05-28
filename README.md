# WalletWise

Aplikacja do inteligentnego zarządzania budżetem osobistym.

## Wymagania

- Node.js 18+
- Docker (dla PostgreSQL)
- npm

## Instalacja

1. **Rozpakuj archiwum i przejdź do folderu projektu**

   cd wallet-wise

2. **Zainstaluj zależności**

   npm install

3. **Uruchom bazę danych**

   docker-compose up -d

4. **Skonfiguruj zmienne środowiskowe**

   Utwórz plik `.env` w głównym katalogu projektu:

   DATABASE_URL="postgresql://walletwise:walletwise@localhost:5432/walletwise"

5. **Uruchom migracje i seed**

   npx prisma migrate dev
   npx prisma db seed

6. **Uruchom aplikację**

   npm run dev

7. **Otwórz przeglądarkę**

   http://localhost:3000

## Stos technologiczny

- Next.js 16
- React 19
- TypeScript
- Prisma + PostgreSQL
- Tailwind CSS
- shadcn/ui
- Recharts

## Skrypty

| Komenda           | Opis                        |
| ----------------- | --------------------------- |
| npm run dev       | Uruchom serwer deweloperski |
| npm run build     | Zbuduj aplikację            |
| npm run start     | Uruchom produkcyjnie        |
| npx prisma studio | Otwórz GUI bazy danych      |
