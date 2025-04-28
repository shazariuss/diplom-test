"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { BookOpen, Brain, Code, Lightbulb, Sparkles } from "lucide-react";

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const controls = useAnimation();

    useEffect(() => {
        setIsVisible(true);
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    return (
        <section
            ref={ref}
            className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white h-screen"
        >
            {/* Animated Background Grid */}
            <div className="absolute inset-0 z-0">
                <AnimatedGrid />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 z-0">
                <FloatingParticles />
            </div>

            <div className="relative z-10 mx-auto max-w-screen-xl px-4 py-16 md:py-24 lg:py-8">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: isVisible ? 1 : 0,
                            y: isVisible ? 0 : 20,
                        }}
                        transition={{ duration: 0.6 }}
                        className="text-center lg:text-left"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mb-4 inline-flex items-center rounded-full border border-blue-500/30 bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-300 backdrop-blur-sm"
                        >
                            <Sparkles className="mr-2 h-4 w-4 text-blue-300" />
                            Powered by Advanced AI
                        </motion.div>

                        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-blue-300 sm:text-5xl lg:text-6xl">
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                                className="block"
                            >
                                AI Course Generator
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.5 }}
                                className="mt-2 block font-extrabold text-white"
                            >
                                Custom Learning Paths, Tailored to You
                            </motion.span>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.7 }}
                            className="mb-8 text-lg text-gray-300 sm:text-xl"
                        >
                            Create personalized learning experiences in seconds.
                            Our AI analyzes your goals, skill level, and
                            learning style to generate comprehensive courses
                            that adapt to your needs.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.9 }}
                            className="flex flex-wrap justify-center gap-4 lg:justify-start"
                        >
                            <Link
                                href="/dashboard"
                                className="group inline-flex items-center rounded-lg bg-blue-600 px-6 py-3.5 text-base font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                Get Started
                                <svg
                                    className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    ></path>
                                </svg>
                            </Link>

                            {/* <Link
                                href="/how-it-works"
                                className="inline-flex items-center rounded-lg border border-gray-600 bg-gray-800/50 px-6 py-3.5 text-base font-medium text-gray-200 shadow-sm backdrop-blur-sm transition-all hover:bg-gray-700/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                            >
                                How It Works
                            </Link> */}
                        </motion.div>

                        {/* Features List */}
                        <div className="mt-8 grid grid-cols-2 gap-4 text-left sm:grid-cols-2">
                            {[
                                {
                                    icon: Brain,
                                    text: "AI-Powered Curriculum",
                                    delay: 0.2,
                                },
                                {
                                    icon: BookOpen,
                                    text: "Personalized Content",
                                    delay: 0.3,
                                },
                                {
                                    icon: Code,
                                    text: "Interactive Exercises",
                                    delay: 0.4,
                                },
                                {
                                    icon: Lightbulb,
                                    text: "Adaptive Learning",
                                    delay: 0.5,
                                },
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={controls}
                                    variants={{
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                duration: 0.6,
                                                delay: feature.delay + 1,
                                            },
                                        },
                                    }}
                                    className="flex items-start"
                                >
                                    <feature.icon className="mr-3 h-5 w-5 text-blue-400" />
                                    <span className="text-sm text-gray-300">
                                        {feature.text}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Visual/Illustration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{
                            opacity: isVisible ? 1 : 0,
                            scale: isVisible ? 1 : 0.95,
                        }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative mx-auto lg:mx-0"
                    >
                        <div className="relative">
                            {/* Animated glow effect */}
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        "0 0 15px 2px rgba(59, 130, 246, 0.3)",
                                        "0 0 20px 5px rgba(59, 130, 246, 0.4)",
                                        "0 0 15px 2px rgba(59, 130, 246, 0.3)",
                                    ],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                }}
                                className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 opacity-50 blur-lg"
                            ></motion.div>
                            <div className="relative overflow-hidden rounded-lg bg-gray-800 shadow-xl">
                                <CourseGenerationVisual />
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.2 }}
                            className="absolute -right-4 -top-4 rounded-lg bg-gray-800/80 p-3 shadow-lg backdrop-blur-sm"
                        >
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                }}
                                className="flex items-center space-x-2"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Number.POSITIVE_INFINITY,
                                    }}
                                    className="h-3 w-3 rounded-full bg-green-400"
                                ></motion.div>
                                <span className="text-xs font-medium text-gray-300">
                                    AI Processing
                                </span>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.4 }}
                            className="absolute -bottom-4 -left-4 rounded-lg bg-indigo-900/50 p-3 shadow-lg backdrop-blur-sm"
                        >
                            <motion.div
                                animate={{ y: [0, 5, 0] }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                }}
                                className="flex items-center space-x-2"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Number.POSITIVE_INFINITY,
                                    }}
                                    className="h-3 w-3 rounded-full bg-indigo-400"
                                ></motion.div>
                                <span className="text-xs font-medium text-gray-300">
                                    Learning Path Generated
                                </span>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 120"
                    className="text-gray-900"
                >
                    <path
                        fill="currentColor"
                        fillOpacity="1"
                        d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
                    ></path>
                </svg>
            </div>
        </section>
    );
};

