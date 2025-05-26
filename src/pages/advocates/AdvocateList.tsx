import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { UserPlus } from 'lucide-react';
import advocateService from '../../services/advocateService';
import { Skeleton } from '@mui/material';

interface Advocate {
  id: string;
  name: string;
  email: string;
  phone: string;
  barNumber: string;
}

const AdvocateList: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [advocates, setAdvocates] = useState<Advocate[]>([]);

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        setIsLoading(true);
        const data = await advocateService.getAdvocates();
        setAdvocates(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvocates();
  }, []);
  return (
    <Box sx={{ p: 3 }}>
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
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Bar Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from(new Array(5)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" /></TableCell>
                </TableRow>
              ))
            ) : advocates.map((advocate) => (
              <TableRow key={advocate.id}>
                <TableCell>{advocate.name}</TableCell>
                <TableCell>{advocate.email}</TableCell>
                <TableCell>{advocate.phone}</TableCell>
                <TableCell>{advocate.barNumber}</TableCell>
              </TableRow>
            ))}
            {advocates.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No advocates found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdvocateList;
