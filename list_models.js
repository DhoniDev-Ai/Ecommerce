const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy init to get client
    // Actually we need to list models. The Node SDK might not expose listModels directly on genAI instance easily in older versions, 
    // but let's try a direct fetch or check documentation approach. 
    // Better approach: simple fetch to the API endpoint to list models if SDK doesn't support it directly in this version.
    
    // Using fetch directly to debug
    const key = process.env.GEMINI_API_KEY;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await response.json();
    //console.log("Available Models:", JSON.stringify(data, null, 2));
  } catch (e) {
    //console.error(e);
  }
}
run();
