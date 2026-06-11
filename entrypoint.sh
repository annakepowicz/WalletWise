#!/bin/sh

echo "Waiting for database..."
until npx prisma db push; do
  echo "Database not ready, retrying in 3s..."
  sleep 3
done

echo "Database ready, starting app..."
npm run dev