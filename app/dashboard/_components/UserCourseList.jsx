"use client";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import React, { useContext, useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { UserCourseListContext } from "@/app/_context/UserCourseListContext";

function UserCourseList() {
    const { user } = useUser();
    const [courseList, setCourseList] = useState();
    const [loading, setLoading] = useState(false);
    const { userCourseList, setUserCourseList } = useContext(
        UserCourseListContext
    );

    useEffect(() => {
        user && getUserCourses();
    }, [user]);

    const getUserCourses = async () => {
        setLoading(true);
        const result = await db
            .select()
            .from(CourseList)
            .where(
                eq(
                    CourseList?.createdBy,
                    user?.primaryEmailAddress?.emailAddress
                )
            );
        setCourseList(result);
        setUserCourseList(result);
        setLoading(false);
    };
    return (
        <div className="mt-10">
            <h2 className="font-medium text-xl">My AI Courses</h2>
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-col-3 gap-5">
                {loading
                    ? [1, 2, 3, 4, 5].map((item, index) => (
                          <div
                              key={index}
                              className="w-full mt-5 bg-slate-200 animate-pulse rounded-lg h-[270px]"
                          ></div>
                      ))
                    : courseList?.map((course, index) => (
                          <CourseCard
                              course={course}
                              key={index}
                              refreshData={() => getUserCourses()}
                              displayUser={true}
                          />
                      ))}
            </div>
        </div>
    );
}

export default UserCourseList;
