import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { getSession } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    // Verify authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { messages } = await req.json()

    // Store the conversation in the database
    const { db } = await connectToDatabase()
    await db.collection("conversations").insertOne({
      userId: session.user.id,
      message: messages[messages.length - 1].content,
      timestamp: new Date(),
    })

    // Generate response using AI SDK
    const result = streamText({
      model: openai("gpt-4o"),
      messages,
      temperature: 0.7,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

