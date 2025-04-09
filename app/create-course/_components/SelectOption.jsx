import React, { useContext } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UserInputContext } from "@/app/_context/UserInputContext";
import { motion } from "framer-motion";

function SelectOption() {
    const { userCourseInput, setUserCourseInput } =
        useContext(UserInputContext);

    const handleInputChange = (fieldName, value) => {
        setUserCourseInput((prev) => ({ ...prev, [fieldName]: value }));
    };

    return (
        <div className="px-4 md:px-10 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    {
                        label: "Difficulty Level",
                        field: "level",
                        options: ["Beginner", "Intermediate", "Advanced"],
                    },
                    {
                        label: "Course Duration",
                        field: "duration",
                        options: ["1 Hour", "2 Hours", "More than 3 hours"],
                    },
                    {
                        label: "Add Video",
                        field: "displayVideo",
                        options: ["Yes", "No"],
                    },
                ].map((item, index) => (
                    <motion.div
                        key={item.field}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <label className="text-sm font-medium text-gray-300">
                            {item.label}
                        </label>
                        <Select
                            onValueChange={(value) =>
                                handleInputChange(item.field, value)
                            }
                            defaultValue={userCourseInput?.[item.field]}
                        >
                            <SelectTrigger className="mt-2 bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/50">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                {item.options.map((option) => (
                                    <SelectItem
                                        key={option}
                                        value={option}
                                        className="hover:bg-blue-900/50"
                                    >
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </motion.div>
                ))}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <label className="text-sm font-medium text-gray-300">
                        Number of Chapters
                    </label>
                    <Input
                        type="number"
                        className="mt-2 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/50"
                        defaultValue={userCourseInput?.noOfChapter}
                        onChange={(e) =>
                            handleInputChange("noOfChapter", e.target.value)
                        }
                    />
                </motion.div>
            </div>
        </div>
    );
}

export default SelectOption;
