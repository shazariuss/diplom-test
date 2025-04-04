import React from "react";
import Markdown from "react-markdown";
import YouTube from "react-youtube";

const ChapterContent = ({ chapter, content }) => {
    const opts = {
        height: "390",
        width: "640",
        playerVars: {
            autoplay: 0,
        },
    };
    return (
        <div className="p-10">
            <h2 className="font-medium text-2xl">{chapter?.chapterName}</h2>
            <p className="text-gray-500">{chapter?.about}</p>

            {/* Video */}

            <div className="flex justify-center my-6">
                <YouTube videoId={content?.videoId} opts={opts} />
            </div>

            {/* Content */}

            <div>
                {content?.content?.sections?.map((item, index) => (
                    <div className="p-5 bg-sky-50 mb-3 rounded-lg max-w-[1150px]">
                        <h2 className="font-medium text-lg">{item?.title}</h2>
                        <Markdown>{item?.explanation}</Markdown>
                        {/* <p className="whitespace-pre-wrap">
                        </p> */}
                        {item?.code_example && (
                            <div className="p-4 bg-black text-white rounded-md mt-3">
                                <pre>
                                    <code>{item?.code_example}</code>
                                </pre>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChapterContent;
