import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Nav from 'react-bootstrap/Nav';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import * as Icon from 'react-bootstrap-icons';

// Toast 관련
import MyToast from 'component/com/MyToast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function DevAssembl(props) {
  // Tab 관련
  const [tabkey, setTabKey] = useState('MyAlert');

  // Alert 관련
  const setMyAlerts = (v_variant, v_heading, v_msg, v_callbackCd) => {
    props.myAlertInfo.alertHeading = v_heading;
    props.myAlertInfo.alertMsg = v_msg;
    props.myAlertInfo.callbackFn = MyAlertCallbackFn;
    props.myAlertInfo.callbackCd = v_callbackCd;
    props.myAlertInfo.alertVariant = v_variant;
    props.myAlertInfo.alertShow = true;
    props.myAlertInfo.setAlertShow(true);
    props.myAlertInfo.setMaskShow(true);
    props.setMyAlertInfo(props.myAlertInfo);
  };
  const MyAlertCallbackFn = (callbackCd) => {
    if ('OK' === callbackCd) {
      // MyAlerts 재 사용은 닫을 텀을 준다...
      setTimeout(() => setMyAlerts('success', '타이틀', '메세지 callback Result', ''), 100);
    }
  };
  // Alert 관련

  // Toast 관련
  const [MyToast_show, setMyToastShow] = useState(false);
  const [MyToast_variant, setMyToastVariant] = useState('info');
  const [MyToast_title, setMyToastTitle] = useState('');
  const [MyToast_small, setMyToastSmall] = useState('');
  const [MyToast_msg, setMyToastMsg] = useState('');
  const [MyToast_delay, setMyToastDelay] = useState(3);

  // 여러개를 동시에 띄우려면 Toast를 여러개 선언 해야 하는 듯 함.
  const setMyToasts = (v_variant, v_title, v_small, v_msg) => {
    setMyToastVariant(v_variant);
    setMyToastTitle(v_title);
    setMyToastSmall(v_small);
    setMyToastMsg(v_msg);
    setMyToastShow(true);
  };
  // Toast 관련

  // Modal.Dialog 관련
  const setMyModialog = (v_backdrop, v_modialogTitle, v_modialogBody, v_btnNm2, v_callbackCd) => {
    props.myModialogInfo.backdrop = v_backdrop;
    props.myModialogInfo.modialogTitle = v_modialogTitle;
    props.myModialogInfo.modialogBody = v_modialogBody;
    props.myModialogInfo.btnNm2 = v_btnNm2;
    props.myModialogInfo.callbackFn2 = MyModialogCallbackFn;
    props.myModialogInfo.callbackCd = v_callbackCd;

    props.myModialogInfo.modialogShow = true;
    props.myModialogInfo.setModialogShow(true);
    props.setMyModialogInfo(props.myModialogInfo);
  };
  const MyModialogCallbackFn = (callbackCd) => {
    if ('OK' === callbackCd) {
      // MyAlerts 재 사용은 닫을 텀을 준다...
      setTimeout(() => setMyAlerts('success', '타이틀', '메세지 Modal.Dialog callback Result', ''), 100);
    }
  };
  // Modal.Dialog 관련
  return (
    <>
      <Tabs id="controlled-tab-example" activeKey={tabkey} onSelect={(k) => setTabKey(k)} className="mb-3">
        <Tab eventKey="MyAlert" title="MyAlert" className="square border">
          <Row style={{ margin: '5px' }}>
            <Col>
              <Icon.BellFill />
            </Col>
            <Col>
              <Button variant="primary" onClick={() => setMyAlerts('primary', '타이틀', '메세지 primary', '')}>
                primary
              </Button>
            </Col>
            <Col>
              <Button variant="secondary" onClick={() => setMyAlerts('secondary', '타이틀', '메세지 secondary', '')}>
                secondary
              </Button>
            </Col>
            <Col>
              <Button variant="success" onClick={() => setMyAlerts('success', '타이틀', '메세지 success', '')}>
                success
              </Button>
            </Col>
            <Col>
              <Button variant="danger" onClick={() => setMyAlerts('danger', '타이틀', '메세지 danger', '')}>
                danger
              </Button>
            </Col>
            <Col>
              <Button variant="warning" onClick={() => setMyAlerts('warning', '타이틀', '메세지 warning', '')}>
                warning
              </Button>
            </Col>
            <Col>
              <Button variant="info" onClick={() => setMyAlerts('info', '타이틀', '메세지 info', '')}>
                info
              </Button>
            </Col>
            <Col>
              <Button variant="light" onClick={() => setMyAlerts('light', '타이틀', '메세지 light', '')}>
                light
              </Button>
            </Col>
            <Col>
              <Button variant="dark" onClick={() => setMyAlerts('dark', '타이틀', '메세지 dark', '')}>
                dark
              </Button>
            </Col>
            <Col>
              <Button variant="warning" onClick={() => setMyAlerts('warning', '타이틀', '메세지 callback', 'OK')}>
                callback
              </Button>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="MyModialog" title="MyModialog" className="square border">
          <Tab.Container id="left-tabs-MyModialog" defaultActiveKey="callback">
            <Row style={{ margin: '5px' }}>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="callback">
                      <Icon.ExclamationSquareFill /> callback
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="noCallback">
                      <Icon.ExclamationSquareFill /> No callback
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={9} className="square border">
                <Tab.Content>
                  <Tab.Pane eventKey="callback">
                    <Row style={{ margin: '5px' }}>
                      <Col>
                        <Button variant="info" onClick={() => setMyModialog('', '바닥 클릭 닫힘', '메세지 callback', 'Callback', 'OK')}>
                          callback
                        </Button>
                      </Col>
                      <Col>
                        <Button variant="info" onClick={() => setMyModialog('static', '바닥 클릭 안 닫힘', '메세지 callback Static backdrop', 'Callback', 'OK')}>
                          callback Static backdrop
                        </Button>
                      </Col>
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="noCallback">
                    <Row style={{ margin: '5px' }}>
                      <Col>
                        <Button variant="info" onClick={() => setMyModialog('', '바닥 클릭 닫힘', '메세지 No callback', '', '')}>
                          No callback
                        </Button>
                      </Col>
                      <Col>
                        <Button variant="info" onClick={() => setMyModialog('static', '바닥 클릭 안 닫힘', '메세지 No callback Static backdrop', '', '')}>
                          No callback Static backdrop
                        </Button>
                      </Col>
                    </Row>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Tab>
        <Tab eventKey="MyToast" title="MyToast" className="square border">
          <Row style={{ margin: '5px' }}>
            <Col>
              <Icon.PhoneVibrate />
            </Col>
            <Col>
              <Button variant="primary" onClick={() => setMyToasts('primary', '타이틀', '11 mins ago', '메세지 primary delay : ' + MyToast_delay + '초')}>
                primary
              </Button>
            </Col>
            <Col>
              <Button variant="secondary" onClick={() => setMyToasts('secondary', '타이틀', '11 mins ago', '메세지 secondary delay : ' + MyToast_delay + '초')}>
                secondary
              </Button>
            </Col>
            <Col>
              <Button variant="success" onClick={() => setMyToasts('success', '타이틀', '11 mins ago', '메세지 success delay : ' + MyToast_delay + '초')}>
                success
              </Button>
            </Col>
            <Col>
              <Button variant="danger" onClick={() => setMyToasts('danger', '타이틀', '11 mins ago', '메세지 danger delay : ' + MyToast_delay + '초')}>
                danger
              </Button>
            </Col>
            <Col>
              <Button variant="warning" onClick={() => setMyToasts('warning', '타이틀', '11 mins ago', '메세지 warning delay : ' + MyToast_delay + '초')}>
                warning
              </Button>
            </Col>
            <Col>
              <Button variant="info" onClick={() => setMyToasts('info', '타이틀', '11 mins ago', '메세지 info delay : ' + MyToast_delay + '초')}>
                info
              </Button>
            </Col>
            <Col>
              <Button variant="light" onClick={() => setMyToasts('light', '타이틀', '11 mins ago', '메세지 light delay : ' + MyToast_delay + '초')}>
                light
              </Button>
            </Col>
            <Col>
              <Button variant="dark" onClick={() => setMyToasts('dark', '타이틀', '11 mins ago', '메세지 dark delay : ' + MyToast_delay + '초')}>
                dark
              </Button>
            </Col>
          </Row>
          <div aria-live="polite" aria-atomic="true" className="bg-dark position-relative" style={{ minHeight: '200px', margin: '5px' }}>
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
              {MyToast(MyToast_show, MyToast_variant, MyToast_title, MyToast_small, MyToast_msg, setMyToastShow, MyToast_delay)}
            </ToastContainer>
          </div>
        </Tab>
        <Tab eventKey="Pills" title="세로텝" className="square border">
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="first">Tab 1</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second">Tab 2</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="first">First tab content</Tab.Pane>
                  <Tab.Pane eventKey="second">Second tab content</Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Tab>
        <Tab eventKey="disabledTab" title="disabled Tab" disabled>
          Tab content for disabled Tab
        </Tab>
        <Tab eventKey="Icons" title="Icon" className="square border">
          <Row style={{ margin: '5px' }}>
            <Col>
              <Icon.Icon0CircleFill />
              <Icon.Icon0Circle />
              <Icon.Icon0SquareFill />
              <Icon.Icon0Square />
              <Icon.Icon1CircleFill />
              <Icon.Icon1Circle />
              <Icon.Icon1SquareFill />
              <Icon.Icon1Square />
              <Icon.Icon123 />
              <Icon.Icon2CircleFill />
              <Icon.Icon2Circle />
              <Icon.Icon2SquareFill />
              <Icon.Icon2Square />
              <Icon.Icon3CircleFill />
              <Icon.Icon3Circle />
              <Icon.Icon3SquareFill />
              <Icon.Icon3Square />
              <Icon.Icon4CircleFill />
              <Icon.Icon4Circle />
              <Icon.Icon4SquareFill />
              <Icon.Icon4Square />
              <Icon.Icon5CircleFill />
              <Icon.Icon5Circle />
              <Icon.Icon5SquareFill />
              <Icon.Icon5Square />
              <Icon.Icon6CircleFill />
              <Icon.Icon6Circle />
              <Icon.Icon6SquareFill />
              <Icon.Icon6Square />
              <Icon.Icon7CircleFill />
              <Icon.Icon7Circle />
              <Icon.Icon7SquareFill />
              <Icon.Icon7Square />
              <Icon.Icon8CircleFill />
              <Icon.Icon8Circle />
              <Icon.Icon8SquareFill />
              <Icon.Icon8Square />
              <Icon.Icon9CircleFill />
              <Icon.Icon9Circle />
              <Icon.Icon9SquareFill />
              <Icon.Icon9Square />
              <Icon.Activity />
              <Icon.AirplaneEnginesFill />
              <Icon.AirplaneEngines />
              <Icon.AirplaneFill />
              <Icon.Airplane />
              <Icon.AlarmFill />
              <Icon.Alarm />
              <Icon.Alexa />
              <Icon.AlignBottom />
              <Icon.AlignCenter />
              <Icon.AlignEnd />
              <Icon.AlignMiddle />
              <Icon.AlignStart />
              <Icon.AlignTop />
              <Icon.Alipay />
              <Icon.AlphabetUppercase />
              <Icon.Alphabet />
              <Icon.Alt />
              <Icon.Amazon />
              <Icon.Amd />
              <Icon.Android />
              <Icon.Android2 />
              <Icon.AppIndicator />
              <Icon.App />
              <Icon.Apple />
              <Icon.ArchiveFill />
              <Icon.Archive />
              <Icon.Arrow90degDown />
              <Icon.Arrow90degLeft />
              <Icon.Arrow90degRight />
              <Icon.Arrow90degUp />
              <Icon.ArrowBarDown />
              <Icon.ArrowBarLeft />
              <Icon.ArrowBarRight />
              <Icon.ArrowBarUp />
              <Icon.ArrowClockwise />
              <Icon.ArrowCounterclockwise />
              <Icon.ArrowDownCircleFill />
              <Icon.ArrowDownCircle />
              <Icon.ArrowDownLeftCircleFill />
              <Icon.ArrowDownLeftCircle />
              <Icon.ArrowDownLeftSquareFill />
              <Icon.ArrowDownLeftSquare />
              <Icon.ArrowDownLeft />
              <Icon.ArrowDownRightCircleFill />
              <Icon.ArrowDownRightCircle />
              <Icon.ArrowDownRightSquareFill />
              <Icon.ArrowDownRightSquare />
              <Icon.ArrowDownRight />
              <Icon.ArrowDownShort />
              <Icon.ArrowDownSquareFill />
              <Icon.ArrowDownSquare />
              <Icon.ArrowDownUp />
              <Icon.ArrowDown />
              <Icon.ArrowLeftCircleFill />
              <Icon.ArrowLeftCircle />
              <Icon.ArrowLeftRight />
              <Icon.ArrowLeftShort />
              <Icon.ArrowLeftSquareFill />
              <Icon.ArrowLeftSquare />
              <Icon.ArrowLeft />
              <Icon.ArrowRepeat />
              <Icon.ArrowReturnLeft />
              <Icon.ArrowReturnRight />
              <Icon.ArrowRightCircleFill />
              <Icon.ArrowRightCircle />
              <Icon.ArrowRightShort />
              <Icon.ArrowRightSquareFill />
              <Icon.ArrowRightSquare />
              <Icon.ArrowRight />
              <Icon.ArrowThroughHeartFill />
              <Icon.ArrowThroughHeart />
              <Icon.ArrowUpCircleFill />
              <Icon.ArrowUpCircle />
              <Icon.ArrowUpLeftCircleFill />
              <Icon.ArrowUpLeftCircle />
              <Icon.ArrowUpLeftSquareFill />
              <Icon.ArrowUpLeftSquare />
              <Icon.ArrowUpLeft />
              <Icon.ArrowUpRightCircleFill />
              <Icon.ArrowUpRightCircle />
              <Icon.ArrowUpRightSquareFill />
              <Icon.ArrowUpRightSquare />
              <Icon.ArrowUpRight />
              <Icon.ArrowUpShort />
              <Icon.ArrowUpSquareFill />
              <Icon.ArrowUpSquare />
              <Icon.ArrowUp />
              <Icon.ArrowsAngleContract />
              <Icon.ArrowsAngleExpand />
              <Icon.ArrowsCollapseVertical />
              <Icon.ArrowsCollapse />
              <Icon.ArrowsExpandVertical />
              <Icon.ArrowsExpand />
              <Icon.ArrowsFullscreen />
              <Icon.ArrowsMove />
              <Icon.ArrowsVertical />
              <Icon.Arrows />
              <Icon.AspectRatioFill />
              <Icon.AspectRatio />
              <Icon.Asterisk />
              <Icon.At />
              <Icon.AwardFill />
              <Icon.Award />
              <Icon.Back />
              <Icon.BackpackFill />
              <Icon.Backpack />
              <Icon.Backpack2Fill />
              <Icon.Backpack2 />
              <Icon.Backpack3Fill />
              <Icon.Backpack3 />
              <Icon.Backpack4Fill />
              <Icon.Backpack4 />
              <Icon.BackspaceFill />
              <Icon.BackspaceReverseFill />
              <Icon.BackspaceReverse />
              <Icon.Backspace />
              <Icon.Badge3dFill />
              <Icon.Badge3d />
              <Icon.Badge4kFill />
              <Icon.Badge4k />
              <Icon.Badge8kFill />
              <Icon.Badge8k />
              <Icon.BadgeAdFill />
              <Icon.BadgeAd />
              <Icon.BadgeArFill />
              <Icon.BadgeAr />
              <Icon.BadgeCcFill />
              <Icon.BadgeCc />
              <Icon.BadgeHdFill />
              <Icon.BadgeHd />
              <Icon.BadgeSdFill />
              <Icon.BadgeSd />
              <Icon.BadgeTmFill />
              <Icon.BadgeTm />
              <Icon.BadgeVoFill />
              <Icon.BadgeVo />
              <Icon.BadgeVrFill />
              <Icon.BadgeVr />
              <Icon.BadgeWcFill />
              <Icon.BadgeWc />
              <Icon.BagCheckFill />
              <Icon.BagCheck />
              <Icon.BagDashFill />
              <Icon.BagDash />
              <Icon.BagFill />
              <Icon.BagHeartFill />
              <Icon.BagHeart />
              <Icon.BagPlusFill />
              <Icon.BagPlus />
              <Icon.BagXFill />
              <Icon.BagX />
              <Icon.Bag />
              <Icon.BalloonFill />
              <Icon.BalloonHeartFill />
              <Icon.BalloonHeart />
              <Icon.Balloon />
              <Icon.BanFill />
              <Icon.Ban />
              <Icon.BandaidFill />
              <Icon.Bandaid />
              <Icon.Bank />
              <Icon.Bank2 />
              <Icon.BarChartFill />
              <Icon.BarChartLineFill />
              <Icon.BarChartLine />
              <Icon.BarChartSteps />
              <Icon.BarChart />
              <Icon.BasketFill />
              <Icon.Basket />
              <Icon.Basket2Fill />
              <Icon.Basket2 />
              <Icon.Basket3Fill />
              <Icon.Basket3 />
              <Icon.BatteryCharging />
              <Icon.BatteryFull />
              <Icon.BatteryHalf />
              <Icon.Battery />
              <Icon.Behance />
              <Icon.BellFill />
              <Icon.BellSlashFill />
              <Icon.BellSlash />
              <Icon.Bell />
              <Icon.Bezier />
              <Icon.Bezier2 />
              <Icon.Bicycle />
              <Icon.Bing />
              <Icon.BinocularsFill />
              <Icon.Binoculars />
              <Icon.BlockquoteLeft />
              <Icon.BlockquoteRight />
              <Icon.Bluetooth />
              <Icon.BodyText />
              <Icon.BookFill />
              <Icon.BookHalf />
              <Icon.Book />
              <Icon.BookmarkCheckFill />
              <Icon.BookmarkCheck />
              <Icon.BookmarkDashFill />
              <Icon.BookmarkDash />
              <Icon.BookmarkFill />
              <Icon.BookmarkHeartFill />
              <Icon.BookmarkHeart />
              <Icon.BookmarkPlusFill />
              <Icon.BookmarkPlus />
              <Icon.BookmarkStarFill />
              <Icon.BookmarkStar />
              <Icon.BookmarkXFill />
              <Icon.BookmarkX />
              <Icon.Bookmark />
              <Icon.BookmarksFill />
              <Icon.Bookmarks />
              <Icon.Bookshelf />
              <Icon.BoomboxFill />
              <Icon.Boombox />
              <Icon.BootstrapFill />
              <Icon.BootstrapReboot />
              <Icon.Bootstrap />
              <Icon.BorderAll />
              <Icon.BorderBottom />
              <Icon.BorderCenter />
              <Icon.BorderInner />
              <Icon.BorderLeft />
              <Icon.BorderMiddle />
              <Icon.BorderOuter />
              <Icon.BorderRight />
              <Icon.BorderStyle />
              <Icon.BorderTop />
              <Icon.BorderWidth />
              <Icon.Border />
              <Icon.BoundingBoxCircles />
              <Icon.BoundingBox />
              <Icon.BoxArrowDownLeft />
              <Icon.BoxArrowDownRight />
              <Icon.BoxArrowDown />
              <Icon.BoxArrowInDownLeft />
              <Icon.BoxArrowInDownRight />
              <Icon.BoxArrowInDown />
              <Icon.BoxArrowInLeft />
              <Icon.BoxArrowInRight />
              <Icon.BoxArrowInUpLeft />
              <Icon.BoxArrowInUpRight />
              <Icon.BoxArrowInUp />
              <Icon.BoxArrowLeft />
              <Icon.BoxArrowRight />
              <Icon.BoxArrowUpLeft />
              <Icon.BoxArrowUpRight />
              <Icon.BoxArrowUp />
              <Icon.BoxFill />
              <Icon.BoxSeamFill />
              <Icon.BoxSeam />
              <Icon.Box />
              <Icon.Box2Fill />
              <Icon.Box2HeartFill />
              <Icon.Box2Heart />
              <Icon.Box2 />
              <Icon.Boxes />
              <Icon.BracesAsterisk />
              <Icon.Braces />
              <Icon.Bricks />
              <Icon.BriefcaseFill />
              <Icon.Briefcase />
              <Icon.BrightnessAltHighFill />
              <Icon.BrightnessAltHigh />
              <Icon.BrightnessAltLowFill />
              <Icon.BrightnessAltLow />
              <Icon.BrightnessHighFill />
              <Icon.BrightnessHigh />
              <Icon.BrightnessLowFill />
              <Icon.BrightnessLow />
              <Icon.Brilliance />
              <Icon.BroadcastPin />
              <Icon.Broadcast />
              <Icon.BrowserChrome />
              <Icon.BrowserEdge />
              <Icon.BrowserFirefox />
              <Icon.BrowserSafari />
              <Icon.BrushFill />
              <Icon.Brush />
              <Icon.BucketFill />
              <Icon.Bucket />
              <Icon.BugFill />
              <Icon.Bug />
              <Icon.BuildingAdd />
              <Icon.BuildingCheck />
              <Icon.BuildingDash />
              <Icon.BuildingDown />
              <Icon.BuildingExclamation />
              <Icon.BuildingFillAdd />
              <Icon.BuildingFillCheck />
              <Icon.BuildingFillDash />
              <Icon.BuildingFillDown />
              <Icon.BuildingFillExclamation />
              <Icon.BuildingFillGear />
              <Icon.BuildingFillLock />
              <Icon.BuildingFillSlash />
              <Icon.BuildingFillUp />
              <Icon.BuildingFillX />
              <Icon.BuildingFill />
              <Icon.BuildingGear />
              <Icon.BuildingLock />
              <Icon.BuildingSlash />
              <Icon.BuildingUp />
              <Icon.BuildingX />
              <Icon.Building />
              <Icon.BuildingsFill />
              <Icon.Buildings />
              <Icon.Bullseye />
              <Icon.BusFrontFill />
              <Icon.BusFront />
              <Icon.CCircleFill />
              <Icon.CCircle />
              <Icon.CSquareFill />
              <Icon.CSquare />
              <Icon.CakeFill />
              <Icon.Cake />
              <Icon.Cake2Fill />
              <Icon.Cake2 />
              <Icon.CalculatorFill />
              <Icon.Calculator />
              <Icon.CalendarCheckFill />
              <Icon.CalendarCheck />
              <Icon.CalendarDateFill />
              <Icon.CalendarDate />
              <Icon.CalendarDayFill />
              <Icon.CalendarDay />
              <Icon.CalendarEventFill />
              <Icon.CalendarEvent />
              <Icon.CalendarFill />
              <Icon.CalendarHeartFill />
              <Icon.CalendarHeart />
              <Icon.CalendarMinusFill />
              <Icon.CalendarMinus />
              <Icon.CalendarMonthFill />
              <Icon.CalendarMonth />
              <Icon.CalendarPlusFill />
              <Icon.CalendarPlus />
              <Icon.CalendarRangeFill />
              <Icon.CalendarRange />
              <Icon.CalendarWeekFill />
              <Icon.CalendarWeek />
              <Icon.CalendarXFill />
              <Icon.CalendarX />
              <Icon.Calendar />
              <Icon.Calendar2CheckFill />
              <Icon.Calendar2Check />
              <Icon.Calendar2DateFill />
              <Icon.Calendar2Date />
              <Icon.Calendar2DayFill />
              <Icon.Calendar2Day />
              <Icon.Calendar2EventFill />
              <Icon.Calendar2Event />
              <Icon.Calendar2Fill />
              <Icon.Calendar2HeartFill />
              <Icon.Calendar2Heart />
              <Icon.Calendar2MinusFill />
              <Icon.Calendar2Minus />
              <Icon.Calendar2MonthFill />
              <Icon.Calendar2Month />
              <Icon.Calendar2PlusFill />
              <Icon.Calendar2Plus />
              <Icon.Calendar2RangeFill />
              <Icon.Calendar2Range />
              <Icon.Calendar2WeekFill />
              <Icon.Calendar2Week />
              <Icon.Calendar2XFill />
              <Icon.Calendar2X />
              <Icon.Calendar2 />
              <Icon.Calendar3EventFill />
              <Icon.Calendar3Event />
              <Icon.Calendar3Fill />
              <Icon.Calendar3RangeFill />
              <Icon.Calendar3Range />
              <Icon.Calendar3WeekFill />
              <Icon.Calendar3Week />
              <Icon.Calendar3 />
              <Icon.Calendar4Event />
              <Icon.Calendar4Range />
              <Icon.Calendar4Week />
              <Icon.Calendar4 />
              <Icon.CameraFill />
              <Icon.CameraReelsFill />
              <Icon.CameraReels />
              <Icon.CameraVideoFill />
              <Icon.CameraVideoOffFill />
              <Icon.CameraVideoOff />
              <Icon.CameraVideo />
              <Icon.Camera />
              <Icon.Camera2 />
              <Icon.CapslockFill />
              <Icon.Capslock />
              <Icon.CapsulePill />
              <Icon.Capsule />
              <Icon.CarFrontFill />
              <Icon.CarFront />
              <Icon.CardChecklist />
              <Icon.CardHeading />
              <Icon.CardImage />
              <Icon.CardList />
              <Icon.CardText />
              <Icon.CaretDownFill />
              <Icon.CaretDownSquareFill />
              <Icon.CaretDownSquare />
              <Icon.CaretDown />
              <Icon.CaretLeftFill />
              <Icon.CaretLeftSquareFill />
              <Icon.CaretLeftSquare />
              <Icon.CaretLeft />
              <Icon.CaretRightFill />
              <Icon.CaretRightSquareFill />
              <Icon.CaretRightSquare />
              <Icon.CaretRight />
              <Icon.CaretUpFill />
              <Icon.CaretUpSquareFill />
              <Icon.CaretUpSquare />
              <Icon.CaretUp />
              <Icon.CartCheckFill />
              <Icon.CartCheck />
              <Icon.CartDashFill />
              <Icon.CartDash />
              <Icon.CartFill />
              <Icon.CartPlusFill />
              <Icon.CartPlus />
              <Icon.CartXFill />
              <Icon.CartX />
              <Icon.Cart />
              <Icon.Cart2 />
              <Icon.Cart3 />
              <Icon.Cart4 />
              <Icon.CashCoin />
              <Icon.CashStack />
              <Icon.Cash />
              <Icon.CassetteFill />
              <Icon.Cassette />
              <Icon.Cast />
              <Icon.CcCircleFill />
              <Icon.CcCircle />
              <Icon.CcSquareFill />
              <Icon.CcSquare />
              <Icon.ChatDotsFill />
              <Icon.ChatDots />
              <Icon.ChatFill />
              <Icon.ChatHeartFill />
              <Icon.ChatHeart />
              <Icon.ChatLeftDotsFill />
              <Icon.ChatLeftDots />
              <Icon.ChatLeftFill />
              <Icon.ChatLeftHeartFill />
              <Icon.ChatLeftHeart />
              <Icon.ChatLeftQuoteFill />
              <Icon.ChatLeftQuote />
              <Icon.ChatLeftTextFill />
              <Icon.ChatLeftText />
              <Icon.ChatLeft />
              <Icon.ChatQuoteFill />
              <Icon.ChatQuote />
              <Icon.ChatRightDotsFill />
              <Icon.ChatRightDots />
              <Icon.ChatRightFill />
              <Icon.ChatRightHeartFill />
              <Icon.ChatRightHeart />
              <Icon.ChatRightQuoteFill />
              <Icon.ChatRightQuote />
              <Icon.ChatRightTextFill />
              <Icon.ChatRightText />
              <Icon.ChatRight />
              <Icon.ChatSquareDotsFill />
              <Icon.ChatSquareDots />
              <Icon.ChatSquareFill />
              <Icon.ChatSquareHeartFill />
              <Icon.ChatSquareHeart />
              <Icon.ChatSquareQuoteFill />
              <Icon.ChatSquareQuote />
              <Icon.ChatSquareTextFill />
              <Icon.ChatSquareText />
              <Icon.ChatSquare />
              <Icon.ChatTextFill />
              <Icon.ChatText />
              <Icon.Chat />
              <Icon.CheckAll />
              <Icon.CheckCircleFill />
              <Icon.CheckCircle />
              <Icon.CheckLg />
              <Icon.CheckSquareFill />
              <Icon.CheckSquare />
              <Icon.Check />
              <Icon.Check2All />
              <Icon.Check2Circle />
              <Icon.Check2Square />
              <Icon.Check2 />
              <Icon.ChevronBarContract />
              <Icon.ChevronBarDown />
              <Icon.ChevronBarExpand />
              <Icon.ChevronBarLeft />
              <Icon.ChevronBarRight />
              <Icon.ChevronBarUp />
              <Icon.ChevronCompactDown />
              <Icon.ChevronCompactLeft />
              <Icon.ChevronCompactRight />
              <Icon.ChevronCompactUp />
              <Icon.ChevronContract />
              <Icon.ChevronDoubleDown />
              <Icon.ChevronDoubleLeft />
              <Icon.ChevronDoubleRight />
              <Icon.ChevronDoubleUp />
              <Icon.ChevronDown />
              <Icon.ChevronExpand />
              <Icon.ChevronLeft />
              <Icon.ChevronRight />
              <Icon.ChevronUp />
              <Icon.CircleFill />
              <Icon.CircleHalf />
              <Icon.CircleSquare />
              <Icon.Circle />
              <Icon.ClipboardCheckFill />
              <Icon.ClipboardCheck />
              <Icon.ClipboardDataFill />
              <Icon.ClipboardData />
              <Icon.ClipboardFill />
              <Icon.ClipboardHeartFill />
              <Icon.ClipboardHeart />
              <Icon.ClipboardMinusFill />
              <Icon.ClipboardMinus />
              <Icon.ClipboardPlusFill />
              <Icon.ClipboardPlus />
              <Icon.ClipboardPulse />
              <Icon.ClipboardXFill />
              <Icon.ClipboardX />
              <Icon.Clipboard />
              <Icon.Clipboard2CheckFill />
              <Icon.Clipboard2Check />
              <Icon.Clipboard2DataFill />
              <Icon.Clipboard2Data />
              <Icon.Clipboard2Fill />
              <Icon.Clipboard2HeartFill />
              <Icon.Clipboard2Heart />
              <Icon.Clipboard2MinusFill />
              <Icon.Clipboard2Minus />
              <Icon.Clipboard2PlusFill />
              <Icon.Clipboard2Plus />
              <Icon.Clipboard2PulseFill />
              <Icon.Clipboard2Pulse />
              <Icon.Clipboard2XFill />
              <Icon.Clipboard2X />
              <Icon.Clipboard2 />
              <Icon.ClockFill />
              <Icon.ClockHistory />
              <Icon.Clock />
              <Icon.CloudArrowDownFill />
              <Icon.CloudArrowDown />
              <Icon.CloudArrowUpFill />
              <Icon.CloudArrowUp />
              <Icon.CloudCheckFill />
              <Icon.CloudCheck />
              <Icon.CloudDownloadFill />
              <Icon.CloudDownload />
              <Icon.CloudDrizzleFill />
              <Icon.CloudDrizzle />
              <Icon.CloudFill />
              <Icon.CloudFogFill />
              <Icon.CloudFog />
              <Icon.CloudFog2Fill />
              <Icon.CloudFog2 />
              <Icon.CloudHailFill />
              <Icon.CloudHail />
              <Icon.CloudHazeFill />
              <Icon.CloudHaze />
              <Icon.CloudHaze2Fill />
              <Icon.CloudHaze2 />
              <Icon.CloudLightningFill />
              <Icon.CloudLightningRainFill />
              <Icon.CloudLightningRain />
              <Icon.CloudLightning />
              <Icon.CloudMinusFill />
              <Icon.CloudMinus />
              <Icon.CloudMoonFill />
              <Icon.CloudMoon />
              <Icon.CloudPlusFill />
              <Icon.CloudPlus />
              <Icon.CloudRainFill />
              <Icon.CloudRainHeavyFill />
              <Icon.CloudRainHeavy />
              <Icon.CloudRain />
              <Icon.CloudSlashFill />
              <Icon.CloudSlash />
              <Icon.CloudSleetFill />
              <Icon.CloudSleet />
              <Icon.CloudSnowFill />
              <Icon.CloudSnow />
              <Icon.CloudSunFill />
              <Icon.CloudSun />
              <Icon.CloudUploadFill />
              <Icon.CloudUpload />
              <Icon.Cloud />
              <Icon.CloudsFill />
              <Icon.Clouds />
              <Icon.CloudyFill />
              <Icon.Cloudy />
              <Icon.CodeSlash />
              <Icon.CodeSquare />
              <Icon.Code />
              <Icon.Coin />
              <Icon.CollectionFill />
              <Icon.CollectionPlayFill />
              <Icon.CollectionPlay />
              <Icon.Collection />
              <Icon.ColumnsGap />
              <Icon.Columns />
              <Icon.Command />
              <Icon.CompassFill />
              <Icon.Compass />
              <Icon.ConeStriped />
              <Icon.Cone />
              <Icon.Controller />
              <Icon.Cookie />
              <Icon.Copy />
              <Icon.CpuFill />
              <Icon.Cpu />
              <Icon.CreditCard2BackFill />
              <Icon.CreditCard2Back />
              <Icon.CreditCard2FrontFill />
              <Icon.CreditCard2Front />
              <Icon.CreditCardFill />
              <Icon.CreditCard />
              <Icon.Crop />
              <Icon.Crosshair />
              <Icon.Crosshair2 />
              <Icon.CupFill />
              <Icon.CupHotFill />
              <Icon.CupHot />
              <Icon.CupStraw />
              <Icon.Cup />
              <Icon.CurrencyBitcoin />
              <Icon.CurrencyDollar />
              <Icon.CurrencyEuro />
              <Icon.CurrencyExchange />
              <Icon.CurrencyPound />
              <Icon.CurrencyRupee />
              <Icon.CurrencyYen />
              <Icon.CursorFill />
              <Icon.CursorText />
              <Icon.Cursor />
              <Icon.DashCircleDotted />
              <Icon.DashCircleFill />
              <Icon.DashCircle />
              <Icon.DashLg />
              <Icon.DashSquareDotted />
              <Icon.DashSquareFill />
              <Icon.DashSquare />
              <Icon.Dash />
              <Icon.DatabaseAdd />
              <Icon.DatabaseCheck />
              <Icon.DatabaseDash />
              <Icon.DatabaseDown />
              <Icon.DatabaseExclamation />
              <Icon.DatabaseFillAdd />
              <Icon.DatabaseFillCheck />
              <Icon.DatabaseFillDash />
              <Icon.DatabaseFillDown />
              <Icon.DatabaseFillExclamation />
              <Icon.DatabaseFillGear />
              <Icon.DatabaseFillLock />
              <Icon.DatabaseFillSlash />
              <Icon.DatabaseFillUp />
              <Icon.DatabaseFillX />
              <Icon.DatabaseFill />
              <Icon.DatabaseGear />
              <Icon.DatabaseLock />
              <Icon.DatabaseSlash />
              <Icon.DatabaseUp />
              <Icon.DatabaseX />
              <Icon.Database />
              <Icon.DeviceHddFill />
              <Icon.DeviceHdd />
              <Icon.DeviceSsdFill />
              <Icon.DeviceSsd />
              <Icon.Diagram2Fill />
              <Icon.Diagram2 />
              <Icon.Diagram3Fill />
              <Icon.Diagram3 />
              <Icon.DiamondFill />
              <Icon.DiamondHalf />
              <Icon.Diamond />
              <Icon.Dice1Fill />
              <Icon.Dice1 />
              <Icon.Dice2Fill />
              <Icon.Dice2 />
              <Icon.Dice3Fill />
              <Icon.Dice3 />
              <Icon.Dice4Fill />
              <Icon.Dice4 />
              <Icon.Dice5Fill />
              <Icon.Dice5 />
              <Icon.Dice6Fill />
              <Icon.Dice6 />
              <Icon.DiscFill />
              <Icon.Disc />
              <Icon.Discord />
              <Icon.DisplayFill />
              <Icon.Display />
              <Icon.DisplayportFill />
              <Icon.Displayport />
              <Icon.DistributeHorizontal />
              <Icon.DistributeVertical />
              <Icon.DoorClosedFill />
              <Icon.DoorClosed />
              <Icon.DoorOpenFill />
              <Icon.DoorOpen />
              <Icon.Dot />
              <Icon.Download />
              <Icon.DpadFill />
              <Icon.Dpad />
              <Icon.Dribbble />
              <Icon.Dropbox />
              <Icon.DropletFill />
              <Icon.DropletHalf />
              <Icon.Droplet />
              <Icon.DuffleFill />
              <Icon.Duffle />
              <Icon.EarFill />
              <Icon.Ear />
              <Icon.Earbuds />
              <Icon.EaselFill />
              <Icon.Easel />
              <Icon.Easel2Fill />
              <Icon.Easel2 />
              <Icon.Easel3Fill />
              <Icon.Easel3 />
              <Icon.EggFill />
              <Icon.EggFried />
              <Icon.Egg />
              <Icon.EjectFill />
              <Icon.Eject />
              <Icon.EmojiAngryFill />
              <Icon.EmojiAngry />
              <Icon.EmojiAstonishedFill />
              <Icon.EmojiAstonished />
              <Icon.EmojiDizzyFill />
              <Icon.EmojiDizzy />
              <Icon.EmojiExpressionlessFill />
              <Icon.EmojiExpressionless />
              <Icon.EmojiFrownFill />
              <Icon.EmojiFrown />
              <Icon.EmojiGrimaceFill />
              <Icon.EmojiGrimace />
              <Icon.EmojiGrinFill />
              <Icon.EmojiGrin />
              <Icon.EmojiHeartEyesFill />
              <Icon.EmojiHeartEyes />
              <Icon.EmojiKissFill />
              <Icon.EmojiKiss />
              <Icon.EmojiLaughingFill />
              <Icon.EmojiLaughing />
              <Icon.EmojiNeutralFill />
              <Icon.EmojiNeutral />
              <Icon.EmojiSmileFill />
              <Icon.EmojiSmileUpsideDownFill />
              <Icon.EmojiSmileUpsideDown />
              <Icon.EmojiSmile />
              <Icon.EmojiSunglassesFill />
              <Icon.EmojiSunglasses />
              <Icon.EmojiSurpriseFill />
              <Icon.EmojiSurprise />
              <Icon.EmojiTearFill />
              <Icon.EmojiTear />
              <Icon.EmojiWinkFill />
              <Icon.EmojiWink />
              <Icon.EnvelopeArrowDownFill />
              <Icon.EnvelopeArrowDown />
              <Icon.EnvelopeArrowUpFill />
              <Icon.EnvelopeArrowUp />
              <Icon.EnvelopeAtFill />
              <Icon.EnvelopeAt />
              <Icon.EnvelopeCheckFill />
              <Icon.EnvelopeCheck />
              <Icon.EnvelopeDashFill />
              <Icon.EnvelopeDash />
              <Icon.EnvelopeExclamationFill />
              <Icon.EnvelopeExclamation />
              <Icon.EnvelopeFill />
              <Icon.EnvelopeHeartFill />
              <Icon.EnvelopeHeart />
              <Icon.EnvelopeOpenFill />
              <Icon.EnvelopeOpenHeartFill />
              <Icon.EnvelopeOpenHeart />
              <Icon.EnvelopeOpen />
              <Icon.EnvelopePaperFill />
              <Icon.EnvelopePaperHeartFill />
              <Icon.EnvelopePaperHeart />
              <Icon.EnvelopePaper />
              <Icon.EnvelopePlusFill />
              <Icon.EnvelopePlus />
              <Icon.EnvelopeSlashFill />
              <Icon.EnvelopeSlash />
              <Icon.EnvelopeXFill />
              <Icon.EnvelopeX />
              <Icon.Envelope />
              <Icon.EraserFill />
              <Icon.Eraser />
              <Icon.Escape />
              <Icon.Ethernet />
              <Icon.EvFrontFill />
              <Icon.EvFront />
              <Icon.EvStationFill />
              <Icon.EvStation />
              <Icon.ExclamationCircleFill />
              <Icon.ExclamationCircle />
              <Icon.ExclamationDiamondFill />
              <Icon.ExclamationDiamond />
              <Icon.ExclamationLg />
              <Icon.ExclamationOctagonFill />
              <Icon.ExclamationOctagon />
              <Icon.ExclamationSquareFill />
              <Icon.ExclamationSquare />
              <Icon.ExclamationTriangleFill />
              <Icon.ExclamationTriangle />
              <Icon.Exclamation />
              <Icon.Exclude />
              <Icon.ExplicitFill />
              <Icon.Explicit />
              <Icon.Exposure />
              <Icon.EyeFill />
              <Icon.EyeSlashFill />
              <Icon.EyeSlash />
              <Icon.Eye />
              <Icon.Eyedropper />
              <Icon.Eyeglasses />
              <Icon.Facebook />
              <Icon.Fan />
              <Icon.FastForwardBtnFill />
              <Icon.FastForwardBtn />
              <Icon.FastForwardCircleFill />
              <Icon.FastForwardCircle />
              <Icon.FastForwardFill />
              <Icon.FastForward />
              <Icon.Feather />
              <Icon.Feather2 />
              <Icon.FileArrowDownFill />
              <Icon.FileArrowDown />
              <Icon.FileArrowUpFill />
              <Icon.FileArrowUp />
              <Icon.FileBarGraphFill />
              <Icon.FileBarGraph />
              <Icon.FileBinaryFill />
              <Icon.FileBinary />
              <Icon.FileBreakFill />
              <Icon.FileBreak />
              <Icon.FileCheckFill />
              <Icon.FileCheck />
              <Icon.FileCodeFill />
              <Icon.FileCode />
              <Icon.FileDiffFill />
              <Icon.FileDiff />
              <Icon.FileEarmarkArrowDownFill />
              <Icon.FileEarmarkArrowDown />
              <Icon.FileEarmarkArrowUpFill />
              <Icon.FileEarmarkArrowUp />
              <Icon.FileEarmarkBarGraphFill />
              <Icon.FileEarmarkBarGraph />
              <Icon.FileEarmarkBinaryFill />
              <Icon.FileEarmarkBinary />
              <Icon.FileEarmarkBreakFill />
              <Icon.FileEarmarkBreak />
              <Icon.FileEarmarkCheckFill />
              <Icon.FileEarmarkCheck />
              <Icon.FileEarmarkCodeFill />
              <Icon.FileEarmarkCode />
              <Icon.FileEarmarkDiffFill />
              <Icon.FileEarmarkDiff />
              <Icon.FileEarmarkEaselFill />
              <Icon.FileEarmarkEasel />
              <Icon.FileEarmarkExcelFill />
              <Icon.FileEarmarkExcel />
              <Icon.FileEarmarkFill />
              <Icon.FileEarmarkFontFill />
              <Icon.FileEarmarkFont />
              <Icon.FileEarmarkImageFill />
              <Icon.FileEarmarkImage />
              <Icon.FileEarmarkLockFill />
              <Icon.FileEarmarkLock />
              <Icon.FileEarmarkLock2Fill />
              <Icon.FileEarmarkLock2 />
              <Icon.FileEarmarkMedicalFill />
              <Icon.FileEarmarkMedical />
              <Icon.FileEarmarkMinusFill />
              <Icon.FileEarmarkMinus />
              <Icon.FileEarmarkMusicFill />
              <Icon.FileEarmarkMusic />
              <Icon.FileEarmarkPdfFill />
              <Icon.FileEarmarkPdf />
              <Icon.FileEarmarkPersonFill />
              <Icon.FileEarmarkPerson />
              <Icon.FileEarmarkPlayFill />
              <Icon.FileEarmarkPlay />
              <Icon.FileEarmarkPlusFill />
              <Icon.FileEarmarkPlus />
              <Icon.FileEarmarkPostFill />
              <Icon.FileEarmarkPost />
              <Icon.FileEarmarkPptFill />
              <Icon.FileEarmarkPpt />
              <Icon.FileEarmarkRichtextFill />
              <Icon.FileEarmarkRichtext />
              <Icon.FileEarmarkRuledFill />
              <Icon.FileEarmarkRuled />
              <Icon.FileEarmarkSlidesFill />
              <Icon.FileEarmarkSlides />
              <Icon.FileEarmarkSpreadsheetFill />
              <Icon.FileEarmarkSpreadsheet />
              <Icon.FileEarmarkTextFill />
              <Icon.FileEarmarkText />
              <Icon.FileEarmarkWordFill />
              <Icon.FileEarmarkWord />
              <Icon.FileEarmarkXFill />
              <Icon.FileEarmarkX />
              <Icon.FileEarmarkZipFill />
              <Icon.FileEarmarkZip />
              <Icon.FileEarmark />
              <Icon.FileEaselFill />
              <Icon.FileEasel />
              <Icon.FileExcelFill />
              <Icon.FileExcel />
              <Icon.FileFill />
              <Icon.FileFontFill />
              <Icon.FileFont />
              <Icon.FileImageFill />
              <Icon.FileImage />
              <Icon.FileLockFill />
              <Icon.FileLock />
              <Icon.FileLock2Fill />
              <Icon.FileLock2 />
              <Icon.FileMedicalFill />
              <Icon.FileMedical />
              <Icon.FileMinusFill />
              <Icon.FileMinus />
              <Icon.FileMusicFill />
              <Icon.FileMusic />
              <Icon.FilePdfFill />
              <Icon.FilePdf />
              <Icon.FilePersonFill />
              <Icon.FilePerson />
              <Icon.FilePlayFill />
              <Icon.FilePlay />
              <Icon.FilePlusFill />
              <Icon.FilePlus />
              <Icon.FilePostFill />
              <Icon.FilePost />
              <Icon.FilePptFill />
              <Icon.FilePpt />
              <Icon.FileRichtextFill />
              <Icon.FileRichtext />
              <Icon.FileRuledFill />
              <Icon.FileRuled />
              <Icon.FileSlidesFill />
              <Icon.FileSlides />
              <Icon.FileSpreadsheetFill />
              <Icon.FileSpreadsheet />
              <Icon.FileTextFill />
              <Icon.FileText />
              <Icon.FileWordFill />
              <Icon.FileWord />
              <Icon.FileXFill />
              <Icon.FileX />
              <Icon.FileZipFill />
              <Icon.FileZip />
              <Icon.File />
              <Icon.FilesAlt />
              <Icon.Files />
              <Icon.FiletypeAac />
              <Icon.FiletypeAi />
              <Icon.FiletypeBmp />
              <Icon.FiletypeCs />
              <Icon.FiletypeCss />
              <Icon.FiletypeCsv />
              <Icon.FiletypeDoc />
              <Icon.FiletypeDocx />
              <Icon.FiletypeExe />
              <Icon.FiletypeGif />
              <Icon.FiletypeHeic />
              <Icon.FiletypeHtml />
              <Icon.FiletypeJava />
              <Icon.FiletypeJpg />
              <Icon.FiletypeJs />
              <Icon.FiletypeJson />
              <Icon.FiletypeJsx />
              <Icon.FiletypeKey />
              <Icon.FiletypeM4p />
              <Icon.FiletypeMd />
              <Icon.FiletypeMdx />
              <Icon.FiletypeMov />
              <Icon.FiletypeMp3 />
              <Icon.FiletypeMp4 />
              <Icon.FiletypeOtf />
              <Icon.FiletypePdf />
              <Icon.FiletypePhp />
              <Icon.FiletypePng />
              <Icon.FiletypePpt />
              <Icon.FiletypePptx />
              <Icon.FiletypePsd />
              <Icon.FiletypePy />
              <Icon.FiletypeRaw />
              <Icon.FiletypeRb />
              <Icon.FiletypeSass />
              <Icon.FiletypeScss />
              <Icon.FiletypeSh />
              <Icon.FiletypeSql />
              <Icon.FiletypeSvg />
              <Icon.FiletypeTiff />
              <Icon.FiletypeTsx />
              <Icon.FiletypeTtf />
              <Icon.FiletypeTxt />
              <Icon.FiletypeWav />
              <Icon.FiletypeWoff />
              <Icon.FiletypeXls />
              <Icon.FiletypeXlsx />
              <Icon.FiletypeXml />
              <Icon.FiletypeYml />
              <Icon.Film />
              <Icon.FilterCircleFill />
              <Icon.FilterCircle />
              <Icon.FilterLeft />
              <Icon.FilterRight />
              <Icon.FilterSquareFill />
              <Icon.FilterSquare />
              <Icon.Filter />
              <Icon.Fingerprint />
              <Icon.Fire />
              <Icon.FlagFill />
              <Icon.Flag />
              <Icon.FloppyFill />
              <Icon.Floppy />
              <Icon.Floppy2Fill />
              <Icon.Floppy2 />
              <Icon.Flower1 />
              <Icon.Flower2 />
              <Icon.Flower3 />
              <Icon.FolderCheck />
              <Icon.FolderFill />
              <Icon.FolderMinus />
              <Icon.FolderPlus />
              <Icon.FolderSymlinkFill />
              <Icon.FolderSymlink />
              <Icon.FolderX />
              <Icon.Folder />
              <Icon.Folder2Open />
              <Icon.Folder2 />
              <Icon.Fonts />
              <Icon.ForwardFill />
              <Icon.Forward />
              <Icon.Front />
              <Icon.FuelPumpDieselFill />
              <Icon.FuelPumpDiesel />
              <Icon.FuelPumpFill />
              <Icon.FuelPump />
              <Icon.FullscreenExit />
              <Icon.Fullscreen />
              <Icon.FunnelFill />
              <Icon.Funnel />
              <Icon.GearFill />
              <Icon.GearWideConnected />
              <Icon.GearWide />
              <Icon.Gear />
              <Icon.Gem />
              <Icon.GenderAmbiguous />
              <Icon.GenderFemale />
              <Icon.GenderMale />
              <Icon.GenderNeuter />
              <Icon.GenderTrans />
              <Icon.GeoAltFill />
              <Icon.GeoAlt />
              <Icon.GeoFill />
              <Icon.Geo />
              <Icon.GiftFill />
              <Icon.Gift />
              <Icon.Git />
              <Icon.Github />
              <Icon.Gitlab />
              <Icon.GlobeAmericas />
              <Icon.GlobeAsiaAustralia />
              <Icon.GlobeCentralSouthAsia />
              <Icon.GlobeEuropeAfrica />
              <Icon.Globe />
              <Icon.Globe2 />
              <Icon.GooglePlay />
              <Icon.Google />
              <Icon.GpuCard />
              <Icon.GraphDownArrow />
              <Icon.GraphDown />
              <Icon.GraphUpArrow />
              <Icon.GraphUp />
              <Icon.Grid1x2Fill />
              <Icon.Grid1x2 />
              <Icon.Grid3x2GapFill />
              <Icon.Grid3x2Gap />
              <Icon.Grid3x2 />
              <Icon.Grid3x3GapFill />
              <Icon.Grid3x3Gap />
              <Icon.Grid3x3 />
              <Icon.GridFill />
              <Icon.Grid />
              <Icon.GripHorizontal />
              <Icon.GripVertical />
              <Icon.HCircleFill />
              <Icon.HCircle />
              <Icon.HSquareFill />
              <Icon.HSquare />
              <Icon.Hammer />
              <Icon.HandIndexFill />
              <Icon.HandIndexThumbFill />
              <Icon.HandIndexThumb />
              <Icon.HandIndex />
              <Icon.HandThumbsDownFill />
              <Icon.HandThumbsDown />
              <Icon.HandThumbsUpFill />
              <Icon.HandThumbsUp />
              <Icon.HandbagFill />
              <Icon.Handbag />
              <Icon.Hash />
              <Icon.HddFill />
              <Icon.HddNetworkFill />
              <Icon.HddNetwork />
              <Icon.HddRackFill />
              <Icon.HddRack />
              <Icon.HddStackFill />
              <Icon.HddStack />
              <Icon.Hdd />
              <Icon.HdmiFill />
              <Icon.Hdmi />
              <Icon.Headphones />
              <Icon.HeadsetVr />
              <Icon.Headset />
              <Icon.HeartArrow />
              <Icon.HeartFill />
              <Icon.HeartHalf />
              <Icon.HeartPulseFill />
              <Icon.HeartPulse />
              <Icon.Heart />
              <Icon.HeartbreakFill />
              <Icon.Heartbreak />
              <Icon.Hearts />
              <Icon.HeptagonFill />
              <Icon.HeptagonHalf />
              <Icon.Heptagon />
              <Icon.HexagonFill />
              <Icon.HexagonHalf />
              <Icon.Hexagon />
              <Icon.Highlighter />
              <Icon.Highlights />
              <Icon.HospitalFill />
              <Icon.Hospital />
              <Icon.HourglassBottom />
              <Icon.HourglassSplit />
              <Icon.HourglassTop />
              <Icon.Hourglass />
              <Icon.HouseAddFill />
              <Icon.HouseAdd />
              <Icon.HouseCheckFill />
              <Icon.HouseCheck />
              <Icon.HouseDashFill />
              <Icon.HouseDash />
              <Icon.HouseDoorFill />
              <Icon.HouseDoor />
              <Icon.HouseDownFill />
              <Icon.HouseDown />
              <Icon.HouseExclamationFill />
              <Icon.HouseExclamation />
              <Icon.HouseFill />
              <Icon.HouseGearFill />
              <Icon.HouseGear />
              <Icon.HouseHeartFill />
              <Icon.HouseHeart />
              <Icon.HouseLockFill />
              <Icon.HouseLock />
              <Icon.HouseSlashFill />
              <Icon.HouseSlash />
              <Icon.HouseUpFill />
              <Icon.HouseUp />
              <Icon.HouseXFill />
              <Icon.HouseX />
              <Icon.House />
              <Icon.HousesFill />
              <Icon.Houses />
              <Icon.Hr />
              <Icon.Hurricane />
              <Icon.Hypnotize />
              <Icon.ImageAlt />
              <Icon.ImageFill />
              <Icon.Image />
              <Icon.Images />
              <Icon.InboxFill />
              <Icon.Inbox />
              <Icon.InboxesFill />
              <Icon.Inboxes />
              <Icon.Incognito />
              <Icon.Indent />
              <Icon.Infinity />
              <Icon.InfoCircleFill />
              <Icon.InfoCircle />
              <Icon.InfoLg />
              <Icon.InfoSquareFill />
              <Icon.InfoSquare />
              <Icon.Info />
              <Icon.InputCursorText />
              <Icon.InputCursor />
              <Icon.Instagram />
              <Icon.Intersect />
              <Icon.JournalAlbum />
              <Icon.JournalArrowDown />
              <Icon.JournalArrowUp />
              <Icon.JournalBookmarkFill />
              <Icon.JournalBookmark />
              <Icon.JournalCheck />
              <Icon.JournalCode />
              <Icon.JournalMedical />
              <Icon.JournalMinus />
              <Icon.JournalPlus />
              <Icon.JournalRichtext />
              <Icon.JournalText />
              <Icon.JournalX />
              <Icon.Journal />
              <Icon.Journals />
              <Icon.Joystick />
              <Icon.JustifyLeft />
              <Icon.JustifyRight />
              <Icon.Justify />
              <Icon.KanbanFill />
              <Icon.Kanban />
              <Icon.KeyFill />
              <Icon.Key />
              <Icon.KeyboardFill />
              <Icon.Keyboard />
              <Icon.Ladder />
              <Icon.LampFill />
              <Icon.Lamp />
              <Icon.LaptopFill />
              <Icon.Laptop />
              <Icon.LayerBackward />
              <Icon.LayerForward />
              <Icon.LayersFill />
              <Icon.LayersHalf />
              <Icon.Layers />
              <Icon.LayoutSidebarInsetReverse />
              <Icon.LayoutSidebarInset />
              <Icon.LayoutSidebarReverse />
              <Icon.LayoutSidebar />
              <Icon.LayoutSplit />
              <Icon.LayoutTextSidebarReverse />
              <Icon.LayoutTextSidebar />
              <Icon.LayoutTextWindowReverse />
              <Icon.LayoutTextWindow />
              <Icon.LayoutThreeColumns />
              <Icon.LayoutWtf />
              <Icon.LifePreserver />
              <Icon.LightbulbFill />
              <Icon.LightbulbOffFill />
              <Icon.LightbulbOff />
              <Icon.Lightbulb />
              <Icon.LightningChargeFill />
              <Icon.LightningCharge />
              <Icon.LightningFill />
              <Icon.Lightning />
              <Icon.Line />
              <Icon.Link45deg />
              <Icon.Link />
              <Icon.Linkedin />
              <Icon.ListCheck />
              <Icon.ListColumnsReverse />
              <Icon.ListColumns />
              <Icon.ListNested />
              <Icon.ListOl />
              <Icon.ListStars />
              <Icon.ListTask />
              <Icon.ListUl />
              <Icon.List />
              <Icon.LockFill />
              <Icon.Lock />
              <Icon.LuggageFill />
              <Icon.Luggage />
              <Icon.LungsFill />
              <Icon.Lungs />
              <Icon.Magic />
              <Icon.MagnetFill />
              <Icon.Magnet />
              <Icon.MailboxFlag />
              <Icon.Mailbox />
              <Icon.Mailbox2Flag />
              <Icon.Mailbox2 />
              <Icon.MapFill />
              <Icon.Map />
              <Icon.MarkdownFill />
              <Icon.Markdown />
              <Icon.MarkerTip />
              <Icon.Mask />
              <Icon.Mastodon />
              <Icon.Medium />
              <Icon.MegaphoneFill />
              <Icon.Megaphone />
              <Icon.Memory />
              <Icon.MenuAppFill />
              <Icon.MenuApp />
              <Icon.MenuButtonFill />
              <Icon.MenuButtonWideFill />
              <Icon.MenuButtonWide />
              <Icon.MenuButton />
              <Icon.MenuDown />
              <Icon.MenuUp />
              <Icon.Messenger />
              <Icon.Meta />
              <Icon.MicFill />
              <Icon.MicMuteFill />
              <Icon.MicMute />
              <Icon.Mic />
              <Icon.MicrosoftTeams />
              <Icon.Microsoft />
              <Icon.MinecartLoaded />
              <Icon.Minecart />
              <Icon.ModemFill />
              <Icon.Modem />
              <Icon.Moisture />
              <Icon.MoonFill />
              <Icon.MoonStarsFill />
              <Icon.MoonStars />
              <Icon.Moon />
              <Icon.MortarboardFill />
              <Icon.Mortarboard />
              <Icon.MotherboardFill />
              <Icon.Motherboard />
              <Icon.MouseFill />
              <Icon.Mouse />
              <Icon.Mouse2Fill />
              <Icon.Mouse2 />
              <Icon.Mouse3Fill />
              <Icon.Mouse3 />
              <Icon.MusicNoteBeamed />
              <Icon.MusicNoteList />
              <Icon.MusicNote />
              <Icon.MusicPlayerFill />
              <Icon.MusicPlayer />
              <Icon.Newspaper />
              <Icon.NintendoSwitch />
              <Icon.NodeMinusFill />
              <Icon.NodeMinus />
              <Icon.NodePlusFill />
              <Icon.NodePlus />
              <Icon.NoiseReduction />
              <Icon.NutFill />
              <Icon.Nut />
              <Icon.Nvidia />
              <Icon.NvmeFill />
              <Icon.Nvme />
              <Icon.OctagonFill />
              <Icon.OctagonHalf />
              <Icon.Octagon />
              <Icon.Opencollective />
              <Icon.OpticalAudioFill />
              <Icon.OpticalAudio />
              <Icon.Option />
              <Icon.Outlet />
              <Icon.PCircleFill />
              <Icon.PCircle />
              <Icon.PSquareFill />
              <Icon.PSquare />
              <Icon.PaintBucket />
              <Icon.PaletteFill />
              <Icon.Palette />
              <Icon.Palette2 />
              <Icon.Paperclip />
              <Icon.Paragraph />
              <Icon.PassFill />
              <Icon.Pass />
              <Icon.PassportFill />
              <Icon.Passport />
              <Icon.PatchCheckFill />
              <Icon.PatchCheck />
              <Icon.PatchExclamationFill />
              <Icon.PatchExclamation />
              <Icon.PatchMinusFill />
              <Icon.PatchMinus />
              <Icon.PatchPlusFill />
              <Icon.PatchPlus />
              <Icon.PatchQuestionFill />
              <Icon.PatchQuestion />
              <Icon.PauseBtnFill />
              <Icon.PauseBtn />
              <Icon.PauseCircleFill />
              <Icon.PauseCircle />
              <Icon.PauseFill />
              <Icon.Pause />
              <Icon.Paypal />
              <Icon.PcDisplayHorizontal />
              <Icon.PcDisplay />
              <Icon.PcHorizontal />
              <Icon.Pc />
              <Icon.PciCardNetwork />
              <Icon.PciCardSound />
              <Icon.PciCard />
              <Icon.PeaceFill />
              <Icon.Peace />
              <Icon.PenFill />
              <Icon.Pen />
              <Icon.PencilFill />
              <Icon.PencilSquare />
              <Icon.Pencil />
              <Icon.PentagonFill />
              <Icon.PentagonHalf />
              <Icon.Pentagon />
              <Icon.PeopleFill />
              <Icon.People />
              <Icon.Percent />
              <Icon.PersonAdd />
              <Icon.PersonArmsUp />
              <Icon.PersonBadgeFill />
              <Icon.PersonBadge />
              <Icon.PersonBoundingBox />
              <Icon.PersonCheckFill />
              <Icon.PersonCheck />
              <Icon.PersonCircle />
              <Icon.PersonDashFill />
              <Icon.PersonDash />
              <Icon.PersonDown />
              <Icon.PersonExclamation />
              <Icon.PersonFillAdd />
              <Icon.PersonFillCheck />
              <Icon.PersonFillDash />
              <Icon.PersonFillDown />
              <Icon.PersonFillExclamation />
              <Icon.PersonFillGear />
              <Icon.PersonFillLock />
              <Icon.PersonFillSlash />
              <Icon.PersonFillUp />
              <Icon.PersonFillX />
              <Icon.PersonFill />
              <Icon.PersonGear />
              <Icon.PersonHeart />
              <Icon.PersonHearts />
              <Icon.PersonLinesFill />
              <Icon.PersonLock />
              <Icon.PersonPlusFill />
              <Icon.PersonPlus />
              <Icon.PersonRaisedHand />
              <Icon.PersonRolodex />
              <Icon.PersonSlash />
              <Icon.PersonSquare />
              <Icon.PersonStandingDress />
              <Icon.PersonStanding />
              <Icon.PersonUp />
              <Icon.PersonVcardFill />
              <Icon.PersonVcard />
              <Icon.PersonVideo />
              <Icon.PersonVideo2 />
              <Icon.PersonVideo3 />
              <Icon.PersonWalking />
              <Icon.PersonWheelchair />
              <Icon.PersonWorkspace />
              <Icon.PersonXFill />
              <Icon.PersonX />
              <Icon.Person />
              <Icon.PhoneFill />
              <Icon.PhoneFlip />
              <Icon.PhoneLandscapeFill />
              <Icon.PhoneLandscape />
              <Icon.PhoneVibrateFill />
              <Icon.PhoneVibrate />
              <Icon.Phone />
              <Icon.PieChartFill />
              <Icon.PieChart />
              <Icon.PiggyBankFill />
              <Icon.PiggyBank />
              <Icon.PinAngleFill />
              <Icon.PinAngle />
              <Icon.PinFill />
              <Icon.PinMapFill />
              <Icon.PinMap />
              <Icon.Pin />
              <Icon.Pinterest />
              <Icon.PipFill />
              <Icon.Pip />
              <Icon.PlayBtnFill />
              <Icon.PlayBtn />
              <Icon.PlayCircleFill />
              <Icon.PlayCircle />
              <Icon.PlayFill />
              <Icon.Play />
              <Icon.Playstation />
              <Icon.PlugFill />
              <Icon.Plug />
              <Icon.Plugin />
              <Icon.PlusCircleDotted />
              <Icon.PlusCircleFill />
              <Icon.PlusCircle />
              <Icon.PlusLg />
              <Icon.PlusSlashMinus />
              <Icon.PlusSquareDotted />
              <Icon.PlusSquareFill />
              <Icon.PlusSquare />
              <Icon.Plus />
              <Icon.PostageFill />
              <Icon.PostageHeartFill />
              <Icon.PostageHeart />
              <Icon.Postage />
              <Icon.PostcardFill />
              <Icon.PostcardHeartFill />
              <Icon.PostcardHeart />
              <Icon.Postcard />
              <Icon.Power />
              <Icon.Prescription />
              <Icon.Prescription2 />
              <Icon.PrinterFill />
              <Icon.Printer />
              <Icon.ProjectorFill />
              <Icon.Projector />
              <Icon.PuzzleFill />
              <Icon.Puzzle />
              <Icon.QrCodeScan />
              <Icon.QrCode />
              <Icon.QuestionCircleFill />
              <Icon.QuestionCircle />
              <Icon.QuestionDiamondFill />
              <Icon.QuestionDiamond />
              <Icon.QuestionLg />
              <Icon.QuestionOctagonFill />
              <Icon.QuestionOctagon />
              <Icon.QuestionSquareFill />
              <Icon.QuestionSquare />
              <Icon.Question />
              <Icon.Quora />
              <Icon.Quote />
              <Icon.RCircleFill />
              <Icon.RCircle />
              <Icon.RSquareFill />
              <Icon.RSquare />
              <Icon.Radar />
              <Icon.Radioactive />
              <Icon.Rainbow />
              <Icon.ReceiptCutoff />
              <Icon.Receipt />
              <Icon.Reception0 />
              <Icon.Reception1 />
              <Icon.Reception2 />
              <Icon.Reception3 />
              <Icon.Reception4 />
              <Icon.RecordBtnFill />
              <Icon.RecordBtn />
              <Icon.RecordCircleFill />
              <Icon.RecordCircle />
              <Icon.RecordFill />
              <Icon.Record />
              <Icon.Record2Fill />
              <Icon.Record2 />
              <Icon.Recycle />
              <Icon.Reddit />
              <Icon.Regex />
              <Icon.Repeat1 />
              <Icon.Repeat />
              <Icon.ReplyAllFill />
              <Icon.ReplyAll />
              <Icon.ReplyFill />
              <Icon.Reply />
              <Icon.RewindBtnFill />
              <Icon.RewindBtn />
              <Icon.RewindCircleFill />
              <Icon.RewindCircle />
              <Icon.RewindFill />
              <Icon.Rewind />
              <Icon.Robot />
              <Icon.RocketFill />
              <Icon.RocketTakeoffFill />
              <Icon.RocketTakeoff />
              <Icon.Rocket />
              <Icon.RouterFill />
              <Icon.Router />
              <Icon.RssFill />
              <Icon.Rss />
              <Icon.Rulers />
              <Icon.SafeFill />
              <Icon.Safe />
              <Icon.Safe2Fill />
              <Icon.Safe2 />
              <Icon.SaveFill />
              <Icon.Save />
              <Icon.Save2Fill />
              <Icon.Save2 />
              <Icon.Scissors />
              <Icon.Scooter />
              <Icon.Screwdriver />
              <Icon.SdCardFill />
              <Icon.SdCard />
              <Icon.SearchHeartFill />
              <Icon.SearchHeart />
              <Icon.Search />
              <Icon.SegmentedNav />
              <Icon.SendArrowDownFill />
              <Icon.SendArrowDown />
              <Icon.SendArrowUpFill />
              <Icon.SendArrowUp />
              <Icon.SendCheckFill />
              <Icon.SendCheck />
              <Icon.SendDashFill />
              <Icon.SendDash />
              <Icon.SendExclamationFill />
              <Icon.SendExclamation />
              <Icon.SendFill />
              <Icon.SendPlusFill />
              <Icon.SendPlus />
              <Icon.SendSlashFill />
              <Icon.SendSlash />
              <Icon.SendXFill />
              <Icon.SendX />
              <Icon.Send />
              <Icon.Server />
              <Icon.Shadows />
              <Icon.ShareFill />
              <Icon.Share />
              <Icon.ShieldCheck />
              <Icon.ShieldExclamation />
              <Icon.ShieldFillCheck />
              <Icon.ShieldFillExclamation />
              <Icon.ShieldFillMinus />
              <Icon.ShieldFillPlus />
              <Icon.ShieldFillX />
              <Icon.ShieldFill />
              <Icon.ShieldLockFill />
              <Icon.ShieldLock />
              <Icon.ShieldMinus />
              <Icon.ShieldPlus />
              <Icon.ShieldShaded />
              <Icon.ShieldSlashFill />
              <Icon.ShieldSlash />
              <Icon.ShieldX />
              <Icon.Shield />
              <Icon.ShiftFill />
              <Icon.Shift />
              <Icon.ShopWindow />
              <Icon.Shop />
              <Icon.Shuffle />
              <Icon.SignDeadEndFill />
              <Icon.SignDeadEnd />
              <Icon.SignDoNotEnterFill />
              <Icon.SignDoNotEnter />
              <Icon.SignIntersectionFill />
              <Icon.SignIntersectionSideFill />
              <Icon.SignIntersectionSide />
              <Icon.SignIntersectionTFill />
              <Icon.SignIntersectionT />
              <Icon.SignIntersectionYFill />
              <Icon.SignIntersectionY />
              <Icon.SignIntersection />
              <Icon.SignMergeLeftFill />
              <Icon.SignMergeLeft />
              <Icon.SignMergeRightFill />
              <Icon.SignMergeRight />
              <Icon.SignNoLeftTurnFill />
              <Icon.SignNoLeftTurn />
              <Icon.SignNoParkingFill />
              <Icon.SignNoParking />
              <Icon.SignNoRightTurnFill />
              <Icon.SignNoRightTurn />
              <Icon.SignRailroadFill />
              <Icon.SignRailroad />
              <Icon.SignStopFill />
              <Icon.SignStopLightsFill />
              <Icon.SignStopLights />
              <Icon.SignStop />
              <Icon.SignTurnLeftFill />
              <Icon.SignTurnLeft />
              <Icon.SignTurnRightFill />
              <Icon.SignTurnRight />
              <Icon.SignTurnSlightLeftFill />
              <Icon.SignTurnSlightLeft />
              <Icon.SignTurnSlightRightFill />
              <Icon.SignTurnSlightRight />
              <Icon.SignYieldFill />
              <Icon.SignYield />
              <Icon.Signal />
              <Icon.Signpost2Fill />
              <Icon.Signpost2 />
              <Icon.SignpostFill />
              <Icon.SignpostSplitFill />
              <Icon.SignpostSplit />
              <Icon.Signpost />
              <Icon.SimFill />
              <Icon.SimSlashFill />
              <Icon.SimSlash />
              <Icon.Sim />
              <Icon.SinaWeibo />
              <Icon.SkipBackwardBtnFill />
              <Icon.SkipBackwardBtn />
              <Icon.SkipBackwardCircleFill />
              <Icon.SkipBackwardCircle />
              <Icon.SkipBackwardFill />
              <Icon.SkipBackward />
              <Icon.SkipEndBtnFill />
              <Icon.SkipEndBtn />
              <Icon.SkipEndCircleFill />
              <Icon.SkipEndCircle />
              <Icon.SkipEndFill />
              <Icon.SkipEnd />
              <Icon.SkipForwardBtnFill />
              <Icon.SkipForwardBtn />
              <Icon.SkipForwardCircleFill />
              <Icon.SkipForwardCircle />
              <Icon.SkipForwardFill />
              <Icon.SkipForward />
              <Icon.SkipStartBtnFill />
              <Icon.SkipStartBtn />
              <Icon.SkipStartCircleFill />
              <Icon.SkipStartCircle />
              <Icon.SkipStartFill />
              <Icon.SkipStart />
              <Icon.Skype />
              <Icon.Slack />
              <Icon.SlashCircleFill />
              <Icon.SlashCircle />
              <Icon.SlashLg />
              <Icon.SlashSquareFill />
              <Icon.SlashSquare />
              <Icon.Slash />
              <Icon.Sliders />
              <Icon.Sliders2Vertical />
              <Icon.Sliders2 />
              <Icon.Smartwatch />
              <Icon.Snapchat />
              <Icon.Snow />
              <Icon.Snow2 />
              <Icon.Snow3 />
              <Icon.SortAlphaDownAlt />
              <Icon.SortAlphaDown />
              <Icon.SortAlphaUpAlt />
              <Icon.SortAlphaUp />
              <Icon.SortDownAlt />
              <Icon.SortDown />
              <Icon.SortNumericDownAlt />
              <Icon.SortNumericDown />
              <Icon.SortNumericUpAlt />
              <Icon.SortNumericUp />
              <Icon.SortUpAlt />
              <Icon.SortUp />
              <Icon.Soundwave />
              <Icon.Sourceforge />
              <Icon.SpeakerFill />
              <Icon.Speaker />
              <Icon.Speedometer />
              <Icon.Speedometer2 />
              <Icon.Spellcheck />
              <Icon.Spotify />
              <Icon.SquareFill />
              <Icon.SquareHalf />
              <Icon.Square />
              <Icon.StackOverflow />
              <Icon.Stack />
              <Icon.StarFill />
              <Icon.StarHalf />
              <Icon.Star />
              <Icon.Stars />
              <Icon.Steam />
              <Icon.StickiesFill />
              <Icon.Stickies />
              <Icon.StickyFill />
              <Icon.Sticky />
              <Icon.StopBtnFill />
              <Icon.StopBtn />
              <Icon.StopCircleFill />
              <Icon.StopCircle />
              <Icon.StopFill />
              <Icon.Stop />
              <Icon.StoplightsFill />
              <Icon.Stoplights />
              <Icon.StopwatchFill />
              <Icon.Stopwatch />
              <Icon.Strava />
              <Icon.Stripe />
              <Icon.Subscript />
              <Icon.Substack />
              <Icon.Subtract />
              <Icon.SuitClubFill />
              <Icon.SuitClub />
              <Icon.SuitDiamondFill />
              <Icon.SuitDiamond />
              <Icon.SuitHeartFill />
              <Icon.SuitHeart />
              <Icon.SuitSpadeFill />
              <Icon.SuitSpade />
              <Icon.SuitcaseFill />
              <Icon.SuitcaseLgFill />
              <Icon.SuitcaseLg />
              <Icon.Suitcase />
              <Icon.Suitcase2Fill />
              <Icon.Suitcase2 />
              <Icon.SunFill />
              <Icon.Sun />
              <Icon.Sunglasses />
              <Icon.SunriseFill />
              <Icon.Sunrise />
              <Icon.SunsetFill />
              <Icon.Sunset />
              <Icon.Superscript />
              <Icon.SymmetryHorizontal />
              <Icon.SymmetryVertical />
              <Icon.Table />
              <Icon.TabletFill />
              <Icon.TabletLandscapeFill />
              <Icon.TabletLandscape />
              <Icon.Tablet />
              <Icon.TagFill />
              <Icon.Tag />
              <Icon.TagsFill />
              <Icon.Tags />
              <Icon.TaxiFrontFill />
              <Icon.TaxiFront />
              <Icon.Telegram />
              <Icon.TelephoneFill />
              <Icon.TelephoneForwardFill />
              <Icon.TelephoneForward />
              <Icon.TelephoneInboundFill />
              <Icon.TelephoneInbound />
              <Icon.TelephoneMinusFill />
              <Icon.TelephoneMinus />
              <Icon.TelephoneOutboundFill />
              <Icon.TelephoneOutbound />
              <Icon.TelephonePlusFill />
              <Icon.TelephonePlus />
              <Icon.TelephoneXFill />
              <Icon.TelephoneX />
              <Icon.Telephone />
              <Icon.TencentQq />
              <Icon.TerminalDash />
              <Icon.TerminalFill />
              <Icon.TerminalPlus />
              <Icon.TerminalSplit />
              <Icon.TerminalX />
              <Icon.Terminal />
              <Icon.TextCenter />
              <Icon.TextIndentLeft />
              <Icon.TextIndentRight />
              <Icon.TextLeft />
              <Icon.TextParagraph />
              <Icon.TextRight />
              <Icon.TextWrap />
              <Icon.TextareaResize />
              <Icon.TextareaT />
              <Icon.Textarea />
              <Icon.ThermometerHalf />
              <Icon.ThermometerHigh />
              <Icon.ThermometerLow />
              <Icon.ThermometerSnow />
              <Icon.ThermometerSun />
              <Icon.Thermometer />
              <Icon.ThreadsFill />
              <Icon.Threads />
              <Icon.ThreeDotsVertical />
              <Icon.ThreeDots />
              <Icon.ThunderboltFill />
              <Icon.Thunderbolt />
              <Icon.TicketDetailedFill />
              <Icon.TicketDetailed />
              <Icon.TicketFill />
              <Icon.TicketPerforatedFill />
              <Icon.TicketPerforated />
              <Icon.Ticket />
              <Icon.Tiktok />
              <Icon.ToggleOff />
              <Icon.ToggleOn />
              <Icon.Toggle2Off />
              <Icon.Toggle2On />
              <Icon.Toggles />
              <Icon.Toggles2 />
              <Icon.Tools />
              <Icon.Tornado />
              <Icon.TrainFreightFrontFill />
              <Icon.TrainFreightFront />
              <Icon.TrainFrontFill />
              <Icon.TrainFront />
              <Icon.TrainLightrailFrontFill />
              <Icon.TrainLightrailFront />
              <Icon.Translate />
              <Icon.Transparency />
              <Icon.TrashFill />
              <Icon.Trash />
              <Icon.Trash2Fill />
              <Icon.Trash2 />
              <Icon.Trash3Fill />
              <Icon.Trash3 />
              <Icon.TreeFill />
              <Icon.Tree />
              <Icon.Trello />
              <Icon.TriangleFill />
              <Icon.TriangleHalf />
              <Icon.Triangle />
              <Icon.TrophyFill />
              <Icon.Trophy />
              <Icon.TropicalStorm />
              <Icon.TruckFlatbed />
              <Icon.TruckFrontFill />
              <Icon.TruckFront />
              <Icon.Truck />
              <Icon.Tsunami />
              <Icon.TvFill />
              <Icon.Tv />
              <Icon.Twitch />
              <Icon.TwitterX />
              <Icon.Twitter />
              <Icon.TypeBold />
              <Icon.TypeH1 />
              <Icon.TypeH2 />
              <Icon.TypeH3 />
              <Icon.TypeH4 />
              <Icon.TypeH5 />
              <Icon.TypeH6 />
              <Icon.TypeItalic />
              <Icon.TypeStrikethrough />
              <Icon.TypeUnderline />
              <Icon.Type />
              <Icon.Ubuntu />
              <Icon.UiChecksGrid />
              <Icon.UiChecks />
              <Icon.UiRadiosGrid />
              <Icon.UiRadios />
              <Icon.UmbrellaFill />
              <Icon.Umbrella />
              <Icon.Unindent />
              <Icon.Union />
              <Icon.Unity />
              <Icon.UniversalAccessCircle />
              <Icon.UniversalAccess />
              <Icon.UnlockFill />
              <Icon.Unlock />
              <Icon.UpcScan />
              <Icon.Upc />
              <Icon.Upload />
              <Icon.UsbCFill />
              <Icon.UsbC />
              <Icon.UsbDriveFill />
              <Icon.UsbDrive />
              <Icon.UsbFill />
              <Icon.UsbMicroFill />
              <Icon.UsbMicro />
              <Icon.UsbMiniFill />
              <Icon.UsbMini />
              <Icon.UsbPlugFill />
              <Icon.UsbPlug />
              <Icon.UsbSymbol />
              <Icon.Usb />
              <Icon.Valentine />
              <Icon.Valentine2 />
              <Icon.VectorPen />
              <Icon.ViewList />
              <Icon.ViewStacked />
              <Icon.Vignette />
              <Icon.Vimeo />
              <Icon.VinylFill />
              <Icon.Vinyl />
              <Icon.Virus />
              <Icon.Virus2 />
              <Icon.Voicemail />
              <Icon.VolumeDownFill />
              <Icon.VolumeDown />
              <Icon.VolumeMuteFill />
              <Icon.VolumeMute />
              <Icon.VolumeOffFill />
              <Icon.VolumeOff />
              <Icon.VolumeUpFill />
              <Icon.VolumeUp />
              <Icon.Vr />
              <Icon.WalletFill />
              <Icon.Wallet />
              <Icon.Wallet2 />
              <Icon.Watch />
              <Icon.Water />
              <Icon.WebcamFill />
              <Icon.Webcam />
              <Icon.Wechat />
              <Icon.Whatsapp />
              <Icon.Wifi1 />
              <Icon.Wifi2 />
              <Icon.WifiOff />
              <Icon.Wifi />
              <Icon.Wikipedia />
              <Icon.Wind />
              <Icon.WindowDash />
              <Icon.WindowDesktop />
              <Icon.WindowDock />
              <Icon.WindowFullscreen />
              <Icon.WindowPlus />
              <Icon.WindowSidebar />
              <Icon.WindowSplit />
              <Icon.WindowStack />
              <Icon.WindowX />
              <Icon.Window />
              <Icon.Windows />
              <Icon.Wordpress />
              <Icon.WrenchAdjustableCircleFill />
              <Icon.WrenchAdjustableCircle />
              <Icon.WrenchAdjustable />
              <Icon.Wrench />
              <Icon.XCircleFill />
              <Icon.XCircle />
              <Icon.XDiamondFill />
              <Icon.XDiamond />
              <Icon.XLg />
              <Icon.XOctagonFill />
              <Icon.XOctagon />
              <Icon.XSquareFill />
              <Icon.XSquare />
              <Icon.X />
              <Icon.Xbox />
              <Icon.Yelp />
              <Icon.YinYang />
              <Icon.Youtube />
              <Icon.ZoomIn />
              <Icon.ZoomOut />
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </>
  );
}

export default DevAssembl;
