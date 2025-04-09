import React, { useEffect, useState } from "react";
import { Edit2 } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/configs/db";
import { eq } from "drizzle-orm";
import { CourseList } from "@/configs/schema";
import { motion } from "framer-motion";

const EditChapters = ({ course, index, refreshData }) => {
    const Chapters = course?.courseOutput?.course?.chapters;
    const [name, setName] = useState();
    const [about, setAbout] = useState();

    useEffect(() => {
        setName(Chapters[index].chapterName);
        setAbout(Chapters[index].about);
    }, [course]);

    const onUpdateHandler = async () => {
        course.courseOutput.course.chapters[index].chapterName = name;
        course.courseOutput.course.chapters[index].about = about;

        await db
            .update(CourseList)
            .set({ courseOutput: course?.courseOutput })
            .where(eq(CourseList?.id, course?.id))
            .returning({ id: CourseList.id });

        refreshData(true);
    };

    return (
        <Dialog>
            <DialogTrigger>
                <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Edit2 className="h-4 w-4 text-blue-400" />
                </motion.div>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle>Edit Chapter</DialogTitle>
                    <DialogDescription>
                        <div className="mt-3">
                            <label className="text-gray-300">
                                Chapter Title
                            </label>
                            <Input
                                defaultValue={Chapters[index].chapterName}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/50"
                            />
                        </div>
                        <div className="mt-3">
                            <label className="text-gray-300">Description</label>
                            <Textarea
                                onChange={(e) => setAbout(e.target.value)}
                                className="h-40 bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/50"
                                defaultValue={Chapters[index].about}
                            />
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose>
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onUpdateHandler}
                            className="group relative inline-flex items-center rounded-lg bg-blue-600 px-6 py-2 font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500"
                        >
                            Update
                            <motion.span
                                animate={{
                                    boxShadow: [
                                        "0 0 0px rgba(59, 130, 246, 0)",
                                        "0 0 8px rgba(59, 130, 246, 0.5)",
                                        "0 0 0px rgba(59, 130, 246, 0)",
                                    ],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 rounded-lg"
                            />
                        </motion.button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditChapters;
