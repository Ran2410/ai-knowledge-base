const { searchChunks } = require("./searchService");
const {
  createConversation,
  getRecentMessages,
  saveMessage,
} = require("./conversationService");

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const HISTORY_LIMIT = 10;

async function chat(question, conversationId = null, limit = 5) {
  let isNewConversation = false;
  if (!conversationId) {
    const conversation = await createConversation(question);
    conversationId = conversation.id;
    isNewConversation = true;
  }

  const history = await getRecentMessages(conversationId, HISTORY_LIMIT);

  await saveMessage(conversationId, "user", question);

  const chunks = await searchChunks(question, limit);

  if (chunks.length === 0) {
    const answer = "Tidak ditemukan konten yang relevan di dokumen anda.";

    await saveMessage(conversationId, "assistant", answer);

    return {
      conversationId,
      answer,
      sources: [],
      isNewConversation,
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
- Percakapan sebelumnya ada di history — gunakan untuk konteks, tapi fokus ke pertanyaan terbaru.

KONTEKS DOKUMEN:
${context}`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: question },
  ];

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
        process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct:free",
      messages,
      max_tokens: 1024,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error("LLM service unavailable");
  }

  const data = await response.json();
  const answer = data.choices[0].message.content;

  await saveMessage(conversationId, "assistant", answer);

  return {
    conversationId,
    answer,
    sources: chunks.map((c) => ({
      chunkId: c.id,
      content: c.content.substring(0, 200) + "...",
      document: c.filename,
      similarity: parseFloat(parseFloat(c.similarity).toFixed(4)),
    })),
    isNewConversation,
  };
}

module.exports = { chat };
