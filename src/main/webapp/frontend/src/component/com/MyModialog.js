import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function MyModialog(v_modialogShow, v_backdrop, v_modialogTitle, v_modialogBody, v_setModialogShow, v_btnNm1, v_btnNm2, v_callbackFn1, v_callbackFn2, v_callbackCd, v_setMyModialogClose) {
  if (!v_backdrop) v_backdrop = '';
  if (!v_modialogTitle) v_modialogTitle = '';
  if (!v_modialogBody) v_modialogBody = '';
  if (!v_btnNm1 && !v_btnNm2) v_btnNm1 = 'Close';
  if (!v_btnNm2) v_btnNm2 = '';
  if (!v_callbackCd) v_callbackCd = '';
  return (
    <>
      <Modal
        show={v_modialogShow}
        onHide={() => {
          v_setMyModialogClose();
        }}
        backdrop={v_backdrop !== '' ? v_backdrop : true}
        keyboard={v_backdrop !== '' ? true : false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{v_modialogTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ whiteSpace: 'pre-wrap' }}>{v_modialogBody}</Modal.Body>
        <Modal.Footer>
          {v_btnNm1 !== '' ? (
            <Button
              variant="secondary"
              onClick={() => {
                v_setMyModialogClose();
                if (v_callbackFn1) v_callbackFn1(v_callbackCd);
              }}
            >
              {v_btnNm1}
            </Button>
          ) : (
            ''
          )}
          {v_btnNm2 !== '' ? (
            <Button
              variant="primary"
              onClick={() => {
                v_setMyModialogClose();
                if (v_callbackFn2) v_callbackFn2(v_callbackCd);
              }}
            >
              {v_btnNm2}
            </Button>
          ) : (
            ''
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default MyModialog;
