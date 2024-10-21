import * as React from "react";
import TwoSidedLayout from "../../components/TwoSidedLayout/TwoSidedLayout";
import Container from "@mui/joy/Container";
import RegistrationForm from "./RegistrationForm";

export default function Layout() {
    return (
        <Container
            sx={{
                maxHeight: "90vh",
            }}
        >
            <TwoSidedLayout reversed>
                <RegistrationForm />
            </TwoSidedLayout>
        </Container>
    );
}
