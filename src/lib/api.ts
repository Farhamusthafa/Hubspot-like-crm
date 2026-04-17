import { FaceRetouchingNaturalOutlined } from "@mui/icons-material";

export const API = "http://localhost:3000/api";

// Module initialization state
let isModuleReady = false;

// Initialize module after a short delay to ensure all constants are loaded
if (typeof window !== 'undefined') {
  setTimeout(() => {
    isModuleReady = true;
    console.log('API module initialized and ready');
  }, 100);
}

// Helper function to handle access denied responses
const handleAccessDenied = (error: any, defaultMessage: string) => {
  if (error.message && error.message.toLowerCase().includes('access denied')) {
    // Show as warning instead of throwing error
    if (typeof window !== 'undefined') {
      // Create a custom event to show warning
      const event = new CustomEvent('showAccessWarning', {
        detail: { message: `⚠️ ${error.message}` }
      });
      window.dispatchEvent(event);
    }
    return null; // Return null instead of throwing error
  }
  throw new Error(error.message || defaultMessage);
};

// Helper function to handle authentication errors
const handleAuthError = (error: any) => {
  if (error.message?.includes('401') || error.message?.includes('Unauthorized') || error.message?.includes('token')) {
    // Clear invalid token and redirect to login (only on client side)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }
};

// Helper function to make authenticated API calls
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  // Wait for module to be ready
  if (!isModuleReady) {
    console.warn('API module not ready yet, waiting...');
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    },
    ...options
  };

  const response = await fetch(`${API}${url}`, defaultOptions);

  if (response.status === 401) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Authentication failed - please login again');
  }

  return response;
};

export const login = async (email: string, password: string) => {
  if (!API) {
    console.error('API constant is not defined');
    throw new Error('API configuration error');
  }

  console.log('Attempting login to:', API);
  console.log('Login credentials:', { email, password: '***' });

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    console.log("Login response status:", res.status, res.statusText);
    console.log("Login response headers:", Object.fromEntries(res.headers.entries()));

    if (!res.ok) {
      let errorMessage = "Login failed";
      try {
        const error = await res.json();
        console.log("Login error response:", error);
        errorMessage = error.message || errorMessage;
      } catch (parseError) {
        console.error("Error parsing login error:", parseError);
        errorMessage = `Server error (${res.status}): ${res.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await res.json();
    console.log("Login success response:", data);
    return data;
  } catch (error: any) {
    console.error("Login fetch error:", error);

    // Check for specific network errors
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Cannot connect to server. Please check if the backend is running on http://localhost:5000');
    }

    throw new Error(error.message || "Login failed");
  }
};

export const register = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  companyName: string;
  industryType: string;
  countryRegion: string;
}) => {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Registration failed");
  }

  return res.json();
};

// Dashboard API Functions
export const getDashboardKPIs = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API}/dashboard/kpis`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    return handleAccessDenied(error, "Failed to fetch KPIs");
  }

  return res.json();
};

export const getDashboardMetrics = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API}/dashboard/metrics`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch dashboard metrics");
  }

  return res.json();
};

export const getSalesReport = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API}/dashboard/sales-report`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch sales report");
  }

  return res.json();
};

export const getConversionData = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API}/dashboard/conversion`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch conversion data");
  }

  return res.json();
};

export const getTeamPerformance = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API}/dashboard/team-performance`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    return handleAccessDenied(error, "Failed to fetch team performance");
  }

  return res.json();
};

// Notification API functions
// User Management API Functions
export const getUserByid =  async (id: number)  => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API}/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  //better option when we use more params
  //  const params = new URLSearchParams();
  // if (companyId) params.append("companyId", companyId.toString());

  // const res = await fetch(`${API}/users?${params.toString()}`, {
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  // });


  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch user");
  }

  return res.json();
};

export const getAllUsers = async (companyId?: number) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
   const url = companyId
    ? `${API}/users?companyId=${companyId}`
    : `${API}/users`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });


  //better option when we use more params
  //  const params = new URLSearchParams();
  // if (companyId) params.append("companyId", companyId.toString());

  // const res = await fetch(`${API}/users?${params.toString()}`, {
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  // });


  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch users");
  }

  return res.json();
};


