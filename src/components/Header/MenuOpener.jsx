import './MenuOpener.scss';
function MenuOpener({ onClick }) {
    return <i onClick={onClick} className="fa-solid fa-bars"></i>;
}

export default MenuOpener;
