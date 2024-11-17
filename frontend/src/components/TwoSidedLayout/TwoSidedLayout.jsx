import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import { typographyClasses } from "@mui/joy/Typography";
import MotionDiv from "../motion/MotionDiv.jsx";

const TwoSidedLayout = ({ children, reversed }) => {
    return (
        <Container
            sx={(theme) => ({
                position: "relative",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start", // Align content to the top
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
            <MotionDiv reversed={reversed}>
                <Box
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
                        [`& .${typographyClasses.root}`]: {
                            textWrap: "balance",
                        },
                    })}
                >
                    {children}
                </Box>
            </MotionDiv>
            <AspectRatio
                ratio={600 / 520}
                variant="plain"
                maxHeight={300}
                sx={(theme) => ({
                    minWidth: 300,
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
                        marginTop: "20px", // Add top margin for the image on mobile
                    },
                })}
            >
                <MotionDiv pic>
                    <img
                        src="https://images.unsplash.com/photo-1483791424735-e9ad0209eea2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                        alt=""
                    />
                </MotionDiv>
            </AspectRatio>
        </Container>
    );
};

export default TwoSidedLayout;
