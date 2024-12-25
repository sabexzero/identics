import "./button.css";

const Button = ({ children, isWhite = false }) => {
    // Выбираем класс на основе значения isWhite
    const buttonClass = isWhite ? "button__white" : "button__black";

    return (
        <button className={buttonClass}>
            <p>{children}</p>
        </button>
    );
};

export default Button;
