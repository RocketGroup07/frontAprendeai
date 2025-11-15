import React, { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";

function IAMessages({ contexto }) {
  const [messages, setMessages] = useState([
    { sender: "ia", text: "Olá! Sou sua assistente de IA. Como posso ajudar?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  /* arrumando a ia */
  // ⚠️ Substitua por variável de ambiente em produção
  const ai = new GoogleGenAI({
    apiKey: "AIzaSyC125d7cbsBNo6ANKLu53ir3PfAat4TdMU"
  });

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setLoading(true);

    const prompt = `
Você é uma tutora virtual especializada em educação.
Seu papel é ajudar o aluno a compreender o conteúdo, sem dar a resposta final.

Instruções:

Seja totalmente objetiva e direta.

Evite frases introdutórias ou comentários desnecessários.

Use linguagem simples e clara, adequada a estudantes do ensino médio.

Explique com tópicos, listas e negritos quando possível.

Forneça apenas o essencial para que o aluno raciocine e chegue à resposta.

Nunca entregue a resposta completa — apenas oriente.

Responda em markdown, com formatação organizada e fácil de ler.

Limite-se a até 3 parágrafos curtos (máximo 150 palavras).

---
Contexto da atividade:
${contexto || "(sem conteúdo)"}

Pergunta do aluno:
${input}

---
Responda de forma didática e envolvente, mas nunca revele a resposta final diretamente.
`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      const iaMsg = { sender: "ia", text: response.text };
      setMessages((msgs) => [...msgs, iaMsg]);
      setDisplayedText(""); // reinicia animação de digitação
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "ia", text: "Erro ao conectar à IA." }
      ]);
    }

    setLoading(false);
    setInput("");
  }

  // Efeito de digitação para a última mensagem da IA
  useEffect(() => {
    if (!messages.length) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.sender !== "ia") return;

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(lastMsg.text.slice(0, i++));
      if (i > lastMsg.text.length) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div className="max-w-[600px] h-[600px] mx-auto my-10 border border-gray-600 bg-[#181818] rounded-lg text-white p-4 flex flex-col">
      <h2 className="text-center text-xl font-medium mb-3">Chat com IA</h2>

      <div className="min-h-[180px]  overflow-y-auto mb-3 bg-[#181818] rounded-md p-3 flex flex-col gap-2">
        {messages.map((msg, idx) => {
          const textToShow =
            msg.sender === "ia" && idx === messages.length - 1
              ? displayedText
              : msg.text;

          return (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <span
                className={`inline-block px-4 py-2 rounded-2xl max-w-[80%] text-sm font-light ${msg.sender === "user" ? "bg-[var(--primary)]" : "bg-gray-700"
                  }`}
              >
                <ReactMarkdown>{textToShow}</ReactMarkdown>
              </span>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <span className="inline-block px-4 py-2 rounded-2xl bg-gray-700 text-sm">
              IA está digitando...
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 mt-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 px-3 py-2 rounded-md bg-[#333] text-white placeholder-gray-400 border-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-5 py-2 rounded-md bg-[var(--primary)] hover:bg-[#8e0303] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

export default IAMessages;
