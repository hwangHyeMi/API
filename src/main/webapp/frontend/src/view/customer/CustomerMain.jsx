import './CustomerMain.css';

const CustomerMain = () => {
  return (
    <header>
      <div className="header-contents">
        <h2>SushiKooya Customer</h2>
        <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. </p>
        <a href="#explore-menu">
          <button>View More</button>
        </a>
      </div>
    </header>
  );
};

export default CustomerMain;
