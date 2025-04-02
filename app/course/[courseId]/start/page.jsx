"use client";
import { db } from "@/configs/db";
import { Chapters, CourseList } from "@/configs/schema";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import ChapterListCard from "./_components/ChapterListCard";
import ChapterContent from "./_components/ChapterContent";
import Header from "@/app/_components/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CourseStart = ({ params }) => {
    const [course, setCourse] = useState();
    const [selectedChapter, setSelectedChapter] = useState();
    const [chapterContent, setChapterContent] = useState();

    useEffect(() => {
        GetCourse();
    }, []);

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
        <>
            <div className="flex">
                <div className="fixed top-0 overflow-auto z-10 md:w-72 hidden md:block h-screen border-r shadow-sm">
                    <h2 className="font-bold text-lg bg-primary p-4 text-white">
                        {course?.courseOutput?.course?.courseName}
                    </h2>
                    <div className="flex-1 overflow-y-auto">
                        {course?.courseOutput?.course?.chapters.map(
                            (chapter, index) => (
                                <div
                                    key={index}
                                    className={`cursor-pointer hover:bg-purple-50 ${
                                        selectedChapter?.chapterName ===
                                        chapter?.chapterName
                                            ? "bg-purple-100"
                                            : ""
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
                                </div>
                            )
                        )}
                    </div>
                </div>
                <div className="md:ml-72 flex-1">
                    <div className="h-[80px] bg-slate-100 flex items-center justify-end pr-5">
                        <Link href="/dashboard">
                            <Button>Dashboard</Button>
                        </Link>
                    </div>
                    <div>
                        <ChapterContent
                            chapter={selectedChapter}
                            content={chapterContent}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseStart;
