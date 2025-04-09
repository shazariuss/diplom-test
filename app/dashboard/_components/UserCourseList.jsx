"use client";

import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { useContext, useEffect, useState, useRef } from "react";
import CourseCard from "./CourseCard";
import { UserCourseListContext } from "@/app/_context/UserCourseListContext";
import { motion } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";

function UserCourseList() {
    const { user } = useUser();
    const [courseList, setCourseList] = useState();
    const [loading, setLoading] = useState(false);
    const { userCourseList, setUserCourseList } = useContext(
        UserCourseListContext
    );
    const containerRef = useRef(null);

    useEffect(() => {
        user && getUserCourses();
    }, [user]);

    const getUserCourses = async () => {
        setLoading(true);
        const result = await db
            .select()
            .from(CourseList)
            .where(
                eq(
                    CourseList?.createdBy,
                    user?.primaryEmailAddress?.emailAddress
                )
            );
        setCourseList(result);
        setUserCourseList(result);
        setLoading(false);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 },
        },
    };

    return (
        <motion.div
            ref={containerRef}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mt-10 relative z-10 overflow-hidden rounded-xl bg-gray-900/90 p-6 shadow-xl backdrop-blur-sm"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
            </div>

            <motion.div
                initial={{ width: 0 }}
                animate={{ width: "30%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute -top-0.5 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-transparent"
            />

            <div className="flex items-center justify-between">
                <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-2"
                >
                    <h2 className="text-2xl font-bold text-white">
                        My AI Courses
                    </h2>
                    <div className="flex h-6 items-center rounded-full bg-blue-900/30 px-2 text-xs font-medium text-blue-300">
                        <Sparkles className="mr-1 h-3 w-3" />
                        AI Generated
                    </div>
                </motion.div>
            </div>

            <motion.div
                variants={containerVariants}
                className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map((item, index) => (
                        <LoadingCard key={index} index={index} />
                    ))
                ) : courseList?.length > 0 ? (
                    courseList.map((course, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{
                                y: -5,
                                boxShadow:
                                    "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            <CourseCard
                                course={course}
                                refreshData={() => getUserCourses()}
                                displayUser={true}
                            />
                        </motion.div>
                    ))
                ) : (
                    <motion.div
                        variants={itemVariants}
                        className="col-span-full flex flex-col items-center justify-center rounded-xl bg-gray-800/50 p-10 text-center"
                    >
                        <BookOpen className="mb-3 h-12 w-12 text-blue-400 opacity-70" />
                        <h3 className="mb-2 text-xl font-medium text-white">
                            No Courses Yet
                        </h3>
                        <p className="text-gray-400">
                            Generate your first AI course to get started with
                            personalized learning.
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
}

// Enhanced loading card with animations
const LoadingCard = ({ index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: {
                    delay: index * 0.05,
                    duration: 0.5,
                },
            }}
            className="overflow-hidden rounded-lg bg-gray-800"
        >
            <div className="relative h-40 w-full overflow-hidden">
                <motion.div
                    animate={{
                        x: ["-100%", "100%"],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1.5,
                        ease: "linear",
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent"
                />
            </div>
            <div className="p-4">
                <motion.div
                    animate={{ opacity: [0.5, 0.7, 0.5] }}
                    transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="mb-2 h-5 w-3/4 rounded bg-gray-700"
                />
                <motion.div
                    animate={{ opacity: [0.5, 0.7, 0.5] }}
                    transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: 0.2,
                    }}
                    className="mb-4 h-4 w-1/2 rounded bg-gray-700"
                />
                <div className="flex justify-between">
                    <motion.div
                        animate={{ opacity: [0.5, 0.7, 0.5] }}
                        transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: 0.3,
                        }}
                        className="h-8 w-20 rounded bg-gray-700"
                    />
                    <motion.div
                        animate={{ opacity: [0.5, 0.7, 0.5] }}
                        transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: 0.4,
                        }}
                        className="h-8 w-8 rounded-full bg-gray-700"
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default UserCourseList;
