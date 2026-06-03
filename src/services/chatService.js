const { searchChunks } = require("./searchService");

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

async function chat(question, limit = 5) {
  const chunks = await searchChunks(question, limit);

  if (chunks.length === 0) {
    return {
      answer: "Tidak Ditemukan konten yang relevan di dokumen anda.",
      sources: [],
    };
  }

  const context = chunks
    .map(
      (c, i) =>
        `[${i + 1}] ${c.filename}, similarity: ${parseFloat(c.similarity).toFixed(2)}\n${c.content}`,
    )
    .join("\n\n---\n\n");

  const systemPrompt = `Kamu adalah asisten AI yang menjawab pertanyaan berdasarkan dokumen yang diberikan.

ATURAN:
- Jawab HANYA berdasarkan konteks dokumen yang diberikan.
- Jika informasi tidak ada di konteks, katakan "Saya tidak menemukan informasi tersebut di dokumen yang tersedia."
- Sertakan nomor referensi [1], [2], dll. saat mengutip informasi dari dokumen.
- Jawab dalam Bahasa Indonesia.

KONTEKS DOKUMEN:
${context}`;

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://localhost:3000",
      "X-Title": "AI Knowledge Base",
    },
    body: JSON.stringify({
      model:
        process.env.OPENROUTER_MODEL || "meta-llama/llama-3.2-3b-instruct:free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      max_tokens: 1024,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const answer = data.choices[0].message.content;

  return {
    answer,
    sources: chunks.map((c) => ({
      chunkId: c.id,
      content: c.content.substring(0, 200) + "...",
      document: c.filename,
      similarity: parseFloat(parseFloat(c.similarity).toFixed(4)),
    })),
  };
}

module.exports = { chat };
