// Test API endpoints
const API = 'http://localhost:5000/api';

async function testNoteAPI() {
  try {
    console.log('Testing note creation without auth...');
    
    const response = await fetch(`${API}/leads/1/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: 'Test note from API test'
      })
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testNoteAPI();
