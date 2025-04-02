import Link from "next/link";
import React from "react";

const Hero = () => {
    return (
        <section className="bg-gray-50">
            <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex  lg:items-center">
                <div className="mx-auto max-w-xl text-center">
                    <h1 className="text-3xl font-extrabold text-primary sm:text-5xl">
                        AI Course Generator
                        <strong className="font-extrabold text-black sm:block">
                            Custom Learning paths, Powered by AI
                        </strong>
                    </h1>

                    <p className="mt-4 sm:text-xl/relaxed">
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Nesciunt illo tenetur fuga ducimus numquam ea!
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            className="block w-full rounded bg-primary 0 px-12 py-3 text-sm font-medium text-white shadow hover:bg-secondaryfocus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                            href="/dashboard"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
