import './HomeTop.css';
import { brand_list } from 'assets/images';
import { Carousel } from 'react-bootstrap';
const HomeTop = () => {
  return (
    <Carousel fade className="carousel">
      {brand_list.map((item, index) => {
        return (
          <Carousel.Item interval={1800} key={index}>
            <img src={item.image} alt={item.title} height="400px" />
            <Carousel.Caption>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              {/* <a href="/">
                <button>{item.button}</button>
              </a> */}
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
};

export default HomeTop;
