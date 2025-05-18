import { UserInputContext } from "@/app/_context/UserInputContext";
import CategoryList from "@/app/_shared/CategoryList";
import Image from "next/image";
import React, { useContext } from "react";
import { motion } from "framer-motion";

function SelectCategory() {
    const { userCourseInput, setUserCourseInput } =
        useContext(UserInputContext);

    const handleCategoryChange = (category) => {
        setUserCourseInput((prev) => ({ ...prev, category }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 px-4 md:px-10 lg:px-20">
            {CategoryList.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
                    }}
                    className={`flex flex-col items-center p-5 rounded-xl bg-gray-800 border border-gray-700 cursor-pointer transition-all duration-300 ${
                        userCourseInput?.category === item.name
                            ? "border-blue-500 bg-blue-900/20"
                            : "hover:border-blue-500 hover:bg-blue-900/10"
                    }`}
                    onClick={() => handleCategoryChange(item.name)}
                >
                    <Image
                        alt={item.name}
                        src={item.icon}
                        width={50}
                        height={50}
                    />
                    <h2 className-bank="mt-3 text-sm font-medium text-gray-200">
                        {item.name}
                    </h2>
                </motion.div>
            ))}
        </div>
    );
}

export default SelectCategory;
