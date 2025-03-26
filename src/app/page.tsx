"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChatBubbleIcon, RocketIcon, GearIcon } from "@radix-ui/react-icons";
import { JSX } from "react";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-[#0D1117] text-white px-6">
			{/* Background Gradient Animation */}
			<motion.div
				className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-[200px]"
				animate={{ opacity: [0.3, 0.5, 0.3] }}
				transition={{
					duration: 5,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			{/* Hero Section */}
			<section className="text-center mt-20">
				<motion.h1
					className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					Influencer GPT
				</motion.h1>
				<motion.p
					className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.5 }}
				>
					Elevate your influence with AI-driven insights, automation,
					and content creation.
				</motion.p>

				{/* Mockup Image (Replace with actual UI preview)
        <motion.div
          className="mt-10 border border-gray-700 rounded-xl overflow-hidden w-full max-w-3xl bg-[#161B22] shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <img
            src="/mockup.png"
            alt="App Preview"
            className="w-full object-cover"
          />
        </motion.div> */}

				{/* Call to Action */}
				<motion.div
					className="mt-4"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.6 }}
				>
					<div className="relative z-10">
						<Link
							href="/dashboard"
							className="px-6 py-2 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:opacity-80 transition inline-block cursor-pointer text-white"
						>
							Get Started
						</Link>
					</div>
				</motion.div>
			</section>

			{/* Feature Section */}
			<section className="mt-36 grid md:grid-cols-3 gap-8 max-w-5xl text-center">
				<FeatureCard
					icon={
						<ChatBubbleIcon className="w-10 h-10 text-blue-400" />
					}
					title="Smart AI Conversations"
					description="Engage with an intelligent AI designed to help influencers craft their brand voice."
				/>
				<FeatureCard
					icon={<RocketIcon className="w-10 h-10 text-purple-400" />}
					title="Automated Content Creation"
					description="Generate captions, blog posts, and even video scripts instantly."
				/>
				<FeatureCard
					icon={<GearIcon className="w-10 h-10 text-green-400" />}
					title="Customizable AI"
					description="Fine-tune your AI to match your personality and content style."
				/>
			</section>

			{/* Footer */}
			<footer className="mt-20 text-gray-400 text-center py-6 border-t border-gray-700 w-full">
				© {new Date().getFullYear()} Influencer GPT. All rights
				reserved.
			</footer>
		</main>
	);
}

// Feature Card Component
function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: JSX.Element;
	title: string;
	description: string;
}) {
	return (
		<motion.div
			className="p-6 bg-[#161B22] rounded-lg shadow-lg hover:shadow-xl transition"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="mb-3 flex justify-center">{icon}</div>
			<h3 className="text-xl font-semibold">{title}</h3>
			<p className="text-gray-300 mt-2">{description}</p>
		</motion.div>
	);
}
