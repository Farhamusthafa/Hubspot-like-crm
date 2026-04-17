// Test script to check attachment functionality
import { getAttachments } from './lib/api';

async function testAttachments() {
  console.log('Testing attachment functionality...');
  
  // Check if user is logged in
  const token = localStorage.getItem('token');
  console.log('Token exists:', !!token);
  
  if (token) {
    console.log('Token:', token.substring(0, 20) + '...');
    
    try {
      // Test getting attachments for lead 1
      const attachments = await getAttachments('lead', 1);
      console.log('Attachments fetched:', attachments);
    } catch (error) {
      console.error('Error fetching attachments:', error);
    }
  } else {
    console.log('No token found - user not logged in');
  }
}

// Run test
testAttachments();
