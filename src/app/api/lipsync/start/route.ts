import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";
import { GoogleAuth } from "google-auth-library";


async function getAccessToken() {
    const auth = new GoogleAuth({
        credentials: {
            type: "service_account",
            project_id: "fabsa-446719",
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
        },
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    console.log("Access Token:", accessToken);
    return accessToken;
}

async function generateSpeech(script: string) {
  try {
    if (!process.env.GCLOUD_ACCESS_TOKEN) {
      throw new Error("Missing GCLOUD_ACCESS_TOKEN in .env file");
    }

    const response = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${(await getAccessToken()).token}`,
        "X-Goog-User-Project": "fabsa-446719",
      },
      body: JSON.stringify({
        input: { text: script },
        voice: { languageCode: "en-GB", name: "en-GB-Chirp3-HD-Aoede" },
        audioConfig: { audioEncoding: "MP3" },
      }),
    });

    if (!response.ok) {
      console.error("❌ Google Cloud TTS Error:", await response.text());
      throw new Error("Failed to generate speech.");
    }

    const { audioContent } = await response.json();
    const buffer = Buffer.from(audioContent, "base64");

    console.log("✅ Audio generated successfully");

    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      region: process.env.AWS_REGION!,
    });

    const fileName = `audio/${Date.now()}.mp3`;
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName,
      Body: buffer,
      ContentType: "audio/mpeg",
    };

    const { Location } = await s3.upload(uploadParams).promise();
    console.log("✅ Audio uploaded to S3:", Location);

    return Location;
  } catch (error) {
    console.error("❌ Error in generateSpeech:", error);
    throw new Error("Failed to generate speech.");
  }
}

export async function POST(req: NextRequest) {
  try {
    const { videoUrl, script } = await req.json();
    if (!videoUrl || !script) {
      return NextResponse.json({ error: "Missing video URL or script" }, { status: 400 });
    }

    console.log("✅ Generating speech...");
    const audioUrl = await generateSpeech(script);
    console.log("🎙️ Speech generated:", audioUrl);

    console.log("🎥 Calling Wav2Lip API...");
    const response = await fetch("https://api.sync.so/v2/generate", {
      method: "POST",
      headers: {
        "x-api-key": process.env.WAV2LIP_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "lipsync-1.7.1",
        input: [
          { type: "video", url: videoUrl },
          { type: "audio", url: audioUrl },
        ],
        options: {
          output_format: "mp4",
          fps: 25,
          output_resolution: [1280, 720],
          active_speaker: true,
        },
      }),
    });

    if (!response.ok) {
      console.error("❌ Wav2Lip API failed:", await response.text());
      return NextResponse.json({ error: "Wav2Lip API failed" }, { status: response.status });
    }

    const result = await response.json();
    console.log("✅ Wav2Lip Job Started:", result);

    return NextResponse.json({ jobId: result.id });
  } catch (error) {
    console.error("❌ Error in /api/lipsync/start:", error);
    return NextResponse.json({ error: "Failed to start job." }, { status: 500 });
  }
}