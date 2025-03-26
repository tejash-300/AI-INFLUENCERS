import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
    try {
      const { numPosts } = await req.json();
      const posts = [];
  
      for (let i = 0; i < numPosts; i++) {
        const prompt = "Write a fun and engaging Instagram post for a virtual influencer promoting a new tech gadget.";
  
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        });
  
        posts.push(response.choices[0].message.content?.trim());
      }
  
      return NextResponse.json({ posts });
    } catch (error) {
      return NextResponse.json({ error: "Failed to generate posts" }, { status: 500 });
    }
  }