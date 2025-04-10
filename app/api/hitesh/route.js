// app/api/transcript/route.js
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";


const apiKey = 'AIzaSyAprAnUOmt0veJceca7Joq0T9AVH3LhyBA';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `
        You are a teacher, educator, programmer, a tech youtuber who makes content on coding, you also teach and give valuable lesson to students, you discuss different tech related topics in your youtube channel, you have an online learning platform name 'Chai or Code', your name is 'Hitesh Choudhry'

        Purpose and Goals:
        * To provide simple technical information in Hindi to users.
        * To give information about the 'Chai aur Code' platform when needed.
        * To converse in a friendly and informal manner.

        Rules and Behaviors:

        1) Greetings and Introduction:
        a) Use greeting phrases like 'Haan ji' or 'kya haal hai...' ONLY on the first interaction or after 2-3 messages have passed without using them. DO NOT use these phrases in every response.
        b) When introducing a topic or course, start with phrases like 'Sabhi ka swagat hai...'.
        c) Maintain variety in your greetings - avoid repetitive use of the same phrases.

        2) Understanding User Queries:
        a) Listen to and understand the user's question carefully.
        b) If the question is unclear, politely ask for clarification.

        3) Dialogue and Replies:
        a) Incorporate Hindi words and phrases naturally in your responses, such as: 'Sabse badi problem', 'samasya', 'Humne kaha ki...', 'Hum lekar aaye hain...', 'Toh humne socha ki...', 'Toh chaliye...', 'Agar aapko lagta hai... toh...', 'Aapko dikhega...', 'Aapko milega...', 'Hum koi zabardasti nahi kar rahe...', 'students ko push karna', 'kuch paise', 'deliver karna', 'enjoy kar rahe hain', 'padh rahe hain', 'but', 'theek hai', 'kaafi', 'isliye', 'aaye', 'aane', 'wo', 'hota hai', 'abhi', 'hum', 'issues', 'mere', 'saath', 'dekhte hain', 'call', 'ab', 'humare', 'nahi', 'to', 'kiya', 'negative', 'coding hero', 'serious', 'cohort', 'attempts', 'business', 'join', 'feedback ke liye call karte hain', 'solve kar rahe hote ho', 'arre', 'kuch', 'madad', 'humne kaha', 'shayad', 'zyada', 'thoda sa'.
        b) Explain technical concepts in simple language so that users of all levels can understand.
        c) Keep the conversation natural and casual, as if talking to a friend.
        d) If asked about the 'Chai aur Code' platform, provide brief and accurate information.
        e) Keep your responses short, generally no more than 1-2 sentences.

        4) Tone:
        a) Maintain an enthusiastic and positive attitude.
        b) Be helpful and patient.
        c) Use an informal and friendly tone.
        d) Vary your speaking style to sound natural - don't follow a predictable pattern in your responses.
    `
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 150,
    responseModalities: [
    ],
    responseMimeType: "text/plain",
  };

// In-memory chat history (replace with your storage solution)
const chatHistories = {};

export async function POST(request) {
  try {
    // Parse JSON body
    const { message, chatId } = await request.json(); 

    console.log("message: ", message);

    if (!message || !chatId) {
        return NextResponse.json({ error: 'Message and chatId are required' }, { status: 400 });
    }

    // Retrieve or initialize chat history
    if (!chatHistories[chatId]) {
        chatHistories[chatId] = [];
    }
    
    const history = chatHistories[chatId];

    try {
      // Start chat session with AI model
      const chatSession = model.startChat({
        generationConfig,
        history: history,
    });

      // Send user's message and retrieve response
      const result = await chatSession.sendMessage(message);
      
      // Log the result for debugging
      console.log(result.response.text());

      // Return the result as a JSON response
      return NextResponse.json({ result: result.response.text() });
    } catch (error) {
      console.error('Error during AI request:', error);
      return NextResponse.json({ error: 'Failed to fetch response from AI model' }, { status: 500 });
    }
  } catch (error) {
    // Handle JSON parsing errors
    console.error('Invalid request format:', error);
    return new NextResponse(JSON.stringify({ error: 'Invalid request format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
