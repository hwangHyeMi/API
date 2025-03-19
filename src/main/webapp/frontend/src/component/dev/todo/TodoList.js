import axios from 'axios';
import { useState, useEffect } from 'react';

import * as Icon from 'react-bootstrap-icons';
import * as Bts from 'react-bootstrap';
import lzutf8 from 'lzutf8';

import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale/ko';
import 'react-datepicker/dist/react-datepicker.css';

import { useNavigate } from 'react-router-dom'; // path 접근시 active 처리 자동화
import { useParams } from 'react-router-dom';

import httpHeaderStore from 'store/httpHeaderStore';
import useLoginStore from 'store/useLoginStore';
import codeStore from 'store/codeStore';
import fileStore from 'store/fileStore';

// Toast 관련
import MyToast from 'component/common/MyToast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function TodoList(props) {
  //registerLocale('ko', ko);
  //Globally
  //setDefaultLocale('ko');
  const DEV_TODO_URL = `${process.env.REACT_APP_DEV_TODO_URL}`;
  const { getHeaders } = httpHeaderStore((state) => {
    return state;
  });
  const headers = getHeaders();
  //로그인상태
  const { getMbrSeq } = useLoginStore((state) => {
    return state;
  });
  const { isCodeData, getCodDtlList } = codeStore((state) => {
    return state;
  });
  const { getFileListData, initFileForm } = fileStore((state) => {
    return state;
  });

  //네비게이트
  const navigate = useNavigate();
  const { topMenuSeq, compressParams } = useParams(); // 파라미터 가져오기
  const [params, setParams] = useState({ searchTodoGb: null, searchRegDtFrom: null, searchRegDtTo: null, searchTodoState: null, searchCondition: null, searchKeyword: null });
  //console.log('get params = ' + params);
  // 검색 영역 컨트롤
  const [openSearch, setOpenSearch] = useState(true);
  const [searchValidated, setSearchValidated] = useState(false);
  const [isSearchingStart, setIsSearchingStart] = useState(false);
  const [searchRegDtFrom, setSearchRegDtFrom] = useState(null); //useState(new Date());
  const [searchRegDtTo, setSearchRegDtTo] = useState(null); //useState(new Date());
  const [devTodoGbCdlList, setDevTodoGbCdlList] = useState([]); //   DEV-TODO-GB	TODO 구분
  const [devTodoStsCdlList, setDevTodoStsCdlList] = useState([]); //   DEV-TODO-STS	TODO 상태
  const [todo_list, setTodoList] = useState([]);

  // Form.Select 컨트롤
  const [selectedTodoGb, setSelectedTodoGb] = useState('');
  const onChangeSelectTodoGb = (e) => {
    setSelectedTodoGb(e.target.value);
  };
  const [selectedTodoState, setSelectedTodoState] = useState('');
  const onChangeSelectTodoState = (e) => {
    setSelectedTodoState(e.target.value);
  };
  const [selectedCondition, setSelectedCondition] = useState('');
  const onChangeSelectCondition = (e) => {
    setSelectedCondition(e.target.value);
  };

  const onChangeSearchRegDtFrom = (date) => {
    setSearchRegDtFrom(date);
    console.log('onChangeSearchRegDtFrom=' + date);
    if (!date) {
      // 시작일을 지우면 종료일도 초기화
      onChangeSearchRegDtTo(date);
    }
  };
  const onChangeSearchRegDtTo = (date) => {
    console.log('onChangeSearchRegDtTo=' + date);
    setSearchRegDtTo(date);
  };

  const searchSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    setSearchValidated(true);

    const formData = new FormData(form); // formData 생성 기준 ID 가 아닌 name 기준임
    const data = Object.fromEntries(formData.entries());
    data.searchRegDtFrom = searchRegDtFrom;
    data.searchRegDtTo = searchRegDtTo;

    //console.log(data);

    let raw_text = JSON.stringify(data);

    // 파람 값 압축 : 더 짧게 압축 할 방법이 있다면 변경 적용
    //console.log(Buffer.from(raw_text).toString());
    var output = lzutf8.compress(raw_text, { outputEncoding: 'Base64' });
    output = output.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    //console.log(output);
    //var input = lzutf8.decompress(output, { inputEncoding: 'Base64' });
    //console.log(input);

    // 화면 이동 하지 않고 axios 통신
    event.preventDefault();
    event.stopPropagation();

    // Sidebar.js 검색 값 유지 용도
    localStorage.setItem('todoParams', output);
    // URL 엔터 입력으로 접근 한 경우 자동 처리 후 서버 연동 하기 위해 화면 재귀 (뒤에 압축 파람 추가) 호출
    navigate('/' + topMenuSeq + '/dev/TodoList/' + output);

    //getDevTodoList(data);
  };
  // 등록 영역 컨트롤
  const [regYn, setRegYn] = useState(true);
  const [regSubYn, setRegSubYn] = useState(true);
  const [openRegTodo, setOpenRegTodo] = useState(false);
  const [openRegSubTodo, setOpenRegSubTodo] = useState(false);
  const [regTodoValidated, setRegTodoValidated] = useState(false);
  const [regSubTodoValidated, setRegSubTodoValidated] = useState(false);
  const [detailData, setDetailData] = useState({});
  const [detailSubData, setDetailSubData] = useState({});

  const [reqMbrSeq, setReqMbrSeq] = useState(null);
  const [resMbrSeq, setResMbrSeq] = useState(null);

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

  const [attachKey] = useState('TODO');
  const [attachId, setAttachId] = useState('');
  const [subAttachId, setSubAttachId] = useState('');
  const [attachList] = useState([]);
  const [subAttachList] = useState([]);
  const [attachInfo, setAttachInfo] = useState({
    striped: true /* ProgressBar striped 여부 디폴트 true */,
    variant: 'warning' /* ProgressBar variant ['success' | 'danger' | 'warning' | 'info']  디폴트 info */,
    multiple: true /* multiple 여부 디폴트 false */,
    accept: 'image/*',
    downYn: true /* multiple 여부 디폴트 true */,
    addYn: true /* 추가 여부 디폴트 true */,
    delYn: false /* multiple 여부 디폴트 false */,
    fileFormId: 'TODO1' /*한 화면에 1개 이상의 첨부 파일 대비 */,
    attachKey: attachKey,
    attachId: attachId,
    setAttachId: setAttachId,
    workKey: null,
    attachList: attachList,
    setMaskShow: props.setMaskShow,
    setMyToasts: setMyToasts,
  });

  const [subAttachInfo, setSubAttachInfo] = useState({
    striped: true /* ProgressBar striped 여부 디폴트 true */,
    variant: 'warning' /* ProgressBar variant ['success' | 'danger' | 'warning' | 'info']  디폴트 info */,
    multiple: true /* multiple 여부 디폴트 false */,
    accept: 'image/*',
    downYn: true /* multiple 여부 디폴트 true */,
    addYn: true /* 추가 여부 디폴트 true */,
    delYn: false /* multiple 여부 디폴트 false */,
    fileFormId: 'TODO2' /*한 화면에 1개 이상의 첨부 파일 대비 */,
    attachKey: attachKey,
    attachId: subAttachId,
    setAttachId: setSubAttachId,
    workKey: null,
    attachList: subAttachList,
    setMaskShow: props.setMaskShow,
    setMyToasts: setMyToasts,
  });
  let todoSaveData;
  let delTodoSeq;

  // Form.Select 컨트롤
  const [selectedDetailTodoGb, setSelectedDetailTodoGb] = useState('');
  const onChangeSelectDetailTodoGb = (e) => {
    setSelectedDetailTodoGb(e.target.value);
  };
  const [selectedDetailTodoState, setSelectedDetailTodoState] = useState('');
  const onChangeSelectDetailTodoState = (e) => {
    setSelectedDetailTodoState(e.target.value);
  };
  const [detailTodoNm, setDetailTodoNm] = useState('');
  const onChangeDetailTodoNm = (e) => {
    setDetailTodoNm(e.target.value);
  };
  const [detailTodoContent, setDetailTodoContent] = useState('');
  const onChangeDetailTodoContent = (e) => {
    setDetailTodoContent(e.target.value);
  };

  const setRegDetail = (e) => {
    setRegYn(true);
    //setAttachId('');
    //attachInfo.setAttachId('');
    attachInfo.attachId = '';
    attachInfo.attachList = [];
    attachInfo.workKey = null;
    attachInfo.addYn = true;
    attachInfo.delYn = true;
    setAttachInfo(attachInfo);

    setSelectedDetailTodoGb('');
    setSelectedDetailTodoState('01');
    setDetailTodoNm('');
    setDetailTodoContent('');
    setReqMbrSeq(getMbrSeq());

    setDetailData({});
    setRegDetailSub();
    if (openRegSubTodo === true) setOpenRegSubTodo(false); // 등록 Sub 영역 접기
  };
  const setDetail = (data, callbackGb) => {
    setRegYn(false);
    attachInfo.attachId = data.attach_id;
    attachInfo.attachList = [];
    attachInfo.workKey = data.todo_seq;
    attachInfo.addYn = data.req_mbr_seq == getMbrSeq() ? true : false;
    attachInfo.delYn = data.req_mbr_seq == getMbrSeq() ? true : false;
    setAttachInfo(attachInfo);

    setSelectedDetailTodoGb(data.todo_gb);
    setSelectedDetailTodoState(data.todo_state);
    setDetailTodoNm(data.todo_nm);
    setDetailTodoContent(data.todo_content);
    setReqMbrSeq(data.req_mbr_seq);

    setDetailData(data);
    //getFileListData({ attachKey: 'TODO', attachId: attachId, workKey: detailData.todo_seq, setAttachId: setAttachId, attachList: attachList, setAttachList: setAttachList });

    let subData = JSON.parse(JSON.stringify(data));
    if ('callback' !== callbackGb) {
      // 기본 정보 복사 및 디폴트 설정(sub 초기 값 세팅)
      subData.todo_seq = '';
      subData.parent_todo_seq = data.todo_seq;
      subData.todo_progress = 0;
      subData.todo_content = '';
      subData.todo_state = '';
      subData.attach_id = '';
      subData.todo_nm = 're:▷' + data.todo_nm;
      subData.res_mbr_seq = getMbrSeq();
      setDetailSub(subData);

      subAttachInfo.attachId = '';
      subAttachInfo.attachList = [];
      subAttachInfo.addYn = true;
      subAttachInfo.delYn = true;
      setSubAttachInfo(subAttachInfo);
    }
    //getFileListData(attachInfo);
    getFileListData(attachInfo);
  };

  const regTodoSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    const formData = new FormData(form); // formData 생성 기준 ID 가 아닌 name 기준임
    const data = Object.fromEntries(formData.entries());
    setRegTodoValidated(true);
    console.log(data);
    //setTodoSaveData(data);
    todoSaveData = data;
    console.log(todoSaveData);
    let confirm_msg = ' 하시겠습니까?';
    if (data.todoSeq) {
      confirm_msg = '수정 ' + confirm_msg;
    } else {
      confirm_msg = '등록 ' + confirm_msg;
    }

    setMyModialog('static', '✅확인', confirm_msg, 'No', 'Yes', 'confirm-s');

    event.preventDefault();
    event.stopPropagation();
  };

  // Form.Select 컨트롤
  const [selectedDetailSubTodoGb, setSelectedDetailSubTodoGb] = useState('');
  const onChangeSelectDetailSubTodoGb = (e) => {
    setSelectedDetailSubTodoGb(e.target.value);
  };
  const [selectedDetailSubTodoState, setSelectedDetailSubTodoState] = useState('');
  const onChangeSelectDetailSubTodoState = (e) => {
    setSelectedDetailSubTodoState(e.target.value);
  };
  const [detailSubTodoProgress, setDetailSubTodoProgress] = useState(0);
  const onChangeDetailSubTodoProgress = (e) => {
    setDetailSubTodoProgress(e.target.value);
  };
  const [detailSubTodoNm, setDetailSubTodoNm] = useState('');
  const onChangeDetailSubTodoNm = (e) => {
    setDetailSubTodoNm(e.target.value);
  };
  const [detailSubTodoContent, setDetailSubTodoContent] = useState('');
  const onChangeDetailSubTodoContent = (e) => {
    setDetailSubTodoContent(e.target.value);
  };
  const setRegDetailSub = () => {
    if (detailData) {
      // 기본 정보 복사 및 디폴트 설정(sub 초기 값 세팅)
      let subData = JSON.parse(JSON.stringify(detailData));
      subData.todo_seq = '';
      subData.parent_todo_seq = detailData.todo_seq;
      subData.todo_progress = 0;
      subData.todo_content = '';
      subData.todo_state = '';
      subData.attach_id = '';
      subData.res_mbr_seq = getMbrSeq();

      setDetailSub(subData);
      //setSubAttachId(subData.attach_id);
      //subAttachInfo.setAttachId(subData.attach_id);
      subAttachInfo.attachId = '';
    } else {
      setRegSubYn(true);
      //setSubAttachId('');
      //subAttachInfo.setAttachId('');
      subAttachInfo.attachId = '';
      subAttachInfo.attachList = [];
      subAttachInfo.workKey = '';
      subAttachInfo.addYn = true;
      subAttachInfo.delYn = true;
      setSelectedDetailSubTodoGb('');
      setDetailSubTodoProgress(0);
      setSelectedDetailSubTodoState('01');
      setDetailSubTodoNm('');
      setDetailSubTodoContent('');
      setResMbrSeq(getMbrSeq());

      setDetailSubData({});
    }
    setSubAttachInfo(subAttachInfo);
  };
  const setDetailSub = (subData) => {
    setRegSubYn(false);
    //setSubAttachId(subData.attach_id);
    //subAttachInfo.setAttachId(subData.attach_id);
    subAttachInfo.attachId = subData.attach_id;
    subAttachInfo.attachList = [];
    subAttachInfo.workKey = subData.todo_seq;
    subAttachInfo.addYn = subData.res_mbr_seq == getMbrSeq() ? true : false;
    subAttachInfo.delYn = subData.res_mbr_seq == getMbrSeq() ? true : false;
    setSubAttachInfo(subAttachInfo);
    setSelectedDetailSubTodoGb(subData.todo_gb);
    setDetailSubTodoProgress(subData.todo_progress);
    setSelectedDetailSubTodoState(subData.todo_state);
    setDetailSubTodoNm(subData.todo_nm);
    setDetailSubTodoContent(subData.todo_content);
    setResMbrSeq(subData.res_mbr_seq);

    setDetailSubData(subData);
    getFileListData(subAttachInfo);
    if (subData.todo_seq) {
      let parentData = todo_list.filter((pData) => pData.todo_seq === subData.parent_todo_seq);
      if (parentData && parentData.length > 0) {
        parentData = parentData[0];
      }
      setDetail(parentData, 'callback');
    } else {
      setRegSubYn(true);
    }
  };
  const regSubTodoSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    const formData = new FormData(form); // formData 생성 기준 ID 가 아닌 name 기준임
    const data = Object.fromEntries(formData.entries());
    // disabled 데이터 처리
    data.todoGb = selectedDetailSubTodoGb;
    setRegSubTodoValidated(true);
    console.log(data);
    //setTodoSaveData(data);
    todoSaveData = data;
    console.log(todoSaveData);

    let confirm_msg = ' 하시겠습니까?';
    if (data.todoSeq) {
      confirm_msg = '수정 ' + confirm_msg;
    } else {
      confirm_msg = '등록 ' + confirm_msg;
    }

    setMyModialog('static', '✅확인', confirm_msg, 'No', 'Yes', 'confirm-s');

    event.preventDefault();
    event.stopPropagation();
  };

  // 행별 새로고침 통신 겸용
  function RowTodo(props) {
    let data = props.data;
    return (
      <tr
        key={data.todo_seq}
        onClick={() => {
          if (openRegTodo === false) setOpenRegTodo(true); // 등록 영역 펼치기
          if (openRegSubTodo === false) setOpenRegSubTodo(true); // 등록 Sub 영역 펼치기
          if (data.parent_todo_seq) {
            //if (openRegSubTodo === false) setOpenRegSubTodo(true); // 등록 Sub 영역 펼치기
            setDetailSub(data);
          } else {
            //if (openRegSubTodo === true) setOpenRegSubTodo(false); // 등록 Sub 영역 접기
            setDetail(data);
          }
        }}
      >
        <td className="datatables-empty" style={{ width: '60px' }}>
          {props.no}
        </td>
        <td>
          {data.parent_todo_seq ? (
            <>
              <Icon.ArrowReturnRight /> {data.res_nm}
            </>
          ) : (
            data.todo_gb_nm
          )}
        </td>
        <td>{data.todo_nm}</td>
        <td>{data.todo_state_nm}</td>
        <td style={{ minWidth: '100px' }}>
          {data.parent_todo_seq ? (
            data.todo_progress === 100 ? (
              <Bts.ProgressBar striped variant="success" now={data.todo_progress} label={`${data.todo_progress}%`} />
            ) : (
              <Bts.ProgressBar striped variant="info" now={data.todo_progress} label={`${data.todo_progress}%`} />
            )
          ) : data.todo_progress > 100 ? (
            <>
              <Icon.EmojiDizzy /> {data.todo_progress + '%'}
            </>
          ) : data.todo_progress === 100 ? (
            <>
              <Icon.EmojiHeartEyes /> {data.todo_progress + '%'}
            </>
          ) : (
            <>
              <Icon.EmojiSunglasses /> {data.todo_progress + '%'}
            </>
          )}
        </td>
        <td style={{ minWidth: '100px' }}>{data.parent_todo_seq ? data.res_nm : data.req_nm}</td>
        <td style={{ width: '160px' }}>{data.parent_todo_seq ? data.end_dt : data.reg_dt}</td>
      </tr>
    );
  }
  async function fnTodoSave() {
    let formData = todoSaveData;
    try {
      console.log(formData);

      await axios
        .post(DEV_TODO_URL + '/save', null, {
          params: formData,
          headers: headers,
        })
        .then((resp) => {
          console.log(resp);
          if (resp && resp.data.code && resp.data.code === 'SUCCESS') {
            //setMyModialog('static', '✨알림', resp.data.message, '', 'Ok', 'OK');
            setMyToasts('success', '✨알림', resp.data.returnCnt + ' 건', resp.data.message);
            getDevTodoList(params);
          } else {
            // REQUIRED
            setMyModialog('warning', '🚧경고', resp.data.message, '', 'Ok', '');
          }
        });
    } catch (error) {
      console.log(error);
      //throw error;
    }
  }
  function onClickTodoDelete(todoSeq) {
    //setDelTodoSeq(todoSeq);
    delTodoSeq = todoSeq;
    setMyModialog('static', '✅확인', '삭제 하시겠습니까?', 'No', 'Yes', 'confirm-d');
  }
  async function fnTodoDelete() {
    let formData = { todoSeq: delTodoSeq, mbrSeq: getMbrSeq() };
    console.log(formData);
    try {
      await axios
        .post(DEV_TODO_URL + '/delete', null, {
          params: formData,
          headers: headers,
        })
        .then((resp) => {
          console.log(resp);
          if (resp && resp.data.code && resp.data.code === 'SUCCESS') {
            //setMyModialog('static', '✨알림', resp.data.message, '', 'Ok', 'OK');
            setMyToasts('success', '✨알림', resp.data.returnCnt + ' 건', resp.data.message);
            getDevTodoList(params);
          } else {
            // REQUIRED
            setMyModialog('warning', '🚧경고', resp.data.message, '', 'Ok', '');
          }
        });
    } catch (error) {
      console.log(error);
      //throw error;
    }
  }
  async function getDevTodoList(formData) {
    //if (openSearch === true) setOpenSearch(false); // 검색 영역 접기
    //if (openRegTodo === true) setOpenRegTodo(false); // 등록 영역 접기
    setRegDetail();
    setIsSearchingStart(true);
    //console.log(formData);
    //console.log(headers);
    try {
      await axios
        .post(DEV_TODO_URL + '/list', null, {
          params: formData,
          headers: headers,
        })
        .then((resp) => {
          if (resp && resp.data) setTodoList(resp.data);
        });
    } catch (error) {
      //console.log('[TodoList.js] useEffect() error :<');
      console.log(error);
      //throw error;
    }
  }
  // Modal.Dialog 관련
  const setMyModialog = (v_backdrop, v_modialogTitle, v_modialogBody, v_btnNm1, v_btnNm2, v_callbackCd) => {
    props.myModialogInfo.backdrop = v_backdrop;
    props.myModialogInfo.modialogTitle = v_modialogTitle;
    props.myModialogInfo.modialogBody = v_modialogBody;
    props.myModialogInfo.btnNm1 = v_btnNm1;
    props.myModialogInfo.btnNm2 = v_btnNm2;
    props.myModialogInfo.callbackFn2 = MyModialogCallbackFn;
    props.myModialogInfo.callbackCd = v_callbackCd;

    props.myModialogInfo.modialogShow = true;
    props.myModialogInfo.setModialogShow(true);
    props.setMyModialogInfo(props.myModialogInfo);
  };
  const MyModialogCallbackFn = (callbackCd) => {
    if ('OK' === callbackCd) {
      getDevTodoList(params);
    } else if ('confirm-s' === callbackCd) {
      fnTodoSave();
    } else if ('confirm-d' === callbackCd) {
      fnTodoDelete();
    }
  };
  // Modal.Dialog 관련

  useEffect(() => {
    //getDevTodoList();

    if (isCodeData) {
      setDevTodoGbCdlList(getCodDtlList('DEV-TODO-GB'));
      setDevTodoStsCdlList(getCodDtlList('DEV-TODO-STS'));
    }
    if (compressParams) {
      // 파람이 온 경우 : UI 세팅 후 서버 통신
      // 파람 값 압축 해제 : 더 짧게 압축 할 방법이 있다면 변경 적용
      var req_params = lzutf8.decompress(compressParams, { inputEncoding: 'Base64' });
      var req_json = JSON.parse(req_params);
      setParams(req_json);
      //console.log(req_json);
      // UI 세팅
      // type="text" : defaultValue 로 세팅
      // [Form.Check type="checkbox", Form.Check type="radio"] : defaultChecked 로 세팅 // 검증 필요
      // Form.Select 세팅
      setSelectedTodoGb(req_json.searchTodoGb);
      setSelectedTodoState(req_json.searchTodoState);
      setSelectedCondition(req_json.searchCondition);
      setSearchRegDtFrom(req_json.searchRegDtFrom);
      setSearchRegDtTo(req_json.searchRegDtTo);

      // 서버 통신
      getDevTodoList(req_json);
      //const getDevTodoList = async (formData) => {
    }
  }, [compressParams, getCodDtlList, isCodeData]);

  return (
    <div style={{ margin: '5px' }} className="row">
      <div aria-live="polite" aria-atomic="true" className="bg-dark position-relative" style={{ minHeight: '0px', margin: '5px' }}>
        <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
          {MyToast(MyToast_show, MyToast_variant, MyToast_title, MyToast_small, MyToast_msg, setMyToastShow, MyToast_delay)}
        </ToastContainer>
      </div>
      <Bts.Form noValidate validated={searchValidated} onSubmit={searchSubmit} id="searchForm">
        {/* 세세한 UI 정렬 등은 추후 익숙 해지면 정리 하는 걸로... */}
        <Bts.Container fluid className="square border">
          <Bts.Row className="m-3">
            <Bts.Col md="12">
              <Bts.Collapse in={openSearch} className="hstack">
                <div id="collapseSearchGroup">
                  <Bts.Form.Group as={Bts.Col} md="3" className="hstack" controlId="searchTodoGb">
                    <Bts.Form.Label style={{ width: '-webkit-fill-available' }}>Todo 구분</Bts.Form.Label>
                    <Bts.Form.Select aria-label="Todo 구분" name="searchTodoGb" onChange={onChangeSelectTodoGb} value={selectedTodoGb}>
                      <option value={''}>전체</option>
                      {devTodoGbCdlList.map((code, i) => {
                        return (
                          <option key={code.codeDetailSeq} value={code.codeCd}>
                            {code.codeNm}
                          </option>
                        );
                      })}
                    </Bts.Form.Select>
                  </Bts.Form.Group>
                  <Bts.Col md="1" className="hstack">
                    <Bts.Form.Label style={{ width: '-webkit-fill-available' }}>&nbsp;&nbsp;&nbsp;&nbsp;발생일</Bts.Form.Label>
                  </Bts.Col>
                  <Bts.Col md="4" className="hstack myContainer">
                    {/* @ts-ignore*/}
                    <DatePicker showMonthDropdown showYearDropdown dropdownMode="scroll" locale={ko} className="myDatePicker" showIcon selected={searchRegDtFrom} onChange={(date) => onChangeSearchRegDtFrom(date)} dateFormat="yyyy-MM-dd" dateFormatCalendar="yyyy년 MM월" isClearable placeholderText="검색 시작 일자" selectsStart startDate={searchRegDtFrom} endDate={searchRegDtTo} maxDate={searchRegDtTo} />
                    {/* From To 사이에 범위 침범 할수 있는 todayButton="today" 제거 오류 발생 원인*/}
                    <> ~ </>
                    {/* @ts-ignore*/}
                    <DatePicker showMonthDropdown showYearDropdown dropdownMode="scroll" locale={ko} className="myDatePicker" showIcon selected={searchRegDtTo} onChange={(date) => onChangeSearchRegDtTo(date)} dateFormat="yyyy-MM-dd" dateFormatCalendar="yyyy년 MM월" isClearable placeholderText="검색 종료 일자" selectsEnd startDate={searchRegDtFrom} endDate={searchRegDtTo} minDate={searchRegDtFrom} />
                  </Bts.Col>
                  <Bts.Form.Group as={Bts.Col} md="4" className="hstack" controlId="searchTodoState">
                    <Bts.Form.Label style={{ width: '-webkit-fill-available' }}>&nbsp;&nbsp;&nbsp;&nbsp;Todo 상태</Bts.Form.Label>
                    <Bts.Form.Select aria-label="Todo 상태" name="searchTodoState" onChange={onChangeSelectTodoState} value={selectedTodoState}>
                      <option value={''}>전체</option>
                      {devTodoStsCdlList.map((code, i) => {
                        return (
                          <option key={code.codeDetailSeq} value={code.codeCd}>
                            {code.codeNm}
                          </option>
                        );
                      })}
                    </Bts.Form.Select>
                  </Bts.Form.Group>
                </div>
              </Bts.Collapse>
            </Bts.Col>
          </Bts.Row>
          <Bts.Row className="m-1">
            <Bts.Form.Group as={Bts.Col} md="2" className="hstack" controlId="searchCondition">
              <Bts.Form.Select aria-label="키워드 조건" name="searchCondition" onChange={onChangeSelectCondition} value={selectedCondition}>
                <option value={''}>전체</option>
                <option value={'1'}>제목</option>
                <option value={'2'}>내용</option>
                <option value={'3'}>등록자</option>
              </Bts.Form.Select>
            </Bts.Form.Group>
            <Bts.Form.Group as={Bts.Col} md="10" className="hstack" controlId="searchKeyword">
              <Bts.Form.Control type="text" name="searchKeyword" placeholder="검색키워드" defaultValue={params.searchKeyword} />
            </Bts.Form.Group>
          </Bts.Row>
          <Bts.Row className="m-3">
            <Bts.Col md="9" className="hstack" style={{ justifyContent: 'center' }}>
              <Bts.Button type="submit">검색</Bts.Button>
            </Bts.Col>
            <Bts.Col md="3" className="hstack" style={{ justifyContent: 'right' }}>
              <Bts.ButtonGroup className="me-2">
                <Bts.Button onClick={() => setOpenSearch(!openSearch)} aria-controls="collapseSearchGroup" aria-expanded={openSearch} variant="info">
                  {openSearch ? (
                    <>
                      <Icon.ArrowUp /> 접기
                    </>
                  ) : (
                    <>
                      <Icon.ArrowDown /> 펼침
                    </>
                  )}
                </Bts.Button>
              </Bts.ButtonGroup>
              <Bts.ButtonGroup>
                <Bts.Button
                  onClick={() => {
                    setRegDetail(); // 등록 접근 입력폼 초기화
                    setOpenRegTodo(!openRegTodo);
                    if (openRegSubTodo === true) setOpenRegSubTodo(false); // 등록 Sub 영역 접기
                  }}
                  aria-controls="collapseSearchGroup"
                  aria-expanded={openRegTodo}
                  variant="info"
                >
                  {openRegTodo ? (
                    <>
                      <Icon.ArrowUp /> 등록 접기
                    </>
                  ) : (
                    <>
                      <Icon.ArrowDown /> 등록 펼침
                    </>
                  )}
                </Bts.Button>
              </Bts.ButtonGroup>
            </Bts.Col>
          </Bts.Row>
        </Bts.Container>
      </Bts.Form>
      <Bts.Collapse in={openRegTodo} className="">
        <Bts.Container fluid className="square border">
          <Bts.Form validated={regTodoValidated} onSubmit={regTodoSubmit} id="regTodoForm">
            <Bts.Form.Control type="hidden" name="todoSeq" defaultValue={detailData.todo_seq} />
            <Bts.Form.Control type="hidden" name="parentTodoSeq" defaultValue={detailData.parent_todo_seq} />
            <Bts.Form.Control type="hidden" name="attachId" defaultValue={attachInfo.attachId} />
            <Bts.Form.Control type="hidden" name="reqMbrSeq" defaultValue={reqMbrSeq} />
            <Bts.Row className="m-1">
              <Bts.Form.Group as={Bts.Col} md="3" className="hstack" controlId="todoGb">
                <Bts.Form.Label style={{ minWidth: '110px' }}>구분 *</Bts.Form.Label>
                <Bts.Form.Select aria-label="Todo 구분" name="todoGb" onChange={onChangeSelectDetailTodoGb} value={selectedDetailTodoGb} required>
                  <option value={''}>선택</option>
                  {devTodoGbCdlList.map((code, i) => {
                    return (
                      <option key={code.codeDetailSeq} value={code.codeCd}>
                        {code.codeNm}
                      </option>
                    );
                  })}
                </Bts.Form.Select>
              </Bts.Form.Group>
              <Bts.Form.Group as={Bts.Col} md="6" className="hstack"></Bts.Form.Group>
              <Bts.Form.Group as={Bts.Col} md="3" className="hstack" controlId="todoState">
                <Bts.Form.Label style={{ minWidth: '110px' }}>상태 *</Bts.Form.Label>
                <Bts.Form.Select aria-label="Todo 상태" name="todoState" onChange={onChangeSelectDetailTodoState} value={selectedDetailTodoState} required>
                  {devTodoStsCdlList
                    .filter((code) => code.codeCd === '01')
                    .map((code, i) => {
                      return (
                        <option key={code.codeDetailSeq} value={code.codeCd}>
                          {code.codeNm}
                        </option>
                      );
                    })}
                </Bts.Form.Select>
              </Bts.Form.Group>
            </Bts.Row>
            <Bts.Row className="m-1">
              <Bts.Form.Group as={Bts.Col} md="12" className="hstack" controlId="todoNm">
                <Bts.Form.Label style={{ minWidth: '110px' }}>제목 *</Bts.Form.Label>
                {/* 
                개 씨발 졸라 그지 같네... 
                defaultValue={detailTodoNm} 로 세팅 하면 한번 후정 하고 나면 다음 데이터 세팅 변경 불가...
                value={detailTodoNm} 로 세팅 하면 화면 로드 할때 https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable 어설픈 가이드 발생...
                결국 해결 법은....value={detailTodoNm ? detailTodoNm : ''}
                */}
                <Bts.Form.Control type="text" name="todoNm" placeholder="제목을 입력하세요." onChange={onChangeDetailTodoNm} value={detailTodoNm ? detailTodoNm : ''} required />
              </Bts.Form.Group>
            </Bts.Row>
            <Bts.Row className="m-1">
              <Bts.Form.Group as={Bts.Col} md="12" className="hstack" controlId="todoContent">
                <Bts.Form.Label style={{ minWidth: '110px' }}>내용</Bts.Form.Label>
                <Bts.Form.Control as="textarea" rows={3} name="todoContent" placeholder="내용을 입력하세요." onChange={onChangeDetailTodoContent} value={detailTodoContent} />
              </Bts.Form.Group>
            </Bts.Row>
          </Bts.Form>
          {/* Form 외부에 배치 type="submit" 버튼은 form="regTodoForm" 로 외부에서 처리 */}
          <Bts.Row className="m-1" style={{ paddingBottom: '20px' }}>
            <Bts.Form.Group as={Bts.Col} md="12">
              {initFileForm(attachInfo)}
            </Bts.Form.Group>
          </Bts.Row>
          <Bts.Row className="m-1">
            <Bts.Col as={Bts.Col} md="2" className="hstack" style={{ justifyContent: 'left' }}>
              <Bts.Button className="btn-danger" style={{ display: regYn ? 'none' : 'block' }} type="button" onClick={() => onClickTodoDelete(detailData.todo_seq)}>
                삭제
              </Bts.Button>
            </Bts.Col>
            <Bts.Col as={Bts.Col} md="8" className="hstack" style={{ justifyContent: 'center' }}>
              <Bts.Button className="btn-success" type="submit" form="regTodoForm">
                {regYn ? '등록' : '수정'}
              </Bts.Button>
            </Bts.Col>

            <Bts.Col as={Bts.Col} md="2" className="hstack" style={{ justifyContent: 'right' }}>
              <Bts.Button type="button" onClick={() => setRegDetail()}>
                신규 작성
              </Bts.Button>
            </Bts.Col>
          </Bts.Row>
        </Bts.Container>
      </Bts.Collapse>
      <Bts.Collapse in={openRegSubTodo} className="">
        <Bts.Container fluid className="square border">
          <Bts.Form validated={regSubTodoValidated} onSubmit={regSubTodoSubmit} id="regSubTodoForm">
            <Bts.Form.Control type="hidden" name="todoSeq" defaultValue={detailSubData.todo_seq} />
            <Bts.Form.Control type="hidden" name="parentTodoSeq" defaultValue={detailSubData.parent_todo_seq} />
            <Bts.Form.Control type="hidden" name="attachId" defaultValue={subAttachInfo.attachId} />
            <Bts.Form.Control type="hidden" name="reqMbrSeq" defaultValue={reqMbrSeq} />
            <Bts.Form.Control type="hidden" name="resMbrSeq" defaultValue={resMbrSeq} />
            <Bts.Row className="m-1">
              <Bts.Form.Group as={Bts.Col} md="3" className="hstack" controlId="sbuTodoGb">
                <Bts.Form.Label style={{ minWidth: '110px' }}>구분 *</Bts.Form.Label>
                <Bts.Form.Select aria-label="Todo 구분" name="todoGb" onChange={onChangeSelectDetailSubTodoGb} value={selectedDetailSubTodoGb} disabled>
                  <option value={''}>선택</option>
                  {devTodoGbCdlList.map((code, i) => {
                    return (
                      <option key={code.codeDetailSeq} value={code.codeCd}>
                        {code.codeNm}
                      </option>
                    );
                  })}
                </Bts.Form.Select>
              </Bts.Form.Group>
              <Bts.Col md="6">
                <Bts.Row className="m-1">
                  <Bts.Form.Group as={Bts.Col} md="12" className="hstack" controlId="subTodoProgress">
                    <Bts.Form.Label style={{ minWidth: '110px' }}>진척도(설정)</Bts.Form.Label>
                    0% <Bts.Form.Range name="todoProgress" onChange={onChangeDetailSubTodoProgress} value={detailSubTodoProgress} /> 100%
                  </Bts.Form.Group>
                </Bts.Row>
                <Bts.Row className="m-1">
                  <Bts.Form.Group as={Bts.Col} md="12" className="hstack" controlId="subTodoProgressRs">
                    <Bts.Form.Label style={{ minWidth: '110px' }}>진척도(결과)</Bts.Form.Label>
                    0% <Bts.ProgressBar now={detailSubTodoProgress} label={`${detailSubTodoProgress}%`} style={{ width: '100%' }} /> 100%
                  </Bts.Form.Group>
                </Bts.Row>
              </Bts.Col>
              <Bts.Form.Group as={Bts.Col} md="3" className="hstack" controlId="subTodoState">
                <Bts.Form.Label style={{ minWidth: '110px' }}>상태 *</Bts.Form.Label>
                <Bts.Form.Select aria-label="Todo 상태" name="todoState" onChange={onChangeSelectDetailSubTodoState} value={selectedDetailSubTodoState} required>
                  <option value={''}>선택</option>
                  {devTodoStsCdlList
                    .filter((code) => code.codeCd !== '01')
                    .map((code, i) => {
                      return (
                        <option key={code.codeDetailSeq} value={code.codeCd}>
                          {code.codeNm}
                        </option>
                      );
                    })}
                </Bts.Form.Select>
              </Bts.Form.Group>
            </Bts.Row>
            <Bts.Row className="m-1">
              <Bts.Form.Group as={Bts.Col} md="12" className="hstack" controlId="sbuTodoNm">
                <Bts.Form.Label style={{ minWidth: '110px' }}>제목 *</Bts.Form.Label>
                {/* 
                개 씨발 졸라 그지 같네... 
                defaultValue={detailSubTodoNm} 로 세팅 하면 한번 후정 하고 나면 다음 데이터 세팅 변경 불가...
                value={detailSubTodoNm} 로 세팅 하면 화면 로드 할때 https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable 어설픈 가이드 발생...
                결국 해결 법은....value={detailSubTodoNm ? detailSubTodoNm : ''}
                */}
                <Bts.Form.Control type="text" name="todoNm" placeholder="제목을 입력하세요." onChange={onChangeDetailSubTodoNm} value={detailSubTodoNm ? detailSubTodoNm : ''} required />
              </Bts.Form.Group>
            </Bts.Row>
            <Bts.Row className="m-1">
              <Bts.Form.Group as={Bts.Col} md="12" className="hstack" controlId="sbuTodoContent">
                <Bts.Form.Label style={{ minWidth: '110px' }}>내용</Bts.Form.Label>
                <Bts.Form.Control as="textarea" rows={3} name="todoContent" placeholder="내용을 입력하세요." onChange={onChangeDetailSubTodoContent} value={detailSubTodoContent} />
              </Bts.Form.Group>
            </Bts.Row>
          </Bts.Form>
          {/* Form 외부에 배치 type="submit" 버튼은 form="regSubTodoForm" 로 외부에서 처리 */}
          <Bts.Row className="m-1" style={{ paddingBottom: '20px' }}>
            <Bts.Form.Group as={Bts.Col} md="12">
              {initFileForm(subAttachInfo)}
            </Bts.Form.Group>
          </Bts.Row>
          <Bts.Row className="m-1">
            <Bts.Col as={Bts.Col} md="2" className="hstack" style={{ justifyContent: 'left' }}>
              <Bts.Button className="btn-danger" style={{ display: regSubYn ? 'none' : 'block' }} type="button" onClick={() => onClickTodoDelete(detailSubData.todo_seq)}>
                삭제
              </Bts.Button>
            </Bts.Col>
            <Bts.Col as={Bts.Col} md="8" className="hstack" style={{ justifyContent: 'center' }}>
              <Bts.Button className="btn-success" type="submit" form="regSubTodoForm">
                {regSubYn ? '등록' : '수정'}
              </Bts.Button>
            </Bts.Col>

            <Bts.Col as={Bts.Col} md="2" className="hstack" style={{ justifyContent: 'right' }}>
              <Bts.Button type="button" onClick={() => setRegDetailSub()}>
                신규 작성
              </Bts.Button>
            </Bts.Col>
          </Bts.Row>
        </Bts.Container>
      </Bts.Collapse>

      {isSearchingStart ? (
        <Bts.Table striped bordered hover variant="secondary">
          <thead>
            <tr style={{ textAlign: 'center' }}>
              <th className="bg-gray-400">순번</th>
              <th className="bg-gray-400">구분</th>
              <th className="bg-gray-400">제목</th>
              <th className="bg-gray-400">상태</th>
              <th className="bg-gray-400">진척도</th>
              <th className="bg-gray-400">이름</th>
              <th className="bg-gray-400">일자</th>
            </tr>
          </thead>
          <tbody>
            {todo_list.map((data, i) => (
              <RowTodo key={data.todo_seq} data={data} no={i + 1} />
            ))}
          </tbody>
        </Bts.Table>
      ) : null}
    </div>
  );
}

export default TodoList;
