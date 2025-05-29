import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Box,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  TextField,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  Gavel,
  Send,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import { format } from 'date-fns';
import { getHearings, type Hearing } from '../../services/hearingService';

interface EventData {
  id: string;
  title: string;
  start: string;
  end?: string;
  extendedProps: Hearing;
}

export default function HearingCalendar() {
  const navigate = useNavigate();
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [selectedHearing, setSelectedHearing] = useState<Hearing | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHearings = async (start: string, end: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getHearings({ startDate: start, endDate: end });
      setHearings(data);
    } catch (error) {
      console.error('Failed to fetch hearings:', error);
      setError('Failed to load hearings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDatesSet = (arg: { start: Date; end: Date }) => {
    const startDate = format(arg.start, 'yyyy-MM-dd');
    const endDate = format(arg.end, 'yyyy-MM-dd');
    fetchHearings(startDate, endDate);
  };

  const events: EventData[] = hearings.map(hearing => ({
    id: hearing.id,
    title: hearing.caseName,
    start: `${hearing.date}T${hearing.time}`,
    extendedProps: hearing
  }));

  const handleEventClick = (info: { event: { extendedProps: Hearing } }) => {
    setSelectedHearing(info.event.extendedProps);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedHearing(null);
    setNewComment('');
    setSelectedFiles([]);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleAddComment = async () => {
    if (!selectedHearing || !newComment.trim()) return;

    try {
      // Add comment logic here
      setNewComment('');
      setSelectedFiles([]);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleNavigateToCase = (caseId: string) => {
    navigate(`/cases/${caseId}`);
    handleCloseDialog();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Hearing Calendar
      </Typography>

      <Paper sx={{ p: 3, mt: 3, position: 'relative' }}>
        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 1,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress size={40} />
              <Typography sx={{ mt: 2 }}>Loading hearings...</Typography>
            </Box>
          </Box>
        )}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
          height="auto"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: true
          }}
        />
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      {selectedHearing && (
        <Dialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" component="div">
              Hearing Details
            </Typography>
            <Typography
              variant="subtitle1"
              color="primary"
              sx={{ cursor: 'pointer' }}
              onClick={() => handleNavigateToCase(selectedHearing.caseId)}
            >
              Case: {selectedHearing.caseName}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Calendar size={20} />
                </ListItemIcon>
                <ListItemText
                  primary="Date & Time"
                  secondary={`${format(new Date(selectedHearing.date), 'PPP')} at ${selectedHearing.time}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <MapPin size={20} />
                </ListItemIcon>
                <ListItemText
                  primary="Court"
                  secondary={`${selectedHearing.courtName}${selectedHearing.room ? ` - Room ${selectedHearing.room}` : ''}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Gavel size={20} />
                </ListItemIcon>
                <ListItemText
                  primary="Judge"
                  secondary={selectedHearing.judge || 'Not assigned'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <User size={20} />
                </ListItemIcon>
                <ListItemText
                  primary="Client"
                  secondary={selectedHearing.clientName}
                />
              </ListItem>
              {selectedHearing.purpose && (
                <ListItem>
                  <ListItemIcon>
                    <FileText size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Purpose"
                    secondary={selectedHearing.purpose}
                  />
                </ListItem>
              )}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Comments
            </Typography>

            <List>
              {selectedHearing.comments?.map((comment) => (
                <ListItem
                  key={comment.id}
                  alignItems="flex-start"
                  sx={{
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                    mb: 1
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2">
                          {comment.userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(comment.createdAt), 'PPp')}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{ mt: 1 }}
                        >
                          {comment.content}
                        </Typography>
                        {comment.attachments.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Attachments:
                            </Typography>
                            <List dense>
                              {comment.attachments.map((attachment) => (
                                <ListItem
                                  key={attachment.id}
                                  sx={{
                                    bgcolor: 'background.paper',
                                    borderRadius: 1,
                                    mb: 0.5
                                  }}
                                >
                                  <FileText size={16} style={{ marginRight: 8 }} />
                                  <ListItemText
                                    primary={attachment.fileName}
                                    secondary={`${(attachment.fileSize / 1024 / 1024).toFixed(2)} MB`}
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={() => window.open(attachment.url)}
                                  >
                                    <Download size={16} />
                                  </IconButton>
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                      </Box>
                    }
                  />
                  <Box sx={{ ml: 2 }}>
                    <IconButton size="small">
                      <Edit size={16} />
                    </IconButton>
                    <IconButton size="small">
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>

            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                  component="label"
                  startIcon={<FileText size={20} />}
                >
                  Attach Files
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileSelect}
                  />
                </Button>
                <Button
                  variant="contained"
                  endIcon={<Send size={20} />}
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  Add Comment
                </Button>
              </Box>
              {selectedFiles.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Selected files:
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
                        <FileText size={16} style={{ marginRight: 8 }} />
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}