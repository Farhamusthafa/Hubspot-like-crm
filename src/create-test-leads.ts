import { Lead } from "./models/lead.model";
import { User } from "./models/user.model";
import { sequelize } from "./config/db";

const createTestLeads = async () => {
  try {
    console.log("Creating test leads for sales report...");

    // Get or create test user
    let testUser = await User.findOne({ where: { email: "test@example.com" } });

    if (!testUser) {
      console.log("Test user not found. Please create test user first.");
      return;
    }

    // Create sample leads with different statuses and values across months
    const sampleLeads = [
      {
        name: "John Smith",
        email: "john.smith@company.com",
        phone: "555-0101",
        company: "Tech Corp",
        jobTitle: "CTO",
        status: "Won",
        value: 15000.00,
        source: "Website",
        assignedToName: `${testUser.firstName} ${testUser.lastName}`,
        assignedToId: testUser.id,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        name: "Sarah Johnson",
        email: "sarah.j@business.com",
        phone: "555-0102",
        company: "Business Inc",
        jobTitle: "CEO",
        status: "Won",
        value: 25000.00,
        source: "Referral",
        assignedToName: `${testUser.firstName} ${testUser.lastName}`,
        assignedToId: testUser.id,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-15')
      },
      {
        name: "Mike Davis",
        email: "mike.davis@startup.com",
        phone: "555-0103",
        company: "Startup LLC",
        jobTitle: "Founder",
        status: "Inprogress",
        value: 12000.00,
        source: "LinkedIn",
        assignedToName: `${testUser.firstName} ${testUser.lastName}`,
        assignedToId: testUser.id,
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-03-10')
      },
      {
        name: "Emily Wilson",
        email: "emily.w@enterprise.com",
        phone: "555-0104",
        company: "Enterprise Co",
        jobTitle: "VP Sales",
        status: "Won",
        value: 35000.00,
        source: "Cold Call",
        assignedToName: `${testUser.firstName} ${testUser.lastName}`,
        assignedToId: testUser.id,
        createdAt: new Date('2024-03-20'),
        updatedAt: new Date('2024-03-25')
      },
      {
        name: "Robert Brown",
        email: "robert.b@corp.com",
        phone: "555-0105",
        company: "Global Corp",
        jobTitle: "Director",
        status: "Qualified",
        value: 18000.00,
        source: "Email",
        assignedToName: `${testUser.firstName} ${testUser.lastName}`,
        assignedToId: testUser.id,
        createdAt: new Date('2024-04-08'),
        updatedAt: new Date('2024-04-12')
      },
      {
        name: "Lisa Anderson",
        email: "lisa.a@tech.com",
        phone: "555-0106",
        company: "Tech Solutions",
        jobTitle: "Manager",
        status: "Won",
        value: 22000.00,
        source: "Website",
        assignedToName: `${testUser.firstName} ${testUser.lastName}`,
        assignedToId: testUser.id,
        createdAt: new Date('2024-04-15'),
        updatedAt: new Date('2024-04-20')
      },
      {
        name: "David Martinez",
        email: "david.m@services.com",
        phone: "555-0107",
        company: "Services Ltd",
        jobTitle: "President",
        status: "Contacted",
        value: 8000.00,
        source: "Conference",
        assignedToName: `${testUser.firstName} ${testUser.lastName}`,
        assignedToId: testUser.id,
        createdAt: new Date('2024-05-01'),
        updatedAt: new Date('2024-05-05')
      },
      {
        name: "Jennifer Taylor",
        email: "jennifer.t@retail.com",
        phone: "555-0108",
        company: "Retail Plus",
        jobTitle: "Owner",
        status: "Won",
        value: 28000.00,
        source: "Referral",
        assignedToName: `${testUser.firstName} ${testUser.lastName}`,
        assignedToId: testUser.id,
        createdAt: new Date('2024-05-10'),
        updatedAt: new Date('2024-05-15')
      }
    ];

    // Check if leads already exist
    const existingLeads = await Lead.count();
    if (existingLeads > 0) {
      console.log(`Found ${existingLeads} existing leads. Skipping creation.`);
      return;
    }

    // Create leads
    const createdLeads = await Lead.bulkCreate(sampleLeads);
    console.log(`Successfully created ${createdLeads.length} test leads!`);

    // Display summary
    const wonLeads = createdLeads.filter(lead => lead.status === 'Won');
    const totalWonValue = wonLeads.reduce((sum, lead) => sum + parseFloat((lead as any).value?.toString() || '0'), 0);

    console.log(`\nSummary:`);
    console.log(`- Total leads created: ${createdLeads.length}`);
    console.log(`- Won deals: ${wonLeads.length}`);
    console.log(`- Total won value: $${totalWonValue.toLocaleString()}`);
    console.log(`\nSales report should now display data!`);

  } catch (error) {
    console.error("Error creating test leads:", error);
  } finally {
    await sequelize.close();
  }
};

// Run the function
createTestLeads();
