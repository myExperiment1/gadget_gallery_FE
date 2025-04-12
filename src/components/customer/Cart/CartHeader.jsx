import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { deleteFromCart } from '../../../states/cart/action';
import { ConfirmationModal } from '../../ConfirmationModal';
import { setAlertActionCreator } from '../../../states/alert/action';
import { setCheckAllItems } from './setCheckAllItems';

function CartHeader() {
  const dispatch = useDispatch();
  const [show, setShow] = useState('');
  const cart = useSelector((state) => state.cart);
  const userSelector = useSelector((state) => state.authUser);

  const toggleCheck = async (e) => {
    const statusChecked = e.target.checked;
    const temp = [];
    const checkBoxes = document.getElementsByName('cart-item-checkboxes');
    setCheckAllItems(
      cart,
      statusChecked,
      dispatch,
      checkBoxes,
      temp,
      userSelector?.id
    );
  };

  const resetCart = async () => {
    try {
      await dispatch(
        deleteFromCart(
          cart,
          cart.map((val) => val.productId),
          userSelector?.id
        )
      );
      setShow('');
    } catch (error) {
      dispatch(
        setAlertActionCreator({
          val: { status: 'error', message: error?.message },
        })
      );
    }
  };

  return (
    <>
      <div className="fw-bold">YOUR CART</div>
      {cart.length ? (
        <div className="d-flex justify-content-between w-100">
          <label htmlFor="check-all-products">
            <input
              type="checkbox"
              id="check-all-products"
              onChange={toggleCheck}
              style={{ marginRight: '8px' }}
            />
            Select All
          </label>
          <span
            type="button"
            style={{ color: '#009BD2' }}
            onClick={() => setShow('RESET_CART')}
          >
            Delete All
          </span>
        </div>
      ) : null}
      <ConfirmationModal
        action={resetCart}
        actionName="DELETE ALL ITEMS FROM CART"
        show={show}
        setShow={setShow}
      />
    </>
  );
}

export { CartHeader };
