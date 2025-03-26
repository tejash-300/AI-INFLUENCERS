import axios from "axios";

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HEYGEN_API_URL = "https://api.heygen.com/v2/video/generate";

export async function createHeygenVideo(script: string) {
  try {
    const response = await axios.post(
      HEYGEN_API_URL,
      {
        script,
        voice: "en-US-JennyNeural", // Example voice, customize as needed
        avatar: "heygen-default", // Choose an avatar if required
      },
      {
        headers: {
          "X-Api-Key": `Bearer ${HEYGEN_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const videoId = response.data.video_id;
    return await checkHeygenVideoStatus(videoId);
  } catch (error) {
    console.error("Heygen Video Creation Error:", error);
    return null;
  }
}

async function checkHeygenVideoStatus(videoId: string) {
  try {
    for (let i = 0; i < 20; i++) {
      const response = await axios.get(`${HEYGEN_API_URL}/${videoId}`, {
        headers: { Authorization: `Bearer ${HEYGEN_API_KEY}` },
      });

      if (response.data.status === "completed") {
        return response.data.video_url;
      }
      await new Promise((res) => setTimeout(res, 30000)); // Wait 30s before retrying
    }
    return null;
  } catch (error) {
    console.error("Heygen Status Check Error:", error);
    return null;
  }
}