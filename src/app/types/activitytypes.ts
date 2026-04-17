type Activity = {
  id: number;
  type: 'note' | 'email' | 'call' | 'task' | 'meeting';
  subject?: string;
  description?: string;
  createdAt?: string;
};