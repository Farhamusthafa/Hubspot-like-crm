// import { API } from "./api";

// // Helper function to handle authentication errors
// const handleAuthError = (error: any) => {
//   if (error.message?.includes('401') || error.message?.includes('Unauthorized') || error.message?.includes('token')) {
//     // Clear invalid token and redirect to login (only on client side)
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//   }
// };

// // Helper function to make authenticated API calls
// const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

//   const defaultOptions = {
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//       ...options.headers
//     },
//     ...options
//   };

//   const response = await fetch(`${API}${url}`, defaultOptions);

//   if (response.status === 401) {
//     const error = await response.json().catch(() => ({}));
//     throw new Error(error.message || 'Authentication failed - please login again');
//   }

//   return response;
// };

// export const login = async (email: string, password: string) => {
//   const res = await fetch(`${API}/auth/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       email,
//       password
//     })
//   });
//   console.log("API URL:", API);

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Login failed");
//   }

//   return res.json();
// };

// export const register = async (userData: {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   phone: string;
//   companyName: string;
//   industryType: string;
//   countryRegion: string;
// }) => {
//   const res = await fetch(`${API}/auth/register`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(userData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Registration failed");
//   }

//   return res.json();
// };

// // Dashboard API Functions
// export const getDashboardKPIs = async () => {
//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//   const res = await fetch(`${API}/dashboard/kpis`, {
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to fetch KPIs");
//   }

//   return res.json();
// };

// export const getDashboardMetrics = async () => {
//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//   const res = await fetch(`${API}/dashboard/metrics`, {
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to fetch dashboard metrics");
//   }

//   return res.json();
// };

// export const getSalesReport = async () => {
//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//   const res = await fetch(`${API}/dashboard/sales-report`, {
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to fetch sales report");
//   }

//   return res.json();
// };

// export const getConversionData = async () => {
//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//   const res = await fetch(`${API}/dashboard/conversion`, {
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to fetch conversion data");
//   }

//   return res.json();
// };

// export const getTeamPerformance = async () => {
//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//   const res = await fetch(`${API}/dashboard/team-performance`, {
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to fetch team performance");
//   }

//   return res.json();
// };

// // Notification API functions
// // User Management API Functions
// export const getAllUsers = async () => {
//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//   const res = await fetch(`${API}/users`, {
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to fetch users");
//   }

//   return res.json();
// };

// export const createUserAccount = async (userData: any) => {
//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//   const res = await fetch(`${API}/users`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(userData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to create user");
//   }

//   return res.json();
// };

// export const updateUser = async (id: string, userData: any) => {
//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//   const res = await fetch(`${API}/users/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(userData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to update user");
//   }

//   return res.json();
// };

// export const deleteUser = async (id: string) => {
//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//   console.log('=== DELETE USER DEBUG START ===');
//   console.log('Delete API call - ID:', id, 'Token exists:', !!token);
//   console.log('Delete API full URL:', `${API}/users/${id}`);
//   console.log('Delete API method: DELETE');

//   if (!token) {
//     console.error('No authentication token found');
//     throw new Error('No authentication token found');
//   }

//   console.log('Delete API headers:', {
//     "Content-Type": "application/json",
//     "Authorization": `Bearer ${token.substring(0, 20) + '...'}`
//   });

//   try {
//     console.log('Making fetch request...');
//     const res = await fetch(`${API}/users/${id}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       }
//     });

//     console.log('Delete API response status:', res.status, 'OK:', res.ok);
//     console.log('Delete API response headers:', [...res.headers.entries()]);
//     console.log('Delete API response type:', res.type);
//     console.log('Delete API response url:', res.url);

//     if (!res.ok) {
//       console.log('Response not OK, parsing error...');
//       let error;
//       try {
//         const responseText = await res.text();
//         console.log('Delete API raw response text:', responseText);
//         console.log('Delete API raw response text length:', responseText.length);
//         console.log('Delete API raw response text is empty:', responseText.length === 0);

//         if (responseText.length === 0) {
//           error = { message: `HTTP ${res.status}: ${res.statusText} (empty response)` };
//         } else {
//           try {
//             error = JSON.parse(responseText);
//           } catch (parseError) {
//             console.error('Failed to parse error response:', parseError);
//             error = { message: `HTTP ${res.status}: ${res.statusText} - ${responseText}` };
//           }
//         }
//       } catch (textError) {
//         console.error('Failed to get response text:', textError);
//         error = { message: `HTTP ${res.status}: ${res.statusText}` };
//       }

