const { sequelize } = require('./dist/config/db');
const { Company } = require('./dist/models/company.model');

async function seedCompanies() {
  try {
    await sequelize.sync();
    
    const sampleCompanies = [
      {
        name: 'Tech Corporation',
        industry: 'Technology',
        type: 'Public',
        status: 'Qualified',
        city: 'San Francisco',
        country: 'USA',
        employees: 5000,
        annualRevenue: 2500000000,
        phone: '+1-415-555-0100',
        owner: 'Jane Cooper'
      },
      {
        name: 'Global Finance Inc',
        industry: 'Finance',
        type: 'Private',
        status: 'Contacted',
        city: 'New York',
        country: 'USA',
        employees: 1200,
        annualRevenue: 850000000,
        phone: '+1-212-555-0200',
        owner: 'Wade Warren'
      },
      {
        name: 'Healthcare Solutions',
        industry: 'Healthcare',
        type: 'Private',
        status: 'New',
        city: 'Boston',
        country: 'USA',
        employees: 800,
        annualRevenue: 320000000,
        phone: '+1-617-555-0300',
        owner: 'Brooklyn Simmons'
      },
      {
        name: 'Education First',
        industry: 'Education',
        type: 'Non-Profit',
        status: 'Open',
        city: 'Chicago',
        country: 'USA',
        employees: 300,
        annualRevenue: 45000000,
        phone: '+1-312-555-0400',
        owner: 'Leslie Alexander'
      },
      {
        name: 'Legal Services Co',
        industry: 'Legal service',
        type: 'Private',
        status: 'Inprogress',
        city: 'Los Angeles',
        country: 'USA',
        employees: 150,
        annualRevenue: 28000000,
        phone: '+1-310-555-0500',
        owner: 'Jenny Wilson'
      },
      {
        name: 'Government Agency',
        industry: 'Technology',
        type: 'Government',
        status: 'Won',
        city: 'Washington DC',
        country: 'USA',
        employees: 10000,
        annualRevenue: 5000000000,
        phone: '+1-202-555-0600',
        owner: 'Guy Hawkins'
      },
      {
        name: 'Startup Innovations',
        industry: 'Technology',
        type: 'Private',
        status: 'Lost',
        city: 'Austin',
        country: 'USA',
        employees: 50,
        annualRevenue: 5000000,
        phone: '+1-512-555-0700',
        owner: 'Robert Fox'
      },
      {
        name: 'Non-Profit Foundation',
        industry: 'Education',
        type: 'Non-Profit',
        status: 'Qualified',
        city: 'Seattle',
        country: 'USA',
        employees: 75,
        annualRevenue: 12000000,
        phone: '+1-206-555-0800',
        owner: 'Cameron Williamson'
      }
    ];

    // Clear existing companies
    await Company.destroy({ where: {} });
    
    // Insert sample companies
    const createdCompanies = await Company.bulkCreate(sampleCompanies);
    
    console.log(`Successfully created ${createdCompanies.length} companies`);
    console.log('Sample companies:', createdCompanies.map(c => ({
      id: c.id,
      name: c.name,
      domain: c.domain,
      industry: c.industry,
      type: c.type,
      status: c.status,
      owner: c.owner,
      city: c.city,
      employees: c.employees,
      createdAt: c.createdAt
    })));
    
  } catch (error) {
    console.error('Error seeding companies:', error);
  } finally {
    await sequelize.close();
  }
}

seedCompanies();
