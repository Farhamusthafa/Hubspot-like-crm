const { sequelize } = require('./dist/config/db');
const { Ticket } = require('./dist/models/ticket.model');

async function seedTickets() {
  try {
    await sequelize.sync();
    
    const sampleTickets = [
      {
        title: 'Payment Failure Issue',
        description: 'Customer unable to complete payment due to credit card decline',
        status: 'Waiting on contact',
        source: 'Chat',
        priority: 'High',
        owner: 'Jane Cooper',
        companyName: 'Tech Corp',
        dealName: 'Enterprise License'
      },
      {
        title: 'Product Inquiry',
        description: 'Customer asking about features and pricing',
        status: 'Waiting on us',
        source: 'Email',
        priority: 'Medium',
        owner: 'Wade Warren',
        companyName: 'Startup Inc',
        dealName: 'Basic Plan'
      },
      {
        title: 'Subscription Upgrade',
        description: 'Customer wants to upgrade from basic to premium plan',
        status: 'New',
        source: 'Chat',
        priority: 'High',
        owner: 'Brooklyn Simmons',
        companyName: 'Global Tech',
        dealName: 'Premium Package'
      },
      {
        title: 'Refund Request – Order #456',
        description: 'Customer requesting refund for recent purchase',
        status: 'New',
        source: 'Phone',
        priority: 'Low',
        owner: 'Leslie Alexander',
        companyName: 'Local Business',
        dealName: null
      },
      {
        title: 'Pricing Clarification',
        description: 'Customer needs clarification on enterprise pricing tiers',
        status: 'Closed',
        source: 'Chat',
        priority: 'Medium',
        owner: 'Jenny Wilson',
        companyName: 'Enterprise Co',
        dealName: 'Enterprise Deal'
      },
      {
        title: 'Login Not Working',
        description: 'Customer unable to access account due to login issues',
        status: 'Waiting on us',
        source: 'Phone',
        priority: 'Critical',
        owner: 'Guy Hawkins',
        companyName: 'Urgent Client',
        dealName: 'Support Contract'
      },
      {
        title: 'Feature Request: Reports',
        description: 'Customer requesting custom reporting features',
        status: 'Waiting on contact',
        source: 'Phone',
        priority: 'High',
        owner: 'Robert Fox',
        companyName: 'Data Corp',
        dealName: 'Analytics Package'
      },
      {
        title: 'SLA Violation Complaint',
        description: 'Customer reporting service level agreement violation',
        status: 'Closed',
        source: 'Chat',
        priority: 'Medium',
        owner: 'Cameron Williamson',
        companyName: 'Service Corp',
        dealName: 'Support Plan'
      }
    ];

    // Clear existing tickets
    await Ticket.destroy({ where: {} });
    
    // Insert sample tickets
    const createdTickets = await Ticket.bulkCreate(sampleTickets);
    
    console.log(`Successfully created ${createdTickets.length} tickets`);
    console.log('Sample tickets:', createdTickets.map(t => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      owner: t.owner,
      createdAt: t.createdAt
    })));
    
  } catch (error) {
    console.error('Error seeding tickets:', error);
  } finally {
    await sequelize.close();
  }
}

seedTickets();