//       // If error object is empty or has no message, use HTTP status
//       if (!error.message || error.message === '') {
//         error.message = `HTTP ${res.status}: ${res.statusText}`;
//       }

//       console.error('Delete API error:', error);
//       console.log('=== DELETE USER DEBUG END ===');
//       throw new Error(error.message || "Failed to delete user");
//     }

//     console.log('Response OK, parsing success...');
//     const result = await res.json();
//     console.log('Delete API success:', result);
//     console.log('=== DELETE USER DEBUG END ===');
//     return result;
//   } catch (fetchError) {
//     console.error('Fetch error:', fetchError);
//     console.log('=== DELETE USER DEBUG END ===');
//     throw fetchError;
//   }
// };

// // Lead API functions
// export const createLead = async (leadData: {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   company: string;
//   jobTitle?: string;
//   status: string;
//   value: number;
//   source?: string;
//   assignedTo?: string;
// }) => {
//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

//   // Combine firstName and lastName into name for backend
//   const backendData = {
//     name: `${leadData.firstName} ${leadData.lastName}`,
//     email: leadData.email,
//     phone: leadData.phone,
//     company: leadData.company,
//     jobTitle: leadData.jobTitle,
//     status: leadData.status,
//     value: leadData.value,
//     source: leadData.source,
//     assignedTo: leadData.assignedTo
//   };

//   const res = await fetch(`${API}/leads`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(backendData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to create lead");
//   }

//   return res.json();
// };

// export const updateLead = async (id: number, leadData: {
//   firstName?: string;
//   lastName?: string;
//   email?: string;
//   phone?: string;
//   company?: string;
//   jobTitle?: string;
//   status?: string;
//   value?: number;
//   source?: string;
//   assignedTo?: string;
// }) => {
//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

//   // Combine firstName and lastName into name for backend
//   const backendData = {
//     name: leadData.firstName && leadData.lastName ? `${leadData.firstName} ${leadData.lastName}` : undefined,
//     email: leadData.email,
//     phone: leadData.phone,
//     company: leadData.company,
//     jobTitle: leadData.jobTitle,
//     status: leadData.status,
//     value: leadData.value,
//     source: leadData.source,
//     assignedTo: leadData.assignedTo
//     company?: string;
//     jobTitle?: string;
//     status?: string;
//     value?: number;
//     source?: string;
//     assignedTo?: string;
//   }) => {
//   const token = localStorage.getItem('token');

//   // Combine firstName and lastName into name for backend
//   const backendData = {
//     name: leadData.firstName && leadData.lastName ? `${leadData.firstName} ${leadData.lastName}` : undefined,
//     email: leadData.email,
//     phone: leadData.phone,
//     company: leadData.company,
//     jobTitle: leadData.jobTitle,
//     status: leadData.status,
//     value: leadData.value,
//     source: leadData.source,
//     assignedTo: leadData.assignedTo
//   };

//   const res = await fetch(`${API}/leads/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(backendData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to update lead");
//   }

//   return res.json();
// };

// export const deleteLead = async (id: number) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/leads/${id}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to delete lead");
//   }

//   return res.json();
// };

// export const convertLead = async (id: number, dealData: any) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/leads/${id}/convert`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(dealData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to convert lead");
//   }

//   return res.json();
// };

// // Attachment API functions
// export const uploadAttachment = async (entityType: string, entityId: number, file: File) => {
//   const token = localStorage.getItem('token');
//   const formData = new FormData();
//   formData.append('file', file);

//   const res = await fetch(`${API}/attachments/${entityType}/${entityId}/upload`, {
//     method: "POST",
//     headers: {
//       "Authorization": `Bearer ${token}`
//     },
//     body: formData
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to upload attachment");
//   }

//   return res.json();
// };

// export const getAttachments = async (entityType: string, entityId: number) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/attachments/${entityType}/${entityId}`, {
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to fetch attachments");
//   }

//   return res.json();
// };

// export const downloadAttachment = async (attachmentId: number) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/attachments/download/${attachmentId}`, {
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to download attachment");
//   }

//   // Convert response to blob and download
//   const blob = await res.blob();
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = ''; // Let server set filename
//   document.body.appendChild(a);
//   a.click();
//   window.URL.revokeObjectURL(url);
//   document.body.removeChild(a);
// };

// export const deleteAttachment = async (attachmentId: number) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/attachments/${attachmentId}`, {
//     method: "DELETE",
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to delete attachment");
//   }

//   return res.json();
// };
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

// export const getCompanyById = async (id: number) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/companies/${id}`, {
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to fetch company");
//   }

//   return res.json();
// };

