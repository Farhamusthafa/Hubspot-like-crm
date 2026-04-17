// Utility functions for activity display
import { API } from "@/lib/api";

export const formatDateTime = (value: string) => {
  const d = new Date(value);

  return {
    date: d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    time: d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
  };
};

export const formatMonth = (value: string) => {
  const d = new Date(value);

  return d.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
};

export const formatUsername = (user: any): string => {
  if (!user) return 'Unknown User';

  // If user has firstName and lastName
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  // If user has only one name field
  if (user.name) {
    return user.name;
  }

  // If user has only firstName
  if (user.firstName) {
    return user.firstName;
  }

  // If user has only lastName
  if (user.lastName) {
    return user.lastName;
  }

  // If user has email (fallback)
  if (user.email) {
    return user.email.split('@')[0]; // Show only the part before @
  }

  return 'Unknown User';
};

export const getActivityUser = (activity: any): any => {
  // Try different possible user field names
  return activity.user || activity.createdByUser || activity.User || null;
};

export const getEntityName = (activity: any): string => {
  // Try to get entity name from different possible field names
  if (activity.entityName) return activity.entityName;
  if (activity.name) return activity.name;
  if (activity.title) return activity.title;
  if (activity.subject) return activity.subject;

  // Fallback to entity type with ID
  const entityType = activity.entityType || 'unknown';
  const entityId = activity.entityId || 'unknown';
  return `${entityType} #${entityId}`;
};

// Function to fetch entity details by type and ID
export const fetchEntityDetails = async (entityType: string, entityId: number): Promise<string> => {
  try {
    const token = localStorage.getItem('token');

    // Map entity types to correct API endpoints
    const apiEndpoints: Record<string, string> = {
      'lead': 'leads',
      'company': 'companies',
      'deal': 'deals',
      'ticket': 'tickets',
      'contact': 'contacts',
      'opportunity': 'opportunities',
      'account': 'accounts'
    };

    const endpoint = apiEndpoints[entityType] || entityType;
    const response = await fetch(`${API}/${endpoint}/${entityId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const entity = await response.json();

      // Return the appropriate name based on entity type
      switch (entityType) {
        case 'lead':
          return entity.name || entity.firstName || `${entity.firstName || ''} ${entity.lastName || ''}`.trim() || `Lead #${entityId}`;
        case 'company':
          return entity.name || entity.companyName || `Company #${entityId}`;
        case 'deal':
          return entity.title || entity.dealName || entity.name || `Deal #${entityId}`;
        case 'ticket':
          return entity.title || entity.subject || entity.ticketName || `Ticket #${entityId}`;
        case 'contact':
          return `${entity.firstName || ''} ${entity.lastName || ''}`.trim() || entity.name || `Contact #${entityId}`;
        case 'opportunity':
          return entity.name || entity.title || entity.opportunityName || `Opportunity #${entityId}`;
        case 'account':
          return entity.name || entity.accountName || `Account #${entityId}`;
        default:
          return entity.name || entity.title || entity.subject || `${entityType} #${entityId}`;
      }
    }
  } catch (error) {
    console.error('Error fetching entity details:', error);
  }

  // Fallback
  return `${entityType} #${entityId}`;
};
