import axios from "axios";

const D_ID_API_KEY = process.env.D_ID_API_KEY;
const D_ID_API_URL = "https://api.d-id.com/talks";

export async function createDIdVideo(fileUrl: string, script: string) {
  try {
    const response = await axios.post(
      D_ID_API_URL,
      {
        source_url: fileUrl,
        script,
      },
      { headers: { Authorization: `Bearer ${D_ID_API_KEY}` } }
    );
    return response.data.id;
  } catch (error) {
    console.error("D-ID Video Creation Error:", error);
    return null;
  }
}

export async function checkDIdVideoStatus(talkId: string) {
  try {
    for (let i = 0; i < 20; i++) {
      const response = await axios.get(`${D_ID_API_URL}/${talkId}`, {
        headers: { Authorization: `Bearer ${D_ID_API_KEY}` },
      });

      if (response.data.status === "done") {
        return response.data.result_url;
      }
      await new Promise((res) => setTimeout(res, 30000)); // 30s wait
    }
    return null;
  } catch (error) {
    console.error("D-ID Status Check Error:", error);
    return null;
  }
}