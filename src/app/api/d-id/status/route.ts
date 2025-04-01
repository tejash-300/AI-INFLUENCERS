import { NextRequest, NextResponse } from "next/server";

const DID_API_KEY = process.env.D_ID_API_KEY || "";
const DID_BASE_URL = "https://api.d-id.com";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const talkId = searchParams.get("talkId");

		if (!talkId) {
			return NextResponse.json(
				{ error: "Missing talkId parameter." },
				{ status: 400 }
			);
		}

		// 🔹 Check the job status
		const statusResponse = await fetch(`${DID_BASE_URL}/talks/${talkId}`, {
			method: "GET",
			headers: { Authorization: `Basic ${DID_API_KEY}` },
		});

		const statusData = await statusResponse.json();
		console.log(`🔄 Talk Status:`, statusData);

		if (statusData.status === "done") {
			return NextResponse.json({ status: "COMPLETED", videoUrl: statusData.result_url });
		} else if (statusData.status === "failed") {
			return NextResponse.json({ status: "FAILED" });
		} else {
			return NextResponse.json({ status: "PROCESSING" });
		}
	} catch (error) {
		console.error("❌ Error checking video status:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}