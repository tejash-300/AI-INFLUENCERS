import { NextRequest, NextResponse } from "next/server";

const DID_API_KEY = process.env.D_ID_API_KEY || "";
console.log(DID_API_KEY);
const DID_BASE_URL = "https://api.d-id.com";

export async function POST(req: NextRequest) {
	try {
		const { script, sourceUrl, engine } = await req.json();

		if (!script || !sourceUrl) {
			return NextResponse.json(
				{ error: "Script and Source URL are required." },
				{ status: 400 }
			);
		}

		let videoUrl = "";

			// Generate video using D-ID API
			const talkResponse = await fetch(`${DID_BASE_URL}/talks`, {
				method: "POST",
				headers: {
					Authorization: `Basic ${DID_API_KEY}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					source_url:
						sourceUrl || "",
					script: {
						type: "text",
						subtitles: "false",
						provider: { type: "microsoft", voice_id: "Sara" },
						input: script,
						ssml: "false",
					},
				}),
			});
			console.log(talkResponse);
			const talkData = await talkResponse.json();
			const talkId = talkData.id;

			if (!talkId) {
				return NextResponse.json(
					{ error: "Failed to create talk." },
					{ status: 500 }
				);
			}

			// Polling mechanism to check video status
			let isReady = false;
			const timeout = 600000; // 10 minutes
			const interval = 10; // Check every 10s
			const startTime = Date.now();

			while (!isReady) {
				if (Date.now() - startTime > timeout) {
					return NextResponse.json(
						{ error: "Video processing timed out." },
						{ status: 500 }
					);
				}

				const statusResponse = await fetch(
					`${DID_BASE_URL}/talks/${talkId}`,
					{
						method: "GET",
						headers: { Authorization: `Basic ${DID_API_KEY}` },
					}
				);

				const statusData = await statusResponse.json();
				console.log(statusData);
				if (statusData.status === "done") {
					videoUrl = statusData.result_url;
					isReady = true;
				} else {
					console.log("Video status:", statusData.status);
					await new Promise((resolve) =>
						setTimeout(resolve, interval)
					);
					continue;
				}
			}

		return NextResponse.json({ videoUrl });
	} catch (error) {
		console.error("Video Generation Error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
