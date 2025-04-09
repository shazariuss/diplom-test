import { UserInputContext } from "@/app/_context/UserInputContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useContext } from "react";
import { motion } from "framer-motion";

function TopicDescription() {
    const { userCourseInput, setUserCourseInput } =
        useContext(UserInputContext);

    const handleInputChange = (fieldName, value) => {
        setUserCourseInput((prev) => ({ ...prev, [fieldName]: value }));
    };

    return (
        <div className="mx-4 md:mx-10 lg:mx-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-5"
            >
                <label className="text-sm font-medium text-gray-300">
                    Write the topic for your course (e.g., Python Course)
                </label>
                <Input
                    placeholder="Topic"
                    className="mt-2 h-14 text-xl bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/50"
                    defaultValue={userCourseInput?.topic}
                    onChange={(e) => handleInputChange("topic", e.target.value)}
                />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-5"
            >
                <label className="text-sm font-medium text-gray-300">
                    Tell us more about your course (what to include)
                </label>
                <Textarea
                    placeholder="Course Description"
                    className="mt-2 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/50"
                    defaultValue={userCourseInput?.description}
                    onChange={(e) =>
                        handleInputChange("description", e.target.value)
                    }
                />
            </motion.div>
        </div>
    );
}

export default TopicDescription;