// Animated background grid
const AnimatedGrid = () => {
    return (
        <div className="absolute inset-0 opacity-10">
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
    );
};

// Floating particles animation
const FloatingParticles = () => {
    const particles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        size: Math.random() * 4 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 10,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-blue-500/20"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0, 0.5, 0],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};

// Visual component showing the course generation process with animations
const CourseGenerationVisual = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [text, setText] = useState("");
    const fullText =
        "Advanced JavaScript and React for building modern web applications";

    useEffect(() => {
        if (text.length < fullText.length) {
            const timeout = setTimeout(() => {
                setText(fullText.slice(0, text.length + 1));
            }, 50);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => {
                if (currentStep < 5) {
                    setCurrentStep((prev) => prev + 1);
                } else {
                    // Reset animation after a delay
                    const resetTimeout = setTimeout(() => {
                        setCurrentStep(0);
                        setText("");
                    }, 3000);
                    return () => clearTimeout(resetTimeout);
                }
            }, 700);
            return () => clearTimeout(timeout);
        }
    }, [text, fullText, currentStep]);

    const courseSteps = [
        "JavaScript Fundamentals Review",
        "Advanced JavaScript Concepts",
        "React Core Principles",
        "State Management with Redux",
        "Building Production-Ready Apps",
    ];

    return (
        <div className="aspect-[4/3] w-full max-w-lg overflow-hidden bg-gray-900 p-4 text-white">
            <div className="flex h-full flex-col">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full bg-red-400"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                        <div className="h-3 w-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="rounded-md bg-gray-800 px-3 py-1 text-xs text-blue-300">
                        AI Course Generator
                    </div>
                </div>

                {/* Course Generation Interface */}
                <div className="flex flex-1 flex-col rounded-lg border border-gray-700 bg-gray-800 p-4">
                    <div className="mb-4">
                        <div className="mb-2 text-sm font-medium text-gray-300">
                            What would you like to learn?
                        </div>
                        <div className="relative rounded-md bg-gray-700 p-3 text-sm text-gray-200 shadow-sm">
                            {text}
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Number.POSITIVE_INFINITY,
                                }}
                                className="ml-0.5 inline-block h-4 w-0.5 bg-blue-400"
                            ></motion.span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="mb-2 text-sm font-medium text-gray-300">
                            Your experience level:
                        </div>
                        <div className="flex space-x-2">
                            {["Beginner", "Intermediate", "Advanced"].map(
                                (level, i) => (
                                    <div
                                        key={level}
                                        className={`rounded-full px-3 py-1 text-xs ${
                                            i === 1
                                                ? "bg-blue-900/70 text-blue-300"
                                                : "bg-gray-700 text-gray-300"
                                        }`}
                                    >
                                        {level}
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="mb-2 text-sm font-medium text-gray-300">
                            Generated learning path:
                        </div>
                        <div className="space-y-2">
                            {courseSteps.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{
                                        opacity: i <= currentStep ? 1 : 0,
                                        x: i <= currentStep ? 0 : 20,
                                    }}
                                    animate={{
                                        opacity: i <= currentStep ? 1 : 0,
                                        x: i <= currentStep ? 0 : 20,
                                        backgroundColor:
                                            i === currentStep
                                                ? "rgba(59, 130, 246, 0.2)"
                                                : "rgba(31, 41, 55, 0.5)",
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center rounded-md bg-gray-700 p-2 text-xs text-gray-200 shadow-sm"
                                >
                                    <motion.div
                                        animate={
                                            i === currentStep
                                                ? {
                                                      scale: [1, 1.2, 1],
                                                      backgroundColor: [
                                                          "rgba(59, 130, 246, 0.3)",
                                                          "rgba(59, 130, 246, 0.6)",
                                                          "rgba(59, 130, 246, 0.3)",
                                                      ],
                                                  }
                                                : {}
                                        }
                                        transition={{
                                            duration: 1.5,
                                            repeat:
                                                i === currentStep
                                                    ? Number.POSITIVE_INFINITY
                                                    : 0,
                                        }}
                                        className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-900/50 text-center text-[10px] font-bold leading-4 text-blue-300"
                                    >
                                        {i + 1}
                                    </motion.div>
                                    {item}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto flex justify-end">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white"
                        >
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
                                className="absolute inset-0 rounded-md"
                            />
                            Generate Course
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