export const getOwnerName = async (ownerId: number) => {
  const user = await getUserByid(ownerId); // API call
  return user?.firstName ? `${user.firstName} ${user.lastName}` : "N/A"; // Return full name or fallback
};


export const createUserAccount = async (userData: any) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(userData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create user");
  }

  return res.json();
};

export const updateUser = async (id: string, userData: any) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  console.log('updateUser called with:', { id, userData: { ...userData, profilePicture: userData.profilePicture instanceof File ? 'File object' : userData.profilePicture } });

  // Check if userData contains a file (profile picture)
  const hasFile = userData.profilePicture instanceof File;

  let res;

  if (hasFile) {
    console.log('Using FormData for file upload');
    // Use FormData for file uploads
    const formData = new FormData();

    // Add all user data fields except profilePicture
    Object.keys(userData).forEach(key => {
      if (key !== 'profilePicture') {
        formData.append(key, userData[key]);
        console.log(`Adding to FormData: ${key} = ${userData[key]}`);
      }
    });

    // Add the file if it exists
    if (userData.profilePicture) {
      formData.append('profilePicture', userData.profilePicture);
      console.log(`Adding file to FormData: ${userData.profilePicture.name}, size: ${userData.profilePicture.size}`);
    }

    console.log('Sending FormData request to:', `${API}/users/${id}`);
    res = await fetch(`${API}/users/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
        // Don't set Content-Type for FormData - browser sets it automatically with boundary
      },
      body: formData
    });
  } else {
    console.log('Using JSON for regular update');
    // Use regular JSON for non-file updates
    res = await fetch(`${API}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });
  }

  console.log('Response status:', res.status, res.statusText);
  console.log('Response headers:', Object.fromEntries(res.headers.entries()));

  if (!res.ok) {
    // Try to parse as JSON first, but handle HTML responses gracefully
    let errorMessage = "Failed to update user";
    try {
      const contentType = res.headers.get('content-type');
      console.log('Response content-type:', contentType);

      if (contentType && contentType.includes('application/json')) {
        const error = await res.json();
        console.log('JSON error response:', error);
        errorMessage = error.message || error.error || errorMessage;
      } else {
        // If not JSON, get text response (might be HTML error page)
        const textResponse = await res.text();
        console.error('Non-JSON error response (first 500 chars):', textResponse.substring(0, 500));
        if (textResponse.includes('<!DOCTYPE')) {
          errorMessage = 'Server error: Invalid response format (HTML returned)';
        } else if (textResponse.trim() === '') {
          errorMessage = `Server error (${res.status}): Empty response`;
        } else {
          errorMessage = textResponse || errorMessage;
        }
      }
    } catch (parseError) {
      console.error('Error parsing error response:', parseError);
      errorMessage = `Server error (${res.status}): ${res.statusText}`;
    }
    console.error('Final error message:', errorMessage);
    throw new Error(errorMessage);
  }

  // Handle successful response
  try {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const result = await res.json();
      console.log('Success response:', result);
      return result;
    } else {
      // Return success for non-JSON responses
      console.log('Non-JSON success response, returning success');
      return { success: true };
    }
  } catch (parseError) {
    console.error('Error parsing success response:', parseError);
    return { success: true };
  }
};

