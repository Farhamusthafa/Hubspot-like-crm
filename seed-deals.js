const { sequelize } = require('./dist/config/db');
const { Deal } = require('./dist/models/deal.model');

async function seedDeals() {
  try {
    await sequelize.sync();
    
    const sampleDeals = [
      {
        name: 'Enterprise Software License',
        stage: 'Proposal',
        closeDate: '2024-03-15',
        owner: 'Jane Cooper',
        amount: 125000
      },
      {
        name: 'Cloud Migration Project',
        stage: 'Negotiation',
        closeDate: '2024-02-28',
        owner: 'Wade Warren',
        amount: 85000
      },
      {
        name: 'CRM Implementation',
        stage: 'Appointment Scheduled',
        closeDate: '2024-04-10',
        owner: 'Brooklyn Simmons',
        amount: 45000
      },
      {
        name: 'Mobile App Development',
        stage: 'Qualified to Buy',
        closeDate: '2024-03-20',
        owner: 'Leslie Alexander',
        amount: 67000
      },
      {
        name: 'Data Analytics Platform',
        stage: 'Presentation Scheduled',
        closeDate: '2024-03-08',
        owner: 'Jenny Wilson',
        amount: 92000
      },
      {
        name: 'Security Audit Services',
        stage: 'Needs Analysis',
        closeDate: '2024-04-01',
        owner: 'Guy Hawkins',
        amount: 35000
      },
      {
        name: 'AI Integration Project',
        stage: 'Proposal',
        closeDate: '2024-03-25',
        owner: 'Robert Fox',
        amount: 180000
      },
      {
        name: 'E-commerce Platform',
        stage: 'Contract Sent',
        closeDate: '2024-02-25',
        owner: 'Cameron Williamson',
        amount: 78000
      }
    ];

    // Clear existing deals
    await Deal.destroy({ where: {} });
    
    // Insert sample deals
    const createdDeals = await Deal.bulkCreate(sampleDeals);
    
    console.log(`Successfully created ${createdDeals.length} deals`);
    console.log('Sample deals:', createdDeals.map(d => ({
      id: d.id,
      name: d.name,
      stage: d.stage,
      amount: d.amount,
      owner: d.owner,
      closeDate: d.closeDate,
      createdAt: d.createdAt
    })));
    
  } catch (error) {
    console.error('Error seeding deals:', error);
  } finally {
    await sequelize.close();
  }
}

seedDeals();
