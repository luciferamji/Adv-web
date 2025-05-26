import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { ArrowLeft, Save } from 'lucide-react';
import clientService from '../../services/clientService';

interface ClientFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function ClientForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  
  const [formValues, setFormValues] = useState<ClientFormValues>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchClient = async () => {
      if (!isEditMode) return;
      
      try {
        setIsLoading(true);
        const client = await clientService.getClientById(id!);
        
        if (client) {
          setFormValues({
            name: client.name,
            email: client.email,
            phone: client.phone,
            address: client.address,
          });
        } else {
          setError('Client not found');
        }
      } catch (error) {
        setError('Failed to load client data');
        console.error('Error fetching client:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClient();
  }, [id, isEditMode]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      setIsSaving(true);
      
      if (isEditMode) {
        await clientService.updateClient(id!, formValues);
        setSuccess('Client updated successfully');
      } else {
        await clientService.createClient(formValues);
        setSuccess('Client created successfully');
        
        // Reset form after successful creation
        if (!isEditMode) {
          setFormValues({
            name: '',
            email: '',
            phone: '',
            address: '',
          });
        }
      }
      
      // Navigate back after a short delay to show success message
      setTimeout(() => {
        navigate('/clients');
      }, 1500);
    } catch (error) {
      setError('Failed to save client data');
      console.error('Error saving client:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        mb: 3 
      }}>
        <Box>
          <Button
            variant="text"
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate('/clients')}
            sx={{ mb: 1, pl: 0 }}
          >
            Back to Clients
          </Button>
          <Typography variant="h4" component="h1">
            {isEditMode ? 'Edit Client' : 'New Client'}
          </Typography>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  autoFocus
                  autoComplete="name"
                  inputProps={{
                    maxLength: 100
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                  autoComplete="email"
                  inputProps={{
                    maxLength: 100
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formValues.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  inputProps={{
                    maxLength: 20
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  multiline
                  rows={3}
                  value={formValues.address}
                  onChange={handleChange}
                  autoComplete="street-address"
                  inputProps={{
                    maxLength: 500
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'flex-end'
                }}>
                  <Button
                    fullWidth={false}
                    variant="outlined"
                    onClick={() => navigate('/clients')}
                    sx={{ flex: { xs: '1', sm: '0 0 auto' } }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    fullWidth={false}
                    variant="contained"
                    startIcon={<Save size={20} />}
                    disabled={isSaving}
                    sx={{ flex: { xs: '1', sm: '0 0 auto' } }}
                  >
                    {isSaving ? 'Saving...' : (isEditMode ? 'Update Client' : 'Create Client')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Box>
  );
}