export const deleteUser = async (id: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  console.log('Delete API call - ID:', id, 'Token exists:', !!token);
  console.log('Delete API full URL:', `${API}/users/${id}`);
  console.log('Delete API method: DELETE');

  if (!token) {
    console.error('No authentication token found');
    throw new Error('No authentication token found');
  }

  console.log('Delete API headers:', {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token.substring(0, 20) + '...'}`
  });

  const res = await fetch(`${API}/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  console.log('Delete API response status:', res.status, 'OK:', res.ok);
  console.log('Delete API response headers:', [...res.headers.entries()]);
  console.log('Delete API response type:', res.type);
  console.log('Delete API response url:', res.url);

  if (!res.ok) {
    let error;
    try {
      const responseText = await res.text();
      console.log('Delete API raw response text:', responseText);
      console.log('Delete API raw response text length:', responseText.length);
      console.log('Delete API raw response text is empty:', responseText.length === 0);

      if (responseText.length === 0) {
        error = { message: `HTTP ${res.status}: ${res.statusText} (empty response)` };
      } else {
        try {
          error = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          error = { message: `HTTP ${res.status}: ${res.statusText} - ${responseText}` };
        }
      }
    } catch (textError) {
      console.error('Failed to get response text:', textError);
      error = { message: `HTTP ${res.status}: ${res.statusText}` };
    }

    // If error object is empty or has no message, use HTTP status
    if (!error.message || error.message === '') {
      error.message = `HTTP ${res.status}: ${res.statusText}`;
    }

    console.error('Delete API error:', error);
    throw new Error(error.message || "Failed to delete user");
  }

  const result = await res.json();
  console.log('Delete API success:', result);
  return result;
};

export const toggleUserStatus = async (id: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API}/users/${id}/toggle-status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to toggle user status");
  }

  return res.json();
};

export const getNotifications = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API}/notifications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch notifications");
  }

  return res.json();
};

export const markNotificationAsRead = async (id: number) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API}/notifications/${id}/read`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to mark notification as read");
  }

  return res.json();
};

export const clearAllNotifications = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API}/notifications/clear`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to clear notifications");
  }

  return res.json();
};

// Helper function to create test notifications (remove in production)
export const createTestNotification = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API}/notifications/test`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create test notification");
  }

  return res.json();
};

// Profile API functions
export const getProfile = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    console.log('No token found in localStorage');
    throw new Error('No authentication token found');
  }

  console.log('Fetching profile with token:', token.substring(0, 20) + '...');

  const res = await fetch(`${API}/auth/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  console.log('Profile response status:', res.status, res.statusText);

  if (!res.ok) {
    let errorMessage = "Failed to fetch profile";
    try {
      const error = await res.json();
      console.log('Profile error response:', error);
      errorMessage = error.message || errorMessage;

      // Handle authentication errors specifically
      if (res.status === 401) {
        console.log('Authentication failed, clearing token');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        errorMessage = 'Session expired. Please login again.';
      } else if (res.status === 404) {
        errorMessage = 'User not found. Please login again.';
      }
    } catch (parseError) {
      console.error('Error parsing profile error:', parseError);
      errorMessage = `Server error (${res.status}): ${res.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return res.json();
};

export const updateProfile = async (profileData: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  companyName?: string;
  industryType?: string;
  countryRegion?: string;
  gender?: string;
}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API}/auth/edit-profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update profile");
  }

  return res.json();
};

export const changePassword = async (passwords: {
  currentPassword: string;
  newPassword: string;
}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API}/auth/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(passwords)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to change password");
  }

  return res.json();
};

export const uploadProfilePhoto = async (file: File) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API}/auth/profile/photo`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to upload profile photo");
  }

  return res.json();
};

// Lead API functions
export const getLeads = async () => {
  try {
    const res = await makeAuthenticatedRequest('/leads', {
      method: "GET"
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch leads");
    }

    return res.json();
  } catch (error: any) {
    handleAuthError(error);
    throw error;
  }
};



export const getLeadById = async (id: number) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/leads/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch lead");
  }

  return res.json();
};

