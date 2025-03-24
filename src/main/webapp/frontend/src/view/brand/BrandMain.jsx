import { Carousel } from 'react-bootstrap';
import './BrandMain.css';
import { brand_list } from 'assets/images';
const BrandMain = () => {
  return (
    <Carousel fade className="carousel">
      {brand_list.map((item, index) => {
        return (
          <Carousel.Item interval={1200}>
            <img src={item.image} alt="Image" />
            <Carousel.Caption>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <a href="/">
                <button>{item.button}</button>
              </a>
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
};

export default BrandMain;
