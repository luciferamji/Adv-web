import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const InvoiceList = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Invoices
        </Typography>
        {/* Invoice list implementation will go here */}
      </Box>
    </Container>
  );
};

export default InvoiceList;