import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const SelectorContainer = styled(Box)({
    display: "flex",
    flexDirection: "row",
    gap: "10px",
});

export const OptionBox = styled(Box)({
    display: "flex",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    backgroundColor: "#ebebeb",
    alignItems: "center",
    borderRadius: 4,
    cursor: "pointer",
});

export const OptionTypography = styled(Typography)({
    userSelect: "none",
});
