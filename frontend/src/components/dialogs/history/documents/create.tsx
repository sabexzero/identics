"use client";

import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { AnimatedDialogContent, AnimatedDialogWrapper } from "@/components/ui/animated-dialog.tsx";
import EditDocumentForm from "@/components/forms/history/documents/edit";

interface DeleteDocumentDialogProps {
    id: number;
    open: boolean;
    onOpenChange: () => void;
}

export default function EditDocumentDialog({ id, open, onOpenChange }: DeleteDocumentDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <AnimatedDialogContent className="space-y-4">
                <AnimatedDialogWrapper timing={0}>
                    <DialogHeader>
                        <DialogTitle>Редактирование документа</DialogTitle>
                        <DialogDescription>
                            Документ нельзя будет восстановить! Вы уверены что хотите переименовать
                            документ?
                        </DialogDescription>
                    </DialogHeader>
                </AnimatedDialogWrapper>

                <EditDocumentForm id={id} onOpenChange={onOpenChange} />
            </AnimatedDialogContent>
        </Dialog>
    );
}
