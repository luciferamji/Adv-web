import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Divider,
  Alert,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  Tab,
  Tabs,
  Chip,
  Avatar
} from '@mui/material';
import {
  ArrowLeft,
  Edit,
  FileText,
  Calendar,
  Paperclip,
  Send,
  Download,
  MapPin,
  Gavel,
  User,
  Clock,
  MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';
import { getCase, getCaseComments, addCaseComment, type CaseComment } from '../../services/caseService';
import {
  getHearings,
  createHearing,
  updateHearing,
  deleteHearing,
  addHearingComment,
  updateHearingComment,
  deleteHearingComment,
  type Hearing
} from '../../services/hearingService';
import Loading from '../../components/common/Loading';
import HearingList from '../../components/hearings/HearingList';
import type { Case } from './CaseList';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`case-tabpanel-${index}`}
      aria-labelledby={`case-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function CaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [comments, setComments] = useState<CaseComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const loadCaseData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const [caseDetails, caseComments, caseHearings] = await Promise.all([
          getCase(id),
          getCaseComments(id),
          getHearings(id)
        ]);
        setCaseData(caseDetails);
        setComments(caseComments);
        setHearings(caseHearings);
      } catch (err) {
        setError('Failed to load case details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCaseData();
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleSubmitComment = async () => {
    if (!id || !newComment.trim()) return;

    try {
      const attachments = await Promise.all(
        selectedFiles.map(async (file) => ({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          url: URL.createObjectURL(file)
        }))
      );

      const comment = await addCaseComment(id, {
        content: newComment,
        attachments
      });

      setComments(prev => [...prev, comment]);
      setNewComment('');
      setSelectedFiles([]);
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleAddHearing = async (hearingData: Partial<Hearing>) => {
    if (!id || !caseData) return;

    try {
      const newHearing = await createHearing(hearingData as Omit<Hearing, 'id' | 'comments'>);
      setHearings(prev => [...prev, newHearing]);
    } catch (err) {
      console.error('Failed to create hearing:', err);
    }
  };

  const handleEditHearing = async (hearingId: string, hearingData: Partial<Hearing>) => {
    try {
      const updatedHearing = await updateHearing(hearingId, hearingData);
      setHearings(prev => prev.map(h => h.id === hearingId ? updatedHearing : h));
    } catch (err) {
      console.error('Failed to update hearing:', err);
    }
  };

  const handleDeleteHearing = async (hearingId: string) => {
    try {
      await deleteHearing(hearingId);
      setHearings(prev => prev.filter(h => h.id !== hearingId));
    } catch (err) {
      console.error('Failed to delete hearing:', err);
    }
  };

  const handleAddHearingComment = async (hearingId: string, content: string, files: File[]) => {
    try {
      const attachments = await Promise.all(
        files.map(async (file) => ({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          url: URL.createObjectURL(file)
        }))
      );

      const comment = await addHearingComment(hearingId, { content, attachments });
      setHearings(prev => prev.map(h => {
        if (h.id === hearingId) {
          return {
            ...h,
            comments: [...(h.comments || []), comment]
          };
        }
        return h;
      }));
    } catch (err) {
      console.error('Failed to add hearing comment:', err);
    }
  };

  const handleEditHearingComment = async (hearingId: string, commentId: string, content: string) => {
    try {
      const updatedComment = await updateHearingComment(hearingId, commentId, { content });
      setHearings(prev => prev.map(h => {
        if (h.id === hearingId && h.comments) {
          return {
            ...h,
            comments: h.comments.map(c => c.id === commentId ? updatedComment : c)
          };
        }
        return h;
      }));
    } catch (err) {
      console.error('Failed to update hearing comment:', err);
    }
  };

  const handleDeleteHearingComment = async (hearingId: string, commentId: string) => {
    try {
      await deleteHearingComment(hearingId, commentId);
      setHearings(prev => prev.map(h => {
        if (h.id === hearingId && h.comments) {
          return {
            ...h,
            comments: h.comments.filter(c => c.id !== commentId)
          };
        }
        return h;
      }));
    } catch (err) {
      console.error('Failed to delete hearing comment:', err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !caseData) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error || 'Case not found'}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Button
            onClick={() => navigate('/cases')}
            startIcon={<ArrowLeft size={20} />}
            sx={{ mb: 1 }}
          >
            Back to Cases
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            {caseData.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              {caseData.caseNumber}
            </Typography>
            <Chip
              label={caseData.status}
              color={
                caseData.status === 'OPEN' ? 'success' :
                caseData.status === 'PENDING' ? 'warning' : 'error'
              }
              size="small"
            />
          </Box>
        </Box>
        <Button
          component={Link}
          to={`/cases/${id}/edit`}
          variant="contained"
          startIcon={<Edit size={20} />}
        >
          Edit Case
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ height: '100%', bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <User size={24} />
                <Typography variant="h6" sx={{ ml: 1 }}>Client Information</Typography>
              </Box>
              <Typography variant="h5" sx={{ mb: 1 }}>{caseData.clientName}</Typography>
              <Typography variant="body1">{caseData.courtName}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ height: '100%', bgcolor: 'secondary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Calendar size={24} />
                <Typography variant="h6" sx={{ ml: 1 }}>Next Hearing</Typography>
              </Box>
              {caseData.nextHearing ? (
                <>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    {format(new Date(caseData.nextHearing), 'PPP')}
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(caseData.nextHearing), 'p')}
                  </Typography>
                </>
              ) : (
                <Typography variant="body1">No hearing scheduled</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mb: 3, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: '1rem'
              }
            }}
          >
            <Tab 
              icon={<FileText size={20} />} 
              iconPosition="start" 
              label="Overview" 
            />
            <Tab 
              icon={<Calendar size={20} />} 
              iconPosition="start" 
              label="Hearings" 
            />
            <Tab 
              icon={<MessageSquare size={20} />} 
              iconPosition="start" 
              label={`Comments (${comments.length})`} 
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Case Description</Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {caseData.description}
              </Typography>
              
              <Typography variant="h6" gutterBottom>Case Details</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Court Name</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Gavel size={20} />
                      <Typography sx={{ ml: 1 }}>{caseData.courtName}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Client Name</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <User size={20} />
                      <Typography sx={{ ml: 1 }}>{caseData.clientName}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Created On</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Clock size={20} />
                      <Typography sx={{ ml: 1 }}>
                        {format(new Date(caseData.createdAt), 'PPP')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <HearingList
            hearings={hearings}
            caseId={caseData.id}
            caseName={caseData.title}
            clientId={caseData.clientId}
            clientName={caseData.clientName}
            onAddHearing={handleAddHearing}
            onEditHearing={handleEditHearing}
            onDeleteHearing={handleDeleteHearing}
            onAddComment={handleAddHearingComment}
            onEditComment={handleEditHearingComment}
            onDeleteComment={handleDeleteHearingComment}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <List>
            {comments.map((comment) => (
              <ListItem
                key={comment.id}
                alignItems="flex-start"
                sx={{ px: 0, py: 2 }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                        {comment.userName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" component="span">
                          {comment.userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          {format(new Date(comment.createdAt), 'PPp')}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ pl: 5 }}>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        sx={{ mb: 1, whiteSpace: 'pre-wrap' }}
                      >
                        {comment.content}
                      </Typography>
                      {comment.attachments.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Attachments:
                          </Typography>
                          <List dense>
                            {comment.attachments.map((attachment) => (
                              <ListItem
                                key={attachment.id}
                                sx={{
                                  bgcolor: 'grey.50',
                                  borderRadius: 1,
                                  mb: 0.5
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                  <FileText size={20} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={attachment.fileName}
                                  secondary={`${(attachment.fileSize / 1024 / 1024).toFixed(2)} MB`}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => window.open(attachment.url)}
                                >
                                  <Download size={18} />
                                </IconButton>
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Add Comment
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Type your comment here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                component="label"
                startIcon={<Paperclip size={20} />}
              >
                Attach Files
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handleFileSelect}
                />
              </Button>
              <Button
                variant="contained"
                startIcon={<Send size={20} />}
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
              >
                Post Comment
              </Button>
            </Box>
            {selectedFiles.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Files:
                </Typography>
                <List dense>
                  {selectedFiles.map((file, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        bgcolor: 'grey.50',
                        borderRadius: 1,
                        mb: 0.5
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <FileText size={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary={file.name}
                        secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}