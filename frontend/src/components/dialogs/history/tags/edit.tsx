import { useRef, useState, useLayoutEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import CreateTagsForm from "@/components/forms/history/tags/create";
import EditTagsForm from "@/components/forms/history/tags/edit";
import { AnimatePresence, motion } from "framer-motion";

interface EditTagsDialogProps {
    id: number;
    open: boolean;
    onOpenChange: () => void;
}

export default function EditTagsDialog({ id, open, onOpenChange }: EditTagsDialogProps) {
    const [tab, setTab] = useState<"create" | "edit">("edit");
    const [prevHeight, setPrevHeight] = useState<number>(0);
    const contentRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (contentRef.current) {
            setPrevHeight(contentRef.current.offsetHeight);
        }
    }, [tab]);

    const handleOnOpenChange = () => {
        onOpenChange();
        setTab("edit");
    };

    return (
        <Dialog open={open} onOpenChange={handleOnOpenChange}>
            <DialogContent className="sm:max-w-[425px] max-w-[300px]">
                <DialogHeader>
                    <DialogTitle>Редактирование тегов</DialogTitle>
                    <DialogDescription>
                        Добавьте новый или выберите тег из уже созданных!
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={tab} onValueChange={(value) => setTab(value as "create" | "edit")}>
                    <TabsList className="w-full">
                        <TabsTrigger value="edit">Добавить существующий</TabsTrigger>
                        <TabsTrigger value="create">Создать новый</TabsTrigger>
                    </TabsList>

                    <div className="relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            {tab === "create" && (
                                <motion.div
                                    key="create"
                                    initial={{ height: prevHeight, filter: "blur(2px)" }}
                                    animate={{ height: "auto", filter: "blur(0px)" }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div ref={contentRef}>
                                        <TabsContent value="create">
                                            <CreateTagsForm onOpenChange={onOpenChange} />
                                        </TabsContent>
                                    </div>
                                </motion.div>
                            )}

                            {tab === "edit" && (
                                <motion.div
                                    key="edit"
                                    initial={{ height: prevHeight, filter: "blur(2px)" }}
                                    animate={{ height: "auto", filter: "blur(0px)" }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div ref={contentRef}>
                                        <TabsContent value="edit">
                                            <EditTagsForm id={id} onOpenChange={onOpenChange} />
                                        </TabsContent>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
