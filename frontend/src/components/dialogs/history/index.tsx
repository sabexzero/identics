import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs.tsx";
import CreateTagsForm from "@/components/forms/history/create-tags";
import EditTagsForm from "@/components/forms/history/edit-tags";

interface EditTagsDialogProps {
    open: boolean;
    onOpenChange: () => void;
}

const EditTagsDialog: React.FC<EditTagsDialogProps> = ({
    open,
    onOpenChange,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Редактирование тегов</DialogTitle>
                    <DialogDescription>
                        Добвьте новый или выберите тег из уже созданных!
                    </DialogDescription>
                </DialogHeader>
                <Tabs>
                    <TabsList className="w-full">
                        <TabsTrigger value="edit">
                            Добавить существующий
                        </TabsTrigger>
                        <TabsTrigger value="create">Создать новый</TabsTrigger>
                    </TabsList>
                    <TabsContent value="create">
                        <CreateTagsForm onOpenChange={onOpenChange} />
                    </TabsContent>
                    <TabsContent value="edit">
                        <EditTagsForm onOpenChange={onOpenChange} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default EditTagsDialog;