// export const createCompany = async (companyData: {
//   name: string;
//   owner: string;
//   phone?: string;
//   industry: string;
//   city?: string;
//   country?: string;
//   type?: string;
//   employees?: string;
//   revenue?: string;
//   domain?: string;
// }) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/companies`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(companyData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to create company");
//   }

//   return res.json();
// };

// export const updateCompany = async (id: number, companyData: {
//   name?: string;
//   owner?: string;
//   phone?: string;
//   industry?: string;
//   city?: string;
//   country?: string;
//   type?: string;
//   employees?: string;
//   revenue?: string;
//   domain?: string;
// }) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/companies/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(companyData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to update company");
//   }

//   return res.json();
// };

// export const deleteCompany = async (id: number) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/companies/${id}`, {
//     method: "DELETE",
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to delete company");
//   }

//   return res.json();
// };

// // Deal API functions
// export const getDeals = async () => {
//   try {
//     const res = await makeAuthenticatedRequest('/deals', {
//       method: "GET"
//     });

//     if (!res.ok) {
//       const error = await res.json();
//       throw new Error(error.message || "Failed to fetch deals");
//     }

//     const data = await res.json();

//     // Ensure we return an array
//     if (!Array.isArray(data)) {
//       console.warn('API returned non-array data, converting to array:', data);
//       return Array.isArray(data.deals) ? data.deals : [];
//     }

//     return data;
//   } catch (error: any) {
//     handleAuthError(error);
//     throw error;
//   }
// };

// export const getDealById = async (id: number) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/deals/${id}`, {
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to fetch deal");
//   }

//   return res.json();
// };

// export const createDeal = async (dealData: {
//   name: string;
//   stage: string;
//   closeDate: string;
//   owner: string;
//   amount: number;
// }) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/deals`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(dealData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to create deal");
//   }

//   return res.json();
// };

// export const updateDeal = async (id: number, dealData: {
//   name?: string;
//   stage?: string;
//   closeDate?: string;
//   owner?: string;
//   amount?: number;
// }) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/deals/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(dealData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to update deal");
//   }

//   return res.json();
// };

// export const deleteDeal = async (id: number) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/deals/${id}`, {
//     method: "DELETE",
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to delete deal");
//   }

//   return res.json();
// };

// export const importDeals = async (file: File) => {
//   const token = localStorage.getItem('token');
//   const formData = new FormData();
//   formData.append('file', file);

//   const res = await fetch(`${API}/deals/import`, {
//     method: "POST",
//     headers: {
//       "Authorization": `Bearer ${token}`
//     },
//     body: formData
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to import deals");
//   }

//   return res.json();
// };

// // Ticket API functions
// export const getTickets = async () => {
//   try {
//     const res = await makeAuthenticatedRequest('/tickets', {
//       method: "GET"
//     });

//     if (!res.ok) {
//       const error = await res.json();
//       throw new Error(error.message || "Failed to fetch tickets");
//     }

//     const data = await res.json();

//     // Ensure we return an array
//     if (!Array.isArray(data)) {
//       console.warn('API returned non-array data, converting to array:', data);
//       return Array.isArray(data.tickets) ? data.tickets : [];
//     }

//     return data;
//   } catch (error: any) {
//     handleAuthError(error);
//     throw error;
//   }
// };

// export const getTicketById = async (id: number) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/tickets/${id}`, {
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to fetch ticket");
//   }

//   return res.json();
// };

// export const createTicket = async (ticketData: {
//   title: string;
//   description: string;
//   status: string;
//   priority: string;
//   owner: string;
// }) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/tickets`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(ticketData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to create ticket");
//   }

//   return res.json();
// };

// export const updateTicket = async (id: number, ticketData: {
//   title?: string;
//   description?: string;
//   status?: string;
//   priority?: string;
//   owner?: string;
// }) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/tickets/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(ticketData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to update ticket");
//   }

//   return res.json();
// };

// export const deleteTicket = async (id: number) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/tickets/${id}`, {
//     method: "DELETE",
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to delete ticket");
//   }

//   return res.json();
// };

// // Activity API functions - Notes
// export const getNotes = async (entityType: string, entityId: number) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/${entityType}/${entityId}/notes`, {
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to fetch notes");
//   }

//   return res.json();
// };

// export const createNote = async (entityType: string, entityId: number, noteData: {
//   content: string;
// }) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/${entityType}/${entityId}/notes`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(noteData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to create note");
//   }

//   return res.json();
// };

// export const updateNote = async (entityType: string, entityId: number, noteId: number, noteData: {
//   content: string;
// }) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/${entityType}/${entityId}/notes/${noteId}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(noteData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to update note");
//   }

//   return res.json();
// };

