import './button.css';

const Button = ({ children, isWhite = false }) => {
    // Выбираем класс на основе значения isWhite
    const buttonClass = isWhite ? 'button__white' : 'button__black';

    return (
        <button className={buttonClass}>
            {children}            
        </button>
    );
};

export default Button;
