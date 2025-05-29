import { format } from 'date-fns';

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

// Mock data with a variety of scenarios for testing
const mockHearings: Hearing[] = [
  {
    id: '1',
    caseId: 'CASE-2025-001',
    caseName: 'Smith vs. Johnson Property Dispute',
    clientId: '1',
    clientName: 'John Smith',
    courtName: 'Superior Court of California',
    date: '2025-02-15',
    time: '10:00',
    status: 'Scheduled',
    notes: 'Initial hearing for property boundary dispute',
    purpose: 'Initial Hearing',
    judge: 'Hon. Sarah Williams',
    room: 'Courtroom 3A',
    comments: [
      {
        id: '1',
        hearingId: '1',
        userId: '1',
        userName: 'John Doe',
        content: 'All documents have been prepared for the hearing.',
        createdAt: '2025-02-10T09:00:00Z',
        attachments: [
          {
            id: '1',
            fileName: 'case_summary.pdf',
            fileSize: 1024576,
            fileType: 'application/pdf',
            url: 'https://example.com/files/case_summary.pdf'
          },
          {
            id: '2',
            fileName: 'property_documents.pdf',
            fileSize: 2048576,
            fileType: 'application/pdf',
            url: 'https://example.com/files/property_documents.pdf'
          }
        ]
      },
      {
        id: '2',
        hearingId: '1',
        userId: '2',
        userName: 'Jane Smith',
        content: 'Client has been notified of the hearing date and time.',
        createdAt: '2025-02-11T14:30:00Z',
        attachments: []
      }
    ]
  },
  {
    id: '2',
    caseId: 'CASE-2025-002',
    caseName: 'Tech Corp Merger Review',
    clientId: '2',
    clientName: 'Tech Corp Inc.',
    courtName: 'Delaware Court of Chancery',
    date: '2025-02-20',
    time: '14:30',
    status: 'Scheduled',
    purpose: 'Merger Review Hearing',
    judge: 'Hon. Michael Brown',
    room: '2B',
    comments: [
      {
        id: '3',
        hearingId: '2',
        userId: '1',
        userName: 'John Doe',
        content: 'Financial statements and merger documents are ready for presentation.',
        createdAt: '2025-02-18T10:15:00Z',
        attachments: [
          {
            id: '3',
            fileName: 'merger_documents.pdf',
            fileSize: 3145728,
            fileType: 'application/pdf',
            url: 'https://example.com/files/merger_documents.pdf'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    caseId: 'CASE-2025-003',
    caseName: 'Insurance Claim Dispute',
    clientId: '3',
    clientName: 'Sarah Williams',
    courtName: 'District Court',
    date: '2025-02-25',
    time: '09:15',
    status: 'Scheduled',
    purpose: 'Evidence Presentation',
    judge: 'Hon. Robert Davis',
    room: '4C',
    comments: []
  },
  {
    id: '4',
    caseId: 'CASE-2025-001',
    caseName: 'Smith vs. Johnson Property Dispute',
    clientId: '1',
    clientName: 'John Smith',
    courtName: 'Superior Court of California',
    date: '2025-03-20',
    time: '11:00',
    status: 'Scheduled',
    purpose: 'Follow-up Hearing',
    judge: 'Hon. Sarah Williams',
    room: 'Courtroom 3A',
    comments: []
  },
  {
    id: '5',
    caseId: 'CASE-2025-004',
    caseName: 'Employment Discrimination Case',
    clientId: '4',
    clientName: 'Emily Johnson',
    courtName: 'Federal District Court',
    date: '2025-02-12',
    time: '13:45',
    status: 'Completed',
    purpose: 'Status Conference',
    judge: 'Hon. David Miller',
    room: '5A',
    comments: [
      {
        id: '4',
        hearingId: '5',
        userId: '2',
        userName: 'Jane Smith',
        content: 'Status conference completed. Next steps discussed and documented.',
        createdAt: '2025-02-12T15:00:00Z',
        attachments: [
          {
            id: '4',
            fileName: 'conference_notes.pdf',
            fileSize: 512000,
            fileType: 'application/pdf',
            url: 'https://example.com/files/conference_notes.pdf'
          }
        ]
      }
    ]
  }
];

// Get hearings with optional date range filter
export const getHearings = async (params?: { 
  caseId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<Hearing[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let filteredHearings = mockHearings;
  
  if (params?.caseId) {
    filteredHearings = filteredHearings.filter(h => h.caseId === params.caseId);
  }
  
  if (params?.startDate && params?.endDate) {
    filteredHearings = filteredHearings.filter(h => {
      const hearingDate = h.date;
      return hearingDate >= params.startDate! && hearingDate <= params.endDate!;
    });
  }
  
  return filteredHearings;
};

// Get a single hearing
export const getHearing = async (id: string): Promise<Hearing> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const hearing = mockHearings.find(h => h.id === id);
  if (!hearing) throw new Error('Hearing not found');
  return hearing;
};

// Create a new hearing
export const createHearing = async (hearingData: Omit<Hearing, 'id' | 'comments'>): Promise<Hearing> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newHearing: Hearing = {
    ...hearingData,
    id: Math.random().toString(36).substr(2, 9),
    comments: []
  };
  mockHearings.push(newHearing);
  return newHearing;
};

// Update an existing hearing
export const updateHearing = async (id: string, hearingData: Partial<Hearing>): Promise<Hearing> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = mockHearings.findIndex(h => h.id === id);
  if (index === -1) throw new Error('Hearing not found');
  
  mockHearings[index] = {
    ...mockHearings[index],
    ...hearingData
  };
  
  return mockHearings[index];
};

// Delete a hearing
export const deleteHearing = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = mockHearings.findIndex(h => h.id === id);
  if (index === -1) throw new Error('Hearing not found');
  mockHearings.splice(index, 1);
};

// Add a comment to a hearing
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
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const hearing = mockHearings.find(h => h.id === hearingId);
  if (!hearing) throw new Error('Hearing not found');
  
  const newComment: HearingComment = {
    id: Math.random().toString(36).substr(2, 9),
    hearingId,
    userId: '1',
    userName: 'John Doe',
    content: data.content,
    createdAt: new Date().toISOString(),
    attachments: data.attachments.map(attachment => ({
      ...attachment,
      id: Math.random().toString(36).substr(2, 9)
    }))
  };
  
  if (!hearing.comments) {
    hearing.comments = [];
  }
  hearing.comments.push(newComment);
  
  return newComment;
};

// Update a hearing comment
export const updateHearingComment = async (
  hearingId: string,
  commentId: string,
  data: { content: string }
): Promise<HearingComment> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const hearing = mockHearings.find(h => h.id === hearingId);
  if (!hearing || !hearing.comments) throw new Error('Hearing not found');
  
  const commentIndex = hearing.comments.findIndex(c => c.id === commentId);
  if (commentIndex === -1) throw new Error('Comment not found');
  
  hearing.comments[commentIndex] = {
    ...hearing.comments[commentIndex],
    content: data.content
  };
  
  return hearing.comments[commentIndex];
};

// Delete a hearing comment
export const deleteHearingComment = async (hearingId: string, commentId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const hearing = mockHearings.find(h => h.id === hearingId);
  if (!hearing || !hearing.comments) throw new Error('Hearing not found');
  
  const commentIndex = hearing.comments.findIndex(c => c.id === commentId);
  if (commentIndex === -1) throw new Error('Comment not found');
  
  hearing.comments.splice(commentIndex, 1);
};