// export interface Deal {
//     id: string;
//     name: string;
//     stage: 'Presentation Scheduled' | 'Qualified to Buy' | 'Contract Sent' | 'Closed Won' | 'Appointment Scheduled' | 'Decision Maker Bought In' | 'Closed Lost';
//     closeDate: string;
//     owner: string;
//     amount: number;
//     createdAt: string;
// }


export interface Deal {
  id: string;
  name: string;
  stage: string;
  closeDate: string;
  owner: number;
  ownerName: string;
  amount: number;
  leadId?: number; // 🔥 ADD THIS LINE
  createdAt?: string;
  updatedAt?: string;
  
}