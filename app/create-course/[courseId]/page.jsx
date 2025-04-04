"use client";
import { db } from "@/configs/db";
import { Chapters, CourseList } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import CourseBasicInfo from "./_components/CourseBasicInfo";
import CourseDetail from "./_components/CourseDetail";
import ChapterList from "./_components/ChapterList";
import LoadingDialog from "../_components/LoadingDialog";
import { Button } from "@/components/ui/button";
import { GenerateChapterContent_AI } from "@/configs/AiModel";
import service from "@/configs/service";
import { useRouter } from "next/navigation";

function CourseLayout({ params }) {
    const { user } = useUser();
    const [course, setCourse] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        params && getCourse();
    }, [params, user]);

    const getCourse = async () => {
        const result = await db
            .select()
            .from(CourseList)
            .where(
                and(
                    eq(CourseList.courseId, params?.courseId),
                    eq(
                        CourseList?.createdBy,
                        user?.primaryEmailAddress?.emailAddress
                    )
                )
            );

        setCourse(result[0]);
    };

    // Helper function to translate text using our API route
    const translateText = async (text) => {
        if (!text || text.trim() === "") return "";

        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error(
                    `Translation failed with status: ${response.status}`
                );
            }

            const data = await response.json();
            return data.translatedText || text; // Fall back to original text if translation fails
        } catch (error) {
            console.warn("Translation error:", error);
            return text; // Return original text if translation fails
        }
    };

    // Helper function to extract relevant keywords from chapter content
    const extractKeywords = async (chapterName, courseName) => {
        // Remove common prefixes like "Chapter 1: " or "1-bob: "
        const cleanChapterName = chapterName.replace(
            /^(\d+[\s\-\.:]*)?(chapter|bob|section|part|qism)?[\s\-\.:]+/i,
            ""
        );

        // Translate the chapter name and course name
        const translatedChapterName = await translateText(cleanChapterName);
        const translatedCourseName = await translateText(courseName);

        console.log(
            `Translation: "${cleanChapterName}" -> "${translatedChapterName}"`
        );

        // Split into words, remove small words (less than 3 chars) and duplicates
        const chapterWords = [
            ...new Set(
                translatedChapterName
                    .split(/[\s\-\.:,]+/)
                    .filter((word) => word.length > 2)
                    .map((word) => word.toLowerCase())
            ),
        ];

        // Get course name words, also removing duplicates and small words
        const courseWords = [
            ...new Set(
                translatedCourseName
                    .split(/[\s\-\.:,]+/)
                    .filter((word) => word.length > 2)
                    .map((word) => word.toLowerCase())
            ),
        ];

        // Create unique keywords by prioritizing chapter-specific terms
        const uniqueChapterWords = chapterWords.filter(
            (word) => !courseWords.includes(word)
        );

        return {
            primaryKeywords: uniqueChapterWords,
            courseKeywords: courseWords,
            allKeywords: [...uniqueChapterWords, ...courseWords],
            translatedChapterName,
            translatedCourseName,
        };
    };

    // Track which videos have already been used to avoid duplicates
    const usedVideos = new Set();

    // Helper function to search for videos with multiple strategies
    const findVideoForChapter = async (
        courseName,
        chapterName,
        additionalContent = ""
    ) => {
        try {
            const keywords = await extractKeywords(chapterName, courseName);
            console.log(`Keywords extracted for "${chapterName}":`, keywords);

            // Translate any additional content if provided
            let translatedAdditionalKeywords = "";
            if (additionalContent) {
                translatedAdditionalKeywords = await translateText(
                    additionalContent
                );
                console.log(
                    `Additional content translated: "${additionalContent}" -> "${translatedAdditionalKeywords}"`
                );
            }

            // Build search queries in order of relevance
            const searchQueries = [
                // 1. Translated chapter name with educational terms
                `${keywords.translatedChapterName} tutorial`,
                `${keywords.translatedChapterName} lesson`,
                `how to ${keywords.translatedChapterName}`,

                // 2. If we have additional content, try with it
                ...(translatedAdditionalKeywords
                    ? [
                          `${keywords.translatedChapterName} ${translatedAdditionalKeywords} tutorial`,
                      ]
                    : []),

                // 3. Chapter-specific keywords with educational terms
                ...(keywords.primaryKeywords.length > 0
                    ? [
                          `${keywords.primaryKeywords.join(" ")} tutorial`,
                          `${keywords.primaryKeywords.join(" ")} guide`,
                          `${keywords.primaryKeywords.join(" ")} explanation`,
                      ]
                    : []),

                // 4. Chapter keywords with course context
                ...(keywords.primaryKeywords.length > 0
                    ? [
                          `${
                              keywords.translatedCourseName
                          } ${keywords.primaryKeywords.join(" ")}`,
                      ]
                    : []),

                // 5. Exact translated chapter name with course context as fallback
                `${keywords.translatedCourseName} ${keywords.translatedChapterName}`,

                // 6. Course as last resort
                `${keywords.translatedCourseName} tutorial`,
                `learn ${keywords.translatedCourseName}`,
            ];

            // Determine topic from course name to filter results
            const topicCategories = {
                programming: [
                    "javascript",
                    "python",
                    "java",
                    "code",
                    "programming",
                    "developer",
                    "web",
                    "app",
                ],
                math: ["math", "calculus", "algebra", "geometry", "statistics"],
                science: ["physics", "chemistry", "biology", "science"],
                language: ["english", "language", "grammar", "vocabulary"],
                // Add more categories as needed
            };

            let courseTopic = "";
            for (const [topic, topicKeywords] of Object.entries(
                topicCategories
            )) {
                if (
                    topicKeywords.some(
                        (keyword) =>
                            keywords.translatedCourseName
                                .toLowerCase()
                                .includes(keyword) ||
                            keywords.translatedChapterName
                                .toLowerCase()
                                .includes(keyword)
                    )
                ) {
                    courseTopic = topic;
                    break;
                }
            }

            // Container for all videos found across all queries
            const allFoundVideos = [];

            // Try each search query until we find a relevant video
            for (const query of searchQueries) {
                console.log(`Searching for video with query: "${query}"`);

                try {
                    const resp = await service.getVideos(query);

                    if (resp && resp.length > 0) {
                        // Add all videos from this query to our collection
                        allFoundVideos.push(...resp);
                    }
                } catch (searchError) {
                    console.warn(
                        `Search error for query "${query}":`,
                        searchError
                    );
                    // Continue with next query
                }

                // Small delay between requests to avoid rate limiting
                await new Promise((resolve) => setTimeout(resolve, 500));
            }

            // Filter function to identify more relevant videos
            const scoreVideo = (video) => {
                if (!video.snippet) return 0;

                let score = 0;
                const title = video.snippet.title.toLowerCase();
                const description =
                    video.snippet.description?.toLowerCase() || "";

                // Check for educational indicators
                if (
                    title.includes("tutorial") ||
                    title.includes("lesson") ||
                    title.includes("guide") ||
                    title.includes("how to") ||
                    title.includes("learn") ||
                    title.includes("course")
                ) {
                    score += 10;
                }

                // Check for topic match
                if (
                    courseTopic &&
                    (title.includes(courseTopic) ||
                        description.includes(courseTopic))
                ) {
                    score += 5;
                }

                // Check for chapter keyword matches
                keywords.primaryKeywords.forEach((keyword) => {
                    if (title.includes(keyword)) score += 3;
                    if (description.includes(keyword)) score += 1;
                });

                // Check for course name match
                if (
                    title.includes(keywords.translatedCourseName.toLowerCase())
                ) {
                    score += 5;
                }

                // Prefer English content
                if (title.match(/[a-zA-Z]{5,}/)) {
                    score += 8; // Likely English if it has several English words
                }

                // Heavily penalize videos we've already used
                if (usedVideos.has(video.id.videoId)) {
                    score -= 50;
                }

                return score;
            };

            // Now score and sort ALL collected videos
            if (allFoundVideos.length > 0) {
                // Remove duplicates by videoId
                const uniqueVideos = Array.from(
                    new Map(
                        allFoundVideos.map((v) => [v.id.videoId, v])
                    ).values()
                );

                // Score and sort videos by relevance
                const scoredVideos = uniqueVideos
                    .map((video) => ({
                        video,
                        score: scoreVideo(video),
                        title: video.snippet?.title || "Unknown",
                    }))
                    .sort((a, b) => b.score - a.score);

                console.log(
                    `Found ${scoredVideos.length} unique videos. Top 3 scores:`
                );
                scoredVideos.slice(0, 3).forEach((v, i) => {
                    console.log(`${i + 1}. "${v.title}" - Score: ${v.score}`);
                });

                if (scoredVideos.length > 0) {
                    const bestMatch = scoredVideos[0].video;
                    console.log(
                        `Selected video: "${bestMatch.snippet.title}" (Score: ${scoredVideos[0].score})`
                    );

                    // Add the selected video to our "used" set to avoid duplicates
                    usedVideos.add(bestMatch.id.videoId);

                    return bestMatch.id.videoId;
                }
            }

            console.log(
                `No videos found for chapter "${chapterName}" after multiple attempts`
            );
            return "";
        } catch (error) {
            console.error(
                `Error searching for videos for "${chapterName}":`,
                error
            );
            return "";
        }
    };

    const GenerateChapterContent = async () => {
        const chapters = course?.courseOutput?.course?.chapters;
        if (!chapters || chapters.length === 0) {
            console.log("No chapters to process.");
            return;
        }

        setIsLoading(true);

        // Reset the used videos tracking set at the beginning of each generation
        usedVideos.clear();

        // Track which chapters have been successfully processed
        const successfulChapters = new Set();
        // Track chapters that are still pending after retries
        const failedChapters = [];

        // Define maximum retry attempts per chapter
        const MAX_RETRIES = 3;
        // Delay between retries (in milliseconds)
        const RETRY_DELAY = 2000;

        try {
            // First pass: try to process all chapters
            for (const [index, chapter] of chapters.entries()) {
                if (index >= 15) break; // Limit to 15 chapters

                if (successfulChapters.has(index)) continue; // Skip already processed chapters

                console.log(
                    `Processing chapter ${index + 1}/${Math.min(
                        chapters.length,
                        15
                    )}: ${chapter.chapterName}`
                );

                // Try to process this chapter with retries
                let retryCount = 0;
                let success = false;

                while (retryCount < MAX_RETRIES && !success) {
                    if (retryCount > 0) {
                        console.log(
                            `Retry #${retryCount} for chapter ${chapter.chapterName}`
                        );
                        // Add delay between retries
                        await new Promise((resolve) =>
                            setTimeout(resolve, RETRY_DELAY)
                        );
                    }

                    try {
                        // First, get AI-generated content for this chapter
                        const PROMPT =
                            "Explain the concept in Detail on Topic: " +
                            course?.name +
                            ", Chapter: " +
                            chapter?.chapterName +
                            ", in JSON Format with a list of arrays with fields as title, explanation on given chapter in detail, Code Example (Code field in <precode> format) if applicable in Uzbek. Ensure all special characters (e.g., newlines, backslashes, quotes) in code examples are properly escaped for valid JSON.";

                        // Get AI-generated content first so we can use it for better video search
                        const result =
                            await GenerateChapterContent_AI.sendMessage(PROMPT);
                        const rawText = result.response?.text();

                        if (!rawText) {
                            throw new Error(
                                "Empty or undefined response from AI"
                            );
                        }

                        // Parse the JSON content
                        let contentObject;
                        try {
                            // Try direct parsing first
                            contentObject = JSON.parse(rawText);
                        } catch (jsonError) {
                            // If direct parsing fails, try to extract JSON
                            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
                            if (jsonMatch) {
                                try {
                                    contentObject = JSON.parse(jsonMatch[0]);
                                } catch (extractError) {
                                    console.log(
                                        "Could not parse JSON even after extraction:",
                                        extractError
                                    );
                                    throw extractError;
                                }
                            } else {
                                console.log("No JSON object found in response");
                                throw new Error(
                                    "Invalid response format from AI"
                                );
                            }
                        }

                        // Extract section titles from content
                        let additionalKeywords = "";
                        if (contentObject && contentObject.sections) {
                            additionalKeywords = contentObject.sections
                                .slice(0, 3)
                                .map((section) => section.title)
                                .join(" ");
                        }

                        // Get video ID using the enhanced search with content-based keywords
                        const videoId = await findVideoForChapter(
                            course.name,
                            chapter.chapterName,
                            additionalKeywords
                        );

                        // Save chapter content to database
                        await db.insert(Chapters).values({
                            chapterId: index,
                            courseId: course?.courseId,
                            content: contentObject,
                            videoId,
                        });

                        console.log(
                            `Successfully processed chapter ${chapter.chapterName}`
                        );

                        // Mark this chapter as successfully processed
                        successfulChapters.add(index);
                        success = true;
                    } catch (err) {
                        console.log(
                            `Error processing chapter ${
                                chapter.chapterName
                            } (Attempt ${retryCount + 1}/${MAX_RETRIES}):`,
                            err
                        );
                        retryCount++;

                        // If we've reached max retries, add to failed chapters list
                        if (retryCount >= MAX_RETRIES) {
                            failedChapters.push({
                                index,
                                chapterName: chapter.chapterName,
                                error: err.message,
                            });
                        }
                    }
                }
            }

            // Check if we have any failed chapters after initial processing
            if (failedChapters.length > 0) {
                console.log(
                    `${failedChapters.length} chapters failed after ${MAX_RETRIES} attempts.`
                );
                console.log(
                    `Failed chapters: ${failedChapters
                        .map((ch) => ch.chapterName)
                        .join(", ")}`
                );

                // Optionally, you can implement a more aggressive retry for persistently failing chapters
                // This could include using a different prompt format or other strategies
            }

            // Check if we've processed all required chapters
            const totalProcessed = successfulChapters.size;
            const totalToProcess = Math.min(chapters.length, 15);

            if (totalProcessed === totalToProcess) {
                console.log(
                    `All ${totalProcessed} chapters successfully processed!`
                );

                // Mark course as published only when all chapters are successfully processed
                await db
                    .update(CourseList)
                    .set({ publish: true })
                    .where(eq(CourseList.courseId, course?.courseId));

                router.replace(
                    "/create-course/" + course?.courseId + "/finish"
                );
            } else {
                console.log(
                    `Processed ${totalProcessed}/${totalToProcess} chapters.`
                );
                // You might want to ask the user if they want to publish anyway or try again later

                // Show an alert or message to the user
                alert(
                    `${totalProcessed} out of ${totalToProcess} chapters were successfully processed. ${failedChapters.length} chapters failed after multiple attempts.`
                );
            }
        } catch (err) {
            console.log("Unexpected error in GenerateChapterContent:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-10 px-7 md:px-20 lg:px-44">
            <h2 className="font-bold text-center text-2xl">Course Layout</h2>

            <LoadingDialog isLoading={isLoading} />

            <CourseBasicInfo course={course} refreshData={getCourse} />
            <CourseDetail course={course} />
            <ChapterList course={course} refreshData={getCourse} />

            <Button className="my-10" onClick={GenerateChapterContent}>
                Generate Course Content
            </Button>
        </div>
    );
}

export default CourseLayout;
