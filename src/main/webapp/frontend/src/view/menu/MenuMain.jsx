import './MenuMain.css';
import { useState } from 'react';
import MenuFoodDisplay from 'component/MenuFoodDisplay/MenuFoodDisplay';
import MenuExplore from 'component/MenuExplore/MenuExplore';
const MenuMain = () => {
  const [category, setCategory] = useState('All');
  return (
    <div>
      <header id="menu-header">
        <div className="menu-contents">
          <h2>Menu</h2>
          <p>Choose from a diverse menu featuring </p>
          <a href="#explore-menu">
            <button>View More</button>
          </a>
        </div>
      </header>
      <MenuExplore category={category} setCategory={setCategory} />
      <MenuFoodDisplay category={category} />
    </div>
  );
};

export default MenuMain;
