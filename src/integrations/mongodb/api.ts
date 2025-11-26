// MongoDB API Client - Replaces Supabase client
// Get API base URL from environment or use default
const getApiBaseUrl = (): string => {
  try {
    // @ts-expect-error - Vite provides import.meta.env
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
  } catch {
    return 'http://localhost:3001/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

// Helper function to remove auth token
export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

// API request helper
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  signUp: async (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    phoneNumber?: string;
  }) => {
    const response = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.token) {
      setAuthToken(result.token);
    }
    return result;
  },

  signIn: async (email: string, password: string) => {
    const response = await apiRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (result.token) {
      setAuthToken(result.token);
    }
    return result;
  },

  signOut: () => {
    removeAuthToken();
  },

  getCurrentUser: async () => {
    const response = await apiRequest('/auth/me');
    return response.json();
  },
};

// Transactions API
export const transactionsAPI = {
  getAll: async () => {
    const response = await apiRequest('/transactions');
    const data = await response.json();
    // Convert MongoDB _id to id for compatibility
    return data.map((item: any) => ({
      ...item,
      id: item._id,
    }));
  },

  create: async (data: {
    date: string;
    description: string;
    category: string;
    amount: number;
    type: 'income' | 'expense';
  }) => {
    const response = await apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return {
      ...result,
      id: result._id,
    };
  },

  delete: async (id: string) => {
    await apiRequest(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },
};

// Invoices API
export const invoicesAPI = {
  getAll: async () => {
    const response = await apiRequest('/invoices');
    const data = await response.json();
    return data.map((item: any) => ({
      ...item,
      id: item._id,
    }));
  },

  create: async (data: {
    invoice_number: string;
    client_name: string;
    date: string;
    due_date: string;
    amount: number;
    status: 'pending' | 'paid' | 'overdue';
  }) => {
    const response = await apiRequest('/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return {
      ...result,
      id: result._id,
    };
  },

  delete: async (id: string) => {
    await apiRequest(`/invoices/${id}`, {
      method: 'DELETE',
    });
  },
};

// Loans API
export const loansAPI = {
  getAll: async () => {
    const response = await apiRequest('/loans');
    const data = await response.json();
    return data.map((item: any) => ({
      ...item,
      id: item._id,
    }));
  },

  create: async (data: {
    loan_name: string;
    principal_amount: number;
    interest_rate: number;
    start_date: string;
    end_date: string;
    monthly_payment: number;
    status: 'active' | 'paid' | 'defaulted';
  }) => {
    const response = await apiRequest('/loans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return {
      ...result,
      id: result._id,
    };
  },

  delete: async (id: string) => {
    await apiRequest(`/loans/${id}`, {
      method: 'DELETE',
    });
  },
};

// Financial Records API
export const financialRecordsAPI = {
  save: async (records: any[]) => {
    await apiRequest('/financial-records', {
      method: 'POST',
      body: JSON.stringify({ records }),
    });
  },

  getAll: async () => {
    const response = await apiRequest('/financial-records');
    const data = await response.json();
    return data.map((item: any) => ({
      ...item,
      id: item._id,
    }));
  },

  delete: async () => {
    await apiRequest('/financial-records', {
      method: 'DELETE',
    });
  },
};

// VCFO conversation API
type VcfoMessagePayload = {
  role: string;
  content: string;
  image_url?: string | null;
  secondary_image_url?: string | null;
  meta?: Record<string, unknown> | null;
};

type VcfoUploadPayload = {
  originalName: string;
  storedPath?: string | null;
  size?: number | null;
  mimeType?: string | null;
};

export const vcfoAPI = {
  getMessages: async () => {
    const response = await apiRequest('/vcfo/messages');
    const data = await response.json();
    return data.map((item: any) => ({
      ...item,
      id: item._id,
    }));
  },

  saveMessage: async (message: VcfoMessagePayload) => {
    const response = await apiRequest('/vcfo/messages', {
      method: 'POST',
      body: JSON.stringify(message),
    });
    const data = await response.json();
    return {
      ...data,
      id: data._id,
    };
  },

  clearMessages: async () => {
    await apiRequest('/vcfo/messages', {
      method: 'DELETE',
    });
  },

  getUploads: async () => {
    const response = await apiRequest('/vcfo/uploads');
    const data = await response.json();
    return data.map((item: any) => ({
      ...item,
      id: item._id,
    }));
  },

  saveUpload: async (payload: VcfoUploadPayload) => {
    const response = await apiRequest('/vcfo/uploads', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return {
      ...data,
      id: data._id,
    };
  },
};

