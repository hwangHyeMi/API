import { assets } from 'assets/images';
import { NavLink, useNavigate } from 'react-router-dom';
import './Footer.css';
const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          {/* <img src={assets.logo} alt="logo" /> */}
          <NavLink to={'/'} className="link">
            {process.env.REACT_APP_HEADER_TITLE}
          </NavLink>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugit ratione fugiat vitae quisquam dolores sint id, nisi veniam repellendus. Tempore, expedita. At praesentium deserunt minima! Porro iste beatae maxime voluptatem?</p>
          <div className="footer-social-icons">
            <a href="https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=%EC%8A%A4%EC%8B%9C%EC%BF%A0%EC%95%BC">
              <img src={assets.naver_icon} alt="naver" />
            </a>
            <a href="https://www.instagram.com/sushikooya/#">
              <img src={assets.instagram_icon} alt="instagram" />
            </a>
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li onClick={() => navigate('/')}>Home</li>
            <li>About Us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+82-02-2612-3330</li>
            <li>go90004@naver.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2025 © sushikooya.com</p>
    </footer>
  );
};

export default Footer;
