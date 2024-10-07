import './login-page.css';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import LinkButton from '../../components/LinkButton/LinkButton';

const LoginPage = () => {
    return (
        <div className="login_form">
            <h1>Вход</h1>
            <p>Ваша почта и пароль будут использоваться для входа в аккаунт</p>
            <Input className="inputClass" placeholder="Почта" />
            <Input className="inputClass" placeholder="Пароль" />
            <LinkButton className = "link_button" isWhite = {false} to="/register">Войти</LinkButton>
            <LinkButton className = "link_button" isWhite = {false} to="/register">Забыли пароль?</LinkButton>
            <span>Нет аккаунта? <a href=""> Создайте его </a></span>
        </div>
    );
};

export default LoginPage;
