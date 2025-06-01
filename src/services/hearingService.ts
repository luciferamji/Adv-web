import api from './api';
import { ENDPOINTS } from '../config/api';
import { uploadFiles } from '../utils/uploadUtils';

export interface Hearing {
  id: number;
  caseId: number;
  hearingDate: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'postponed' | 'cancelled';
  comments?: HearingComment[];
}

export interface HearingComment {
  id: number;
  text: string;
  documents: Array<{
    id: number;
    fileName: string;
    fileSize: number;
    fileType: string;
  }>;
}

export const getHearings = async (params?: { 
  caseId?: number;
  startDate?: string;
  endDate?: string;
}): Promise<{ count: number; data: Hearing[] }> => {
  return api.get(ENDPOINTS.HEARINGS, { params });
};

export const getHearing = async (id: string): Promise<Hearing> => {
  return api.get(ENDPOINTS.HEARING(id));
};

export const createHearing = async (data: Omit<Hearing, 'id' | 'comments'>): Promise<Hearing> => {
  return api.post(ENDPOINTS.HEARINGS, data);
};

export const updateHearing = async (id: string, data: Partial<Hearing>): Promise<Hearing> => {
  return api.put(ENDPOINTS.HEARING(id), data);
};

export const deleteHearing = async (id: string): Promise<void> => {
  return api.delete(ENDPOINTS.HEARING(id));
};

export const addHearingComment = async (
  hearingId: string,
  text: string,
  files?: File[],
  onProgress?: (progress: number) => void
): Promise<HearingComment> => {
  let documents = [];
  
  if (files && files.length > 0) {
    documents = await uploadFiles(
      files,
      ENDPOINTS.HEARING_COMMENTS(hearingId),
      onProgress
    );
  }

  const comment = await api.post(ENDPOINTS.HEARING_COMMENTS(hearingId), {
    text,
    documents: documents.map(doc => doc.id)
  });

  return comment;
};

export const updateHearingComment = async (
  hearingId: string,
  commentId: string,
  data: Partial<HearingComment>
): Promise<HearingComment> => {
  return api.put(ENDPOINTS.HEARING_COMMENT(hearingId, commentId), data);
};

export const deleteHearingComment = async (
  hearingId: string,
  commentId: string
): Promise<void> => {
  return api.delete(ENDPOINTS.HEARING_COMMENT(hearingId, commentId));
};