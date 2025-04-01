"use client";
import { useRef, useState } from "react";

export default function LipSyncForm() {
	const [video, setVideo] = useState<File | null>(null);
	const [videoName, setVideoName] = useState("");
	const [script, setScript] = useState("");
	const [loading, setLoading] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [outputVideo, setOutputVideo] = useState("");
	const [error, setError] = useState("");
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (!isDragging) setIsDragging(true);
	};

	const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const files = e.dataTransfer.files;
		if (files && files.length > 0) {
			const file = files[0];
			// Check if it's a video file
			if (file.type.startsWith("video/")) {
				setVideo(file);
				setVideoName(file.name);
			} else {
				setError("Please upload a video file.");
			}
		}
	};

	const handleSubmit = async () => {
        if (!video || !script) {
            return alert("Upload a video and enter a script.");
        }
    
        setError("");
        setLoading(true);
        setUploading(true);
    
        try {
            // 🔹 Upload video to S3
            const formData = new FormData();
            formData.append("file", video);
            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
    
            if (!uploadRes.ok) throw new Error("Video upload failed.");
            const uploadData = await uploadRes.json();
            const videoUrl = uploadData.url;
            setUploading(false);
    
            // 🔹 Start lip-sync job and get jobId
            const res = await fetch("/api/lipsync/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ videoUrl, script }),
            });
    
            if (!res.ok) throw new Error("Lip-sync job start failed.");
            const data = await res.json();
            const jobId = data?.jobId;
            if (!jobId) throw new Error("Failed to retrieve job ID.");
    
            // 🔄 Polling for job status
            let outputVideo = "";
            let attempts = 0;
            while (true) {
                attempts++;
                console.log(`Checking status... Attempt ${attempts}`);
                await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds
                const statusRes = await fetch(`/api/lipsync/status?jobId=${jobId}`);
                if (!statusRes.ok) throw new Error("Failed to check job status.");
    
                const statusData = await statusRes.json();
                if (statusData.status === "COMPLETED") {
                    outputVideo = statusData.videoUrl;
                    break;
                } else if (statusData.status === "FAILED") {
                    throw new Error("Lip-sync processing failed.");
                }
            }
    
            setOutputVideo(outputVideo);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong."
            );
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

	return (
		<div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-6">
			<h1 className="text-3xl font-bold mb-6">
				Video to Video Generator
			</h1>

			<div className="w-full max-w-lg mb-4">
				<label
					htmlFor="video-upload"
					className={`flex flex-col items-center justify-center w-full h-32 px-4 transition bg-gray-800 border-2 ${
						isDragging
							? "border-blue-500 bg-gray-750"
							: "border-gray-700"
					} border-dashed rounded-lg cursor-pointer hover:bg-gray-750 hover:border-blue-500`}
					onDragEnter={handleDragEnter}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<div className="flex flex-col items-center justify-center pt-5 pb-6">
						<svg
							className="w-8 h-8 mb-3 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
							></path>
						</svg>
						<p className="mb-2 text-sm text-gray-400">
							<span className="font-semibold">
								Click to upload
							</span>{" "}
							or drag and drop
						</p>
						<p className="text-xs text-gray-400">
							MP4, MOV, or other video formats
						</p>
					</div>

					<input
						id="video-upload"
						ref={fileInputRef}
						type="file"
						accept="video/*"
						onChange={(e) => {
							const file = e.target.files?.[0] || null;
							setVideo(file);
							setVideoName(file ? file.name : "");
						}}
						className="hidden"
					/>
				</label>
			</div>
			{videoName && (
				<div className="mb-4 bg-gray-800 p-2 rounded text-green-500">
					<p className="text-sm truncate">{videoName}</p>
				</div>
			)}

			<textarea
				className="w-full p-2 bg-gray-800 text-white rounded-xl mb-4"
				rows={3}
				placeholder="Enter your script here..."
				onChange={(e) => setScript(e.target.value)}
			/>

			<button
				onClick={handleSubmit}
				disabled={loading}
				className="bg-blue-600 px-6 py-2 cursor-pointer rounded text-white hover:bg-blue-700"
			>
				{loading
					? uploading
						? "Uploading Video..."
						: "Processing..."
					: "Generate Video"}
			</button>
			{loading && (
				<div className="flex items-center mt-4">
					<svg
						className="animate-spin h-5 w-5 mr-3 text-blue-500"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm1.5 17.5h-3v-3h3zm0-4.5h-3V7h3z"
						/>
					</svg>
					<span className="text-blue-500">
						Your Video is being generated. This may take some time.
						Do not close this tab.
					</span>
				</div>
			)}

			{error && <p className="text-red-500 mt-4">{error}</p>}

			{outputVideo && (
				<div className="mt-6">
					<h2 className="text-xl mb-2">Generated Video:</h2>
					<video
						controls
						src={outputVideo}
						className="rounded w-full max-w-lg"
					/>
				</div>
			)}
		</div>
	);
}
