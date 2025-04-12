import { Card, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CartItemLine } from './CartItemLine';

export function CartShowUp({ showCart, setShowCart }) {
  const cart = useSelector((state) => state.cart);

  return (
    <Card
      className={
        showCart ? 'd-none d-md-block position-absolute bg-white p-1' : 'd-none'
      }
      onMouseEnter={() => setShowCart(true)}
      onMouseLeave={() => setShowCart(false)}
      style={{
        width: '400px',
        left: '50%',
        transform: 'translate(-50%,0)',
        zIndex: 2,
        maxHeight: `400px`,
      }}
    >
      <Row className="m-0 p-2">
        <Link to="/cart" className="text-decoration-none text-secondary w-100">
          {cart.length === 0 ? (
            <span className="text-center">Phew, Your cart is empty</span>
          ) : (
            `Your Cart (${cart.length})`
          )}
        </Link>
      </Row>
      {cart.map((item) => (
        <CartItemLine item={item} key={item.productId} />
      ))}
    </Card>
  );
}
