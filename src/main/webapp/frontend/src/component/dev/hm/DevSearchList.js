import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Row, Table, Form, Button, Container } from 'react-bootstrap';

//          component          //
function DevSearchList() {
  const navigate = useNavigate(); //네비게이트
  const { topMenuSeq } = useParams(); //페이지 이동을 위한 파람

  // 리스트 검색용
  const [bbsList, setBbsList] = useState([]);
  const [condition, setCondition] = useState('');
  const [keyword, setKeyword] = useState('');
  // Paging
  const [pageSize, setPageSize] = useState(10);
  const [sort] = useState('create_date,DESC'); //sort변경시 setSort사용
  const [totalCnt, setTotalCnt] = useState(0);
  const [validated, setValidated] = useState(false);
  //          function          //
  // 게시글 전체 조회
  const BbsList = async (selpage) => {
    const FRONT_BOARD_URL = `${process.env.REACT_APP_DEV_BOARD_URL}`;

    //springboot pageable에 화면별로 설정할 수 있음
    const req = { params: { page: selpage - 1, size: pageSize, sort: sort, searchCondition: condition, searchKeyword: keyword } };

    await axios
      .get(FRONT_BOARD_URL + '/list', req) //api/front/board/list
      .then((resp) => {
        setBbsList(resp.data.content);
        setPageSize(resp.data.size);
        setTotalCnt(resp.data.totalElements);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  // 글쓰기
  const BbsWrite = () => {
    navigate('/' + topMenuSeq + '/hm/DevWrite');
  };
  // 상세보기
  const BbsDetail = (boardId) => {
    navigate('/' + topMenuSeq + '/hm/DevDetail/' + boardId);
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
  // 페이징 보여주기
  const changePage = (event) => {
    let selectPage = event.selected + 1;
    BbsList(selectPage);
  };
  // 검색 formsubmit
  const formSubmitHandler = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    setValidated(false);
    event.preventDefault();
    event.stopPropagation();
    BbsList();
  };
  //          effect          //
  // 첫 로딩 시, 한 페이지만 가져옴
  useEffect(() => {
    BbsList(1);
  }, []);

  return (
    <div style={{ margin: '5px' }} className="row">
      <Form noValidate validated={validated} onSubmit={formSubmitHandler} method="post" name="submitForm">
        <Container fluid className="square">
          <Row className="m-4">
            <Col>
              <Form.Group controlId="searchCondition">
                <Form.Select name="searchCondition" value={condition} onChange={changeCondition}>
                  <option value="">검색</option>
                  <option value="1">제목</option>
                  <option value="2">내용</option>
                  <option value="3">작성자명</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">검색항목을 선택하세요.</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="searchKeyword">
                <Form.Control name="searchKeyword" value={keyword} onChange={changeKeyword} defaultValue={''} />
              </Form.Group>
            </Col>
            <Col>
              <Button type="submit" variant="primary">
                검색
              </Button>
            </Col>
            <Col>&nbsp;</Col>
            <Col style={{ justifyContent: 'right', display: 'flex' }}>
              <Button variant="success" onClick={BbsWrite}>
                글쓰기
              </Button>
            </Col>
          </Row>
          <Row>
            <Table striped bordered hover size="lg" variant="secondary">
              <thead>
                <tr style={{ textAlign: 'center' }}>
                  <th className="bg-gray-400">No.</th>
                  <th className="bg-gray-400">제목</th>
                  <th className="bg-gray-400">작성자</th>
                  <th className="bg-gray-400">작성일</th>
                  <th className="bg-gray-400">수정일</th>
                  <th className="bg-gray-400">조회수</th>
                </tr>
              </thead>
              <tbody>
                {bbsList.map((info, i) => {
                  return (
                    <tr
                      key={info.boardId}
                      onClick={() => {
                        BbsDetail(info.boardId);
                      }}
                    >
                      <td style={{ textAlign: 'center' }}>{info.boardId}</td>
                      <td>{info.title}</td>
                      <td>{info.mbrNm}</td>
                      <td style={{ textAlign: 'center' }}>{info.createDate}</td>
                      <td style={{ textAlign: 'center' }}>{info.modifiedDate}</td>
                      <td style={{ textAlign: 'center' }}>{info.viewCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Row>
          <Row>
            <ReactPaginate pageCount={Math.ceil(totalCnt / pageSize)} pageRangeDisplayed={pageSize} marginPagesDisplayed={10} breakLabel={'...'} previousLabel={'<'} nextLabel={'>'} onPageChange={changePage} containerClassName="pagination justify-content-center" pageClassName="page-item" pageLinkClassName="page-link" previousClassName="page-item" previousLinkClassName="page-link" nextClassName="page-item" nextLinkClassName="page-link" activeClassName="active" />
          </Row>
        </Container>
      </Form>
    </div>
  );
}

export default DevSearchList;
