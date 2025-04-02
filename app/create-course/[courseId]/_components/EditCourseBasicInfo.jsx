"use client";
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
import { CourseList } from "@/configs/schema";
import { db } from "@/configs/db";
import { eq } from "drizzle-orm";

const EditCourseBasicInfo = ({ course, refreshData }) => {
    const [name, setName] = useState();
    const [description, setDescription] = useState();

    useEffect(() => {
        setName(course?.courseOutput?.course?.courseName);
        setDescription(course?.courseOutput?.course?.description);
    }, [course]);

    const onUpdateHandler = async () => {
        course.courseOutput.course.courseName = name;
        course.courseOutput.course.description = description;

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
                    <DialogTitle>Edit Course Title & Description</DialogTitle>
                    <DialogDescription>
                        <div className="mt-3">
                            <label htmlFor="">Course Title</label>
                            <Input
                                defaultValue={
                                    course?.courseOutput?.course?.courseName
                                }
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="">Description</label>
                            <Textarea
                                onChange={(e) => setDescription(e.target.value)}
                                className="h-40"
                                defaultValue={
                                    course?.courseOutput?.course?.description
                                }
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

export default EditCourseBasicInfo;
