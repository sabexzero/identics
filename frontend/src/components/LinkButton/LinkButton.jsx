import "./link-button.css";
import { Link } from "react-router-dom";

const LinkButton = ({ to, children, isWhite = false }) => {
    const buttonClass = isWhite ? "link_button__white" : "link_button__black";

    return (
        <Link to={to} className={buttonClass}>
            {children}
        </Link>
    );
};

export default LinkButton;
