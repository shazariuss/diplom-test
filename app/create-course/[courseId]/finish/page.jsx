"use client";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import CourseBasicInfo from "../_components/CourseBasicInfo";
import { useRouter } from "next/navigation";
import { HiOutlineClipboardDocument } from "react-icons/hi2";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FinishScreen = ({ params }) => {
    const { user } = useUser();
    const [course, setCourse] = useState([]);
    const router = useRouter();

    useEffect(() => {
        params && getCourse();
    }, [params, user]);

    const getCourse = async () => {
        const result = await db
            .select()
            .from(CourseList)
            .where(
                and(
                    eq(CourseList.courseId, params?.courseId),
                    eq(
                        CourseList?.createdBy,
                        user?.primaryEmailAddress?.emailAddress
                    )
                )
            );

        setCourse(result[0]);
        // console.log(result);
    };
    return (
        <div className="px-10 md:px-20 lg:px-44 my-7 flex flex-col gap-5">
            <h2 className="text-center font-bold text-2xl my-3 text-primary">
                Congratulations! <br />
                Your Course is Ready!
            </h2>
            <CourseBasicInfo
                course={course}
                refreshData={() => console.log()}
            />
            <Link href={`/course/` + course?.courseId}>
                <Button>Go to Course!</Button>
            </Link>
            <h2 className="text-center text-gray-400 border p-2 rounded flex gap-5 items-center">
                {process.env.NEXT_PUBLIC_HOST_NAME}/course/
                {course?.courseId}
                <HiOutlineClipboardDocument
                    className="h-5 w-5 cursor-pointer"
                    onClick={async () =>
                        await navigator.clipboard.writeText(
                            process.env.NEXT_PUBLIC_HOST_NAME +
                                "/course/" +
                                course?.courseId
                        )
                    }
                />
            </h2>
        </div>
    );
};

export default FinishScreen;
