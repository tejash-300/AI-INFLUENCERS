import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const jobId = req.nextUrl.searchParams.get("jobId");
    let attempts = 1;
    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    const url = `https://api.sync.so/v2/generate/${jobId}`;
    const options = { method: "GET", headers: { "x-api-key": process.env.WAV2LIP_API_KEY! } };

    const response = await fetch(url, options);
    if (!response.ok) {
      console.error("❌ Wav2Lip status check failed:", await response.text());
      return NextResponse.json({ error: "Failed to check status." }, { status: response.status });
    }

    const statusResponse = await response.json();
    console.log(`Checking status... Attempt ${attempts}`);
    attempts++;
    return NextResponse.json({
      status: statusResponse.status,
      videoUrl: statusResponse.outputUrl || null,
    });
  } catch (error) {
    console.error("❌ Error in /api/lipsync/status:", error);
    return NextResponse.json({ error: "Failed to check job status." }, { status: 500 });
  }
}