export const createLead = async (leadData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle?: string;
  status: string;
  value: number;
  source: string;
  assignedTo: string;
 
}) => {
  const token = localStorage.getItem('token');

  // Combine firstName and lastName into name for backend
  const backendData = {
    name: `${leadData.firstName} ${leadData.lastName}`,
    email: leadData.email,
    phone: leadData.phone,
    company: leadData.company,
    jobTitle: leadData.jobTitle,
    status: leadData.status,
    value: leadData.value,
    source: leadData.source,
    assignedTo: leadData.assignedTo,
  };

  const res = await fetch(`${API}/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(backendData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create lead");
  }

  return res.json();
};

export const updateLead = async (id: number, leadData: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  status?: string;
  value?: number;
  source?: string;
  assignedTo?: string;
}) => {
  const token = localStorage.getItem('token');

  // Combine firstName and lastName into name for backend
  const backendData = {
    name: leadData.firstName && leadData.lastName ? `${leadData.firstName} ${leadData.lastName}` : undefined,
    email: leadData.email,
    phone: leadData.phone,
    company: leadData.company,
    jobTitle: leadData.jobTitle,
    status: leadData.status,
    value: leadData.value,
    source: leadData.source,
    assignedTo: leadData.assignedTo
  };

  const res = await fetch(`${API}/leads/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(backendData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update lead");
  }

  return res.json();
};

export const deleteLead = async (id: number) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/leads/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete lead");
  }

  return res.json();
};

export const convertLead = async (id: number, dealData: any) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/leads/${id}/convert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(dealData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to convert lead");
  }

  return res.json();
};

// Email API functions
export const sendEmail = async (to: string | string[], subject: string, content: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('No authentication token found');
  }

  console.log('Sending email:', { to, subject, contentLength: content.length });

  const res = await fetch(`${API}/auth/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ to, subject, content })
  });

  console.log('Send email response status:', res.status, res.statusText);

  if (!res.ok) {
    let errorMessage = "Failed to send email";
    try {
      const error = await res.json();
      console.log('Send email error response:', error);
      errorMessage = error.message || errorMessage;

      // Handle authentication errors specifically
      if (res.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (parseError) {
      console.error('Error parsing send email error:', parseError);
      errorMessage = `Server error (${res.status}): ${res.statusText}`;
    }
    console.error('Final send email error message:', errorMessage);
    throw new Error(errorMessage);
  }

  const result = await res.json();
  console.log('Email sent successfully:', result);
  return result;
};
export const uploadAttachment = async (entityType: string, entityId: number, file: File) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  console.log('Uploading attachment:', { entityType, entityId, fileName: file.name, fileSize: file.size });

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API}/attachments/${entityType}/${entityId}/upload`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  });

  console.log('Upload response status:', res.status, res.statusText);

  if (!res.ok) {
    let errorMessage = "Failed to upload attachment";
    try {
      const error = await res.json();
      console.log('Upload error response:', error);
      errorMessage = error.message || error.error || errorMessage;

      // Handle specific foreign key constraint error
      if (error.message && error.message.includes('attachments_uploadedBy_fkey')) {
        errorMessage = 'Authentication error: User session invalid. Please login again.';
        // Clear invalid session
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (parseError) {
      console.error('Error parsing upload error:', parseError);
      errorMessage = `Server error (${res.status}): ${res.statusText}`;
    }
    console.error('Final upload error message:', errorMessage);
    throw new Error(errorMessage);
  }

  const result = await res.json();
  console.log('Upload success:', result);
  return result;
};

export const getAttachments = async (entityType: string, entityId: number) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/attachments/${entityType}/${entityId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch attachments");
  }

  return res.json();
};

export const downloadAttachment = async (attachmentId: number) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/attachments/download/${attachmentId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to download attachment");
  }

  // Convert response to blob and download
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = ''; // Let server set filename
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const deleteAttachment = async (attachmentId: number) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/attachments/${attachmentId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete attachment");
  }

  return res.json();
};
export const getCompanies = async (filters: any = {}) => {
   
    console.log('Fetching companies...');
     const params = new URLSearchParams(filters).toString();
     const token = localStorage.getItem('token');
     const url = params
    ? `${API}/companies?${params}`   // ✅ FIXED
    : `${API}/companies`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // const res = await fetch(`${API}/companies/${params}`, {
  //   headers: {
  //     "Authorization": `Bearer ${token}`
  //   }
  // });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch company");
  }

  return res.json();
};

  


