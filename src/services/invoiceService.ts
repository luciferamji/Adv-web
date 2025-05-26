interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  caseId?: string;
  caseName?: string;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2025-001',
    clientId: '1',
    clientName: 'John Smith',
    caseId: 'CASE-2025-001',
    caseName: 'Smith vs. Johnson Property Dispute',
    issueDate: '2025-02-01',
    dueDate: '2025-02-15',
    status: 'sent',
    items: [
      {
        id: '1',
        description: 'Initial Consultation',
        quantity: 1,
        rate: 250,
        amount: 250
      },
      {
        id: '2',
        description: 'Document Review',
        quantity: 3,
        rate: 200,
        amount: 600
      }
    ],
    subtotal: 850,
    tax: 85,
    total: 935
  }
];

export const getInvoices = async (): Promise<Invoice[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockInvoices;
};

export const getInvoice = async (id: string): Promise<Invoice> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const invoice = mockInvoices.find(i => i.id === id);
  if (!invoice) throw new Error('Invoice not found');
  return invoice;
};

export const createInvoice = async (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber'>): Promise<Invoice> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newInvoice: Invoice = {
    ...invoiceData,
    id: Math.random().toString(36).substr(2, 9),
    invoiceNumber: `INV-2025-${String(mockInvoices.length + 1).padStart(3, '0')}`
  };
  
  mockInvoices.push(newInvoice);
  return newInvoice;
};

export const updateInvoice = async (id: string, invoiceData: Partial<Invoice>): Promise<Invoice> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = mockInvoices.findIndex(i => i.id === id);
  if (index === -1) throw new Error('Invoice not found');
  
  mockInvoices[index] = {
    ...mockInvoices[index],
    ...invoiceData
  };
  
  return mockInvoices[index];
};

export const deleteInvoice = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = mockInvoices.findIndex(i => i.id === id);
  if (index === -1) throw new Error('Invoice not found');
  mockInvoices.splice(index, 1);
};