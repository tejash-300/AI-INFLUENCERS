"use client";

import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function VideoScriptPage() {
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateScript = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic to generate a script.");
      return;
    }
    setError("");
    setLoading(true);
    setScript("");

    try {
      const response = await axios.get(`/api/generate-script?topic=${topic}`);
      setScript(response.data.script || "No script generated.");
    } catch (err) {
      setError("Failed to generate script. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col mt-[60px] py-8 items-center justify-center bg-gray-900 text-white px-4">
      <motion.div 
        className="bg-gray-800 p-8 rounded-2xl shadow-lg backdrop-blur-lg bg-opacity-50 w-full max-w-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center text-white mb-4">Create a Viral Video Script</h1>
        <Input
          type="text"
          placeholder="Enter a video topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="mt-4 text-white bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
        />
        <Button 
          onClick={generateScript} 
          className="mt-4 w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Generate Script"}
        </Button>
      </motion.div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {script && (
        <motion.div 
          className="mt-6 w-full max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-white mb-2">Generated Script:</h2>
          <Card className="bg-gray-800 border border-gray-700">
            <CardContent className="p-4">
              <Textarea
                value={script}
                readOnly
                className="w-full bg-gray-700 text-white border-none focus:ring-0 resize-none"
                rows={10}
              />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}