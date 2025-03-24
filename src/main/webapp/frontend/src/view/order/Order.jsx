import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContextStore } from 'store/ContextStore';
import { deliveryFee } from '../cart/Cart';
import './Order.css';

const Order = () => {
  const { getTotalCartAmount } = useContext(ContextStore);
  const navigate = useNavigate();
  return (
    <>
      <form className="place-order">
        <div className="place-order-left">
          <h2 className="title">Delivery Information</h2>
          <div className="multi-fields">
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
          </div>
          <input type="email" placeholder="Email Address" />
          <input type="text" placeholder="Street" />
          <div className="multi-fields">
            <input type="text" placeholder="City" />
            <input type="text" placeholder="State" />
          </div>
          <div className="multi-fields">
            <input type="number" placeholder="Zip Code" />
            <input type="text" placeholder="Country" />
          </div>
          <input type="number" placeholder="Phone" />
        </div>
        <div className="place-order-right">
          <div className="cart-total">
            <h2 className="title">Cart Total</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>{getTotalCartAmount().toLocaleString('ko-KR')}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Free</p>
                <p>{getTotalCartAmount() === 0 ? 0 : deliveryFee.toLocaleString('ko-KR')}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>{getTotalCartAmount() === 0 ? 0 : (getTotalCartAmount() + deliveryFee).toLocaleString('ko-KR')}</b>
              </div>
            </div>
            <div>
              <button disabled={getTotalCartAmount() === 0}>Payment</button> &nbsp;&nbsp;
              <button onClick={() => navigate('/cart')}>Cancle</button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Order;
