import Toast from 'react-bootstrap/Toast';
import * as Icon from 'react-bootstrap-icons';

function MyToast(v_show, v_variant, v_title, v_small, v_msg, v_setToastShow, v_delay) {
  //const [show, setShow] = useState(false);
  //'primary','secondary','success','danger','warning','info','light','dark'
  if (!v_variant) v_variant = 'info';
  if (!v_title) v_title = '';
  if (!v_small) v_small = '';
  if (!v_msg) v_msg = '';
  if (!v_delay) v_delay = 3;
  v_delay = v_delay * 1000;
  return (
    <Toast onClose={() => v_setToastShow(false)} show={v_show} delay={v_delay} autohide bg={v_variant.toLowerCase()}>
      <Toast.Header>
        <div style={{ paddingRight: '2px' }}>
          <Icon.BellFill />
        </div>
        <strong className="me-auto">{v_title}</strong>
        <small>{v_small}</small>
      </Toast.Header>
      <Toast.Body className={v_variant.toLowerCase() === 'dark' && 'text-white'}>{v_msg}</Toast.Body>
    </Toast>
  );
}

export default MyToast;
