import type { Case } from '../pages/cases/CaseList';

// Types for comments
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

// Mock data for cases - aligned with hearing data
const mockCases: Case[] = [
  {
    id: 'CASE-2025-001',
    caseNumber: 'CASE-2025-001',
    title: 'Smith vs. Johnson Property Dispute',
    clientId: '1',
    clientName: 'John Smith',
    status: 'OPEN',
    courtName: 'Superior Court of California',
    nextHearing: '2025-02-15T10:00:00',
    createdAt: '2025-01-01T08:00:00',
    description: 'Property boundary dispute between neighboring landowners. Multiple surveys and property documents need review.'
  },
  {
    id: 'CASE-2025-002',
    caseNumber: 'CASE-2025-002',
    title: 'Tech Corp Merger Review',
    clientId: '2',
    clientName: 'Tech Corp Inc.',
    status: 'PENDING',
    courtName: 'Delaware Court of Chancery',
    nextHearing: '2025-02-20T14:30:00',
    createdAt: '2025-01-05T09:30:00',
    description: 'Review of proposed merger between Tech Corp Inc. and Innovation Systems Ltd. Complex regulatory compliance requirements.'
  },
  {
    id: 'CASE-2025-003',
    caseNumber: 'CASE-2025-003',
    title: 'Insurance Claim Dispute',
    clientId: '3',
    clientName: 'Sarah Williams',
    status: 'OPEN',
    courtName: 'District Court',
    nextHearing: '2025-02-25T09:15:00',
    createdAt: '2025-01-10T14:15:00',
    description: 'Insurance claim dispute over property damage from natural disaster. Multiple expert testimonies required.'
  },
  {
    id: 'CASE-2025-004',
    caseNumber: 'CASE-2025-004',
    title: 'Employment Discrimination Case',
    clientId: '4',
    clientName: 'Emily Johnson',
    status: 'PENDING',
    courtName: 'Federal District Court',
    nextHearing: '2025-02-12T13:45:00',
    createdAt: '2025-01-15T11:30:00',
    description: 'Employment discrimination case involving workplace harassment and unfair termination claims.'
  }
];

// Mock data for case comments
const mockComments: CaseComment[] = [
  {
    id: '1',
    caseId: 'CASE-2025-001',
    userId: '1',
    userName: 'John Doe',
    content: 'Initial review of property documents completed. Found several discrepancies in the boundary markers.',
    attachments: [
      {
        id: '1',
        fileName: 'property_survey.pdf',
        fileSize: 2500000,
        fileType: 'application/pdf',
        url: 'https://example.com/files/property_survey.pdf'
      },
      {
        id: '2',
        fileName: 'historical_records.pdf',
        fileSize: 1800000,
        fileType: 'application/pdf',
        url: 'https://example.com/files/historical_records.pdf'
      }
    ],
    createdAt: '2025-01-02T10:30:00Z'
  },
  {
    id: '2',
    caseId: 'CASE-2025-002',
    userId: '2',
    userName: 'Jane Smith',
    content: 'Merger documentation review completed. Several regulatory compliance issues identified.',
    attachments: [
      {
        id: '3',
        fileName: 'merger_analysis.pdf',
        fileSize: 3200000,
        fileType: 'application/pdf',
        url: 'https://example.com/files/merger_analysis.pdf'
      }
    ],
    createdAt: '2025-01-06T14:15:00Z'
  },
  {
    id: '3',
    caseId: 'CASE-2025-003',
    userId: '1',
    userName: 'John Doe',
    content: 'Insurance policy review completed. Found potential coverage gaps.',
    attachments: [],
    createdAt: '2025-01-11T09:45:00Z'
  },
  {
    id: '4',
    caseId: 'CASE-2025-004',
    userId: '2',
    userName: 'Jane Smith',
    content: 'Witness statements collected and reviewed. Strong evidence supporting discrimination claims.',
    attachments: [
      {
        id: '4',
        fileName: 'witness_statements.pdf',
        fileSize: 4500000,
        fileType: 'application/pdf',
        url: 'https://example.com/files/witness_statements.pdf'
      }
    ],
    createdAt: '2025-01-16T13:20:00Z'
  }
];

// Get all cases
export const getCases = async (): Promise<Case[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockCases;
};

// Get a single case by ID
export const getCase = async (id: string): Promise<Case> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const case_ = mockCases.find(c => c.id === id);
  if (!case_) {
    throw new Error('Case not found');
  }
  return case_;
};

// Create a new case
export const createCase = async (caseData: Omit<Case, 'id' | 'createdAt'>): Promise<Case> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newCase: Case = {
    ...caseData,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString()
  };
  mockCases.push(newCase);
  return newCase;
};

// Update an existing case
export const updateCase = async (id: string, caseData: Partial<Case>): Promise<Case> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = mockCases.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Case not found');
  }
  
  mockCases[index] = {
    ...mockCases[index],
    ...caseData
  };
  
  return mockCases[index];
};

// Get comments for a case
export const getCaseComments = async (caseId: string): Promise<CaseComment[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockComments.filter(comment => comment.caseId === caseId);
};

// Add a comment to a case
export const addCaseComment = async (
  caseId: string,
  data: { content: string; attachments: Omit<CommentAttachment, 'id'>[] }
): Promise<CaseComment> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newComment: CaseComment = {
    id: Math.random().toString(36).substr(2, 9),
    caseId,
    userId: '1',
    userName: 'John Doe',
    content: data.content,
    attachments: data.attachments.map(attachment => ({
      ...attachment,
      id: Math.random().toString(36).substr(2, 9)
    })),
    createdAt: new Date().toISOString()
  };
  
  mockComments.push(newComment);
  return newComment;
};