// export const deleteNote = async (entityType: string, entityId: number, noteId: number) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/${entityType}/${entityId}/notes/${noteId}`, {
//     method: "DELETE",
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to delete note");
//   }

//   return res.json();
// };

// // Activity API functions - Tasks
// export const getTasks = async (entityType: string, entityId: number) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/${entityType}/${entityId}/tasks`, {
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to fetch tasks");
//   }

//   return res.json();
// };

// export const createTask = async (entityType: string, entityId: number, taskData: {
//   title: string;
//   description?: string;
//   dueDate: string;
//   priority?: string;
//   assignedTo?: string;
//   status?: string;
// }) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/${entityType}/${entityId}/tasks`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(taskData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to create task");
//   }

//   return res.json();
// };

// export const updateTask = async (entityType: string, entityId: number, taskId: number, taskData: {
//   title?: string;
//   description?: string;
//   dueDate?: string;
//   priority?: string;
//   assignedTo?: string;
//   status?: string;
// }) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/${entityType}/${entityId}/tasks/${taskId}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(taskData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to update task");
//   }

//   return res.json();
// };

// export const deleteTask = async (entityType: string, entityId: number, taskId: number) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/${entityType}/${entityId}/tasks/${taskId}`, {
//     method: "DELETE",
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to delete task");
//   }

//   return res.json();
// };

// // Activity API functions - Meetings
// export const getMeetings = async (entityType: string, entityId: number) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/${entityType}/${entityId}/meetings`, {
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to fetch meetings");
//   }

//   return res.json();
// };

// export const createMeeting = async (entityType: string, entityId: number, meetingData: {
//   title: string;
//   description?: string;
//   date: string;
//   time: string;
//   duration?: string;
//   attendees?: string;
//   location?: string;
// }) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/${entityType}/${entityId}/meetings`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(meetingData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to create meeting");
//   }

//   return res.json();
// };

// export const updateMeeting = async (entityType: string, entityId: number, meetingId: number, meetingData: {
//   title?: string;
//   description?: string;
//   date?: string;
//   time?: string;
//   duration?: string;
//   attendees?: string;
//   location?: string;
// }) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/${entityType}/${entityId}/meetings/${meetingId}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(meetingData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to update meeting");
//   }

//   return res.json();
// };

// export const deleteMeeting = async (entityType: string, entityId: number, meetingId: number) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/${entityType}/${entityId}/meetings/${meetingId}`, {
//     method: "DELETE",
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to delete meeting");
//   }

//   return res.json();
// };

// // Activity API functions - Emails
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

// export const createEmail = async (entityType: string, entityId: number, emailData: {
//   to: string;
//   subject: string;
//   body: string;
// }) => {
//   const token = localStorage.getItem('token');

//   // Convert frontend data to backend format
//   const backendEmailData = {
//     subject: emailData.subject,
//     content: emailData.body,
//     recipients: Array.isArray(emailData.to) ? emailData.to : [emailData.to]
//   };

//   const res = await fetch(`${API}/${entityType}/${entityId}/emails`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(backendEmailData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to create email");
//   }

//   return res.json();
// };

// export const updateEmail = async (entityType: string, entityId: number, emailId: number, emailData: {
//   to?: string;
//   subject?: string;
//   body?: string;
// }) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/${entityType}/${entityId}/emails/${emailId}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(emailData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to update email");
//   }

//   return res.json();
// };

// export const deleteEmail = async (entityType: string, entityId: number, emailId: number) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/${entityType}/${entityId}/emails/${emailId}`, {
//     method: "DELETE",
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to delete email");
//   }

//   return res.json();
// };

// // Activity API functions - Calls
// export const getCalls = async (entityType: string, entityId: number) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/${entityType}/${entityId}/calls`, {
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to fetch calls");
//   }

//   return res.json();
// };

// export const createCall = async (entityType: string, entityId: number, callData: {
//   subject: string;
//   duration?: string;
//   description?: string;
//   outcome: string;
// }) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/${entityType}/${entityId}/calls`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(callData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to create call");
//   }

//   return res.json();
// };

// export const updateCall = async (entityType: string, entityId: number, callId: number, callData: {
//   subject?: string;
//   duration?: string;
//   description?: string;
//   outcome?: string;
// }) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/${entityType}/${entityId}/calls/${callId}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(callData)
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to update call");
//   }

//   return res.json();
// };

// export const deleteCall = async (entityType: string, entityId: number, callId: number) => {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`${API}/${entityType}/${entityId}/calls/${callId}`, {
//     method: "DELETE",
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to delete call");
//   }

//   return res.json();
// };