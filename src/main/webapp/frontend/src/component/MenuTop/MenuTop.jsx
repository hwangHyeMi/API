import './MenuTop.css';
const HomeTop = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>Welcome to SushiKooya</h2>
        <p>최고의 초밥을 맛보러 오세요~!</p>
        <a href="#explore-menu">
          <button>View More</button>
        </a>
      </div>
    </div>
  );
};

export default HomeTop;
