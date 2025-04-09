"use client";
import { UserCourseListContext } from "@/app/_context/UserCourseListContext";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { useContext, useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Sparkles } from "lucide-react";

function AddCourse() {
    const { user } = useUser();
    const { userCourseList, setUserCourseList } = useContext(
        UserCourseListContext
    );

    // Animation setup
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    return (
        <section
            ref={ref}
            className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-4 py-8 shadow-lg"
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
                        className="h-full w-full"
                    />
                </div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 z-0">
                {Array.from({ length: 10 }).map((_, i) => (
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
                            y: [0, -20, 0],
                            x: [0, Math.random() * 10 - 5, 0],
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{
                            duration: Math.random() * 15 + 5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 mx-auto flex max-w-screen-xl items-center justify-between">
                {/* Greeting Section */}
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
                    className="text-white"
                >
                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Hello,{" "}
                        <motion.span
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-blue-300"
                        >
                            {user?.fullName}
                        </motion.span>
                    </h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="mt-2 text-sm text-gray-400 sm:text-base"
                    >
                        Create new courses with AI, share with friends, and earn
                        from them.
                    </motion.p>
                </motion.div>

                {/* Button Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={controls}
                    variants={{
                        visible: {
                            opacity: 1,
                            x: 0,
                            transition: { duration: 0.6, delay: 0.8 },
                        },
                    }}
                >
                    <Link
                        href={
                            userCourseList?.length >= 5
                                ? "/dashboard/upgrade"
                                : "/create-course"
                        }
                    >
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                            <Sparkles className="mr-2 h-5 w-5 text-blue-300 transition-transform duration-300 group-hover:rotate-12" />
                            Create AI Course
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
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

export default AddCourse;
