import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { description, style } = await req.json();

    if (typeof style !== "string" || typeof description !== "string") {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    let dallePrompt = "";
    console.log(style);
    switch (style.toLowerCase()) {
      case "realistic":
        dallePrompt = `${description}. Them image should be highly realistic`;
        break;
      case "cartoon":
        dallePrompt = `Create a cartoon-style influencer: ${description}.`;
        break;
      case "abstract":
        dallePrompt = `Create an abstract artistic representation of a virtual influencer: ${description}.`;
        break;
      default:
        return NextResponse.json({ error: "Invalid style. Choose 'realistic', 'cartoon', or 'abstract'." }, { status: 400 });
    }

    const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            prompt: dallePrompt,
            n: 1,
            size: "1024x1024"
        })
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }
    const data = await response.json();
    console.log(data);

    return NextResponse.json({ imageUrl: data.data[0].url });
  } catch (error) {
    console.error("DALL-E API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate image";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}