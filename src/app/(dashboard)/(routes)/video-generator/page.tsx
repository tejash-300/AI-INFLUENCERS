"use client";

import { useState } from "react";

export default function VideoGenerator() {
  const [script, setScript] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [engine, setEngine] = useState("D-ID");

  const handleGenerateVideo = async () => {
    if (!script.trim() || !sourceUrl.trim()) {
      alert("Please enter a script and source URL.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, sourceUrl, engine }),
      });

      const data = await response.json();
      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
      } else {
        alert("Failed to generate video.");
      }
    } catch (error) {
      console.error("Video Generation Error:", error);
      alert("An error occurred.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 mt-[60px] py-8 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">🎬 Image to Video Generator</h1>

      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-md">
        <label className="block mb-2 text-gray-400">🎤 Enter Script:</label>
        <textarea
          className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-lg"
          rows={4}
          value={script}
          onChange={(e) => setScript(e.target.value)}
        />

        <label className="block mt-4 mb-2 text-gray-400">🔗 Source Image URL:</label>
        <input
          type="text"
          className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-lg"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
        />

        {/* <label className="block mt-4 mb-2 text-gray-400">🎥 Select Engine:</label>
        <select
          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
          value={engine}
          onChange={(e) => setEngine(e.target.value)}
        >
          <option value="D-ID">D-ID</option>
          <option value="Heygen">Heygen</option>
        </select> */}

        <button
          className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-bold"
          onClick={handleGenerateVideo}
          disabled={loading}
        >
          {loading ? "Generating..." : "🚀 Generate Video"}
        </button>

        {videoUrl && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">🎞️ Generated Video:</h2>
            <video className="w-full rounded-lg mt-2" controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
}