import React, { useContext } from 'react';
import './FoodDisplay.css';
import { ContextStore } from 'store/ContextStore';
import FoodItem from 'component/FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(ContextStore);
  return (
    <div className="food-display" id="food-display">
      <h2>Top Dishes Near You</h2>
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
