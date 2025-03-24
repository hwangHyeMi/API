import React, { useState, useEffect, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function DevListScroll() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const elementRef = useRef(null);

  const fetchMoreItems = async () => {
    const response = await fetch(`https://dummyjson.com/products?limit=10&skip=${page * 10}`);
    const newData = await response.json();
    // 만약 더 이상 불러올 상품이 없다면 hasMore 상태를 false로 설정합니다.
    if (newData.products.length === 0) {
      setHasMore(false);
    } else {
      // 불러온 데이터를 현재 상품 목록에 추가합니다.
      // 이전 상품 목록(prevProducts)에 새로운 데이터(newData.products)를 연결합니다.
      setProducts((prevProducts) => [...prevProducts, ...newData.products]);

      // 페이지 번호를 업데이트하여 다음 요청에 올바른 skip 값을 사용합니다.
      setPage((prevPage) => {
        //console.log('prevPage=' + prevPage);
        return prevPage + 1;
      });
      console.log('page=' + page);
      //console.log(`skip=${page * 10}`);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  const onIntersection = (entries) => {
    const firstEntry = entries[0];

    // 첫 번째 entry가 화면에 나타나고 더 많은 데이터를 불러올 수 있는 상태(hasMore)인 경우 fetchMoreItems 함수를 호출.
    if (firstEntry.isIntersecting && hasMore) {
      fetchMoreItems();
    }
  };
  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection);

    //elementRef가 현재 존재하면 observer로 해당 요소를 관찰.
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    // 컴포넌트가 언마운트되거나 더 이상 관찰할 필요가 없을 때(observer를 해제할 때)반환.
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [page]);

  return (
    <>
      {products.map((item, index) => (
        <div className="row">
          <Card key={index} style={{ margin: '0 auto' }} className={'mb-2'}>
            <Row>
              <Col md={4}>
                <img src={item.thumbnail} alt="상품 이미지" style={{ width: '100%', margin: '10px' }} />
              </Col>
              <Col md={8}>
                <Card.Body>
                  <Card.Text>{item.description}</Card.Text>
                  <Card.Text>${item.price}</Card.Text>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      ))}
      {hasMore && (
        <div ref={elementRef} style={{ textAlign: 'center' }}>
          Load More Items
        </div>
      )}
      <div className="scroll__container">
        <button id="top" onClick={scrollToTop} type="button">
          {' '}
          Top
        </button>
      </div>
    </>
  );
}

export default DevListScroll;
