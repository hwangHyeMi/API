import './StoreMain.css';

const StoreMain = () => {
  return (
    <header id="store-header">
      <div className="store-contents">
        <h2>Store</h2>
        <p>Choose from a diverse menu featuring a delectable </p>
        <a href="#explore-menu">
          <button>View More</button>
        </a>
      </div>
    </header>
  );
};

export default StoreMain;
