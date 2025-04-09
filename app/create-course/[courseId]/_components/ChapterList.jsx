"use client";
import React from "react";
import { Clock, CheckCircle2 } from "lucide-react";
import EditChapters from "./EditChapters";
import { motion } from "framer-motion";

const ChapterList = ({ course, refreshData, edit = true }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-3"
        >
            <h2 className="font-bold text-xl text-white">Chapters</h2>
            <div className="mt-2">
                {course?.courseOutput?.course?.chapters.map(
                    (chapter, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="border border-gray-700 p-5 rounded-lg mb-2 flex items-center justify-between bg-gray-800/50 hover:bg-gray-700/50 transition-all"
                        >
                            <div className="flex gap-5 items-center">
                                <h2 className="bg-blue-600 h-10 w-10 text-white rounded-full text-center p-2 font-bold">
                                    {index + 1}
                                </h2>
                                <div>
                                    <h2 className="font-medium text-lg text-white flex items-center gap-2">
                                        {chapter?.chapterName}
                                        {edit && (
                                            <EditChapters
                                                index={index}
                                                course={course}
                                                refreshData={refreshData}
                                            />
                                        )}
                                    </h2>
                                    <p className="text-sm text-gray-400">
                                        {chapter?.about}
                                    </p>
                                    <p className="flex gap-2 text-blue-400 items-center">
                                        <Clock className="h-4 w-4" />{" "}
                                        {chapter?.duration}
                                    </p>
                                </div>
                            </div>
                            <CheckCircle2 className="text-4xl text-gray-400 flex-none" />
                        </motion.div>
                    )
                )}
            </div>
        </motion.div>
    );
};

export default ChapterList;
