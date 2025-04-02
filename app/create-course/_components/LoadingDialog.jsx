import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

const LoadingDialog = ({ isLoading }) => {
    return (
        <AlertDialog open={isLoading}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogDescription>
                        <div className="flex flex-col items-center py-10">
                            <Image
                                alt="image"
                                src={"/loader.gif"}
                                width={100}
                                height={100}
                            />
                            <h2>Please wait... AI is working on your Course</h2>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default LoadingDialog;
