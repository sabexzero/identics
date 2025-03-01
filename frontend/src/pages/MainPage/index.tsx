import React from "react";
import TwoSidedLayout from "../../components/TwoSidedLayout/index.tsx";
import {
    ContentBox,
    Description,
    FlexContainer,
    Heading,
    LoginLink,
    LoginText,
    Logo,
} from "./styled.tsx";
import RouterLink from "../../components/RouterLink/index.tsx";
import { Link } from "react-router-dom";

const MainPage: React.FC = () => {
    return (
        <FlexContainer>
            <TwoSidedLayout>
                <ContentBox>
                    <Logo>IDENTICS</Logo>
                    <Heading>
                        Мы - надежная защита от плагиата с применением передовых
                        технологий.
                    </Heading>
                    <Description>
                        Точность, скорость и инновации - выбери антиплагиат
                        нового поколения!
                    </Description>
                    <RouterLink to="/auth/reg">Зарегистироваться</RouterLink>
                    <LoginText>
                        Уже есть аккаунт? &nbsp;
                        <LoginLink as={Link} to="/auth/login">
                            Войти
                        </LoginLink>
                    </LoginText>
                </ContentBox>
            </TwoSidedLayout>
        </FlexContainer>
    );
};

export default MainPage;
