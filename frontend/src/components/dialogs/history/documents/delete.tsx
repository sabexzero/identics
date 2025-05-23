"use client";

import {
    Dialog,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { AnimatedDialogContent, AnimatedDialogWrapper } from "@/components/ui/animated-dialog.tsx";
import { useDeleteDocumentByIdMutation } from "@/api/documentApi";
import { ErrorHandler, RootState } from "@/api/store.ts";
import { toast } from "sonner";
import { useSelector } from "react-redux";

interface DeleteDocumentDialogProps {
    id: number;
    open: boolean;
    onOpenChange: () => void;
}

export default function DeleteDocumentDialog({
    id,
    open,
    onOpenChange,
}: DeleteDocumentDialogProps) {
    const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentByIdMutation();
    const userId = useSelector((state: RootState) => state.user.userId);

    const handleDeleteDocument = async () => {
        try {
            await deleteDocument({
                userId: userId!,
                id: id,
            });

            onOpenChange();
            toast.success("Документ успешно удален!");
        } catch (error) {
            toast.error(
                `Возникла ошибка при удалении документа: ${(error as ErrorHandler).data.error}`
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <AnimatedDialogContent>
                <AnimatedDialogWrapper timing={0}>
                    <DialogHeader>
                        <DialogTitle>Удаление документа</DialogTitle>
                        <DialogDescription>
                            Документ нельзя будет восстановить! Вы уверены что хотите удалить
                            документ?
                        </DialogDescription>
                    </DialogHeader>
                </AnimatedDialogWrapper>

                <AnimatedDialogWrapper timing={1}>
                    <DialogFooter className="mt-4">
                        <Button onClick={onOpenChange} variant="outline">
                            Отмена
                        </Button>
                        <Button onClick={handleDeleteDocument} disabled={isDeleting}>
                            {isDeleting ? "Удаление..." : "Удалить"}
                        </Button>
                    </DialogFooter>
                </AnimatedDialogWrapper>
            </AnimatedDialogContent>
        </Dialog>
    );
}
