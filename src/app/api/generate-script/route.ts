import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "", // Load API key from env
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");

  if (!topic) {
    return NextResponse.json({ error: "Topic is required" }, { status: 400 });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": `create a viral shortform video script for a talking head about: ${topic}. Give just the script to say, no meta desciption or anything else.`}
    ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const script = completion.choices[0]?.message?.content?.trim() || "No script generated.";

    return NextResponse.json({ script });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json({ error: "Failed to generate script" }, { status: 500 });
  }
}