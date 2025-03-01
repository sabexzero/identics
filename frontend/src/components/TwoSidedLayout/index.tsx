import React from "react";
import Motion from "../Motion";
import { Box } from "@mui/material";

interface TwoSidedLayoutProps {
    reversed?: boolean;
    children: React.ReactNode;
}

const TwoSidedLayout: React.FC<TwoSidedLayoutProps> = ({
    reversed,
    children,
}) => {
    return (
        <Box
            sx={(theme) => ({
                position: "relative",
                maxHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                overflow: "hidden",
                py: 0,
                gap: 4,
                [theme.breakpoints.up(834)]: {
                    flexDirection: reversed ? "row-reverse" : "row",
                    gap: 3,
                },
                [theme.breakpoints.up(1199)]: {
                    gap: 2,
                },
            })}
        >
            <Motion key="test-key" reversed={reversed}>
                <Box
                    key="test-child"
                    sx={(theme) => ({
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "1rem",
                        maxWidth: "75ch",
                        textAlign: "center",
                        flexShrink: 999,
                        [theme.breakpoints.up(834)]: {
                            minWidth: 420,
                            alignItems: "flex-start",
                            textAlign: "initial",
                        },
                    })}
                >
                    {children}
                </Box>
            </Motion>
            <Box
                sx={(theme) => ({
                    minWidth: 300,
                    display: "flex",
                    aspectRatio: "600/520",
                    alignSelf: "stretch",
                    [theme.breakpoints.up(834)]: {
                        alignSelf: "initial",
                        flexGrow: 1,
                        "--AspectRatio-maxHeight": "520px",
                        "--AspectRatio-minHeight": "400px",
                    },
                    borderRadius: "sm",
                    bgcolor: "transparent",
                    flexBasis: "50%",
                    [theme.breakpoints.down(834)]: {
                        marginTop: "20px",
                    },
                })}
            >
                <Motion key="next-test-key" pic>
                    <img
                        key="test-next-child"
                        src="https://images.unsplash.com/photo-1483791424735-e9ad0209eea2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                        alt=""
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "block",
                            objectFit: "cover",
                            aspectRatio: "600/520",
                        }}
                    />
                </Motion>
            </Box>
        </Box>
    );
};

export default TwoSidedLayout;
