import './CustomerMain.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { assets } from 'assets/images';
import ReactPaginate from 'react-paginate';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Row, Form, Button, Container, Table, Card, Image } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
const CustomerMain = () => {
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

  //게시판 작성자 프로필
  const [ImageSrc, setImageSrc] = useState(assets.default_prifile_img);
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

  // 상세보기
  const BbsDetail = (boardId) => {
    navigate('/' + topMenuSeq + '/front/customer/CustomerDetail/' + boardId);
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
    <div>
      <header id="customer-header">
        <div className="customer-contents">
          <h2>Customer</h2>
          <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. </p>
          <a href="#explore-menu">
            <button>View More</button>
          </a>
        </div>
      </header>
      <Form noValidate validated={validated} onSubmit={formSubmitHandler} method="post" name="submitForm">
        <Container fluid>
          <Row className="m-2">
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
          </Row>
          <Row className="m-3">
            <Col>
              <Form.Group controlId="searchKeyword">
                <Form.Control name="searchKeyword" value={keyword} onChange={changeKeyword} defaultValue={''} width={500} />
              </Form.Group>
            </Col>
            <Col className="pe-sm-2">
              <Button type="submit" variant="primary">
                검색
              </Button>
              {'    '}&nbsp;
              {/* <Button variant="success" onClick={BbsWrite}>
                글쓰기
              </Button> */}
            </Col>
          </Row>
          <Row className="m-2">
            <div className="list-group p-2">
              {bbsList.map((info, i) => {
                return (
                  <div
                    className="list-group-item list-group-item-action"
                    onClick={() => {
                      BbsDetail(info.boardId);
                    }}
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <small className="text-muted">
                        <Image roundedCircle src={`${process.env.REACT_APP_API_URL}` + '/com/file/images/' + info.mbrAttachId + '/1'} width={20} height={20} /> {info.mbrNm}
                      </small>
                      <small className="text-muted">{info.modifiedDate}</small>
                    </div>
                    &nbsp;
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">{info.title}</h5>
                      <small className="text-muted">
                        <i className="fas fa-eye"></i>
                        {'  '}
                        {info.viewCount}
                      </small>
                    </div>
                    <small className="text-muted">{info.content.substring(0, 50)}</small>
                  </div>
                );
              })}
            </div>
          </Row>
          <Row className="m-3">
            <ReactPaginate pageCount={Math.ceil(totalCnt / pageSize)} pageRangeDisplayed={pageSize} marginPagesDisplayed={10} breakLabel={'...'} previousLabel={'<'} nextLabel={'>'} onPageChange={changePage} containerClassName="pagination justify-content-center" pageClassName="page-item" pageLinkClassName="page-link" previousClassName="page-item" previousLinkClassName="page-link" nextClassName="page-item" nextLinkClassName="page-link" activeClassName="active" />
          </Row>
        </Container>
      </Form>
    </div>
  );
};

export default CustomerMain;
