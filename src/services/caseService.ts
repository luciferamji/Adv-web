import api from './api';
import { ENDPOINTS } from '../config/api';

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  clientId: string;
  clientName: string;
  status: 'OPEN' | 'CLOSED' | 'PENDING';
  courtName: string;
  nextHearing?: string;
  createdAt: string;
  description?: string;
}

export interface CaseComment {
  id: string;
  caseId: string;
  userId: string;
  userName: string;
  content: string;
  attachments: CommentAttachment[];
  createdAt: string;
}

export interface CommentAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
}

export const getCases = async (): Promise<Case[]> => {
  return api.get(ENDPOINTS.CASES);
};

export const getCase = async (id: string): Promise<Case> => {
  return api.get(`${ENDPOINTS.CASES}/${id}`);
};

export const createCase = async (caseData: Omit<Case, 'id' | 'createdAt'>): Promise<Case> => {
  return api.post(ENDPOINTS.CASES, caseData);
};

export const updateCase = async (id: string, caseData: Partial<Case>): Promise<Case> => {
  return api.put(`${ENDPOINTS.CASES}/${id}`, caseData);
};

export const getCaseComments = async (caseId: string): Promise<CaseComment[]> => {
  return api.get(ENDPOINTS.CASE_COMMENTS(caseId));
};

export const addCaseComment = async (
  caseId: string,
  data: { content: string; attachments: Omit<CommentAttachment, 'id'>[] }
): Promise<CaseComment> => {
  return api.post(ENDPOINTS.CASE_COMMENTS(caseId), data);
};