"use server";

import Anthropic from "@anthropic-ai/sdk";

export type ReceiptData = {
  storeName?: string;
  date?: string;
  total?: number;
  error?: string;
};

export async function processReceiptImage(
  formData: FormData
): Promise<ReceiptData> {
  const file = formData.get("image") as File;
  if (!file) return { error: "Brak zdjęcia" };

  if (!process.env.ANTHROPIC_API_KEY) {
    return { error: "Brak klucza ANTHROPIC_API_KEY w pliku .env" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const mediaType = file.type as
    | "image/jpeg"
    | "image/png"
    | "image/gif"
    | "image/webp";

  const client = new Anthropic();

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            {
              type: "text",
              text: `To jest zdjęcie paragonu lub faktury. Wyodrębnij z niego dane i zwróć TYLKO obiekt JSON bez żadnego dodatkowego tekstu:
{
  "storeName": "nazwa sklepu lub sprzedawcy (string lub null)",
  "date": "data zakupu w formacie YYYY-MM-DD (string lub null)",
  "total": liczba będąca łączną kwotą do zapłaty (number lub null)
}
Jeśli nie możesz odczytać danego pola, ustaw null. Kwotę podaj jako liczbę dziesiętną (np. 45.99).`,
            },
          ],
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return { error: "Nie udało się odczytać danych z paragonu" };

    const parsed = JSON.parse(match[0]);
    return {
      storeName: parsed.storeName ?? undefined,
      date: parsed.date ?? undefined,
      total: typeof parsed.total === "number" ? parsed.total : undefined,
    };
  } catch (e) {
    console.error("OCR receipt error:", e);
    return { error: "Błąd analizy zdjęcia. Sprawdź klucz ANTHROPIC_API_KEY." };
  }
}

export async function processShoppingImage(
  formData: FormData
): Promise<{ items?: string[]; error?: string }> {
  const file = formData.get("image") as File;
  if (!file) return { error: "Brak zdjęcia" };

  if (!process.env.ANTHROPIC_API_KEY) {
    return { error: "Brak klucza ANTHROPIC_API_KEY w pliku .env" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const mediaType = file.type as
    | "image/jpeg"
    | "image/png"
    | "image/gif"
    | "image/webp";

  const client = new Anthropic();

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            {
              type: "text",
              text: 'To jest zdjęcie listy zakupów. Wyodrębnij wszystkie produkty z listy. Zwróć TYLKO tablicę JSON z nazwami produktów, bez żadnego dodatkowego tekstu. Przykład: ["Mleko", "Chleb", "Jajka"]. Jeśli nie możesz odczytać żadnych produktów, zwróć pustą tablicę [].',
            },
          ],
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return { items: [] };

    const items = JSON.parse(match[0]) as string[];
    return { items: items.filter((i) => typeof i === "string" && i.trim()) };
  } catch (e) {
    console.error("OCR error:", e);
    return { error: "Błąd analizy zdjęcia. Sprawdź klucz ANTHROPIC_API_KEY." };
  }
}
