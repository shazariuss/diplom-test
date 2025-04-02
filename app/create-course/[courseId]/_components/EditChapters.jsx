import React, { useEffect, useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";

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
import { Button } from "@/components/ui/button";
import { db } from "@/configs/db";
import { eq } from "drizzle-orm";
import { CourseList } from "@/configs/schema";

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

        const result = await db
            .update(CourseList)
            .set({
                courseOutput: course?.courseOutput,
            })
            .where(eq(CourseList?.id, course?.id))
            .returning({ id: CourseList.id });

        refreshData(true);
    };

    return (
        <Dialog>
            <DialogTrigger>
                <HiOutlinePencilAlt />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Chapter</DialogTitle>
                    <DialogDescription>
                        <div className="mt-3">
                            <label htmlFor="">Course Title</label>
                            <Input
                                defaultValue={Chapters[index].chapterName}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="">Description</label>
                            <Textarea
                                onChange={(e) => setAbout(e.target.value)}
                                className="h-40"
                                defaultValue={Chapters[index].about}
                            />
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose>
                        <Button onClick={onUpdateHandler}>Update</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default EditChapters;
