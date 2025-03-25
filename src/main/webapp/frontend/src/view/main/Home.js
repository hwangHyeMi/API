import { useState } from 'react';
import MenuTop from 'component/MenuTop/MenuTop';
import FoodDisplay from 'component/FoodDisplay/FoodDisplay';
import ExploreMenu from 'component/ExploreMenu/ExploreMenu';

//          component: Join 컴포넌트          //
function Home() {
  const [category, setCategory] = useState('All');
  return (
    <div>
      <MenuTop />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
    </div>
  );
}
export default Home;
