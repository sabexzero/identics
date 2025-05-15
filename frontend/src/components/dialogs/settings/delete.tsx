"use client";

import {
    Dialog,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import { AnimatedDialogContent, AnimatedDialogWrapper } from "@/components/ui/animated-dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { ErrorHandler } from "@/api/store.ts";
import { useDeleteProfileMutation } from "@/api/profileApi";
import { useNavigate } from "react-router-dom";

interface SettingsDeleteProfileDialogProps {
    open: boolean;
    onOpenChange: () => void;
}

export default function SettingsDeleteProfileDialog({
    open,
    onOpenChange,
}: SettingsDeleteProfileDialogProps) {
    const [deleteProfile, { isLoading: isDeleting }] = useDeleteProfileMutation();
    const navigate = useNavigate();

    const handleDeleteProfile = async () => {
        try {
            await deleteProfile().unwrap();
            localStorage.clear();
            navigate("/auth");
        } catch (error) {
            toast.error("Ошибка!", {
                description: `Возникла ошибка при удалении аккаунта: ${(error as ErrorHandler).data.error}`,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <AnimatedDialogContent>
                <AnimatedDialogWrapper timing={0}>
                    <DialogHeader>
                        <DialogTitle>Удаление аккаунта</DialogTitle>
                        <DialogDescription>
                            Аккаунт нельзя будет восстановить! Вы уверены что хотите удалить
                            аккаунт?
                        </DialogDescription>
                    </DialogHeader>
                </AnimatedDialogWrapper>

                <AnimatedDialogWrapper timing={1}>
                    <DialogFooter className="mt-4">
                        <Button onClick={onOpenChange} variant="outline">
                            Отмена
                        </Button>
                        <Button
                            onClick={handleDeleteProfile}
                            variant="destructive"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Удаление..." : "Удалить"}
                        </Button>
                    </DialogFooter>
                </AnimatedDialogWrapper>
            </AnimatedDialogContent>
        </Dialog>
    );
}
