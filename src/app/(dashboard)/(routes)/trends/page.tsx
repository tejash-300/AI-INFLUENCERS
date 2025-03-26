"use client";

import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function TrendsPage() {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("GPT");
  const [trends, setTrends] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTrends = async () => {
    if (!query.trim()) {
      setError("Please enter a topic to search trends.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await axios.get(`/api/get-trends?query=${query}&source=${source}`);
      setTrends(response.data.trends || []);
    } catch (err) {
      setError("Failed to fetch trends. Try again.");
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
        <h1 className="text-3xl font-bold text-center text-white mb-4">Discover Trends</h1>
        <Input
          type="text"
          placeholder="Enter a topic..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-4 text-white bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
        />
        <RadioGroup className="mt-4 flex justify-center gap-4" value={source} onValueChange={setSource}>
          <label className="flex items-center space-x-2">
            <RadioGroupItem value="Twitter" /> <span>Twitter</span>
          </label>
          <label className="flex items-center space-x-2">
            <RadioGroupItem value="GPT" /> <span>GPT</span>
          </label>
        </RadioGroup>
        <Button 
          onClick={fetchTrends} 
          className="mt-4 w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin cursor-pointer w-5 h-5 mx-auto" /> : "Find Trends"}
        </Button>
      </motion.div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {trends.length > 0 && (
        <motion.div 
          className="mt-6 w-full max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-white mb-2">Top Trends:</h2>
          <Card className="bg-gray-800 border border-gray-700">
            <CardContent className="p-4">
              <ul className="space-y-2">
                {trends.map((trend, index) => (
                  <motion.li 
                    key={index} 
                    className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {trend}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}