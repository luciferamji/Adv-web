import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  Award,
  Calendar,
  Briefcase,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import advocateService from '../../services/advocateService';
import { getCases } from '../../services/caseService';
import type { Case } from '../cases/CaseList';

interface Advocate {
  id: string;
  name: string;
  email: string;
  phone: string;
  barNumber: string;
  specialization?: string;
  status: 'active' | 'inactive';
  joinDate: string;
  caseCount: number;
}

const AdvocateDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [advocate, setAdvocate] = useState<Advocate | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [advocateData, casesData] = await Promise.all([
          advocateService.getAdvocate(id!),
          getCases()
        ]);
        setAdvocate(advocateData);
        setCases(casesData.filter(c => c.advocateId === id));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load advocate details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    try {
      await advocateService.deleteAdvocate(id!);
      navigate('/advocates');
    } catch (error) {
      console.error('Error deleting advocate:', error);
      setError('Failed to delete advocate');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error || !advocate) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error || 'Advocate not found'}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Button
            onClick={() => navigate('/advocates')}
            startIcon={<ArrowLeft size={20} />}
            sx={{ mb: 1 }}
          >
            Back to Advocates
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            {advocate.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Bar Number: {advocate.barNumber}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Edit size={20} />}
            onClick={() => navigate(`/advocates/${id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Trash2 size={20} />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ height: '100%', bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Contact Information</Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Mail size={20} />
                  <Typography sx={{ ml: 1 }}>{advocate.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Phone size={20} />
                  <Typography sx={{ ml: 1 }}>{advocate.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Award size={20} />
                  <Typography sx={{ ml: 1 }}>{advocate.specialization || 'General Practice'}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ height: '100%', bgcolor: 'secondary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Case Summary</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h3" sx={{ mb: 1 }}>{advocate.caseCount}</Typography>
                <Typography>Active Cases</Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Calendar size={20} />
                  <Typography sx={{ ml: 1 }}>
                    Joined {format(new Date(advocate.joinDate), 'MMMM yyyy')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Assigned Cases</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Case Number</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Client</TableCell>
                    <TableCell>Court</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Next Hearing</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cases.map((case_) => (
                    <TableRow key={case_.id} hover>
                      <TableCell>{case_.caseNumber}</TableCell>
                      <TableCell>{case_.title}</TableCell>
                      <TableCell>{case_.clientName}</TableCell>
                      <TableCell>{case_.courtName}</TableCell>
                      <TableCell>
                        <Chip
                          label={case_.status}
                          color={
                            case_.status === 'OPEN' ? 'success' :
                            case_.status === 'PENDING' ? 'warning' : 'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {case_.nextHearing ? format(new Date(case_.nextHearing), 'PP') : 'Not scheduled'}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/cases/${case_.id}`)}
                        >
                          <Eye size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {cases.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography color="text.secondary">
                          No cases assigned
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Advocate</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {advocate.name}? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdvocateDetails;