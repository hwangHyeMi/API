import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

function MyAlert(v_show, v_variant, v_heading, v_msg, v_setAlertShow, v_setMaskShow, v_callbackFn, v_callbackCd) {
  //console.log(v_show);
  //const [show, setShow] = useState(v_show);
  //console.log(show);
  //console.log(v_callbackFn);
  //'primary','secondary','success','danger','warning','info','light','dark'
  if (!v_variant) v_variant = 'info';
  if (!v_heading) v_heading = '';
  if (!v_msg) v_msg = '';
  return (
    <div className="myAlert">
      <Alert show={v_show} variant={v_variant}>
        <div style={{}}>
          <Alert.Heading>{v_heading}</Alert.Heading>
          <p style={{whiteSpace: 'pre-wrap'}}>{v_msg}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button
              onClick={() => {
                v_setAlertShow(false);
                v_setMaskShow(false);
                v_callbackFn(v_callbackCd);
              }}
              variant={'outline-' + v_variant}
            >
              Close
            </Button>
          </div>
        </div>
      </Alert>
    </div>
  );
}
export default MyAlert;
