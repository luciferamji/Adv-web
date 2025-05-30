import api from './api';
import { ENDPOINTS } from '../config/api';

export interface HearingComment {
  id: string;
  hearingId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  attachments: Array<{
    id: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    url: string;
  }>;
}

export interface Hearing {
  id: string;
  caseId: string;
  caseName: string;
  clientId: string;
  clientName: string;
  courtName: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
  purpose?: string;
  judge?: string;
  room?: string;
  comments?: HearingComment[];
}

export const getHearings = async (params?: { 
  caseId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<Hearing[]> => {
  return api.get(ENDPOINTS.HEARINGS, { params });
};

export const getHearing = async (id: string): Promise<Hearing> => {
  return api.get(`${ENDPOINTS.HEARINGS}/${id}`);
};

export const createHearing = async (hearingData: Omit<Hearing, 'id' | 'comments'>): Promise<Hearing> => {
  return api.post(ENDPOINTS.HEARINGS, hearingData);
};

export const updateHearing = async (id: string, hearingData: Partial<Hearing>): Promise<Hearing> => {
  return api.put(`${ENDPOINTS.HEARINGS}/${id}`, hearingData);
};

export const deleteHearing = async (id: string): Promise<void> => {
  return api.delete(`${ENDPOINTS.HEARINGS}/${id}`);
};

export const addHearingComment = async (
  hearingId: string,
  data: {
    content: string;
    attachments: Array<{
      fileName: string;
      fileSize: number;
      fileType: string;
      url: string;
    }>;
  }
): Promise<HearingComment> => {
  return api.post(ENDPOINTS.HEARING_COMMENTS(hearingId), data);
};

export const updateHearingComment = async (
  hearingId: string,
  commentId: string,
  data: { content: string }
): Promise<HearingComment> => {
  return api.put(`${ENDPOINTS.HEARING_COMMENTS(hearingId)}/${commentId}`, data);
};

export const deleteHearingComment = async (hearingId: string, commentId: string): Promise<void> => {
  return api.delete(`${ENDPOINTS.HEARING_COMMENTS(hearingId)}/${commentId}`);
};