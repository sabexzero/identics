import * as React from "react";
import TwoSidedLayout from "../../components/TwoSidedLayout/TwoSidedLayout";
import LoginForm from "./LoginForm";
import Container from "@mui/joy/Container";

export default function Layout() {
    return (
        <Container
            sx={{
                maxHeight: "90vh",
            }}
        >
            <TwoSidedLayout reversed>
                <LoginForm />
            </TwoSidedLayout>
        </Container>
    );
}
