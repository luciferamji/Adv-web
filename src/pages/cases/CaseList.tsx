import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  Typography,
  Box
} from '@mui/material';
import { Plus, FileText, Edit, Eye } from 'lucide-react';
import { getCases } from '../../services/caseService';
import Loading from '../../components/common/Loading';

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  clientName: string;
  status: 'OPEN' | 'CLOSED' | 'PENDING';
  courtName: string;
  nextHearing?: string;
  createdAt: string;
}

export default function CaseList() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCases = async () => {
      try {
        const data = await getCases();
        setCases(data);
      } catch (error) {
        console.error('Failed to load cases:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Legal Cases
        </Typography>
        <Button
          component={Link}
          to="/cases/new"
          variant="contained"
          startIcon={<Plus size={20} />}
        >
          New Case
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Case Number</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Court</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Next Hearing</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cases.map((case_) => (
              <TableRow key={case_.id}>
                <TableCell>{case_.caseNumber}</TableCell>
                <TableCell>{case_.title}</TableCell>
                <TableCell>{case_.clientName}</TableCell>
                <TableCell>{case_.courtName}</TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor: 
                        case_.status === 'OPEN' ? 'success.light' :
                        case_.status === 'PENDING' ? 'warning.light' : 
                        'error.light',
                      color: '#fff'
                    }}
                  >
                    {case_.status}
                  </Box>
                </TableCell>
                <TableCell>{case_.nextHearing || 'Not Scheduled'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      component={Link}
                      to={`/cases/${case_.id}`}
                      size="small"
                      startIcon={<Eye size={16} />}
                    >
                      View
                    </Button>
                    <Button
                      component={Link}
                      to={`/cases/${case_.id}/edit`}
                      size="small"
                      startIcon={<Edit size={16} />}
                    >
                      Edit
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}