import { Lead } from "./models/lead.model";
import { User } from "./models/user.model";
import { sequelize } from "./config/db";

const updateTestLeads = async () => {
  try {
    console.log("Updating test leads with current year dates...");

    // Get all existing leads
    const leads = await Lead.findAll();
    
    if (leads.length === 0) {
      console.log("No leads found to update.");
      return;
    }

    // Update leads with current year dates
    const currentYear = new Date().getFullYear();
    const updates = leads.map((lead, index) => {
      const month = Math.floor(index % 12) + 1; // Distribute across months 1-12
      const day = Math.floor(Math.random() * 28) + 1; // Random day 1-28
      
      return {
        id: lead.id,
        createdAt: new Date(`${currentYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`),
        updatedAt: new Date(`${currentYear}-${month.toString().padStart(2, '0')}-${(day + 5).toString().padStart(2, '0')}`)
      };
    });

    // Apply updates
    for (const update of updates) {
      await Lead.update(
        { 
          createdAt: update.createdAt,
          updatedAt: update.updatedAt
        },
        { where: { id: update.id } }
      );
    }

    console.log(`Successfully updated ${updates.length} leads with ${currentYear} dates!`);

    // Show updated leads
    const updatedLeads = await Lead.findAll({
      order: [['createdAt', 'ASC']]
    });

    console.log("\nUpdated leads:");
    updatedLeads.forEach(lead => {
      console.log(`- ${lead.name}: ${lead.status}, $${lead.value}, Created: ${lead.createdAt.toISOString().split('T')[0]}`);
    });

  } catch (error) {
    console.error("Error updating test leads:", error);
  } finally {
    await sequelize.close();
  }
};

// Run the function
updateTestLeads();
