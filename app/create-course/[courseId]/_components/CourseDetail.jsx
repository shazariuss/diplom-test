"use client";

import React from "react";
import { BarChart, Clock, BookOpen, Play } from "lucide-react";
import { motion } from "framer-motion";

const CourseDetail = ({ course }) => {
    const details = [
        {
            icon: <BarChart className="text-4xl text-blue-400" />,
            label: "Skill Level",
            value: course?.level,
        },
        {
            icon: <Clock className="text-4xl text-blue-400" />,
            label: "Duration",
            value: course?.courseOutput?.course?.duration,
        },
        {
            icon: <BookOpen className="text-4xl text-blue-400" />,
            label: "No Of Chapters",
            value: course?.courseOutput?.course?.noOfChapters,
        },
        {
            icon: <Play className="text-4xl text-blue-400" />,
            label: "Video Included?",
            value: course?.includeVideo,
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="border border-gray-700 p-6 rounded-xl bg-gray-800/50 shadow-lg shadow-blue-500/10 mt-3"
        >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {details.map((detail, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex gap-3 items-center"
                    >
                        {detail.icon}
                        <div>
                            <h2 className="text-xs text-gray-400">
                                {detail.label}
                            </h2>
                            <h2 className="font-medium text-lg text-white">
                                {detail.value}
                            </h2>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default CourseDetail;
