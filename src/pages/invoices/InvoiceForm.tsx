import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const InvoiceForm = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {/* Title will be dynamic based on whether we're creating or editing */}
          Create Invoice
        </Typography>
        {/* Invoice form implementation will go here */}
      </Box>
    </Container>
  );
};

export default InvoiceForm;