import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

function DevSearchList() {
  const [bbsList, setBbsList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const elementRef = useRef(null);
  const tableBody = useRef('');

  // 검색용 Hook
  const [searchCondition, setCondition] = useState('');
  const [searchKeyword, setKeyword] = useState('');

  // Paging
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('create_date,asc');
  const [totalCnt, setTotalCnt] = useState(0);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  const searchBtn = () => {
    console.log(tableBody.current);
    alert('조회 버튼 클릭시 기존 조회 내역 초기화 후 조회 하도록 수정 필요.');
    return;
    //setPage(1);
    //getBbsList();
  };

  // 게시글 전체 조회
  const getBbsList = async () => {
    const FRONT_BOARD_URL = `${process.env.REACT_APP_DEV_BOARD_URL}`;

    //springboot pageable에 화면별로 설정할 수 있음
    const req = {
      params: { page: page - 1, size: pageSize, sort: sort, searchCondition: searchCondition, searchKeyword: searchKeyword },
    };
    console.log(req.params);
    await axios
      .get(FRONT_BOARD_URL + '/list', req) //front/board/list
      .then((resp) => {
        if (resp && resp.data) {
          const newData = resp.data;
          // 만약 더 이상 불러올 상품이 없다면 hasMore 상태를 false로 설정합니다.
          if (newData.content.length === 0) {
            setHasMore(false);
          } else {
            // 불러온 데이터를 현재 상품 목록에 추가합니다.
            // 이전 상품 목록(prevProducts)에 새로운 데이터(newData.products)를 연결합니다.
            setBbsList((prevContents) => [...prevContents, ...newData.content]);

            // 페이지 번호를 업데이트하여 다음 요청에 올바른 skip 값을 사용합니다.
            setPage((prevPage) => {
              //console.log('prevPage=' + prevPage);
              return prevPage + 1;
            });
            console.log('page=' + page);
            //console.log(`skip=${page * 10}`);
          }
        }
      });
  };
  const onIntersection = (entries) => {
    const firstEntry = entries[0];

    // 첫 번째 entry가 화면에 나타나고 더 많은 데이터를 불러올 수 있는 상태(hasMore)인 경우 fetchMoreItems 함수를 호출.
    if (firstEntry.isIntersecting && hasMore) {
      getBbsList();
    }
  };

  //          event handler          //
  // 검색 조건 저장
  const changeCondition = (event) => {
    setCondition(event.target.value);
  };
  // 검색 키워드 저장
  const changeKeyword = (event) => {
    setKeyword(event.target.value);
  };

  // 첫 로딩 시, 한 페이지만 가져옴
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
    <div className="container_margin">
      <Container>
        <Form>
          <Row className="mb-2">
            <Col>
              <Form.Select className="md" name="searchCondition" value={searchCondition} onChange={changeCondition}>
                <option>검색</option>
                <option value="1">제목</option>
                <option value="2">내용</option>
              </Form.Select>
            </Col>
            <Col>
              <Form.Control name="searchKeyword" value={searchKeyword} onChange={changeKeyword} />
            </Col>
            <Col>
              <Button variant="primary" onClick={searchBtn}>
                검색
              </Button>
            </Col>
          </Row>
        </Form>
        <Row className="mb-2">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>No.</th>
                <th>ID</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>수정일</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody ref={tableBody}>
              {bbsList.map((info, i) => {
                return (
                  <tr key={info.boardId} style={{ height: '50px' }}>
                    <td style={{ textAlign: 'center' }}>{i + 1}</td>
                    <td>{info.boardId}</td>
                    <td>{info.title}</td>
                    <td>{info.mbrNm}</td>
                    <td>{info.createDate}</td>
                    <td>{info.modifiedDate}</td>
                    <td>{info.viewCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Row>
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
      </Container>
    </div>
  );
}

export default DevSearchList;
