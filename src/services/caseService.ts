import api from './api';
import { ENDPOINTS } from '../config/api';
import { uploadFiles } from '../utils/uploadUtils';

export interface Case {
  id: number;
  clientId: number;
  caseId: string;
  courtDetails: string;
  remarks?: string;
  status: 'active' | 'closed' | 'pending';
  hearings?: Hearing[];
  comments?: CaseComment[];
}

interface Hearing {
  id: number;
  hearingDate: string;
  notes?: string;
  status: string;
}

interface CaseComment {
  id: number;
  text: string;
  documents: Array<{
    id: number;
    fileName: string;
    fileSize: number;
    fileType: string;
  }>;
}

export const getCases = async (params?: { 
  clientId?: number;
  status?: string;
}): Promise<{ count: number; data: Case[] }> => {
  return api.get(ENDPOINTS.CASES, { params });
};

export const getCase = async (id: string): Promise<Case> => {
  return api.get(ENDPOINTS.CASE(id));
};

export const createCase = async (data: Omit<Case, 'id' | 'hearings' | 'comments'>): Promise<Case> => {
  return api.post(ENDPOINTS.CASES, data);
};

export const updateCase = async (id: string, data: Partial<Case>): Promise<Case> => {
  return api.put(ENDPOINTS.CASE(id), data);
};

export const deleteCase = async (id: string): Promise<void> => {
  return api.delete(ENDPOINTS.CASE(id));
};

export const getCaseComments = async (caseId: string): Promise<CaseComment[]> => {
  return api.get(ENDPOINTS.CASE_COMMENTS(caseId));
};

export const addCaseComment = async (
  caseId: string,
  text: string,
  files?: File[],
  onProgress?: (progress: number) => void
): Promise<CaseComment> => {
  let documents = [];
  
  if (files && files.length > 0) {
    documents = await uploadFiles(
      files,
      ENDPOINTS.CASE_COMMENTS(caseId),
      onProgress
    );
  }

  const comment = await api.post(ENDPOINTS.CASE_COMMENTS(caseId), {
    text,
    documents: documents.map(doc => doc.id)
  });

  return comment;
};