// export const getCompanies = async () => {
//   try {
//     console.log('Fetching companies...');
//     const res = await makeAuthenticatedRequest('/companies');
//     console.log('Companies API response status:', res.status);

//     if (!res.ok) {
//       const error = await res.json();
//       console.error('Companies API error:', error);
//       throw new Error(error.message || "Failed to fetch companies");
//     }

//     const data = await res.json();
//     console.log('Companies API response data:', data);

//     // Ensure we return an array
//     if (!Array.isArray(data)) {
//       console.warn('API returned non-array data, converting to array:', data);
//       return Array.isArray(data.companies) ? data.companies : [];
//     }

//     return data;
//   } catch (error: any) {
//     console.error('Error in getCompanies:', error);
//     handleAuthError(error);
//     throw error;
//   }
// };

export const getCompanyById = async (id: number) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/companies/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch company");
  }

  return res.json();
};

export const createCompany = async (companyData: {
  name: string;
  owner: string;
  phone?: string;
  industry: string;
  city?: string;
  country?: string;
  type?: string;
  employees?: string;
  revenue?: string;
  domain?: string;
}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(companyData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create company");
  }

  return res.json();
};

export const updateCompany = async (id: number, companyData: {
  name?: string;
  owner?: string;
  phone?: string;
  industry?: string;
  city?: string;
  country?: string;
  type?: string;
  employees?: string;
  revenue?: string;
  domain?: string;
}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/companies/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(companyData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update company");
  }

  return res.json();
};

export const deleteCompany = async (id: number) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/companies/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete company");
  }

  return res.json();
};

// Deal API functions
export const getDeals = async () => {
  try {
    const res = await makeAuthenticatedRequest('/deals', {
      method: "GET"
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch deals");
    }

    const data = await res.json();

    // Ensure we return an array
    if (!Array.isArray(data)) {
      console.warn('API returned non-array data, converting to array:', data);
      return Array.isArray(data.deals) ? data.deals : [];
    }

    return data;
  } catch (error: any) {
    handleAuthError(error);
    throw error;
  }
};

export const getDealById = async (id: number) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/deals/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch deal");
  }

  return res.json();
};

export const createDeal = async (dealData: {
  name: string;
  stage: string;
  closeDate: string;
  owner: number;
  amount: number;
  leadId?: number;
}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/deals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(dealData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create deal");
  }

  return res.json();
};

export const updateDeal = async (id: number, dealData: {
  name?: string;
  stage?: string;
  closeDate?: string;
  owner?: number;
  amount?: number;
  leadId?: number;
}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/deals/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(dealData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update deal");
  }

  return res.json();
};

export const deleteDeal = async (id: number) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/deals/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete deal");
  }

  return res.json();
};

