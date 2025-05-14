"use client";

import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { AnimatedDialogContent, AnimatedDialogWrapper } from "@/components/ui/animated-dialog.tsx";
import CreateReviewReportForm from "@/components/forms/review";

interface DeleteDocumentDialogProps {
    open: boolean;
    onOpenChange: () => void;
}

export default function CreateReviewReport({ open, onOpenChange }: DeleteDocumentDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <AnimatedDialogContent className="space-y-4">
                <AnimatedDialogWrapper timing={0}>
                    <DialogHeader>
                        <DialogTitle>Заполнение информации</DialogTitle>
                        <DialogDescription>
                            Для получения отчета осталось заполнить, необходимую для его генерации,
                            информацию
                        </DialogDescription>
                    </DialogHeader>
                </AnimatedDialogWrapper>
                <CreateReviewReportForm onOpenChange={onOpenChange} />
            </AnimatedDialogContent>
        </Dialog>
    );
}
