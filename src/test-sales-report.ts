import { DashboardService } from "./services/dashboard.service";

const testSalesReport = async () => {
  try {
    console.log("Testing sales report API...");
    
    // Mock user object
    const mockUser = {
      id: 1,
      role: "Admin",
      firstName: "Test",
      lastName: "User"
    };

    const salesData = await DashboardService.getSalesReport(mockUser);
    
    console.log("Sales Report Data:");
    console.log(JSON.stringify(salesData, null, 2));
    
    if (salesData.length === 0) {
      console.log("No sales data found. This might be why the frontend shows empty chart.");
    } else {
      console.log(`Found ${salesData.length} months of sales data!`);
    }
    
  } catch (error) {
    console.error("Error testing sales report:", error);
  }
};

testSalesReport();
