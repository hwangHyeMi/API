import 'css/Home.css';

//          component: Join 컴포넌트          //
function Home() {
  return (
    <header>
      <div className="header-contents">
        <h2>SushiKooya</h2>
        <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
        <a href="#explore-menu">
          <button>View Menu</button>
        </a>
      </div>
    </header>
  );
}
export default Home;
