import './search.css';
import Search_icon from '../../assets/images/search_icon.png';

const Search = ({ placeholder }) => {
    console.log(Search_icon); // Проверяем, выводится ли путь
    return (
        <div className="search_class">
            <img src={Search_icon} alt="Search Icon" />
            <input className="inputClass" placeholder={placeholder} />
        </div>
    );
};

export default Search;
