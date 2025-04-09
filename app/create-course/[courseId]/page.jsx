"use client";
import { db } from "@/configs/db";
import { Chapters, CourseList } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState, useRef } from "react";
import CourseBasicInfo from "./_components/CourseBasicInfo";
import CourseDetail from "./_components/CourseDetail";
import ChapterList from "./_components/ChapterList";
import LoadingDialog from "../_components/LoadingDialog";
import { motion, useAnimation, useInView } from "framer-motion";
import { Sparkles } from "lucide-react";
import service from "@/configs/service";
import { useRouter } from "next/navigation";
import { GenerateChapterContent_AI } from "@/configs/AiModel";

function CourseLayout({ params }) {
    const { user } = useUser();
    const [course, setCourse] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) controls.start("visible");
    }, [isInView, controls]);

    useEffect(() => {
        params && user && getCourse();
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

    const translateText = async (text) => {
        if (!text || text.trim() === "") return "";
        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });
            if (!response.ok)
                throw new Error(
                    `Translation failed with status: ${response.status}`
                );
            const data = await response.json();
            console.log(`Translation: "${text}" -> "${data.translatedText}"`);
            return data.translatedText || text;
        } catch (error) {
            console.warn("Translation error:", error);
            return text;
        }
    };

    const extractKeywords = async (chapterName, courseName) => {
        const cleanChapterName = chapterName.replace(
            /^(\d+[\s\-\.:]*)?(chapter|bob|section|part|qism)?[\s\-\.:]+/i,
            ""
        );
        const translatedChapterName = await translateText(cleanChapterName);
        const translatedCourseName = await translateText(courseName);

        console.log(
            `Translation: "${cleanChapterName}" -> "${translatedChapterName}"`
        );

        const chapterWords = [
            ...new Set(
                translatedChapterName
                    .split(/[\s\-\.:,]+/)
                    .filter((word) => word.length > 2)
                    .map((word) => word.toLowerCase())
            ),
        ];
        const courseWords = [
            ...new Set(
                translatedCourseName
                    .split(/[\s\-\.:,]+/)
                    .filter((word) => word.length > 2)
                    .map((word) => word.toLowerCase())
            ),
        ];
        const uniqueChapterWords = chapterWords.filter(
            (word) => !courseWords.includes(word)
        );

        console.log(`Keywords extracted for "${chapterName}":`, {
            primaryKeywords: uniqueChapterWords,
            courseKeywords: courseWords,
            allKeywords: [...uniqueChapterWords, ...courseWords],
            translatedChapterName,
            translatedCourseName,
        });

        return {
            primaryKeywords: uniqueChapterWords,
            courseKeywords: courseWords,
            allKeywords: [...uniqueChapterWords, ...courseWords],
            translatedChapterName,
            translatedCourseName,
        };
    };

    const usedVideos = new Set();

    const findVideoForChapter = async (
        courseName,
        chapterName,
        additionalContent = ""
    ) => {
        try {
            const keywords = await extractKeywords(chapterName, courseName);
            let translatedAdditionalKeywords = "";
            if (additionalContent) {
                translatedAdditionalKeywords = await translateText(
                    additionalContent
                );
                console.log(
                    `Additional content translated: "${additionalContent}" -> "${translatedAdditionalKeywords}"`
                );
            }

            const searchQueries = [
                `${keywords.translatedChapterName} tutorial`,
                `${keywords.translatedChapterName} lesson`,
                `how to ${keywords.translatedChapterName}`,
                ...(translatedAdditionalKeywords
                    ? [
                          `${keywords.translatedChapterName} ${translatedAdditionalKeywords} tutorial`,
                      ]
                    : []),
                ...(keywords.primaryKeywords.length > 0
                    ? [
                          `${keywords.primaryKeywords.join(" ")} tutorial`,
                          `${keywords.primaryKeywords.join(" ")} guide`,
                          `${keywords.primaryKeywords.join(" ")} explanation`,
                      ]
                    : []),
                ...(keywords.primaryKeywords.length > 0
                    ? [
                          `${
                              keywords.translatedCourseName
                          } ${keywords.primaryKeywords.join(" ")}`,
                      ]
                    : []),
                `${keywords.translatedCourseName} ${keywords.translatedChapterName}`,
                `${keywords.translatedCourseName} tutorial`,
                `learn ${keywords.translatedCourseName}`,
            ];

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

            const allFoundVideos = [];
            for (const query of searchQueries) {
                console.log(`Searching for video with query: "${query}"`);
                try {
                    const resp = await service.getVideos(query);
                    if (resp && resp.length > 0) allFoundVideos.push(...resp);
                } catch (searchError) {
                    console.warn(
                        `Search error for query "${query}":`,
                        searchError
                    );
                }
                await new Promise((resolve) => setTimeout(resolve, 500));
            }

            const scoreVideo = (video) => {
                if (!video.snippet) return 0;
                let score = 0;
                const title = video.snippet.title.toLowerCase();
                const description =
                    video.snippet.description?.toLowerCase() || "";
                if (
                    [
                        "tutorial",
                        "lesson",
                        "guide",
                        "how to",
                        "learn",
                        "course",
                    ].some((term) => title.includes(term))
                )
                    score += 10;
                if (
                    courseTopic &&
                    (title.includes(courseTopic) ||
                        description.includes(courseTopic))
                )
                    score += 5;
                keywords.primaryKeywords.forEach((keyword) => {
                    if (title.includes(keyword)) score += 3;
                    if (description.includes(keyword)) score += 1;
                });
                if (title.includes(keywords.translatedCourseName.toLowerCase()))
                    score += 5;
                if (title.match(/[a-zA-Z]{5,}/)) score += 8;
                if (usedVideos.has(video.id.videoId)) score -= 50;
                return score;
            };

            if (allFoundVideos.length > 0) {
                const uniqueVideos = Array.from(
                    new Map(
                        allFoundVideos.map((v) => [v.id.videoId, v])
                    ).values()
                );
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
        usedVideos.clear();
        const successfulChapters = new Set();
        const failedChapters = [];
        const MAX_RETRIES = 3;
        const RETRY_DELAY = 2000;

        try {
            for (const [index, chapter] of chapters.entries()) {
                if (index >= 15) break;
                if (successfulChapters.has(index)) continue;

                console.log(
                    `Processing chapter ${index + 1}/${Math.min(
                        chapters.length,
                        15
                    )}: ${chapter.chapterName}`
                );

                let retryCount = 0;
                let success = false;

                while (retryCount < MAX_RETRIES && !success) {
                    if (retryCount > 0) {
                        console.log(
                            `Retry #${retryCount} for chapter ${chapter.chapterName}`
                        );
                        await new Promise((resolve) =>
                            setTimeout(resolve, RETRY_DELAY)
                        );
                    }

                    try {
                        const PROMPT = `Explain the concept in Detail on Topic: ${course?.name}, Chapter: ${chapter?.chapterName}, in JSON Format with a list of arrays with fields as title, explanation on given chapter in detail, Code Example (Code field in <precode> format) if applicable in Uzbek. Ensure all special characters (e.g., newlines, backslashes, quotes) in code examples are properly escaped for valid JSON.`;
                        const result =
                            await GenerateChapterContent_AI.sendMessage(PROMPT);
                        const rawText = result.response?.text();

                        if (!rawText) {
                            throw new Error(
                                "Empty or undefined response from AI"
                            );
                        }

                        let contentObject;
                        try {
                            contentObject = JSON.parse(rawText);
                        } catch (jsonError) {
                            console.log(
                                "Direct parsing failed, trying to extract JSON"
                            );
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

                        const videoId = await findVideoForChapter(
                            course.name,
                            chapter.chapterName,
                            additionalKeywords
                        );

                        await db.insert(Chapters).values({
                            chapterId: index,
                            courseId: course?.courseId,
                            content: contentObject,
                            videoId,
                        });

                        console.log(
                            `Successfully processed chapter ${chapter.chapterName}`
                        );

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
            }

            const totalProcessed = successfulChapters.size;
            const totalToProcess = Math.min(chapters.length, 15);

            if (totalProcessed === totalToProcess) {
                console.log(
                    `All ${totalProcessed} chapters successfully processed!`
                );

                await db
                    .update(CourseList)
                    .set({ publish: true })
                    .where(eq(CourseList.courseId, course?.courseId));
                router.replace(`/create-course/${course?.courseId}/finish`);
            } else {
                console.log(
                    `Processed ${totalProcessed}/${totalToProcess} chapters.`
                );

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
        <section
            ref={ref}
            className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 px-4 py-10 text-white"
        >
            <div className="absolute inset-0 z-0 opacity-10">
                <div className="h-full w-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]">
                    <motion.div
                        initial={{ opacity: 0.3 }}
                        animate={{
                            opacity: [0.3, 0.4, 0.3],
                            scale: [1, 1.02, 1],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    />
                </div>
            </div>
            <div className="absolute inset-0 z-0">
                {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-blue-500/20"
                        style={{
                            width: Math.random() * 4 + 1,
                            height: Math.random() * 4 + 1,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, Math.random() * 20 - 10, 0],
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{
                            duration: Math.random() * 20 + 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 mx-auto max-w-screen-xl">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={controls}
                    variants={{
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.6 },
                        },
                    }}
                    className="text-center text-4xl font-extrabold tracking-tight text-blue-300 sm:text-5xl"
                >
                    Course Layout
                </motion.h2>

                <LoadingDialog isLoading={isLoading} />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={controls}
                    variants={{
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.6, delay: 0.2 },
                        },
                    }}
                >
                    <CourseBasicInfo course={course} refreshData={getCourse} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={controls}
                    variants={{
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.6, delay: 0.4 },
                        },
                    }}
                >
                    <CourseDetail course={course} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={controls}
                    variants={{
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.6, delay: 0.6 },
                        },
                    }}
                >
                    <ChapterList course={course} refreshData={getCourse} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={controls}
                    variants={{
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.6, delay: 0.8 },
                        },
                    }}
                    className="flex justify-center my-10"
                >
                    <motion.button
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={GenerateChapterContent}
                        className="group relative inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500"
                    >
                        <Sparkles className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                        Generate Course Content
                        <motion.span
                            animate={{
                                boxShadow: [
                                    "0 0 0px rgba(59, 130, 246, 0)",
                                    "0 0 8px rgba(59, 130, 246, 0.5)",
                                    "0 0 0px rgba(59, 130, 246, 0)",
                                ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-lg"
                        />
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}

export default CourseLayout;
