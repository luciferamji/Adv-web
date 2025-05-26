// This is a mock authentication service
// In a real application, this would make API calls to your backend

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

const login = async (email: string, password: string): Promise<LoginResponse> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Demo credentials check
  if (email === 'admin@example.com' && password === 'password123') {
    // Create a simple JWT-like token for the super-admin
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkFkbWluIFVzZXIiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6InN1cGVyLWFkbWluIiwiZXhwIjoxOTE0NjYxODQ0fQ.dJk-XrBzZIANBGLUa22qHpH0XGNnJfFEPTcBZKQy3X0';
    
    return {
      token,
      user: {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'super-admin',
      },
    };
  } else if (email === 'advocate@example.com' && password === 'password123') {
    // Create a simple JWT-like token for the advocate
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwibmFtZSI6IkFkdm9jYXRlIFVzZXIiLCJlbWFpbCI6ImFkdm9jYXRlQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkdm9jYXRlIiwiZXhwIjoxOTE0NjYxODQ0fQ.3mHDTYvWAEYqvr5DcgFVZV1AgQbYhgJnAf8nX2KnMUs';
    
    return {
      token,
      user: {
        id: '2',
        name: 'Advocate User',
        email: 'advocate@example.com',
        role: 'advocate',
      },
    };
  }
  
  // If credentials don't match, throw an error
  throw new Error('Invalid email or password');
};

const authService = {
  login,
};

export default authService;