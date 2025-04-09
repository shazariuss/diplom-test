import React, { useState } from "react";
import Markdown from "react-markdown";
import YouTube from "react-youtube";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"; // Dark theme style
import { HiOutlineClipboardCopy } from "react-icons/hi";

const ChapterContent = ({ chapter, content }) => {
    const [copied, setCopied] = useState(false);

    const opts = {
        height: "390",
        width: "640",
        playerVars: {
            autoplay: 0,
        },
    };

    // Reset "Copied!" state after 2 seconds
    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-10"
        >
            <h2 className="mb-2 text-2xl font-medium text-blue-300">
                {chapter?.chapterName}
            </h2>
            <p className="mb-6 text-gray-400">{chapter?.about}</p>

            {/* Video */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="my-6 flex justify-center"
            >
                <div className="relative rounded-lg shadow-xl">
                    <YouTube videoId={content?.videoId} opts={opts} />
                </div>
            </motion.div>

            {/* Content */}
            <div className="space-y-4">
                {content?.content?.sections?.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                        className="rounded-lg bg-gray-800/50 p-5 shadow-md backdrop-blur-sm"
                    >
                        <h2 className="mb-2 font-medium text-lg text-gray-200">
                            {item?.title}
                        </h2>
                        <div className="prose prose-invert text-gray-300">
                            <Markdown>{item?.explanation}</Markdown>
                        </div>
                        {item?.code_example && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="relative mt-3 rounded-md bg-gray-900 shadow-inner"
                            >
                                {/* Copy Button */}
                                {/* <CopyToClipboard
                                    text={item.code_example}
                                    onCopy={handleCopy}
                                >
                                    <button className="absolute right-2 top-2 flex items-center rounded-md bg-blue-600 px-2 py-1 text-sm text-white transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                                        <HiOutlineClipboardCopy className="mr-1 h-4 w-4" />
                                        {copied ? "Copied!" : "Copy"}
                                    </button>
                                </CopyToClipboard> */}

                                {/* Syntax Highlighted Code */}
                                <SyntaxHighlighter
                                    language="javascript" // Adjust based on your code type if known
                                    style={oneDark}
                                    customStyle={{
                                        margin: 0,
                                        padding: "1rem",
                                        borderRadius: "0.375rem",
                                        background: "transparent",
                                    }}
                                    wrapLines={true}
                                    showLineNumbers={true}
                                >
                                    {item.code_example.trim()}
                                </SyntaxHighlighter>
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default ChapterContent;
