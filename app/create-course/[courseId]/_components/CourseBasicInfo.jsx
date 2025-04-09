"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Puzzle, Upload } from "lucide-react";
import EditCourseBasicInfo from "./EditCourseBasicInfo";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/configs/firebaseConfig";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { motion } from "framer-motion";

const CourseBasicInfo = ({ course, refreshData, edit = true }) => {
    const [selectedFile, setSelectedFile] = useState();

    useEffect(() => {
        if (course) setSelectedFile(course?.courseBanner);
    }, [course]);

    const onFileSelected = async (event) => {
        const file = event.target.files[0];
        setSelectedFile(URL.createObjectURL(file));

        const fileName = Date.now() + ".jpg";
        const storageRef = ref(storage, "ai-course/" + fileName);
        await uploadBytes(storageRef, file).then(() => {
            getDownloadURL(storageRef).then(async (downloadUrl) => {
                await db
                    .update(CourseList)
                    .set({ courseBanner: downloadUrl })
                    .where(eq(CourseList.id, course?.id));
            });
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-6 md:p-10 border border-gray-700 rounded-xl bg-gray-800/50 shadow-lg shadow-blue-500/10 mt-5"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-3xl font-extrabold text-white">
                            {course?.courseOutput?.course?.courseName}
                        </h2>
                        {edit && (
                            <EditCourseBasicInfo
                                course={course}
                                refreshData={refreshData}
                            />
                        )}
                    </div>
                    <p className="text-sm text-gray-400 mt-3">
                        {course?.courseOutput?.course?.description}
                    </p>
                    <h2 className="font-bold mt-2 flex gap-2 items-center text-blue-400">
                        <Puzzle className="h-5 w-5" />
                        {course?.category}
                    </h2>
                    {!edit && (
                        <Link href={`/course/${course?.courseId}/start`}>
                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow:
                                        "0 0 15px rgba(59, 130, 246, 0.4)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 mt-5 w-full md:w-auto"
                            >
                                Start Course
                                <motion.span
                                    animate={{
                                        boxShadow: [
                                            "0 0 0px rgba(59, 130, 246, 0)",
                                            "0 0 8px rgba(59, 130, 246, 0.5)",
                                            "0 0 0px rgba(59, 130, 246, 0)",
                                        ],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                    className="absolute inset-0 rounded-lg"
                                />
                            </motion.button>
                        </Link>
                    )}
                </div>
                <div className="relative">
                    <label htmlFor="upload-image">
                        <Image
                            alt="Course Banner"
                            src={selectedFile || "/placeholder.png"}
                            width={300}
                            height={300}
                            className="w-full h-[300px] object-cover rounded-xl cursor-pointer border border-gray-600"
                        />
                        {edit && (
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="absolute top-2 right-2 bg-blue-600 p-2 rounded-full"
                            >
                                <Upload className="h-5 w-5 text-white" />
                            </motion.div>
                        )}
                    </label>
                    {edit && (
                        <input
                            type="file"
                            id="upload-image"
                            className="opacity-0 absolute inset-0"
                            onChange={onFileSelected}
                        />
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default CourseBasicInfo;
