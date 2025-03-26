"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from "@/components/ui/card";

export default function VirtualInfluencerPage() {
    const [name, setName] = useState("Lumi Haze");
    const [personality, setPersonality] = useState("Adventurous and creative");
    const [interests, setInterests] = useState(
        "Technology, fashion, and mental health awareness"
    );
    const [profile, setProfile] = useState("");
    const [numPosts, setNumPosts] = useState(1);
    const [posts, setPosts] = useState<string[]>([]);
    const [imageDesc, setImageDesc] = useState(
        "A young, stylish influencer with a bright smile wearing trendy clothes"
    );
    const [imageStyle, setImageStyle] = useState("realistic");
    const [imageUrl, setImageUrl] = useState("");
    
    // Loading states for the three actions
    const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
    const [isGeneratingPosts, setIsGeneratingPosts] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

    const generateProfile = async () => {
        setIsGeneratingProfile(true);
        try {
            const response = await fetch("/api/influencer/profile", {
                method: "POST",
                body: JSON.stringify({ name, personality, interests }),
            });
            const data = await response.json();
            setProfile(data.profile);
        } catch (error) {
            console.error("Error generating profile:", error);
        } finally {
            setIsGeneratingProfile(false);
        }
    };

    const generatePosts = async () => {
        setIsGeneratingPosts(true);
        try {
            const response = await fetch("/api/influencer/posts", {
                method: "POST",
                body: JSON.stringify({ numPosts }),
            });
            const data = await response.json();
            setPosts(data.posts);
        } catch (error) {
            console.error("Error generating posts:", error);
        } finally {
            setIsGeneratingPosts(false);
        }
    };

    const generateImage = async () => {
        setIsGeneratingImage(true);
        try {
            const response = await fetch("/api/influencer/image", {
                method: "POST",
                body: JSON.stringify({ description: imageDesc, style: imageStyle }),
            });
            const data = await response.json();
            console.log(data.imageUrl);
            setImageUrl(data.imageUrl);
        } catch (error) {
            console.error("Error generating image:", error);
        } finally {
            setIsGeneratingImage(false);
        }
    };

    return (
        <div className="bg-gray-900 mt-[60px] mx-auto px-6 cursor-pointer py-10">
            <h1 className="text-3xl text-center font-bold mb-6 cursor-pointer">
                ✨ Virtual Influencer Generator
            </h1>

            {/* Step 1: Profile Generation */}
            <Card className="mb-6 cursor-pointer bg-gray-800">
                <CardHeader>
                    <h2 className="text-xl font-semibold">
                        Step 1: Generate Influencer Profile
                    </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                    <h1 className="text-lg font-bold text-white mb-4">
                        Name:
                    </h1>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-gray-700"
                    />
                    <h1 className="text-lg font-bold text-white  mb-4">
                        Personality:
                    </h1>
                    <Input
                        value={personality}
                        onChange={(e) => setPersonality(e.target.value)}
                        className="bg-gray-700"
                    />
                    <h1 className="text-lg font-bold text-white mb-4">
                        Interests:
                    </h1>
                    <Input
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                        className="bg-gray-700"
                    />
                    <Button 
                        onClick={generateProfile} 
                        className="mt-6 cursor-pointer w-full py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-bold"
                        disabled={isGeneratingProfile}
                    >
                        {isGeneratingProfile ? "Generating..." : "Generate Profile"}
                    </Button>
                    {profile && (
                        <Textarea value={profile} readOnly className="h-32" />
                    )}
                </CardContent>
            </Card>

            {/* Step 2: Post Generation */}
            <Card className="mb-6 cursor-pointer bg-gray-800">
                <CardHeader>
                    <h2 className="text-xl font-semibold">
                        Step 2: Generate Influencer Posts
                    </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                    <h1 className="text-lg font-bold text-white mb-4">
                        Number of Posts:
                    </h1>
                    <Input
                        type="number"
                        value={numPosts}
                        onChange={(e) => setNumPosts(Number(e.target.value))}
                        min={1}
                        max={10}
                        className="bg-gray-700"
                    />
                    <Button 
                        onClick={generatePosts} 
                        className="mt-6 cursor-pointer w-full py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-bold"
                        disabled={isGeneratingPosts}
                    >
                        {isGeneratingPosts ? "Generating..." : "Generate Posts"}
                    </Button>
                    {posts.length > 0 && (
                        <div className="mt-4 space-y-3">
                            {posts.map((post, idx) => (
                                <Card key={idx} className="p-4">
                                    <p className="font-medium">
                                        Post #{idx + 1}
                                    </p>
                                    <p className="text-gray-200">{post}</p>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Step 3: Image Generation */}
            <Card className="bg-gray-800">
                <CardHeader>
                    <h2 className="text-xl font-semibold">
                        Step 3: Generate Influencer Image
                    </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                    <h1 className="text-lg font-bold text-white mb-4">
                        Description:
                    </h1>
                    <Input
                        value={imageDesc}
                        onChange={(e) => setImageDesc(e.target.value)}
                        className="bg-gray-700"
                    />

                        <div className="bg-gray-700"><Select
                            value={imageStyle}
                            onValueChange={setImageStyle}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Style" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Realistic" className="bg-gray-700">
                                    Realistic
                                </SelectItem>
                                <SelectItem value="Cartoon" className="bg-gray-700">Cartoon</SelectItem>
                                <SelectItem value="Abstract" className="bg-gray-700">
                                    Abstract
                                </SelectItem>
                            </SelectContent>
                        </Select></div>
                    <Button 
                        onClick={generateImage} 
                        className="mt-6 cursor-pointer w-full py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-bold"
                        disabled={isGeneratingImage}
                    >
                        {isGeneratingImage ? "Generating..." : "Generate Image"}
                    </Button>
                    {imageUrl && (
                        <div className="mt-4">
                            <img
                                src={imageUrl}
                                alt="Generated Influencer"
                                width={500}
                                height={500}
                                className="rounded-lg shadow-md"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
