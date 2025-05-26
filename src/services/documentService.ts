interface DocumentLink {
  id: string;
  clientId: string;
  caseId?: string;
  title: string;
  expiryDate: string;
  accessKey: string;
  createdAt: string;
  status: 'active' | 'expired';
}

interface Document {
  id: string;
  clientId: string;
  caseId?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  uploadedBy: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockDocumentLinks: DocumentLink[] = [
  {
    id: '1',
    clientId: '1',
    caseId: 'CASE-2025-001',
    title: 'Property Documents Upload',
    expiryDate: '2025-03-15T23:59:59Z',
    accessKey: 'abc123xyz',
    createdAt: '2025-02-01T10:00:00Z',
    status: 'active'
  }
];

const mockDocuments: Document[] = [
  {
    id: '1',
    clientId: '1',
    caseId: 'CASE-2025-001',
    fileName: 'property_deed.pdf',
    fileSize: 2048576, // 2MB
    fileType: 'application/pdf',
    uploadedAt: '2025-02-01T12:00:00Z',
    uploadedBy: 'client@example.com',
    status: 'pending'
  }
];

export const createDocumentLink = async (linkData: Omit<DocumentLink, 'id' | 'accessKey' | 'createdAt' | 'status'>): Promise<DocumentLink> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newLink: DocumentLink = {
    ...linkData,
    id: Math.random().toString(36).substr(2, 9),
    accessKey: Math.random().toString(36).substr(2, 12),
    createdAt: new Date().toISOString(),
    status: 'active'
  };
  
  mockDocumentLinks.push(newLink);
  return newLink;
};

export const getDocumentLinks = async (): Promise<DocumentLink[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockDocumentLinks;
};

export const getDocumentLink = async (id: string): Promise<DocumentLink> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const link = mockDocumentLinks.find(l => l.id === id);
  if (!link) throw new Error('Document link not found');
  return link;
};

export const getDocuments = async (clientId?: string, caseId?: string): Promise<Document[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockDocuments.filter(doc => 
    (!clientId || doc.clientId === clientId) && 
    (!caseId || doc.caseId === caseId)
  );
};

export const uploadDocument = async (file: File, metadata: { clientId: string; caseId?: string }): Promise<Document> => {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload time
  
  const newDocument: Document = {
    id: Math.random().toString(36).substr(2, 9),
    clientId: metadata.clientId,
    caseId: metadata.caseId,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    uploadedAt: new Date().toISOString(),
    uploadedBy: 'user@example.com', // This would come from auth context in real app
    status: 'pending'
  };
  
  mockDocuments.push(newDocument);
  return newDocument;
};