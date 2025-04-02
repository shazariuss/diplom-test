import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { HiOutlinePuzzle } from "react-icons/hi";
import EditCourseBasicInfo from "./EditCourseBasicInfo";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/configs/firebaseConfig";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

const CourseBasicInfo = ({ course, refreshData, edit = true }) => {
    const [selectedFile, setSelectedFile] = useState();

    useEffect(() => {
        if (course) {
            setSelectedFile(course?.courseBanner);
        }
    }, [course]);

    const onFileSelected = async (event) => {
        const file = event.target.files[0];
        setSelectedFile(URL.createObjectURL(file));

        const fileName = Date.now() + ".jpg";
        const storageRef = ref(storage, "ai-course/" + fileName);
        await uploadBytes(storageRef, file)
            .then((snapshot) => {
                console.log("Upload File completed");
            })
            .then((resp) => {
                getDownloadURL(storageRef).then(async (downloadUrl) => {
                    console.log(downloadUrl);

                    await db
                        .update(CourseList)
                        .set({
                            courseBanner: downloadUrl,
                        })
                        .where(eq(CourseList.id, course?.id));
                });
            });
    };
    return (
        <div className="p-10 border rounded-xl shadow-sm mt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                <div className="flex flex-col justify-between">
                    <h2 className="fond-bold text-3xl">
                        {course?.courseOutput?.course?.courseName}{" "}
                        {edit && (
                            <EditCourseBasicInfo
                                course={course}
                                refreshData={() => refreshData(true)}
                            />
                        )}
                    </h2>
                    <p className="text-sm text-gray-400 mt-3">
                        {course?.courseOutput?.course?.description}
                    </p>
                    <h2 className="font-bold mt-2 flex gap-2 items-center text-primary">
                        <HiOutlinePuzzle />
                        {course?.category}
                    </h2>
                    {!edit && (
                        <Link href={"/course/" + course?.courseId + "/start"}>
                            <Button className="w-full mt-5">Start</Button>
                        </Link>
                    )}
                </div>
                <div>
                    <label htmlFor="upload-image">
                        <Image
                            alt="image"
                            src={
                                selectedFile ? selectedFile : "/placeholder.png"
                            }
                            width={300}
                            height={300}
                            className="w-full h-[300px] object-cover rounded-xl cursor-pointer"
                        />
                    </label>
                    {edit && (
                        <input
                            type="file"
                            id="upload-image"
                            className="opacity-0"
                            onChange={onFileSelected}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseBasicInfo;
