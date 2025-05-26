import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Divider
} from '@mui/material';
import {
  ArrowLeft,
  Edit,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Building,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import clientService from '../../services/clientService';
import { getCases } from '../../services/caseService';
import type { Case } from '../cases/CaseList';

interface Client {
  id: string;
  name: string;
  clientId: string;
  email: string;
  phone: string;
  address: string;
  caseCount: number;
  createdAt: string;
}

export default function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [clientData, casesData] = await Promise.all([
          clientService.getClientById(id!),
          getCases()
        ]);

        if (clientData) {
          setClient(clientData);
          // Filter cases for this client
          setCases(casesData.filter(c => c.clientId === id));
        } else {
          setError('Client not found');
        }
      } catch (error) {
        setError('Failed to load client data');
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error || !client) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error || 'Client not found'}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Button
            onClick={() => navigate('/clients')}
            startIcon={<ArrowLeft size={20} />}
            sx={{ mb: 1 }}
          >
            Back to Clients
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            {client.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Client ID: {client.clientId}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            component={Link}
            to="/cases/new"
            startIcon={<Plus size={20} />}
          >
            New Case
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to={`/clients/${id}/edit`}
            startIcon={<Edit size={20} />}
          >
            Edit Client
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
                  <Typography sx={{ ml: 1 }}>{client.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Phone size={20} />
                  <Typography sx={{ ml: 1 }}>{client.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <MapPin size={20} style={{ marginTop: 4 }} />
                  <Typography sx={{ ml: 1 }}>{client.address}</Typography>
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
                <Typography variant="h3" sx={{ mb: 1 }}>{cases.length}</Typography>
                <Typography>Active Cases</Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Calendar size={20} />
                  <Typography sx={{ ml: 1 }}>
                    Client since {format(new Date(client.createdAt), 'MMMM yyyy')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Cases</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Case ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Court</TableCell>
                    <TableCell>Next Hearing</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cases.map((caseItem) => (
                    <TableRow key={caseItem.id} hover>
                      <TableCell>{caseItem.caseNumber}</TableCell>
                      <TableCell>{caseItem.title}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Building size={16} style={{ marginRight: 8 }} />
                          {caseItem.courtName}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {caseItem.nextHearing ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Clock size={16} style={{ marginRight: 8 }} />
                            {format(new Date(caseItem.nextHearing), 'PPp')}
                          </Box>
                        ) : (
                          'Not scheduled'
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={caseItem.status}
                          color={
                            caseItem.status === 'OPEN' ? 'success' :
                            caseItem.status === 'PENDING' ? 'warning' : 'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          component={Link}
                          to={`/cases/${caseItem.id}`}
                          startIcon={<Eye size={16} />}
                          size="small"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {cases.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary">
                          No cases found for this client
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
    </Box>
  );
}