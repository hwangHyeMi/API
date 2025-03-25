import FoodItem from 'component/FoodItem/FoodItem';
import { useContext } from 'react';
import { ContextStore } from 'stores/ContextStore';
import './FoodDisplay.css';

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(ContextStore);
  return (
    <div className="food-display" id="food-display">
      {category !== 'All' ? <h2>{category}</h2> : <h2></h2>}

      <div className="food-display-list">
        {food_list.map((item, index) => {
          if (category === 'All' || category === item.category) {
            return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />;
          }
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