export const importDeals = async (file: File) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API}/deals/import`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to import deals");
  }

  return res.json();
};

// Import API functions
export const importCsv = async (entityType: string, file: File) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('No authentication token found');
  }

  const formData = new FormData();
  formData.append('file', file);

  console.log(`Importing ${entityType} data:`, { entityType, fileName: file.name, fileSize: file.size });

  const res = await fetch(`${API}/import/${entityType}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  });

  console.log('Import response status:', res.status, res.statusText);

  if (!res.ok) {
    let errorMessage = "Failed to import data";
    try {
      const error = await res.json();
      console.log('Import error response:', error);
      errorMessage = error.message || errorMessage;

      if (res.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (parseError) {
      console.error('Error parsing import error:', parseError);
      errorMessage = `Server error (${res.status}): ${res.statusText}`;
    }
    console.error('Final import error message:', errorMessage);
    throw new Error(errorMessage);
  }

  const result = await res.json();
  console.log('Import successful:', result);
  return result;
};

export const downloadImportTemplate = async (entityType: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('No authentication token found');
  }

  console.log(`Downloading template for ${entityType}`);

  const res = await fetch(`${API}/import/template/${entityType}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  console.log('Template response status:', res.status, res.statusText);

  if (!res.ok) {
    let errorMessage = "Failed to download template";
    try {
      const error = await res.json();
      console.log('Template error response:', error);
      errorMessage = error.message || errorMessage;

      if (res.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (parseError) {
      console.error('Error parsing template error:', parseError);
      errorMessage = `Server error (${res.status}): ${res.statusText}`;
    }
    console.error('Final template error message:', errorMessage);
    throw new Error(errorMessage);
  }

  // Create blob and download
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `${entityType}-template.csv`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);

  console.log('Template downloaded successfully');
  return true;
};

export const getImportFiles = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('No authentication token found');
  }

  console.log('Fetching import files');

  const res = await fetch(`${API}/import/files`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  console.log('Files response status:', res.status, res.statusText);

  if (!res.ok) {
    let errorMessage = "Failed to fetch import files";
    try {
      const error = await res.json();
      console.log('Files error response:', error);
      errorMessage = error.message || errorMessage;

      if (res.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (parseError) {
      console.error('Error parsing files error:', parseError);
      errorMessage = `Server error (${res.status}): ${res.statusText}`;
    }
    console.error('Final files error message:', errorMessage);
    throw new Error(errorMessage);
  }

  const result = await res.json();
  console.log('Import files fetched:', result);
  return result.files;
};

export const downloadImportFile = async (filename: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('No authentication token found');
  }

  console.log(`Downloading import file: ${filename}`);

  const res = await fetch(`${API}/import/files/${filename}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  console.log('File download response status:', res.status, res.statusText);

  if (!res.ok) {
    let errorMessage = "Failed to download file";
    try {
      const error = await res.json();
      console.log('File download error response:', error);
      errorMessage = error.message || errorMessage;

      if (res.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (parseError) {
      console.error('Error parsing file download error:', parseError);
      errorMessage = `Server error (${res.status}): ${res.statusText}`;
    }
    console.error('Final file download error message:', errorMessage);
    throw new Error(errorMessage);
  }

  // Create blob and download
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);

  console.log('File downloaded successfully');
  return true;
};

// Ticket API functions
export const getTickets = async () => {
  try {
    const res = await makeAuthenticatedRequest('/tickets', {
      method: "GET"
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch tickets");
    }

    const data = await res.json();

    // Ensure we return an array
    if (!Array.isArray(data)) {
      console.warn('API returned non-array data, converting to array:', data);
      return Array.isArray(data.tickets) ? data.tickets : [];
    }

    return data;
  } catch (error: any) {
    handleAuthError(error);
    throw error;
  }
};

export const getTicketById = async (id: number) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/tickets/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch ticket");
  }

  return res.json();
};

export const createTicket = async (ticketData: {
  title: string;
  description: string;
  status: string;
  priority: string;
  owner: string;
}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(ticketData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create ticket");
  }

  return res.json();
};

export const updateTicket = async (id: number, ticketData: {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  owner?: string;
}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/tickets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(ticketData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update ticket");
  }

  return res.json();
};

export const deleteTicket = async (id: number) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/tickets/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete ticket");
  }

  return res.json();
};

// Activity API functions - Notes
export const getNotes = async (entityType: string, entityId: number): Promise<Activity[]> => {
  const token = localStorage.getItem('token');

  const res = await fetch(
    `${API}/activities?entityType=${entityType}&entityId=${entityId}&type=note`,
    {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch notes");
  }

  return res.json();
};


export const createNote = async (
  entityType: string,
  entityId: number,
  noteData: {
    description: string;
  }
) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API}/activities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      type: "note",              // ✅ VERY IMPORTANT
      entityType,                 // ✅ NEW
      entityId,                   // ✅ NEW
      description: noteData.description,
    })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create note");
  }

  return res.json();
};


export const updateNote = async (entityType: string, entityId: number, noteId: number, noteData: {
  content: string;
}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/${entityType}/${entityId}/notes/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(noteData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update note");
  }

  return res.json();
};

export const deleteNote = async (entityType: string, entityId: number, noteId: number) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/${entityType}/${entityId}/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete note");
  }

  return res.json();
};

