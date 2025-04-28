"use client";
import { useContext, useEffect, useState, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
    Sparkles,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
} from "lucide-react";
import SelectCategory from "./_components/SelectCategory";
import TopicDescription from "./_components/TopicDescription";
import SelectOption from "./_components/SelectOption";
import { UserInputContext } from "../_context/UserInputContext";
import { GenerateCourseLayout_AI } from "@/configs/AiModel";
import LoadingDialog from "./_components/LoadingDialog";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function CreateCourse() {
    const StepperCourse = [
        { id: 1, name: "Category", icon: <Sparkles /> },
        { id: 2, name: "Topic & Desc", icon: <Sparkles /> },
        { id: 3, name: "Options", icon: <Sparkles /> },
    ];
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    const router = useRouter();
    const { userCourseInput, setUserCourseInput } =
        useContext(UserInputContext);
    const [activeIndex, setActiveIndex] = useState(0);

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) controls.start("visible");
    }, [isInView, controls]);

    // Determine if each step is completed based on userCourseInput
    const isStepCompleted = (stepIndex) => {
        if (!userCourseInput || Object.keys(userCourseInput).length === 0)
            return false;
        switch (stepIndex) {
            case 0:
                return (
                    userCourseInput?.category &&
                    userCourseInput.category.length > 0
                );
            case 1:
                return (
                    userCourseInput?.topic &&
                    userCourseInput.topic.length > 0 &&
                    userCourseInput?.description &&
                    userCourseInput.description.length > 0
                );
            case 2:
                return (
                    userCourseInput?.level &&
                    userCourseInput?.duration &&
                    userCourseInput?.displayVideo !== undefined &&
                    userCourseInput?.noOfChapter
                );
            default:
                return false;
        }
    };

    const checkStatus = () => {
        return !isStepCompleted(activeIndex);
    };

    const GenerateCourseLayout = async () => {
        setIsLoading(true);
        const BASIC_PROMPT =
            "Generate A Course Tutorial on Following Detail With field as Course Name, Description, Along with Chapter Name, about, Duration:";
        const USER_INPUT_PROMPT = `Category: ${userCourseInput?.category}, Topic: ${userCourseInput?.topic}, Level: ${userCourseInput?.level}, Duration: ${userCourseInput?.duration}, NoOf Chapters: ${userCourseInput?.noOfChapter}, in JSON format in Uzbek Language.`;
        const FINAL_PROMPT = BASIC_PROMPT + USER_INPUT_PROMPT;
        const result = await GenerateCourseLayout_AI.sendMessage(FINAL_PROMPT);
        setIsLoading(false);
        const courseLayout = JSON.parse(result.response?.text());
        SaveCourseLayoutInDb(courseLayout);
    };

    const SaveCourseLayoutInDb = async (courseLayout) => {
        const id = uuid4();
        setIsLoading(true);
        await db.insert(CourseList).values({
            courseId: id,
            name: userCourseInput?.topic,
            level: userCourseInput?.level,
            category: userCourseInput?.category,
            courseOutput: courseLayout,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            userName: user?.fullName,
            userProfileImage: user?.imageUrl,
        });
        setIsLoading(false);
        router.replace("/create-course/" + id);
    };

    return (
        <section
            ref={ref}
            className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 px-4 py-10 text-white"
        >
            {/* Animated Background Grid */}
            <div className="absolute inset-0 z-0 opacity-10">
                <div className="h-full w-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]">
                    <motion.div
                        initial={{ opacity: 0.3 }}
                        animate={{
                            opacity: [0.3, 0.4, 0.3],
                            scale: [1, 1.02, 1],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                        }}
                    />
                </div>
            </div>
            {/* Floating Particles */}
            <div className="absolute inset-0 z-0">
                {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-blue-500/20"
                        style={{
                            width: Math.random() * 4 + 1,
                            height: Math.random() * 4 + 1,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, Math.random() * 20 - 10, 0],
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{
                            duration: Math.random() * 20 + 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 mx-auto max-w-screen-xl">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={controls}
                    variants={{
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.6 },
                        },
                    }}
                    className="text-center text-4xl font-extrabold tracking-tight text-blue-300 sm:text-5xl"
                >
                    Create Your Course
                </motion.h2>

                {/* Enhanced Stepper Component */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={controls}
                    variants={{
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.6, delay: 0.2 },
                        },
                    }}
                    className="mt-10 flex justify-center"
                >
                    {StepperCourse.map((item, index) => (
                        <div key={item.id} className="flex items-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{
                                    scale: activeIndex >= index ? 1 : 0.9,
                                    opacity: 1,
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.2 * index,
                                }}
                                className={`relative flex h-16 w-16 flex-col items-center justify-center rounded-lg ${
                                    isStepCompleted(index)
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                        : activeIndex === index
                                        ? "bg-blue-500/40 text-white shadow-md shadow-blue-400/20"
                                        : "bg-gray-800/80 text-gray-400"
                                } transition-all duration-300`}
                            >
                                {/* Glow effect for active/completed steps */}
                                {(isStepCompleted(index) ||
                                    activeIndex === index) && (
                                    <motion.div
                                        className="absolute inset-0 rounded-lg"
                                        animate={{
                                            boxShadow: [
                                                "0 0 0px rgba(59, 130, 246, 0)",
                                                "0 0 8px rgba(59, 130, 246, 0.5)",
                                                "0 0 0px rgba(59, 130, 246, 0)",
                                            ],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Number.POSITIVE_INFINITY,
                                        }}
                                    />
                                )}

                                <div className="flex h-full w-full items-center justify-center">
                                    {isStepCompleted(index) ? (
                                        <CheckCircle2 className="h-6 w-6" />
                                    ) : (
                                        <motion.div
                                            animate={
                                                activeIndex === index
                                                    ? {
                                                          rotate: [
                                                              0, 5, 0, -5, 0,
                                                          ],
                                                          scale: [1, 1.1, 1],
                                                      }
                                                    : {}
                                            }
                                            transition={{
                                                duration: 2,
                                                repeat: Number.POSITIVE_INFINITY,
                                                repeatType: "reverse",
                                            }}
                                        >
                                            {item.icon}
                                        </motion.div>
                                    )}
                                </div>
                                <span className="absolute -bottom-6 whitespace-nowrap text-sm font-medium text-blue-100">
                                    {item.name}
                                </span>
                            </motion.div>

                            {index < StepperCourse.length - 1 && (
                                <div className="relative h-1 w-[50px] md:w-[100px] lg:w-[170px]">
                                    {/* Background line (always visible) */}
                                    <motion.div className="absolute h-1 w-full rounded-full bg-gray-700/70" />

                                    {/* Progress line (fills based on completion) */}
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: isStepCompleted(index)
                                                ? "100%"
                                                : "0%",
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.2 * index,
                                        }}
                                        className="absolute h-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                                        style={{
                                            boxShadow:
                                                "0 0 8px rgba(59, 130, 246, 0.5)",
                                        }}
                                    />

                                    {/* Animated particles along the line */}
                                    {isStepCompleted(index) && (
                                        <>
                                            <motion.div
                                                className="absolute top-0 h-1 w-3 rounded-full bg-blue-300"
                                                animate={{
                                                    x: ["0%", "100%"],
                                                    opacity: [0, 1, 0],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    ease: "easeInOut",
                                                    delay: Math.random(),
                                                }}
                                            />
                                            <motion.div
                                                className="absolute top-0 h-1 w-5 rounded-full bg-blue-200"
                                                animate={{
                                                    x: ["0%", "100%"],
                                                    opacity: [0, 1, 0],
                                                }}
                                                transition={{
                                                    duration: 2.5,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    ease: "easeInOut",
                                                    delay: Math.random(),
                                                }}
                                            />
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={controls}
                    variants={{
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.6, delay: 0.4 },
                        },
                    }}
                    className="mt-16 px-4 md:px-10 lg:px-20"
                >
                    {activeIndex === 0 && <SelectCategory />}
                    {activeIndex === 1 && <TopicDescription />}
                    {activeIndex === 2 && <SelectOption />}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={controls}
                    variants={{
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.6, delay: 0.6 },
                        },
                    }}
                    className="mt-10 flex justify-between px-4 md:px-10 lg:px-20"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={activeIndex === 0}
                        onClick={() => setActiveIndex((prev) => prev - 1)}
                        className="group inline-flex items-center rounded-lg border border-gray-600 bg-gray-800/50 px-6 py-3 font-medium text-gray-200 shadow-sm transition-all hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                        Previous
                    </motion.button>
                    {activeIndex < 2 ? (
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            disabled={checkStatus()}
                            onClick={() => setActiveIndex((prev) => prev + 1)}
                            className="group relative inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
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
                                    repeat: Number.POSITIVE_INFINITY,
                                }}
                                className="absolute inset-0 rounded-lg"
                            />
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            disabled={checkStatus()}
                            onClick={GenerateCourseLayout}
                            className="group relative inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Sparkles className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                            Generate Course
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
                                    repeat: Number.POSITIVE_INFINITY,
                                }}
                                className="absolute inset-0 rounded-lg"
                            />
                        </motion.button>
                    )}
                </motion.div>
            </div>
            <LoadingDialog isLoading={isLoading} />
        </section>
    );
}

export default CreateCourse;
