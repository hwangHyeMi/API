import * as Bts from 'react-bootstrap';
import { Link } from 'react-router-dom';

import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale/ko';
import 'react-datepicker/dist/react-datepicker.css';

function DevCalendar() {
  return (
    <div style={{ margin: '5px' }}>
      <Bts.Container fluid className="square border">
        <Bts.Row className="m-1">
          <Bts.Col md="3">react-datepicker package</Bts.Col>
          <Bts.Col md="8">
            <Link to="https://www.npmjs.com/package/react-datepicker" target="_blank">
              https://www.npmjs.com/package/react-datepicker
            </Link>
          </Bts.Col>
        </Bts.Row>
        <Bts.Row className="m-1">
          <Bts.Col md="3">react-datepicker example</Bts.Col>
          <Bts.Col md="8">
            <Link to="https://reactdatepicker.com/" target="_blank">
              https://reactdatepicker.com/
            </Link>
          </Bts.Col>
        </Bts.Row>
        <Bts.Row className="m-1">
          <Bts.Col md="3">date-fns package</Bts.Col>
          <Bts.Col md="8">
            <Link to="https://date-fns.org/v3.3.1/docs/I18n" target="_blank">
              https://date-fns.org/v3.3.1/docs/I18n
            </Link>
          </Bts.Col>
        </Bts.Row>
      </Bts.Container>
      <br />
      <Bts.Container fluid className="square border">
        <Bts.Row className="m-1">
          <Bts.Col md="3">install react-datepicker package</Bts.Col>
          <Bts.Col md="8">npm install react-datepicker --save</Bts.Col>
        </Bts.Row>
        <Bts.Row className="m-1">
          <Bts.Col md="3">install date-fns package</Bts.Col>
          <Bts.Col md="8">npm install date-fns --save</Bts.Col>
        </Bts.Row>
      </Bts.Container>
      <br />
      <Bts.Container fluid className="square border">
        <Bts.Row className="m-1">
          <Bts.Col md="3">WARNING 처리</Bts.Col>
          <Bts.Col md="8">.env 파일에 GENERATE_SOURCEMAP=false 내용 추가</Bts.Col>
        </Bts.Row>
      </Bts.Container>
      <br />
      <Bts.Container fluid className="square border">
        <Bts.Row className="m-1">
          <Bts.Col md="3">아이콘</Bts.Col>
          <Bts.Col md="8">
            <Link to="https://reactdatepicker.com/#example-calendar-icon" target="_blank">
              https://reactdatepicker.com/#example-calendar-icon
            </Link>
          </Bts.Col>
        </Bts.Row>
        <Bts.Row className="m-1">
          <Bts.Col md="3">Date Range</Bts.Col>
          <Bts.Col md="8">
            <Link to="https://reactdatepicker.com/#example-date-range" target="_blank">
              https://reactdatepicker.com/#example-date-range
            </Link>
          </Bts.Col>
        </Bts.Row>
        <Bts.Row className="m-1">
          <Bts.Col md="3">년-월 순 콤보 커스텀</Bts.Col>
          <Bts.Col md="8">
            <Link to="https://reactdatepicker.com/#example-custom-input" target="_blank">
              https://reactdatepicker.com/#example-custom-input
            </Link>
          </Bts.Col>
        </Bts.Row>
        <Bts.Row className="m-1">
          <Bts.Col md="3">다른 동작 침범시 참고</Bts.Col>
          <Bts.Col md="8">
            <Link to="https://github.com/Hacker0x01/react-datepicker/issues/2524" target="_blank">
              https://github.com/Hacker0x01/react-datepicker/issues/2524
            </Link>
          </Bts.Col>
        </Bts.Row>
      </Bts.Container>
    </div>
  );
}

export default DevCalendar;
