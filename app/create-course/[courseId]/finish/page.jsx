"use client";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import CourseBasicInfo from "../_components/CourseBasicInfo";
import { useRouter } from "next/navigation";
import { HiOutlineClipboardDocument } from "react-icons/hi2";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const FinishScreen = ({ params }) => {
    const { user } = useUser();
    const [course, setCourse] = useState([]);
    const [copied, setCopied] = useState(false); // For copy feedback
    const router = useRouter();

    useEffect(() => {
        if (params && user) getCourse();
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

    // Handle copy to clipboard with feedback
    const handleCopy = async () => {
        const url = `${process.env.NEXT_PUBLIC_HOST_NAME}/course/${course?.courseId}`;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="px-10 md:px-20 lg:px-44  flex flex-col gap-5 min-h-screen bg-gray-900 text-gray-200"
        >
            {/* Congratulations Header */}
            <motion.h2
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-center font-bold text-2xl my-3 text-blue-300"
            >
                Congratulations! <br />
                Your Course is Ready!
            </motion.h2>

            {/* Course Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-lg bg-gray-800/50 p-5 shadow-md backdrop-blur-sm"
            >
                <CourseBasicInfo course={course} refreshData={() => {}} />
            </motion.div>

            {/* Go to Course Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex justify-center"
            >
                <Link href={`/course/${course?.courseId}`}>
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-md transition-all">
                        Go to Course!
                    </Button>
                </Link>
            </motion.div>

            {/* Course URL with Copy Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex justify-center items-center gap-3 mt-5"
            >
                {/* <div className="text-center text-gray-400 border border-gray-700 p-3 rounded-lg bg-gray-800/50 shadow-inner flex items-center gap-3">
                    <span className="truncate max-w-xs">
                        {process.env.NEXT_PUBLIC_HOST_NAME}/course/
                        {course?.courseId}
                    </span>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopy}
                        className="flex items-center rounded-md bg-blue-600 px-2 py-1 text-sm text-white transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                        <HiOutlineClipboardDocument className="h-5 w-5 mr-1" />
                        {copied ? "Copied!" : "Copy"}
                    </motion.button>
                </div> */}
            </motion.div>
        </motion.div>
    );
};

export default FinishScreen;
