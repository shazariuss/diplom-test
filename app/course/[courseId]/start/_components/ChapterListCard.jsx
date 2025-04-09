import React from "react";
import { HiOutlineClock } from "react-icons/hi2";
import { motion } from "framer-motion";

const ChapterListCard = ({ chapter, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="grid grid-cols-5 items-center p-4"
        >
            <div>
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 text-white"
                >
                    {index + 1}
                </motion.div>
            </div>
            <div className="col-span-4">
                <h2 className="font-medium text-gray-200">
                    {chapter?.chapterName}
                </h2>
                <h2 className="flex items-center gap-2 text-sm text-blue-400">
                    <HiOutlineClock />
                    {chapter?.duration}
                </h2>
            </div>
        </motion.div>
    );
};

export default ChapterListCard;
