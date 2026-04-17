// export interface IUser {
//   id: number;
//   role: 'admin' | 'user';
// }

// export interface ICompany {
//   id?: number;
//   name: string;
//   industry?: string;
//   city?: string;
//   country?: string;
//   phone?: string;
//   leadStatus?: string;
//   createdBy?: number;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// // DTO for creating a company
// export interface CompanyCreateDTO {
//   domain: string;
//   name: string;
//   owner?: string;
//   industry: "Technology" | "Finance" | "Healthcare" | "Education" | "Legal service";
//   type: "Public" | "Private" | "Government" | "Non-Profit";
//   leadStatus?: "New" | "Contacted" | "Open" | "Inprogress" | "Won" | "Lost" | "Qualified"; // optional, defaults to "New"
//   city?: string;
//   country?: string;
//   employees?: number;
//   annualRevenue?: number;
//   phone: string;
// }

// export interface CompanyUpdateDTO {
//   domain?: string;
//   name?: string;
//   owner?: string;
//   industry?: "Technology" | "Finance" | "Healthcare" | "Education" | "Legal service";
//   type?: "Public" | "Private" | "Government" | "Non-Profit";
//   leadStatus?: "New" | "Contacted" | "Open" | "Inprogress" | "Won" | "Lost" | "Qualified";
//   city?: string;
//   country?: string;
//   employees?: number;
//   annualRevenue?: number;
//   phone?: string;
// }