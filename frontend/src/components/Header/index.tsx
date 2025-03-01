import React from "react";
import { Box, Button, Stack, styled, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

const ButtonContainer = styled(Button)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px !important",
    height: "32px",
    minWidth: "32px",
    padding: 0,
    cursor: "pointer",
    boxShadow: "hsla(215, 15%, 89%, 0.5) 0 1px 2px 0",
    border: "1px solid hsl(215, 15%, 82%)",
    borderRadius: "10px",
    outline: 0,
    "&:hover": {
        outline: "none",
        borderColor: "hsl(215, 15%, 82%)",
    },
    "&:focus": {
        outline: "none",
    },
});

const Header: React.FC = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.5rem 1rem",
                    height: "3rem",
                    boxSizing: "border-box",
                    backgroundColor: "transparent",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    backdropFilter: "blur(8px)",
                    borderBottom: "1px solid hsl(215, 15%, 82%)",
                }}
            >
                <Typography fontSize="21px">IDENTICS</Typography>
                <Stack direction="row" spacing={1}>
                    <ButtonContainer>
                        <NotificationsNoneOutlinedIcon
                            sx={{ width: "18px", height: "18px" }}
                            color="primary"
                        />
                    </ButtonContainer>
                    <ButtonContainer>
                        <SettingsOutlinedIcon
                            sx={{ width: "18px", height: "18px" }}
                            color="primary"
                        />
                    </ButtonContainer>
                </Stack>
            </Box>
            <Box
                sx={{
                    maxWidth: "100%",
                    mt: "48px",
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default Header;
