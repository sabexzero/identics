import "./personal-account.css";
import Button from "../../components/Button/Button";
import Img_man from "../../assets/images/img_man.png";
import Search from "../../components/Search/Search";

export default function PersonalAccount() {
    return (
        <>
            <div className="profile-container">
                <div className="up_bar">
                    <h1>IDENTICS</h1>
                    <Button isWhite={true}>Выйти</Button>
                </div>
            </div>

            <div className="black_block">
                <div className="content_block">
                    <div className="text_or_doc">
                        <h2>Проверить оригинальность</h2>
                        <div className="button_container">
                            <Button isWhite={true}>Текст</Button>
                            <Button isWhite={true}>Документ</Button>
                        </div>
                    </div>
                    <img src={Img_man} alt="" />
                </div>
            </div>
            <div className="profile-container">
                <div className="search_profile">
                    <Search placeholder={"Поиск документа"}></Search>
                </div>
            </div>
        </>
    );
}
