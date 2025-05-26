import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme, useMediaQuery } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { Plus, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import dashboardService from '../../services/dashboardService';

interface Hearing {
  id: string;
  caseId: string;
  caseName: string;
  clientId: string;
  clientName: string;
  courtName: string;
  date: string;
  time: string;
  status: string;
}

interface CaseOverview {
  id: string;
  caseId: string;
  clientName: string;
  courtName: string;
  nextHearingDate: string | null;
  status: string;
}

export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalCases: 0,
    activeCases: 0,
    upcomingHearings: 0,
  });
  const [upcomingHearings, setUpcomingHearings] = useState<Hearing[]>([]);
  const [recentCases, setRecentCases] = useState<CaseOverview[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await dashboardService.getDashboardData();
        setStats(data.stats);
        setUpcomingHearings(data.upcomingHearings);
        setRecentCases(data.recentCases);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, bgColor }: { title: string; value: number; bgColor: string }) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: bgColor,
        color: 'white',
        boxShadow: theme.shadows[3],
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <CardContent>
        <Typography variant="h3" component="div" sx={{ 
          fontWeight: 600,
          fontSize: { xs: '2rem', sm: '3rem' }
        }}>
          {isLoading ? <Skeleton width="60%" /> : value}
        </Typography>
        <Typography sx={{ fontSize: { xs: 14, sm: 16 } }} gutterBottom>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 2,
        mb: 4 
      }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.name || 'User'}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate('/cases/new')}
          >
            New Case
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Plus size={20} />}
            onClick={() => navigate('/clients/new')}
          >
            New Client
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Clients" value={stats.totalClients} bgColor="#1A237E" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Cases" value={stats.totalCases} bgColor="#00796B" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Cases" value={stats.activeCases} bgColor="#D32F2F" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Upcoming Hearings" value={stats.upcomingHearings} bgColor="#ED6C02" />
        </Grid>
      </Grid>

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 2 
        }}>
          <Typography variant="h5" component="h2" gutterBottom={isMobile}>
            Upcoming Hearings
          </Typography>
          <Button 
            fullWidth={isMobile}
            variant="outlined" 
            size="small"
            onClick={() => navigate('/calendar')}
          >
            View Calendar
          </Button>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Case</TableCell>
                {!isMobile && <TableCell>Client</TableCell>}
                <TableCell>Date & Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from(new Array(3)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton /></TableCell>
                    {!isMobile && <TableCell><Skeleton /></TableCell>}
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                  </TableRow>
                ))
              ) : upcomingHearings.length > 0 ? (
                upcomingHearings.map((hearing) => (
                  <TableRow key={hearing.id} hover>
                    <TableCell>{hearing.caseName}</TableCell>
                    {!isMobile && <TableCell>{hearing.clientName}</TableCell>}
                    <TableCell>
                      {format(new Date(hearing.date), 'MMM dd')} at {hearing.time}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor:
                            hearing.status === 'Scheduled'
                              ? 'rgba(25, 118, 210, 0.12)'
                              : hearing.status === 'Completed'
                              ? 'rgba(46, 125, 50, 0.12)'
                              : 'rgba(237, 108, 2, 0.12)',
                          color:
                            hearing.status === 'Scheduled'
                              ? 'primary.main'
                              : hearing.status === 'Completed'
                              ? 'success.main'
                              : 'warning.main',
                        }}
                      >
                        {hearing.status}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<Eye size={16} />}
                        onClick={() => navigate(`/cases/${hearing.caseId}`)}
                      >
                        {isMobile ? '' : 'View Case'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isMobile ? 4 : 5} align="center">
                    <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                      No upcoming hearings scheduled.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 2 
        }}>
          <Typography variant="h5" component="h2" gutterBottom={isMobile}>
            Recent Cases
          </Typography>
          <Button 
            fullWidth={isMobile}
            variant="outlined" 
            size="small"
            onClick={() => navigate('/cases')}
          >
            View All Cases
          </Button>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Case ID</TableCell>
                {!isMobile && (
                  <>
                    <TableCell>Client</TableCell>
                    <TableCell>Court</TableCell>
                  </>
                )}
                <TableCell>Next Hearing</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from(new Array(4)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton /></TableCell>
                    {!isMobile && (
                      <>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                      </>
                    )}
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                  </TableRow>
                ))
              ) : recentCases.length > 0 ? (
                recentCases.map((caseItem) => (
                  <TableRow key={caseItem.id} hover>
                    <TableCell>{caseItem.caseId}</TableCell>
                    {!isMobile && (
                      <>
                        <TableCell>{caseItem.clientName}</TableCell>
                        <TableCell>{caseItem.courtName}</TableCell>
                      </>
                    )}
                    <TableCell>
                      {caseItem.nextHearingDate
                        ? format(new Date(caseItem.nextHearingDate), 'MMM dd')
                        : 'Not scheduled'}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor:
                            caseItem.status === 'Active'
                              ? 'rgba(46, 125, 50, 0.12)'
                              : caseItem.status === 'Pending'
                              ? 'rgba(237, 108, 2, 0.12)'
                              : 'rgba(211, 47, 47, 0.12)',
                          color:
                            caseItem.status === 'Active'
                              ? 'success.main'
                              : caseItem.status === 'Pending'
                              ? 'warning.main'
                              : 'error.main',
                        }}
                      >
                        {caseItem.status}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<Eye size={16} />}
                        onClick={() => navigate(`/cases/${caseItem.id}`)}
                      >
                        {isMobile ? '' : 'View Details'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isMobile ? 4 : 6} align="center">
                    <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                      No cases found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}