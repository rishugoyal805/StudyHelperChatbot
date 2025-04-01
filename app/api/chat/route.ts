import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 90;

// Load API Key from environment variables
const GEMINI_API_KEY = "AIzaSyB14JTZ6SdYKikEIRiSue_dZiBaRx7p6P0";

export async function POST(req: Request) {
  try {
    // Verify authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await req.json();

    // Store the conversation in the database
    const { db } = await connectToDatabase();
    await db.collection("conversations").insertOne({
      userId: session.user.id,
      message: messages[messages.length - 1].content,
      timestamp: new Date(),
    });

    // Initialize Google Gemini API
    const genAI = new GoogleGenerativeAI("GEMINI_API_KEY");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Prepare messages for Gemini API
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      content: msg.content,
    }));

    // Generate response using Gemini
    const response = await model.generateContent({ contents: formattedMessages });
    const result = response.response.text(); // Get the generated response

    return NextResponse.json({ reply: result });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}