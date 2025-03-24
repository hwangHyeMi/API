import './HomeTop.css';

const HomeTop = () => {
  return (
    <header>
      <div className="header-contents">
        <h2>SushiKooya</h2>
        <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. </p>
        <a href="#explore-menu">
          <button>View Menu</button>
        </a>
      </div>
    </header>
  );
};

export default HomeTop;
