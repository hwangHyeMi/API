import { useState } from 'react';
import HomeTop from 'component/HomeTop/HomeTop';
import FoodDisplay from 'component/FoodDisplay/FoodDisplay';
import ExploreMenu from 'component/ExploreMenu/ExploreMenu';

//          component: Join 컴포넌트          //
function Home() {
  const [category, setCategory] = useState('All');
  return (
    <div>
      <HomeTop />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
    </div>
  );
}
export default Home;
