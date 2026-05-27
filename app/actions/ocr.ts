"use server";

import Anthropic from "@anthropic-ai/sdk";

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
