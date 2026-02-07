import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getProductContext } from "@/lib/ai/context";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");



export async function POST(req: Request) {
    try {
        const { messages, orderContext } = await req.json();
        const lastMessage = messages[messages.length - 1];

        // 1. Fetch Dynamic Context
        const productContext = await getProductContext();

        // 2. Construct System Prompt
        const systemPrompt = `
You are "Aya", the personal wellness concierge for Ayuniv.
Your tone is warm, confident, and succinct (like a knowledgeable friend).

CORE INSTRUCTIONS:
1. **LANGUAGE MIRRORING (CRITICAL)**:
   - If User speaks **Standard English** -> Reply in **Standard English**.
   - If User speaks **Hindi** (Devanagari) -> Reply in **Hindi**.
   - If User speaks **Hinglish** (Hindi in English) -> Reply in **Hinglish**.
   - *NEVER* mix languages unless the user does.

2. **RECOMMENDATIONS & LINKS**:
   - When suggesting a product, you **MUST** format it as a **Visual Card** using this exact markdown syntax:
     
         [![Name | Price](Image_URL)](/products/slug)
     
     Example:
     
         [![Sea Buckthorn Elixir | ₹1250](https://exam.ple/img.jpg)](/products/sea-buckthorn-elixir)
     
   - Never just link the text. Always use the visual card format.

3. **STRUCTURE & SALESMANSHIP**:
   - **Start with the solution**: "Yes, for back pain, our [Product Name](/products/slug) is great because..."
   - **Explain WHY (Benefits)**: Briefly mention the key ingredient or benefit. "It contains Turmeric which reduces inflammation."
   - **Conversational Pivots**: If the user mentions celebrities, fitness icons, or lifestyle:
     - *Acknowledge*: "Yes, that's fitness is indeed incredible!"
     - *Bridge*: "You can achieve similar vitality with consistency, exercise, and the right nutrition."
     - *Sell*: "Our [Product Name](/products/slug) can be your partner in this journey."
     - *CTA*: "Would you like a recommendation for energy or recovery?"
   - **Be Brief**: Keep answers under 50 words.
   - **No Repetitive Disclaimers**: Do NOT end every message with "Consult a doctor". Only say it if the user asks about a serious medical cure or surgery.

4. **CONTEXT**:
   - Use the CATALOG below. If you don't know a product, say so.
5. **CONTACT INFO**:
   - If asked for support/contact:
     - Email: info@ayuniv.com
     - Instagram: https://www.instagram.com/ayuniv_official/
     - We are here for you.
6. **USER DATA (SECURE)**:
   ${orderContext ? orderContext : "User is currently a Guest (not logged in)."}
   - If User asks about heir orders and the data is here, answer securely.
   - If User is Guest, ask them to "Please sign in to view your order history."

${productContext}
`;

        // 3. Fallback Strategy for Gemini Models
        const MODELS = [
            "gemini-2.5-flash",
            "gemini-2.5-flash-lite",
            "gemma-3-27b-it" // High limit fallback
        ];

        let lastError: any = null;

        for (const modelName of MODELS) {
            try {
                // //console.log(`Attempting with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const chat = model.startChat({
                    history: [
                        {
                            role: "user",
                            parts: [{ text: systemPrompt }],
                        },
                        {
                            role: "model",
                            parts: [{ text: "Hay! I am Aya. I will help you with Ayuniv wellness in English, Hindi, or Hinglish. I am ready." }],
                        },
                        ...messages.slice(0, -1).map((m: any) => ({
                            role: m.role === 'user' ? 'user' : 'model',
                            parts: [{ text: m.content }],
                        }))
                    ],
                });

                const result = await chat.sendMessage(lastMessage.content);
                const response = result.response.text();

                return NextResponse.json({ role: 'assistant', content: response, model: modelName });

            } catch (error: any) {
                //console.warn(`Model ${modelName} failed:`, error.message);
                lastError = error;
                // If it's a rate limit (429) or overloaded (503), continue to next model.
                // Otherwise, potentially break? For now, we'll try to be resilient and try all.
                if (error.status === 429 || error.status === 503 || error.message.includes("429") || error.message.includes("503")) {
                    continue;
                }
                // If it's another error (like 404 not found if model doesn't exist), also continue.
                continue;
            }
        }

        // If loop finishes without return, throw the last error
        console.error("All AI models failed. Last error:", lastError);
        throw lastError;

    } catch (error: any) {
        console.error("AI Chat Error Details:", error);
        console.error("API Key Status:", process.env.GEMINI_API_KEY ? "Present" : "Missing/Empty");
        return NextResponse.json({ error: error.message || "Aya is meditating. Please try again." }, { status: 500 });
    }
}
