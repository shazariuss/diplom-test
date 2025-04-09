"use client";

import Image from "next/image";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { HiMiniEllipsisVertical } from "react-icons/hi2";
import DropdownOption from "./DropdownOption";
import { db } from "@/configs/db";
import { Chapters, CourseList } from "@/configs/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { motion } from "framer-motion";

function CourseCard({ course, refreshData, displayUser = false }) {
    const handleOnDelete = async () => {
        try {
            // First delete all related chapters
            await db
                .delete(Chapters)
                .where(eq(Chapters.courseId, course?.courseId));

            // Then delete the course
            const resp = await db
                .delete(CourseList)
                .where(eq(CourseList.id, course?.id))
                .returning({ id: CourseList?.id });

            if (resp) {
                refreshData();
            }

            return true; // Return true to indicate successful deletion
        } catch (error) {
            console.error("Error deleting course and chapters:", error);
            return false; // Return false to indicate failed deletion
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{
                y: -5,
                transition: { duration: 0.2 },
            }}
            className="relative mt-4 cursor-pointer overflow-hidden rounded-xl bg-gray-800 shadow-lg transition-all"
        >
            {/* Subtle glow effect on hover */}
            <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 blur-lg transition-opacity"
            />

            <div className="relative z-10 flex h-full flex-col">
                {/* Course Image with Overlay */}
                <Link
                    href={"/course/" + course?.courseId}
                    className="block overflow-hidden"
                >
                    <div className="relative">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            className="relative"
                        >
                            <Image
                                alt={
                                    course?.courseOutput?.course?.courseName ||
                                    "Course image"
                                }
                                src={course?.courseBanner || "/placeholder.svg"}
                                width={300}
                                height={200}
                                className="h-[180px] w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
                        </motion.div>

                        {/* Level Badge */}
                        <div className="absolute right-3 top-3 rounded-full bg-blue-900/80 px-3 py-1 text-xs font-medium text-blue-100 backdrop-blur-sm">
                            {course?.level}
                        </div>
                    </div>
                </Link>

                {/* Course Content */}
                <div className="flex flex-1 flex-col p-4">
                    <div className="mb-2 flex items-start justify-between">
                        <h2 className="font-medium text-lg text-white line-clamp-2">
                            {course?.courseOutput?.course?.courseName}
                        </h2>

                        {displayUser && (
                            <div className="ml-2 flex-shrink-0">
                                <DropdownOption
                                    handleOnDelete={() => handleOnDelete()}
                                >
                                    <motion.div
                                        whileHover={{ rotate: 90 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                                    >
                                        <HiMiniEllipsisVertical />
                                    </motion.div>
                                </DropdownOption>
                            </div>
                        )}
                    </div>

                    <p className="mb-3 text-sm text-gray-400">
                        {course?.category}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-md bg-blue-900/30 px-2 py-1 text-sm text-blue-300">
                            <HiOutlineBookOpen className="text-blue-400" />
                            <span>
                                {course?.courseOutput?.course?.noOfChapters}{" "}
                                Chapters
                            </span>
                        </div>
                    </div>

                    {/* User Info */}
                    {displayUser && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-4 flex items-center gap-2 border-t border-gray-700 pt-3"
                        >
                            <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                <Image
                                    src={
                                        course?.userProfileImage ||
                                        "/placeholder.svg"
                                    }
                                    width={32}
                                    height={32}
                                    className="h-full w-full object-cover"
                                    alt={course?.userName || "User"}
                                />
                            </div>
                            <h2 className="text-sm text-gray-300">
                                {course?.userName}
                            </h2>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default CourseCard;
