"use client";
import { UserCourseListContext } from "@/app/_context/UserCourseListContext";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { HiOutlineHome, HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { motion } from "framer-motion";

const Sidebar = ({ onClose }) => {
    const Menu = [
        {
            id: 1,
            name: "Home",
            icon: <HiOutlineHome />,
            path: "/dashboard",
        },
        // {
        // //     id: 2,
        // //     name: "Explore",
        // //     icon: <HiOutlineSquare3Stack3D />,
        // //     path: "/dashboard/explore",
        // // },
        // {
        //     id: 3,
        //     name: "Upgrade",
        //     icon: <HiMiniShieldCheck />,
        //     path: "/dashboard/upgrade",
        // },
        // {
        //     id: 4,
        //     name: "Logout",
        //     icon: <HiOutlinePower />,
        //     path: "/dashboard/logout",
        // },
    ];

    const { userCourseList, setUserCourseList } = useContext(
        UserCourseListContext
    );

    const path = usePathname();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.4 },
        },
    };

    return (
        <div className="fixed h-full w-64 overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-800 p-5 shadow-lg shadow-blue-900/5">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-5">
                <div className="h-full w-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
            </div>

            {/* Animated Gradient Border */}
            <div className="absolute bottom-0 left-0 right-0 top-0">
                <div className="absolute bottom-0 right-0 top-0 w-[1px] overflow-hidden">
                    <motion.div
                        animate={{
                            y: ["-100%", "100%"],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                        className="h-1/3 w-full bg-gradient-to-b from-transparent via-blue-500 to-transparent"
                    />
                </div>
            </div>

            <div className="relative z-10 flex h-full flex-col">
                {/* Logo Section */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-3"
                >
                    <div className="relative">
                        <motion.div
                            animate={{
                                boxShadow: [
                                    "0 0 0px rgba(59, 130, 246, 0)",
                                    "0 0 8px rgba(59, 130, 246, 0.5)",
                                    "0 0 0px rgba(59, 130, 246, 0)",
                                ],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                            }}
                            className="absolute -inset-1 rounded-full opacity-70"
                        />
                        <Image
                            alt="AI Course Generator Logo"
                            src="/logo.png"
                            width={40}
                            height={40}
                            className="relative rounded-full"
                        />
                    </div>
                    <span className="text-lg font-bold text-white">
                        AI Course Gen
                    </span>
                </motion.div>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="my-5 h-px w-full bg-gradient-to-r from-transparent via-gray-600 to-transparent"
                />

                {/* Navigation Menu */}
                <motion.ul
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="mb-10 flex-1"
                >
                    {Menu.map((item, index) => (
                        <motion.li key={index} variants={itemVariants}>
                            <Link href={item.path} onClick={onClose}>
                                <motion.div
                                    whileHover={{
                                        x: 5,
                                        backgroundColor:
                                            "rgba(59, 130, 246, 0.1)",
                                    }}
                                    className={`relative mb-2 flex items-center gap-3 rounded-lg p-3 text-gray-300 transition-all hover:text-white ${
                                        item.path === path
                                            ? "bg-blue-900/20 text-white"
                                            : ""
                                    }`}
                                >
                                    {item.path === path && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute left-0 top-0 h-full w-1 rounded-l-md bg-blue-500"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-800 text-xl">
                                        {item.icon}
                                    </div>
                                    <h2 className="font-medium">{item.name}</h2>
                                </motion.div>
                            </Link>
                        </motion.li>
                    ))}
                </motion.ul>

                {/* Progress Section - Fixed Positioning */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-auto w-full"
                >
                    <div className="rounded-lg bg-gray-800/50 p-4 backdrop-blur-sm">
                        <h2 className="mb-2 text-sm font-medium text-white">
                            Course Progress
                        </h2>

                        <Progress
                            value={(userCourseList?.length / 5) * 100}
                            className="h-2 bg-gray-700"
                        />

                        <h2 className="my-2 text-sm text-gray-300">
                            <span className="font-bold text-blue-300">
                                {userCourseList?.length}
                            </span>{" "}
                            Out of 5 Course created
                        </h2>

                        <p className="text-xs text-gray-400">
                            Upgrade your plan for unlimited course generation
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Sidebar;
