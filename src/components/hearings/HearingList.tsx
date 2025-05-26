import React, { useState } from 'react';
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
  Collapse,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Plus,
  Send,
  FileText,
  Download
} from 'lucide-react';
import { format } from 'date-fns';
import type { Hearing, HearingComment } from '../../services/hearingService';
import HearingDialog from './HearingDialog';

interface HearingListProps {
  hearings: Hearing[];
  caseId: string;
  caseName: string;
  clientId: string;
  clientName: string;
  onAddHearing: (hearingData: Partial<Hearing>) => Promise<void>;
  onEditHearing: (id: string, hearingData: Partial<Hearing>) => Promise<void>;
  onDeleteHearing: (id: string) => Promise<void>;
  onAddComment: (hearingId: string, content: string, attachments: File[]) => Promise<void>;
  onEditComment: (hearingId: string, commentId: string, content: string) => Promise<void>;
  onDeleteComment: (hearingId: string, commentId: string) => Promise<void>;
}

export default function HearingList({
  hearings,
  caseId,
  caseName,
  clientId,
  clientName,
  onAddHearing,
  onEditHearing,
  onDeleteHearing,
  onAddComment,
  onEditComment,
  onDeleteComment
}: HearingListProps) {
  const [openHearingId, setOpenHearingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHearing, setSelectedHearing] = useState<Hearing | undefined>();
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File[]>>({});
  const [editingComment, setEditingComment] = useState<{ id: string; content: string } | null>(null);

  const handleToggleHearing = (hearingId: string) => {
    setOpenHearingId(openHearingId === hearingId ? null : hearingId);
  };

  const handleAddHearing = () => {
    setSelectedHearing(undefined);
    setDialogOpen(true);
  };

  const handleEditHearing = (hearing: Hearing) => {
    setSelectedHearing(hearing);
    setDialogOpen(true);
  };

  const handleSaveHearing = async (hearingData: Partial<Hearing>) => {
    if (selectedHearing) {
      await onEditHearing(selectedHearing.id, hearingData);
    } else {
      await onAddHearing(hearingData);
    }
    setDialogOpen(false);
  };

  const handleCommentChange = (hearingId: string, value: string) => {
    setNewComments(prev => ({ ...prev, [hearingId]: value }));
  };

  const handleFileSelect = (hearingId: string, files: FileList) => {
    setSelectedFiles(prev => ({
      ...prev,
      [hearingId]: Array.from(files)
    }));
  };

  const handleAddComment = async (hearingId: string) => {
    const content = newComments[hearingId];
    const files = selectedFiles[hearingId] || [];
    if (content?.trim()) {
      await onAddComment(hearingId, content, files);
      setNewComments(prev => ({ ...prev, [hearingId]: '' }));
      setSelectedFiles(prev => ({ ...prev, [hearingId]: [] }));
    }
  };

  const handleStartEditComment = (comment: HearingComment) => {
    setEditingComment({ id: comment.id, content: comment.content });
  };

  const handleSaveEditComment = async (hearingId: string, commentId: string) => {
    if (editingComment && editingComment.id === commentId) {
      await onEditComment(hearingId, commentId, editingComment.content);
      setEditingComment(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Hearings</Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={handleAddHearing}
        >
          Schedule Hearing
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Date & Time</TableCell>
              <TableCell>Purpose</TableCell>
              <TableCell>Court</TableCell>
              <TableCell>Judge</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hearings.map((hearing) => (
              <React.Fragment key={hearing.id}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleHearing(hearing.id)}
                    >
                      {openHearingId === hearing.id ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    {format(new Date(`${hearing.date} ${hearing.time}`), 'PPp')}
                  </TableCell>
                  <TableCell>{hearing.purpose}</TableCell>
                  <TableCell>{hearing.courtName}</TableCell>
                  <TableCell>{hearing.judge}</TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor:
                          hearing.status === 'Scheduled' ? 'success.light' :
                          hearing.status === 'Completed' ? 'info.light' :
                          'error.light',
                        color: '#fff'
                      }}
                    >
                      {hearing.status}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEditHearing(hearing)}
                    >
                      <Edit size={20} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDeleteHearing(hearing.id)}
                    >
                      <Trash2 size={20} />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={openHearingId === hearing.id} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Comments
                        </Typography>
                        <List>
                          {hearing.comments?.map((comment) => (
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
                                  editingComment?.id === comment.id ? (
                                    <Box sx={{ mt: 1 }}>
                                      <TextField
                                        fullWidth
                                        multiline
                                        value={editingComment.content}
                                        onChange={(e) => setEditingComment({
                                          ...editingComment,
                                          content: e.target.value
                                        })}
                                        size="small"
                                      />
                                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <Button
                                          size="small"
                                          onClick={() => setEditingComment(null)}
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          size="small"
                                          variant="contained"
                                          onClick={() => handleSaveEditComment(hearing.id, comment.id)}
                                        >
                                          Save
                                        </Button>
                                      </Box>
                                    </Box>
                                  ) : (
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
                                  )
                                }
                              />
                              <ListItemSecondaryAction>
                                <IconButton
                                  edge="end"
                                  size="small"
                                  onClick={() => handleStartEditComment(comment)}
                                >
                                  <Edit size={16} />
                                </IconButton>
                                <IconButton
                                  edge="end"
                                  size="small"
                                  onClick={() => onDeleteComment(hearing.id, comment.id)}
                                >
                                  <Trash2 size={16} />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))}
                        </List>
                        <Box sx={{ mt: 2 }}>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="Add a comment..."
                            value={newComments[hearing.id] || ''}
                            onChange={(e) => handleCommentChange(hearing.id, e.target.value)}
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
                                onChange={(e) => e.target.files && handleFileSelect(hearing.id, e.target.files)}
                              />
                            </Button>
                            <Button
                              variant="contained"
                              endIcon={<Send size={20} />}
                              onClick={() => handleAddComment(hearing.id)}
                              disabled={!newComments[hearing.id]?.trim()}
                            >
                              Add Comment
                            </Button>
                          </Box>
                          {selectedFiles[hearing.id]?.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                Selected files:
                              </Typography>
                              <List dense>
                                {selectedFiles[hearing.id].map((file, index) => (
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
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <HearingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveHearing}
        hearing={selectedHearing}
        caseId={caseId}
        caseName={caseName}
        clientId={clientId}
        clientName={clientName}
      />
    </Box>
  );
}