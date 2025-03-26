import { menu_list } from 'assets/images';
import './MenuExplore.css';

const MenuExplore = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Menu</h1>
      <p className="explore-menu-text">Choose from a diverse menu featuring a delectable array of dishes.</p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div key={index} className="explore-menu-list-item" onClick={() => setCategory((prev) => (prev === item.menu_name ? 'All' : item.menu_name))}>
              <img src={item.menu_image} className={category === item.menu_name ? 'active' : ''} alt="menu_image" />
              <p>{item.menu_name}</p>
              <p>{item.sub_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default MenuExplore;
