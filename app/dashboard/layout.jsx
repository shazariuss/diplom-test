"use client";
import { useState, useEffect } from "react";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";
import { UserCourseListContext } from "../_context/UserCourseListContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";

const DashboardLayout = ({ children }) => {
    const [userCourseList, setUserCourseList] = useState([]);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Handle mounting animation
    useEffect(() => {
        setMounted(true);
    }, []);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                isMobileSidebarOpen &&
                !e.target.closest(".sidebar-container")
            ) {
                setIsMobileSidebarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobileSidebarOpen]);

    return (
        <UserCourseListContext.Provider
            value={{ userCourseList, setUserCourseList }}
        >
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
                {/* Background Pattern */}
                <div className="fixed inset-0 z-0 opacity-5">
                    <div className="h-full w-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
                </div>

                {/* Mobile Sidebar Toggle Button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                    className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-white shadow-lg shadow-blue-900/20 md:hidden"
                >
                    <Menu size={20} />
                </motion.button>

                {/* Sidebar - Desktop (fixed) and Mobile (animated slide-in) */}
                <div className="sidebar-container">
                    {/* Desktop Sidebar */}
                    <div className="fixed left-0 top-0 z-30 hidden h-screen w-64 md:block">
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="h-full"
                        >
                            <Sidebar />
                        </motion.div>
                    </div>

                    {/* Mobile Sidebar */}
                    <AnimatePresence>
                        {isMobileSidebarOpen && (
                            <motion.div
                                initial={{ x: -280 }}
                                animate={{ x: 0 }}
                                exit={{ x: -280 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                }}
                                className="fixed left-0 top-0 z-40 h-screen w-64 md:hidden"
                            >
                                <Sidebar
                                    onClose={() =>
                                        setIsMobileSidebarOpen(false)
                                    }
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Main Content Area */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: mounted ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative z-10 md:ml-64"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-20">
                        <Header />
                    </div>

                    {/* Page Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="p-4 pt-20 md:p-8 md:pt-6"
                    >
                        {/* Content Container with Glow Effect */}
                        <div className="relative rounded-xl">
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        "0 0 0px rgba(59, 130, 246, 0)",
                                        "0 0 15px rgba(59, 130, 246, 0.1)",
                                        "0 0 0px rgba(59, 130, 246, 0)",
                                    ],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                }}
                                className="absolute -inset-1 rounded-xl opacity-30"
                            ></motion.div>

                            {/* Actual Content */}
                            <div className="relative z-10">{children}</div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Mobile Sidebar Overlay */}
                <AnimatePresence>
                    {isMobileSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-20 bg-black md:hidden"
                        />
                    )}
                </AnimatePresence>
            </div>
        </UserCourseListContext.Provider>
    );
};

export default DashboardLayout;
