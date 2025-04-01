import { NextRequest, NextResponse } from "next/server";

const DID_API_KEY = process.env.D_ID_API_KEY || "";
const DID_BASE_URL = "https://api.d-id.com";

export async function POST(req: NextRequest) {
	try {
		const { script, sourceUrl } = await req.json();

		if (!script || !sourceUrl) {
			return NextResponse.json(
				{ error: "Script and Source URL are required." },
				{ status: 400 }
			);
		}

		// 🔹 Start the video generation job
		const talkResponse = await fetch(`${DID_BASE_URL}/talks`, {
			method: "POST",
			headers: {
				Authorization: `Basic ${DID_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				source_url: sourceUrl,
				script: {
					type: "text",
					subtitles: "false",
					provider: { type: "microsoft", voice_id: "Sara" },
					input: script,
					ssml: "false",
				},
			}),
		});

		const talkData = await talkResponse.json();
		const talkId = talkData.id;

		if (!talkId) {
			return NextResponse.json(
				{ error: "Failed to create talk." },
				{ status: 500 }
			);
		}

		console.log(`✅ Talk job started: ${talkId}`);
		return NextResponse.json({ talkId });
	} catch (error) {
		console.error("❌ Error starting video generation:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}