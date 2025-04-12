import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { useEffect, useState } from 'react';
import { ListAddress } from './ListAddress';

export function BoxAddresses({
  address = {},
  addresses = [],
  setAddress,
  setAddresses,
  handleClose,
  setAddressToEdit,
  setOpen,
  setShippingMethod,
  open,
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleListItemClick = (event, index, destination) => {
    setSelectedIndex(index);
    setAddress(destination);
    setShippingMethod({});
    handleClose();
  };

  useEffect(() => {
    setSelectedIndex(addresses.findIndex((dest) => dest.isDefault));
  }, []);
  useEffect(() => {
    setSelectedIndex(addresses.findIndex((dest) => dest.id === address.id));
  }, [address]);
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <List component="nav" aria-label="main address list">
        {addresses.map((destination, index) => (
          <ListAddress
            destination={destination}
            index={index}
            selectedIndex={selectedIndex}
            handleListItemClick={handleListItemClick}
            setAddressToEdit={setAddressToEdit}
            setOpen={setOpen}
            key={destination?.id}
            addresses={addresses}
            setAddresses={setAddresses}
            open={open}
          />
        ))}
      </List>
    </Box>
  );
}
