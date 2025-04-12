import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { PaymentHeader } from '../../components/customer/OrderPayment/PaymentHeader';
import { PaymentBody } from '../../components/customer/OrderPayment/PaymentBody';
import api from '../../constants/api';
import { SeeOrderProducts } from '../../components/customer/OrderPayment/SeeOrderProducts';

export function Payment() {
  const directTransactionData = useLocation().state;
  const userSelector = useSelector((state) => state.authUser);
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState({});
  const fetchOrder = async () => {
    const { data } = await api.get(`/order/${userSelector?.id}/${orderId}`);
    setOrderData(data);
  };

  useEffect(() => {
    if (directTransactionData) setOrderData(directTransactionData);
    else if (userSelector?.id) fetchOrder();
  }, [userSelector]);
  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <PaymentHeader orderData={orderData} />
        <PaymentBody orderData={orderData} setOrderData={setOrderData} />
        <SeeOrderProducts orderData={orderData} />
      </Box>
    </Container>
  );
}
