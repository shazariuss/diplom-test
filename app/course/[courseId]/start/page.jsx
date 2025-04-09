"use client";
import { db } from "@/configs/db";
import { Chapters, CourseList } from "@/configs/schema";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import ChapterListCard from "./_components/ChapterListCard";
import ChapterContent from "./_components/ChapterContent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CourseStart = ({ params }) => {
    const [course, setCourse] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [chapterContent, setChapterContent] = useState(null);

    useEffect(() => {
        GetCourse();
    }, [params?.courseId]);

    const GetCourse = async () => {
        const result = await db
            .select()
            .from(CourseList)
            .where(eq(CourseList?.courseId, params?.courseId));
        const fetchedCourse = result[0];
        setCourse(fetchedCourse);
        if (fetchedCourse?.courseOutput?.course?.chapters?.length > 0) {
            setSelectedChapter(fetchedCourse.courseOutput.course.chapters[0]);
            getSelectedChapterContent(0, fetchedCourse);
        }
    };

    const getSelectedChapterContent = async (
        chapterId,
        courseData = course
    ) => {
        const result = await db
            .select()
            .from(Chapters)
            .where(
                and(
                    eq(Chapters.chapterId, chapterId),
                    eq(Chapters.courseId, courseData?.courseId)
                )
            );
        setChapterContent(result[0]);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white"
        >
            <div className="flex">
                {/* Sidebar */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="fixed top-0 z-10 hidden h-screen w-72 border-r border-gray-700 bg-gray-800/50 shadow-lg backdrop-blur-sm md:block"
                >
                    <h2 className="bg-blue-900 p-4 text-lg font-bold text-blue-300">
                        {course?.courseOutput?.course?.courseName}
                    </h2>
                    <div className="h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-gray-800">
                        {course?.courseOutput?.course?.chapters.map(
                            (chapter, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                    className={`cursor-pointer border-b border-gray-700 transition-colors ${
                                        selectedChapter?.chapterName ===
                                        chapter?.chapterName
                                            ? "bg-blue-900/30"
                                            : "hover:bg-gray-700/50"
                                    }`}
                                    onClick={() => {
                                        setSelectedChapter(chapter);
                                        getSelectedChapterContent(index);
                                    }}
                                >
                                    <ChapterListCard
                                        chapter={chapter}
                                        index={index}
                                    />
                                </motion.div>
                            )
                        )}
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="flex-1 md:ml-72">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex h-20 items-center justify-end bg-gray-800/50 pr-5 shadow-md backdrop-blur-sm"
                    >
                        <Link href="/dashboard">
                            <Button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 hover:shadow-blue-500/40">
                                Dashboard
                            </Button>
                        </Link>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        <ChapterContent
                            chapter={selectedChapter}
                            content={chapterContent}
                        />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseStart;
