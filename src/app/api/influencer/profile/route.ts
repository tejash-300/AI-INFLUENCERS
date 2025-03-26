import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { name, personality, interests } = await req.json();
    const prompt = `Create a virtual influencer profile with the name '${name}', personality '${personality}', and interests '${interests}'.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({ profile: response.choices[0].message.content?.trim() });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate profile" }, { status: 500 });
  }
}