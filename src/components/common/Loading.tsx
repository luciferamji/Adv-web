import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { GavelIcon } from 'lucide-react';

const Loading = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <GavelIcon size={64} color="#1A237E" strokeWidth={1.5} />
      <Typography
        variant="h4"
        sx={{ 
          fontWeight: 600, 
          mt: 2, 
          mb: 4,
          color: 'primary.main'
        }}
      >
        Advocate Pro
      </Typography>
      <CircularProgress color="primary" />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Loading...
      </Typography>
    </Box>
  );
};

export default Loading;