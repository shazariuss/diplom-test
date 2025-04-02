"use client";
import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState } from "react";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import SelectCategory from "./_components/SelectCategory";
import TopicDescription from "./_components/TopicDescription";
import SelectOption from "./_components/SelectOption";
import { UserInputContext } from "../_context/UserInputContext";
import { GenerateCourseLayout_AI } from "@/configs/AiModel";
import LoadingDialog from "./_components/LoadingDialog";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function CreateCourse() {
    const StepperCourse = [
        {
            id: 1,
            name: "Category",
            icon: <HiMiniSquares2X2 />,
        },
        {
            id: 2,
            name: "Topic & Desc",
            icon: <HiMiniSquares2X2 />,
        },
        {
            id: 3,
            name: "Options",
            icon: <HiMiniSquares2X2 />,
        },
    ];
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    const router = useRouter();

    const { userCourseInput, setUserCourseInput } =
        useContext(UserInputContext);

    // useEffect(() => {
    //     console.log(userCourseInput);
    // }, [userCourseInput]);

    const checkStatus = () => {
        if (userCourseInput?.length == 0) {
            return true;
        }

        if (
            activeIndex == 0 &&
            (userCourseInput?.category?.length == 0 ||
                userCourseInput?.category == undefined)
        ) {
            return true;
        }

        if (
            activeIndex == 1 &&
            (userCourseInput?.topic?.length == 0 ||
                userCourseInput?.topic == undefined)
        ) {
            return true;
        }

        if (
            activeIndex == 2 &&
            (userCourseInput?.level == undefined ||
                userCourseInput?.duration == undefined ||
                userCourseInput?.displayVideo == undefined ||
                userCourseInput?.noOfChapter == undefined)
        ) {
            return true;
        }
        return false;
    };

    const GenerateCourseLayout = async () => {
        setIsLoading(true);
        const BASIC_PROMPT =
            "Generate A Course Tutorial on Following Detail With field as Course Name, Description, Along with Chapter Name, about, Duration:";
        const USER_INPUT_PROMPT =
            "Category: " +
            userCourseInput?.category +
            ", Topic: " +
            userCourseInput?.topic +
            ", Level: " +
            userCourseInput?.level +
            ", Duration:" +
            userCourseInput?.duration +
            ", NoOf Chapters:" +
            userCourseInput?.noOfChapter +
            ", in JSON format" +
            "in Uzbek Language.";
        const FINAL_RPOMPT = BASIC_PROMPT + USER_INPUT_PROMPT;
        console.log("Final prompt:", FINAL_RPOMPT);
        const result = await GenerateCourseLayout_AI.sendMessage(FINAL_RPOMPT);
        setIsLoading(false);
        // console.log(result.response?.text());
        console.log("Result layout:", JSON.parse(result.response?.text()));
        SaveCourseLayoutInDb(JSON.parse(result.response?.text()));
    };

    const SaveCourseLayoutInDb = async (courseLayout) => {
        var id = uuid4();
        setIsLoading(true);
        const result = await db.insert(CourseList).values({
            courseId: id,
            name: userCourseInput?.topic,
            level: userCourseInput?.level,
            category: userCourseInput?.category,
            courseOutput: courseLayout,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            userName: user?.fullName,
            userProfileImage: user?.imageUrl,
        });

        // console.log("finish");
        setIsLoading(false);
        router.replace("/create-course/" + id);
    };

    const [activeIndex, setActiveIndex] = useState(0);
    return (
        <div>
            <div className="flex flex-col justify-center items-center mt-10">
                <h2 className="text-4xl text-primary font-medium">
                    Create Course
                </h2>
                <div className="flex mt-10">
                    {StepperCourse.map((item, index) => (
                        <div className="flex items-center">
                            <div className="flex flex-col items-center w-[50px] md:w-[100px]">
                                <div
                                    className={`bg-gray-200 p-3 rounded-full text-white ${
                                        activeIndex >= index && "bg-purple-500"
                                    }`}
                                >
                                    {item.icon}
                                </div>
                                <h2 className="hidden md:block md:text-sm">
                                    {item.name}
                                </h2>
                            </div>
                            {index != StepperCourse.length - 1 && (
                                <div
                                    className={`h-1 w-[50px] md:w-[100px] rounded-full lg:w-[170px] bg-gray-300 ${
                                        activeIndex - 1 >= index &&
                                        "bg-purple-500"
                                    }`}
                                ></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-10 md:px-20 lg:px-44 mt-10">
                {activeIndex == 0 && <SelectCategory />}
                {activeIndex == 1 && <TopicDescription />}
                {activeIndex == 2 && <SelectOption />}
                <div className="flex justify-between mt-10">
                    <Button
                        variant="outline"
                        disabled={activeIndex == 0}
                        onClick={() => setActiveIndex((prev) => prev - 1)}
                    >
                        Previous{" "}
                    </Button>
                    {activeIndex < 2 && (
                        <Button
                            disabled={checkStatus()}
                            onClick={() =>
                                setActiveIndex((prev) =>
                                    prev < 2 ? prev + 1 : prev
                                )
                            }
                        >
                            Next
                        </Button>
                    )}

                    {activeIndex == 2 && (
                        <Button
                            disabled={checkStatus()}
                            onClick={() => GenerateCourseLayout()}
                        >
                            Generate Course Layout
                        </Button>
                    )}
                </div>
            </div>
            <LoadingDialog isLoading={isLoading} />
        </div>
    );
}

export default CreateCourse;
