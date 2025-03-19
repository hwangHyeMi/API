import axios from 'axios';
import { useEffect, useState } from 'react';
import codeStore from 'store/codeStore';
import useLoginStore from 'store/useLoginStore';
import Table from 'react-bootstrap/Table';
//          component: DevMain 컴포넌트          //
function DevMain() {
  //로그인상태
  const { islogIn, storeLogout, storeLogin, getMbrId } = useLoginStore((state) => {
    return state;
  });
  const { isCodeData, getCodGroupList, getCodDtlList } = codeStore((state) => {
    return state;
  });

  const [codeAllList, setCodeAllList] = useState([]);
  const [CODE0001_CodDtlList, setCODE0001_CodDtlList] = useState([]);

  const [info_list, setDevInfoUrl] = useState([]);
  const COM_DEV_INFO_URL = `${process.env.REACT_APP_DEV_URL}`;

  const loginTest = () => {
    let data = {
      mbrId: '임시 테스트',
      token: 'eyJhbGciOiJIUzUxMiJ9.eyJtYnJTZXEiOjMsImdyb3VwQ29kZSI6IkdST1VQLUNPREUiLCJtYnJBdXRob3JpdGllcyI6W3sibWJyU2VxIjozLCJhdXRob3JpdHkiOiJVU0VSIiwiYXV0aG9yaXR5Tm0iOiLsnbzrsJgg7ZqM7JuQLeyEpOuqhSIsImdyb3VwQ2QiOiJHUk9VUC1DT0RFIiwiZ3JvdXBObSI6Iuq3uOujuSDtg4DsnoUifV0sInN1YiI6InVzZXIiLCJpYXQiOjE3NDAxOTE2ODUsImV4cCI6MTc0MDIwOTY4NX0.dLNp-ZVkn8OTXSSG_VywB6_NCN65PXdySknMbg3rqvuIClMHY9JguKB1LcMaviVYgJm9ahJbaMDZurreWSO0RA',
      mbrSeq: -999,
      mbrNm: '임시 테스트',
      groupCode: '',
      mbrAuthorities: [],
      mbrLoginFailCnt: 0,
      role: 'USER',
    };
    storeLogin(data);
    let mbrId = getMbrId();
    alert(mbrId + '님, 성공적으로 로그인 되었습니다 🔐\n팝업으로 구현 하고, 로그인 성공시 창닫고 메뉴를 Role에 따라 재구성 하기 위해 리로드 해야 할듯...');
  };
  const logoutTest = () => {
    let mbrId = getMbrId();
    alert(mbrId + '님, 성공적으로 로그아웃 됐습니다 🔒');
    storeLogout();
  };
  useEffect(() => {
    const getDevInfoUrl = async () => {
      try {
        const response = await axios.get(COM_DEV_INFO_URL);

        console.log('[DevMain.js] useEffect() success :D');

        console.log(response.data.urlList);

        setDevInfoUrl(response.data.urlList);
      } catch (error) {
        console.log('[DevMain.js] useEffect() error :<');
        console.log(error);
        //throw error;
      }
    };
    getDevInfoUrl();
    if (isCodeData) {
      setCodeAllList(getCodGroupList());
      setCODE0001_CodDtlList(getCodDtlList('CODE0001'));
    }
  }, [COM_DEV_INFO_URL, getCodDtlList, getCodGroupList, isCodeData]);

  return (
    <>
      <div className="row">
        <div>
          <div style={{ float: 'left' }}>
            {islogIn ? (
              <div className="my-1 d-flex justify-content-center">
                <button className="btn btn-outline-secondary" onClick={logoutTest}>
                  <i className="fas fa-sign-in-alt"></i> 로그아웃 Test
                </button>
                <div style={{ paddingTop: '13px' }}>[로그 아웃 이력을 디비에 쌓으려면 백엔드 서버 통신 추가 필요...]</div>
              </div>
            ) : (
              <div className="my-1 d-flex justify-content-center">
                <button className="btn btn-outline-secondary" onClick={loginTest}>
                  <i className="fas fa-sign-in-alt"></i> 로그인 Test
                </button>

                <div style={{ paddingTop: '13px' }}>[모달 팝업으로 구현 할 것인지 고민 필요...]</div>
              </div>
            )}
          </div>
        </div>
        <div style={{ float: 'left' }}>
          <div style={{ float: 'left' }}>
            <div className="my-1 d-flex justify-content-center">
              <div style={{ paddingTop: '13px' }}>[Dev 정보]</div>
            </div>
          </div>
          {/*
          <Container fluid>
            <Row>
              <Col xs={1}>No</Col>
              <Col xs={3}>url</Col>
              <Col xs={2}>parameters</Col>
              <Col xs={1}>method</Col>
              <Col xs={2}>direction</Col>
              <Col xs={2}>direction1</Col>
              <Col xs={2}>direction2</Col>
            </Row>
            {info_list.map((info, i) => {
              return (
                <Row>
                  <Col xs={1}>{i + 1}</Col>
                  <Col xs={3}>{info.url}</Col>
                  <Col xs={2}>{info.parameters}</Col>
                  <Col xs={1}>{info.method}</Col>
                  <Col xs={2}>{info.direction}</Col>
                  <Col xs={2}>{info.direction1}</Col>
                  <Col xs={2}>{info.direction2}</Col>
                </Row>
              );
            })}
          </Container>
          */}
          <Table responsive="Table" className="table-dark table-striped table-hover">
            <thead>
              <tr>
                <th className="col-auto">No</th>
                <th className="col-auto">url</th>
                <th className="col-auto">parameters</th>
                <th className="col-auto">method</th>
                <th className="col-auto">direction</th>
                <th className="col-auto">direction1</th>
                <th className="col-auto">direction2</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: 'left' }}>
              {info_list.map((info, i) => {
                return (
                  <tr key={info.url}>
                    <td>{i + 1}</td>
                    <td>{info.url}</td>
                    <td>{info.parameters}</td>
                    <td>{info.method}</td>
                    <td>{info.direction}</td>
                    <td>{info.direction1}</td>
                    <td>{info.direction2}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <div>
          <div style={{ float: 'left' }}>
            <div className="my-1 d-flex justify-content-center">
              <div style={{ paddingTop: '13px' }}>[코드 정보]</div>
            </div>
          </div>
        </div>
        <div>
          <Table responsive="Table" className="table-dark table-striped table-hover">
            <thead>
              <tr>
                <th className="col-auto">No</th>
                <th className="col-auto">Code Group</th>
                <th className="col-auto">Code Name</th>
                <th className="col-auto">direction</th>
                <th className="col-auto">Detail Code Count</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: 'left' }}>
              {codeAllList.map((data, i) => {
                return (
                  <tr key={data.codeGroupCd}>
                    <td>{i + 1}</td>
                    <td>{data.codeGroupCd}</td>
                    <td>{data.codeGroupNm}</td>
                    <td>{data.codeGroupDescription}</td>
                    <td>{data.codeDetailList.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <div>
          <div style={{ float: 'left' }}>
            <div className="my-1 d-flex justify-content-center">
              <div style={{ paddingTop: '13px' }}>[ CODE0001 그룹 코드 상세 정보]</div>
            </div>
          </div>
        </div>
        <div>
          <Table responsive="Table" className="table-dark table-striped table-hover">
            <thead>
              <tr>
                <th className="col-auto">No</th>
                <th className="col-auto">Code Group</th>
                <th className="col-auto">Code Name</th>
                <th className="col-auto">Code</th>
                <th className="col-auto">Name</th>
                <th className="col-auto">direction</th>
                <th className="col-auto">codeRefer1</th>
                <th className="col-auto">codeRefer2</th>
                <th className="col-auto">codeRefer3</th>
                <th className="col-auto">codeRefer4</th>
                <th className="col-auto">codeRefer5</th>
                <th className="col-auto">codeRefer6</th>
                <th className="col-auto">codeRefer7</th>
                <th className="col-auto">codeRefer8</th>
                <th className="col-auto">codeRefer9</th>
                <th className="col-auto">codeRefer10</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: 'left' }}>
              {CODE0001_CodDtlList.map((data, i) => {
                console.log(data);
                return (
                  <tr key={data.codeCd}>
                    <td>{i + 1}</td>
                    <td>{data.codeGroupCd}</td>
                    <td>{data.codeGroupNm}</td>
                    <td>{data.codeCd}</td>
                    <td>{data.codeNm}</td>
                    <td>{data.codeDescription}</td>
                    <td>{data.codeRefer1}</td>
                    <td>{data.codeRefer2}</td>
                    <td>{data.codeRefer3}</td>
                    <td>{data.codeRefer4}</td>
                    <td>{data.codeRefer5}</td>
                    <td>{data.codeRefer6}</td>
                    <td>{data.codeRefer7}</td>
                    <td>{data.codeRefer8}</td>
                    <td>{data.codeRefer9}</td>
                    <td>{data.codeRefer10}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}

export default DevMain;
