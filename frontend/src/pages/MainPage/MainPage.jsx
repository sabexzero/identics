import './main-page.css';
// import Button from '../../components/Button/Button';
import LinkButton from '../../components/LinkButton/LinkButton';

// import Header from '../../components/Header/Header';
// import TextBlock from '../../components/TextBlock/TextBlock';
// import Footer from '../../components/Footer/Footer';

// import banner from '../../assets/banner.jpg';
// import LinkButton from '../../components/LinkButton/LinkButton';

const MainPage = () => {
    return (
        <>
        <div className="container">
            <h1>IDENTICS</h1>
            <div className="content">
                <div className="text_block">
                    <div className="up_text_block">
                        <p>
                            Надежная защита от плагиата с применением передовых технологий. Точность, скорость и инновации – выбери антиплагиат нового поколения!
                        </p>
                    </div>
                    <div className="down_text_block">
                    <p>Мы предлагаем:</p>
                        <ul>
                            <li>
                                Уникальная нейронная сеть для высокой точности
                            </li>
                            <li>
                                Быстрая обработка и анализ текста
                            </li>
                            <li>
                                Надежные результаты для академической и профессиональной среды
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="image_rand">

                </div>
            </div>

            <div className="buttons">
            <LinkButton className = "link_button" isWhite to="/login">Войти</LinkButton>
            <LinkButton className = "link_button" isWhite = {false} to="/register">Создать аккаунт</LinkButton>

                {/* <Button isWhite={true} to = "/login"> 
                    <p className="white_button">Войти</p>
                </Button>
                <Button isWhite={false}> 
                    <p className="black_button">Создать аккаунт</p>
                </Button> */}
            </div>
        </div>
        </>
    )
}

export default MainPage;