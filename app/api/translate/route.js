import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
    try {
        const body = await request.json();
        const { text, targetLanguage = "en" } = body;

        if (!text || text.trim() === "") {
            return NextResponse.json({ translatedText: "" });
        }

        // Use the Google Translate API unofficial client
        const response = await axios.get(
            "https://translate.googleapis.com/translate_a/single",
            {
                params: {
                    client: "gtx", // Use the free client
                    sl: "auto", // Auto-detect source language
                    tl: targetLanguage,
                    dt: "t", // Return translated text
                    q: text,
                },
            }
        );

        // Parse the response - it comes in a nested array format
        const translatedText = response.data[0].map((item) => item[0]).join("");

        return NextResponse.json({
            originalText: text,
            translatedText,
        });
    } catch (error) {
        console.error("Translation error:", error);
        return NextResponse.json(
            {
                error: "Translation failed",
                details: error.message,
                translatedText: "", // Return empty string as fallback
            },
            { status: 500 }
        );
    }
}
