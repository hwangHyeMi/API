import axios from 'axios';
import { useEffect, useState } from 'react';
import codeStore from 'store/codeStore';
import useLoginStore from 'store/useLoginStore';
import { Col, Row, Table, Container } from 'react-bootstrap';
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
    <div className="m-3">
      <Container>
        <Row style={{ justifyContent: 'left', display: 'flex' }}>
          <Col>
            <Table striped bordered hover size="lg" variant="secondary">
              <thead>
                <tr>
                  <th className="col-auto bg-gray-400">No</th>
                  <th className="col-auto bg-gray-400">url</th>
                  <th className="col-auto bg-gray-400">parameters</th>
                  <th className="col-auto bg-gray-400">method</th>
                  <th className="col-auto bg-gray-400">direction</th>
                  <th className="col-auto bg-gray-400">direction1</th>
                  <th className="col-auto bg-gray-400">direction2</th>
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
          </Col>
        </Row>
        <Row style={{ justifyContent: 'left', display: 'flex' }}>
          <Col>
            <Table striped bordered hover size="lg" variant="secondary">
              <thead>
                <tr>
                  <th className="col-auto bg-gray-400">No</th>
                  <th className="col-auto bg-gray-400">Code Group</th>
                  <th className="col-auto bg-gray-400">Code Name</th>
                  <th className="col-auto bg-gray-400">direction</th>
                  <th className="col-auto bg-gray-400">Detail Code Count</th>
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
          </Col>
        </Row>
        <Row style={{ justifyContent: 'left', display: 'flex' }}>
          <Col>
            <Table striped bordered hover size="lg" variant="secondary">
              <thead>
                <tr>
                  <th className="col-auto bg-gray-400">No</th>
                  <th className="col-auto bg-gray-400">Code Group</th>
                  <th className="col-auto bg-gray-400">Code Name</th>
                  <th className="col-auto bg-gray-400">Code</th>
                  <th className="col-auto bg-gray-400">Name</th>
                  <th className="col-auto bg-gray-400">direction</th>
                  <th className="col-auto bg-gray-400">codeRefer1</th>
                  <th className="col-auto bg-gray-400">codeRefer2</th>
                  <th className="col-auto bg-gray-400">codeRefer3</th>
                  <th className="col-auto bg-gray-400">codeRefer4</th>
                  <th className="col-auto bg-gray-400">codeRefer5</th>
                  <th className="col-auto bg-gray-400">codeRefer6</th>
                  <th className="col-auto bg-gray-400">codeRefer7</th>
                  <th className="col-auto bg-gray-400">codeRefer8</th>
                  <th className="col-auto bg-gray-400">codeRefer9</th>
                  <th className="col-auto bg-gray-400">codeRefer10</th>
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
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default DevMain;
