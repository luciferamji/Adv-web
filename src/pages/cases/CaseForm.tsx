import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import { Save, ArrowLeft } from 'lucide-react';
import { createCase, getCase, updateCase } from '../../services/caseService';
import Loading from '../../components/common/Loading';

interface CaseFormData {
  title: string;
  caseNumber: string;
  clientName: string;
  courtName: string;
  status: 'OPEN' | 'CLOSED' | 'PENDING';
  description: string;
  nextHearing?: string;
}

const initialFormData: CaseFormData = {
  title: '',
  caseNumber: '',
  clientName: '',
  courtName: '',
  status: 'OPEN',
  description: '',
  nextHearing: ''
};

export default function CaseForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState<CaseFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCase = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getCase(id);
        setFormData(data);
      } catch (err) {
        setError('Failed to load case details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCase();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      if (id) {
        await updateCase(id, formData);
      } else {
        await createCase(formData);
      }
      navigate('/cases');
    } catch (err) {
      setError('Failed to save case');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {id ? 'Edit Case' : 'New Case'}
        </Typography>
        <Button
          onClick={() => navigate('/cases')}
          startIcon={<ArrowLeft size={20} />}
        >
          Back to Cases
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="title"
              label="Case Title"
              value={formData.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="caseNumber"
              label="Case Number"
              value={formData.caseNumber}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="clientName"
              label="Client Name"
              value={formData.clientName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="courtName"
              label="Court Name"
              value={formData.courtName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="OPEN">Open</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="CLOSED">Closed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="datetime-local"
              name="nextHearing"
              label="Next Hearing Date"
              value={formData.nextHearing}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="description"
              label="Case Description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save size={20} />}
            disabled={loading}
          >
            {id ? 'Update Case' : 'Create Case'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}