import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';

export function Products({ data }) {
  const imageId = data?.Product?.ProductImages[0].id;
  return (
    <Stack gap={1} borderTop="4px solid gainsboro" pb={1} pt={2}>
      <Typography>
        <b>Products</b>
      </Typography>
      <Stack>
        <Card>
          <CardContent>
            <Grid container className="w-100">
              <Grid
                container
                className="w-100 flex-row justify-content-between"
              >
                <Grid item flexGrow={1}>
                  <Stack
                    direction="row"
                    gap={1}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <img
                      src={`${
                        import.meta.env.VITE_API_BASE_URL
                      }/products/images/${imageId}`}
                      alt="product"
                      width="100px"
                    />
                    <div>
                      <Typography color="primary.main">
                        {/* <Link
                          href={`/products/${product?.productId}`}
                          className="text-decoration-none"
                        > */}
                        {data?.Product?.name}
                        {/* </Link> */}
                      </Typography>
                      <Typography>Quantity: {data?.quantity}</Typography>
                    </div>
                  </Stack>
                </Grid>
                <Grid item sm="auto" xs={12} alignItems="center">
                  <Typography
                    className="text-end"
                    flexShrink={1}
                    display={
                      window.location.pathname === '/admin/transactions'
                        ? 'block'
                        : 'none'
                    }
                  >
                    <b
                      className={
                        // product?.stock > product?.quantity
                        /* ? */ 'text-success'
                        //   : 'text-danger'
                      }
                    >
                      {/* Stock: {product?.stock} */} stock
                    </b>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  );
}
