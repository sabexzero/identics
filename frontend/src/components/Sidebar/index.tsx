import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { Box, Input } from "@mui/material";
import Motion from "../Motion";
import { AnimatePresence } from "framer-motion";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CloseIcon from "@mui/icons-material/Close";

const Sidebar: React.FC = () => {
    const [visible, setVisible] = useState<boolean>(false);

    const variants = {
        initial: { width: 0 },
        animate: { width: visible ? 301 : 0 },
        exit: { width: 0 },
    };

    const iconVariants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
    };

    return (
        <AnimatePresence mode="wait">
            {visible ? (
                <Motion
                    key="sidebar"
                    variants={variants}
                    transition={{ duration: 0.3 }}
                    style={{
                        overflow: "hidden",
                        flexShrink: 0,
                        display: "flex",
                        height: "auto",
                    }}
                >
                    <Paper
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                            position: "relative",
                            minWidth: "300px",
                            backgroundColor: "transparent",
                            boxSizing: "border-box",
                            marginRight: "1px",
                            gap: "20px",
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                right: "0.5rem",
                                top: "1rem",
                            }}
                        >
                            <Motion
                                variants={iconVariants}
                                transition={{
                                    delay: 0.45,
                                    duration: 0.3,
                                    type: "spring",
                                }}
                                whileHover={{ scale: 1.05 }}
                                key="close"
                            >
                                <CloseIcon
                                    onClick={() => setVisible(false)}
                                    sx={{
                                        cursor: "pointer",
                                        transition: "all 0.3s",
                                        "&:hover": {
                                            color: "#1976D2",
                                        },
                                    }}
                                />
                            </Motion>
                        </Box>
                        <Input
                            style={{ margin: "4rem 20px 0 20px" }}
                            placeholder="Поиск"
                        />
                        <SimpleTreeView sx={{ width: "100%" }}>
                            <TreeItem itemId="grid" label="Data Grid">
                                <TreeItem
                                    itemId="grid-community"
                                    label="@mui/x-data-grid"
                                />
                                <TreeItem
                                    itemId="grid-pro"
                                    label="@mui/x-data-grid-pro"
                                />
                                <TreeItem
                                    itemId="grid-premium"
                                    label="@mui/x-data-grid-premium"
                                />
                            </TreeItem>
                            <TreeItem
                                itemId="pickers"
                                label="Date and Time Pickers"
                            >
                                <TreeItem
                                    itemId="pickers-community"
                                    label="@mui/x-date-pickers"
                                />
                                <TreeItem
                                    itemId="pickers-pro"
                                    label="@mui/x-date-pickers-pro"
                                />
                            </TreeItem>
                            <TreeItem itemId="charts" label="Charts">
                                <TreeItem
                                    itemId="charts-community"
                                    label="@mui/x-charts"
                                />
                            </TreeItem>
                            <TreeItem itemId="tree-view" label="Tree View">
                                <TreeItem
                                    itemId="tree-view-community"
                                    label="@mui/x-tree-view"
                                />
                            </TreeItem>
                        </SimpleTreeView>
                    </Paper>
                </Motion>
            ) : (
                <Box
                    sx={{
                        position: "fixed",
                        left: "1rem",
                        top: "5rem",
                    }}
                >
                    <Motion
                        variants={iconVariants}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3, type: "spring" }}
                    >
                        <FormatListBulletedIcon
                            onClick={() => setVisible(true)}
                            sx={{
                                cursor: "pointer",
                                transition: "all 0.3s",
                                "&:hover": {
                                    color: "#1976D2",
                                },
                            }}
                        />
                    </Motion>
                </Box>
            )}
        </AnimatePresence>
    );
};

export default Sidebar;
