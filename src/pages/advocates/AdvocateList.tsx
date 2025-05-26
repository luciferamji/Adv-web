import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Tooltip
} from '@mui/material';
import { UserPlus, Eye, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@mui/material';
import advocateService from '../../services/advocateService';
import { format } from 'date-fns';

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

const AdvocateList: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAdvocate, setSelectedAdvocate] = useState<Advocate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        setIsLoading(true);
        const data = await advocateService.getAdvocates();
        setAdvocates(data);
      } catch (error) {
        console.error('Error fetching advocates:', error);
        setError('Failed to load advocates');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvocates();
  }, []);

  const handleDelete = async () => {
    if (!selectedAdvocate) return;

    try {
      await advocateService.deleteAdvocate(selectedAdvocate.id);
      setAdvocates(advocates.filter(a => a.id !== selectedAdvocate.id));
      setDeleteDialogOpen(false);
      setSelectedAdvocate(null);
    } catch (error) {
      console.error('Error deleting advocate:', error);
      setError('Failed to delete advocate');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">
          Advocates
        </Typography>
        <Button
          variant="contained"
          startIcon={<UserPlus />}
          onClick={() => navigate('/advocates/new')}
        >
          Add Advocate
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Bar Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Cases</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from(new Array(5)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" /></TableCell>
                </TableRow>
              ))
            ) : advocates.length > 0 ? (
              advocates.map((advocate) => (
                <TableRow key={advocate.id} hover>
                  <TableCell>{advocate.name}</TableCell>
                  <TableCell>{advocate.barNumber}</TableCell>
                  <TableCell>{advocate.email}</TableCell>
                  <TableCell>{advocate.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={advocate.status}
                      color={advocate.status === 'active' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{advocate.caseCount}</TableCell>
                  <TableCell>{format(new Date(advocate.joinDate), 'PP')}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/advocates/${advocate.id}`)}
                        >
                          <Eye size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/advocates/${advocate.id}/edit`)}
                        >
                          <Edit size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedAdvocate(advocate);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                    No advocates found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Advocate</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {selectedAdvocate?.name}? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdvocateList;