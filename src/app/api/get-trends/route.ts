import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const source = searchParams.get("source");

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    let trends: string[] = [];

    if (source === "Twitter") {
      const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;
      const twitterResponse = await axios.get(
        `https://api.twitter.com/2/tweets/search/recent?query=${query}&max_results=10`,
        { headers: { Authorization: `Bearer ${twitterBearerToken}` } }
      );
      trends = twitterResponse.data.data?.map((tweet: any) => tweet.text) || [];
    } else if (source === "GPT") {
      const openaiApiKey = process.env.OPENAI_API_KEY;
      const gptResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a trend generator. Provide the top trends based on the given topic." },
            { role: "user", content: `What are the top trends about ${query}?` },
          ],
        },
        { headers: { Authorization: `Bearer ${openaiApiKey}`, "Content-Type": "application/json" } }
      );
      trends = gptResponse.data.choices[0]?.message?.content?.split("\n") || [];
    }

    return NextResponse.json({ trends });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trends" }, { status: 500 });
  }
}