// Activity API functions - Tasks
export const getTasks = async (entityType: string, entityId: number): Promise<Activity[]> => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/${entityType}/${entityId}/tasks`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch tasks");
  }

  return res.json();
};

export const createTask = async (entityType: string, entityId: number, taskData: {
  title: string;
  description?: string;
  dueDate: string;
  priority?: string;
  assignedTo?: string;
  status?: string;
}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/${entityType}/${entityId}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create task");
  }

  return res.json();
};

export const updateTask = async (entityType: string, entityId: number, taskId: number, taskData: {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  assignedTo?: string;
  status?: string;
}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/${entityType}/${entityId}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update task");
  }

  return res.json();
};

export const deleteTask = async (entityType: string, entityId: number, taskId: number) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/${entityType}/${entityId}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete task");
  }

  return res.json();
};

// Activity API functions - Meetings
export const getMeetings = async (entityType: string, entityId: number): Promise<Activity[]> => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/${entityType}/${entityId}/meetings`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch meetings");
  }

  return res.json();
};

export const createMeeting = async (entityType: string, entityId: number, meetingData: {
  title: string;
  description?: string;
  date: string;
  time: string;
  duration?: string;
  attendees?: string;
  location?: string;
}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/${entityType}/${entityId}/meetings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(meetingData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create meeting");
  }

  return res.json();
};

export const updateMeeting = async (entityType: string, entityId: number, meetingId: number, meetingData: {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  duration?: string;
  attendees?: string;
  location?: string;
}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/${entityType}/${entityId}/meetings/${meetingId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(meetingData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update meeting");
  }

  return res.json();
};

export const deleteMeeting = async (entityType: string, entityId: number, meetingId: number) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/${entityType}/${entityId}/meetings/${meetingId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete meeting");
  }

  return res.json();
};

// Activity API functions - Emails
// export const getEmails = async (entityType: string, entityId: number) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/${entityType}/${entityId}/emails`, {
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to fetch emails");
//   }

//   return res.json();
// };

// 
export const createEmail = async (
  entityType: string,
  entityId: number,
  emailData: {
    to: string;
    subject: string;
    body: string;
  }
) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API}/activities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      type: "email",              // ✅ VERY IMPORTANT
      entityType,                 // ✅ NEW
      entityId,                   // ✅ NEW
      subject: emailData.subject,
      body: emailData.body,
      recipients: emailData.to
    })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create email");
  }

  return res.json();
};

export const getEmails = async (entityType: string, entityId: number): Promise<Activity[]> => {
  const token = localStorage.getItem('token');

  const res = await fetch(
    `${API}/activities?entityType=${entityType}&entityId=${entityId}&type=email`,
    {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch emails");
  }

  return res.json();
};

export const updateEmail = async (entityType: string, entityId: number, emailId: number, emailData: {
  to?: string;
  subject?: string;
  body?: string;
}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/${entityType}/${entityId}/emails/${emailId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(emailData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update email");
  }

  return res.json();
};

export const deleteEmail = async (entityType: string, entityId: number, emailId: number) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/${entityType}/${entityId}/emails/${emailId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete email");
  }

  return res.json();
};

// Activity API functions - Calls
export const getCalls = async (entityType: string, entityId: number): Promise<Activity[]> => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/${entityType}/${entityId}/calls`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch calls");
  }

  return res.json();
};

export const createCall = async (entityType: string, entityId: number, callData: {
  subject: string;
  duration?: string;
  description?: string;
  outcome: string;
}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/${entityType}/${entityId}/calls`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(callData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create call");
  }

  return res.json();
};

export const updateCall = async (entityType: string, entityId: number, callId: number, callData: {
  subject?: string;
  duration?: string;
  description?: string;
  outcome?: string;
}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/${entityType}/${entityId}/calls/${callId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(callData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update call");
  }

  return res.json();
};

export const deleteCall = async (entityType: string, entityId: number, callId: number) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/${entityType}/${entityId}/calls/${callId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete call");
  }

  return res.json();
};