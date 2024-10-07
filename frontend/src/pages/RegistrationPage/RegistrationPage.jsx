import './registration-page.css';
import Button from '../../components/Button/Button';
import LinkButton from '../../components/LinkButton/LinkButton';
import Input from '../../components/Input/Input';

const RegisterPage = () => {
    return (
        <div className="register_form">
            <h1>Регистрация</h1>
            <p>Ваша почта и пароль будут использоваться для входа в аккаунт</p>
            <Input className="inputClass" placeholder="Почта" />
            <Input className="inputClass" placeholder="Введите пароль" />
            <Input className="inputClass" placeholder="Повторите пароль" />
            <LinkButton className = "link_button" isWhite = {false} to="/login">Войти</LinkButton>
            <LinkButton className = "link_button" isWhite = {false} to="/register">Зарегистрироваться</LinkButton>
        </div>
    );
};

export default RegisterPage;
