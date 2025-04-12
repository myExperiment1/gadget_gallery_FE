import { setAlertActionCreator } from '../../../states/alert/action';

export const checkCartLength = (cart, directBuyItem, dispatch, nav) =>
  setTimeout(() => {
    if (!cart.length && !directBuyItem?.quantity) {
      setTimeout(() => {
        nav(`/cart`);
        dispatch(
          setAlertActionCreator({
            val: {
              status: 'error',
              message: 'It seems like there is no item here',
            },
          })
        );
      }, 500);
    }
  }, 750);
