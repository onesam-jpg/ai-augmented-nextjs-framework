require('dotenv').config();
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Helper function to create a database
async function createDatabase(parentPageId, name, properties, description = '') {
  try {
    console.log(`\n📊 Creating database: ${name}...`);

    const database = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: parentPageId
      },
      title: [
        {
          type: 'text',
          text: {
            content: name
          }
        }
      ],
      description: [
        {
          type: 'text',
          text: {
            content: description
          }
        }
      ],
      properties: properties
    });

    console.log(`✅ Created: ${name}`);
    console.log(`   Database ID: ${database.id}`);
    return database;
  } catch (error) {
    console.error(`❌ Error creating ${name}:`, error.message);
    throw error;
  }
}

// DATABASE 1: Current Self Snapshot
const currentSelfSchema = {
  "Snapshot Date": {
    title: {}
  },
  "Identity Description": {
    rich_text: {}
  },
  "Current Habits - Productive": {
    rich_text: {}
  },
  "Current Habits - Unproductive": {
    rich_text: {}
  },
  "Current Habits - Neutral": {
    rich_text: {}
  },
  "Work Hours Per Week": {
    number: { format: 'number' }
  },
  "Time in Active Work %": {
    number: { format: 'percent' }
  },
  "Time in Passive Work %": {
    number: { format: 'percent' }
  },
  "Personal Time Hours": {
    number: { format: 'number' }
  },
  "Wasted Time Hours": {
    number: { format: 'number' }
  },
  "Total Monthly Income": {
    number: { format: 'dollar' }
  },
  "Active Income": {
    number: { format: 'dollar' }
  },
  "Passive Income": {
    number: { format: 'dollar' }
  },
  "Current Skills": {
    multi_select: {
      options: [
        { name: "Notary", color: "blue" },
        { name: "Real Estate", color: "green" },
        { name: "Marketing", color: "yellow" },
        { name: "Sales", color: "orange" },
        { name: "Content Creation", color: "red" },
        { name: "Automation", color: "purple" }
      ]
    }
  },
  "Average Energy Level": {
    number: { format: 'number' }
  },
  "Physical Health Score": {
    number: { format: 'number' }
  },
  "Mental Health Score": {
    number: { format: 'number' }
  },
  "Stress Level": {
    number: { format: 'number' }
  },
  "Limiting Beliefs": {
    rich_text: {}
  },
  "Empowering Beliefs": {
    rich_text: {}
  },
  "Confidence Score": {
    number: { format: 'number' }
  },
  "Top 3 Resistance Patterns": {
    rich_text: {}
  },
  "Biggest Fear": {
    rich_text: {}
  },
  "Biggest Blocker": {
    rich_text: {}
  },
  "Life Satisfaction": {
    number: { format: 'number' }
  },
  "Progress Toward Best Self %": {
    number: { format: 'percent' }
  },
  "Notes": {
    rich_text: {}
  }
};

// DATABASE 2: Best Self Vision
const bestSelfSchema = {
  "Vision Name": {
    title: {}
  },
  "Target Date": {
    date: {}
  },
  "Identity Statement": {
    rich_text: {}
  },
  "Core Values": {
    multi_select: {
      options: [
        { name: "Freedom", color: "blue" },
        { name: "Growth", color: "green" },
        { name: "Impact", color: "yellow" },
        { name: "Health", color: "red" },
        { name: "Family", color: "pink" },
        { name: "Integrity", color: "purple" },
        { name: "Creativity", color: "orange" }
      ]
    }
  },
  "Life Purpose": {
    rich_text: {}
  },
  "Ideal Day Description": {
    rich_text: {}
  },
  "Target Habits to BUILD": {
    rich_text: {}
  },
  "Target Habits to ELIMINATE": {
    rich_text: {}
  },
  "Deep Work Hours/Week": {
    number: { format: 'number' }
  },
  "Total Work Hours/Week": {
    number: { format: 'number' }
  },
  "Target Monthly Income": {
    number: { format: 'dollar' }
  },
  "Target Passive Income": {
    number: { format: 'dollar' }
  },
  "Target Energy Level": {
    number: { format: 'number' }
  },
  "Location Independence": {
    checkbox: {}
  },
  "Legacy Statement": {
    rich_text: {}
  },
  "Visualization Script": {
    rich_text: {}
  },
  "Why This Matters": {
    rich_text: {}
  }
};

// DATABASE 3: Resistance Tracker
const resistanceSchema = {
  "Resistance Event": {
    title: {}
  },
  "Detected Date": {
    date: {}
  },
  "Resistance Type": {
    select: {
      options: [
        { name: "Procrastination", color: "red" },
        { name: "Self-Sabotage", color: "orange" },
        { name: "Fear-Based Avoidance", color: "yellow" },
        { name: "Identity Conflict", color: "blue" },
        { name: "Energy Depletion", color: "gray" },
        { name: "Perfectionism", color: "purple" },
        { name: "Analysis Paralysis", color: "pink" },
        { name: "Upper Limit Problem", color: "green" },
        { name: "Imposter Syndrome", color: "brown" }
      ]
    }
  },
  "Times Rescheduled": {
    number: { format: 'number' }
  },
  "Research Hours": {
    number: { format: 'number' }
  },
  "Execution Hours": {
    number: { format: 'number' }
  },
  "Importance Rating": {
    number: { format: 'number' }
  },
  "Severity": {
    select: {
      options: [
        { name: "Low", color: "green" },
        { name: "Medium", color: "yellow" },
        { name: "High", color: "orange" },
        { name: "Critical", color: "red" }
      ]
    }
  },
  "Underlying Fear": {
    rich_text: {}
  },
  "Limiting Belief": {
    rich_text: {}
  },
  "What Am I Avoiding": {
    rich_text: {}
  },
  "Suggested Intervention": {
    select: {
      options: [
        { name: "2-Minute Rule", color: "blue" },
        { name: "Pomodoro (25 min)", color: "green" },
        { name: "Accountability Partner", color: "yellow" },
        { name: "Cookie Jar", color: "orange" },
        { name: "40% Rule Push", color: "red" },
        { name: "Reframe as Learning", color: "purple" },
        { name: "Good Enough Standard", color: "pink" },
        { name: "Research Freeze", color: "gray" },
        { name: "Mandatory Recovery", color: "brown" }
      ]
    }
  },
  "Intervention Applied": {
    checkbox: {}
  },
  "Date Applied": {
    date: {}
  },
  "Effective": {
    checkbox: {}
  },
  "Notes": {
    rich_text: {}
  }
};

// DATABASE 4: Opportunity Evaluation Matrix
const opportunitySchema = {
  "Opportunity": {
    title: {}
  },
  "Description": {
    rich_text: {}
  },
  "Status": {
    select: {
      options: [
        { name: "Idea", color: "gray" },
        { name: "Research", color: "blue" },
        { name: "Testing", color: "yellow" },
        { name: "Active", color: "green" },
        { name: "Paused", color: "orange" },
        { name: "Dead", color: "red" }
      ]
    }
  },
  "Time Freedom Score": {
    number: { format: 'number' }
  },
  "Income Potential Score": {
    number: { format: 'number' }
  },
  "Leverage Score": {
    number: { format: 'number' }
  },
  "Startup Cost Score": {
    number: { format: 'number' }
  },
  "Skill Match Score": {
    number: { format: 'number' }
  },
  "Hours Required/Week": {
    number: { format: 'number' }
  },
  "Scalable Without You": {
    checkbox: {}
  },
  "Monthly Income Potential": {
    number: { format: 'dollar' }
  },
  "Passive Income": {
    checkbox: {}
  },
  "Startup Cost": {
    number: { format: 'dollar' }
  },
  "Launched": {
    checkbox: {}
  },
  "Launch Date": {
    date: {}
  },
  "Current MRR": {
    number: { format: 'dollar' }
  },
  "Next Step": {
    rich_text: {}
  }
};

// DATABASE 5: Income Stream Tracker
const incomeStreamSchema = {
  "Income Stream": {
    title: {}
  },
  "Type": {
    select: {
      options: [
        { name: "Active - Time for Money", color: "red" },
        { name: "Active - Leveraged", color: "yellow" },
        { name: "Passive - Digital Products", color: "green" },
        { name: "Passive - Investments", color: "blue" },
        { name: "Passive - Royalties", color: "purple" },
        { name: "Passive - Business Ownership", color: "pink" }
      ]
    }
  },
  "Category": {
    select: {
      options: [
        { name: "Notary", color: "blue" },
        { name: "Real Estate", color: "green" },
        { name: "Courses", color: "yellow" },
        { name: "Coaching", color: "orange" },
        { name: "Community", color: "red" },
        { name: "SaaS", color: "purple" },
        { name: "YouTube", color: "pink" },
        { name: "Affiliate", color: "brown" },
        { name: "Investments", color: "gray" }
      ]
    }
  },
  "Monthly Amount": {
    number: { format: 'dollar' }
  },
  "Hours Required/Week": {
    number: { format: 'number' }
  },
  "Passive Percentage": {
    number: { format: 'percent' }
  },
  "Scalability": {
    select: {
      options: [
        { name: "Not Scalable", color: "red" },
        { name: "Partially", color: "yellow" },
        { name: "Highly Scalable", color: "green" },
        { name: "Infinite", color: "blue" }
      ]
    }
  },
  "Status": {
    select: {
      options: [
        { name: "Idea", color: "gray" },
        { name: "Building", color: "yellow" },
        { name: "Launched", color: "green" },
        { name: "Growing", color: "blue" },
        { name: "Mature", color: "purple" },
        { name: "Declining", color: "orange" },
        { name: "Sunset", color: "red" }
      ]
    }
  },
  "Launch Date": {
    date: {}
  },
  "Target Monthly": {
    number: { format: 'dollar' }
  },
  "On Track": {
    checkbox: {}
  },
  "Description": {
    rich_text: {}
  },
  "Next Steps": {
    rich_text: {}
  }
};

// DATABASE 6: People/CRM
const peopleSchema = {
  "Name": {
    title: {}
  },
  "Email": {
    email: {}
  },
  "Phone": {
    phone_number: {}
  },
  "Company": {
    rich_text: {}
  },
  "Tier": {
    select: {
      options: [
        { name: "Lead", color: "gray" },
        { name: "Customer", color: "green" },
        { name: "Community Member", color: "blue" },
        { name: "Collaborator", color: "purple" },
        { name: "Mentor", color: "yellow" },
        { name: "Mentee", color: "orange" },
        { name: "Affiliate", color: "pink" },
        { name: "Investor", color: "red" }
      ]
    }
  },
  "Tags": {
    multi_select: {
      options: [
        { name: "Real Estate", color: "green" },
        { name: "Notary", color: "blue" },
        { name: "Entrepreneur", color: "purple" },
        { name: "Investor", color: "yellow" },
        { name: "Content Creator", color: "red" }
      ]
    }
  },
  "Connection Strength": {
    number: { format: 'number' }
  },
  "Last Interaction": {
    date: {}
  },
  "Next Contact": {
    date: {}
  },
  "Interaction Frequency": {
    select: {
      options: [
        { name: "Weekly", color: "red" },
        { name: "Bi-weekly", color: "orange" },
        { name: "Monthly", color: "yellow" },
        { name: "Quarterly", color: "green" },
        { name: "Annually", color: "blue" },
        { name: "As Needed", color: "gray" }
      ]
    }
  },
  "What They Need": {
    rich_text: {}
  },
  "What I Need": {
    rich_text: {}
  },
  "LinkedIn": {
    url: {}
  },
  "Personal Notes": {
    rich_text: {}
  },
  "Active": {
    checkbox: {}
  }
};

// DATABASE 7: AI Agent Dashboard
const aiAgentSchema = {
  "Agent Task": {
    title: {}
  },
  "Agent": {
    select: {
      options: [
        { name: "Market Intelligence", color: "blue" },
        { name: "Content Creation", color: "green" },
        { name: "CRM & Relationships", color: "yellow" },
        { name: "Performance Analytics", color: "orange" },
        { name: "Automation Builder", color: "purple" },
        { name: "Learning & Development", color: "pink" }
      ]
    }
  },
  "Task Type": {
    select: {
      options: [
        { name: "Research", color: "blue" },
        { name: "Generate Content", color: "green" },
        { name: "Send Follow-ups", color: "yellow" },
        { name: "Analyze Data", color: "orange" },
        { name: "Build Automation", color: "purple" },
        { name: "Curate Resources", color: "pink" }
      ]
    }
  },
  "Status": {
    select: {
      options: [
        { name: "Queued", color: "gray" },
        { name: "Running", color: "yellow" },
        { name: "Completed", color: "green" },
        { name: "Failed", color: "red" }
      ]
    }
  },
  "Priority": {
    select: {
      options: [
        { name: "Low", color: "gray" },
        { name: "Medium", color: "yellow" },
        { name: "High", color: "orange" },
        { name: "Urgent", color: "red" }
      ]
    }
  },
  "Scheduled Run": {
    date: {}
  },
  "Last Run": {
    date: {}
  },
  "Frequency": {
    select: {
      options: [
        { name: "Hourly", color: "red" },
        { name: "Daily", color: "orange" },
        { name: "Weekly", color: "yellow" },
        { name: "Monthly", color: "green" },
        { name: "On-Demand", color: "blue" }
      ]
    }
  },
  "Output": {
    rich_text: {}
  },
  "Action Required": {
    checkbox: {}
  },
  "Notes": {
    rich_text: {}
  }
};

// Main function to create all databases
async function createAllDatabases() {
  try {
    console.log('🚀 Starting Life OS Database Creation...\n');
    console.log('⚠️  You need to provide a parent page ID where these databases will be created.');
    console.log('   Find this by opening a Notion page, clicking "..." → "Copy link"');
    console.log('   The ID is the part after the last slash and before the "?"\n');

    // TODO: Replace with your actual parent page ID
    const PARENT_PAGE_ID = process.env.NOTION_PARENT_PAGE_ID || 'YOUR_PAGE_ID_HERE';

    if (PARENT_PAGE_ID === 'YOUR_PAGE_ID_HERE') {
      console.error('❌ Please set NOTION_PARENT_PAGE_ID in your .env file');
      console.log('\nAdd this line to your .env file:');
      console.log('NOTION_PARENT_PAGE_ID=your-page-id-here\n');
      return;
    }

    const databases = [];

    // Create each database
    databases.push(await createDatabase(
      PARENT_PAGE_ID,
      'Current Self Snapshots',
      currentSelfSchema,
      'Quarterly assessments of your current state for transformation tracking'
    ));

    databases.push(await createDatabase(
      PARENT_PAGE_ID,
      'Best Self Vision',
      bestSelfSchema,
      'Your target future state - who you want to become'
    ));

    databases.push(await createDatabase(
      PARENT_PAGE_ID,
      'Resistance Patterns',
      resistanceSchema,
      'AI-detected resistance patterns with intervention suggestions'
    ));

    databases.push(await createDatabase(
      PARENT_PAGE_ID,
      'Opportunities',
      opportunitySchema,
      'Business opportunity evaluation matrix with scoring algorithm'
    ));

    databases.push(await createDatabase(
      PARENT_PAGE_ID,
      'Income Streams',
      incomeStreamSchema,
      'Track all income sources and transition to passive'
    ));

    databases.push(await createDatabase(
      PARENT_PAGE_ID,
      'People',
      peopleSchema,
      'CRM for building network and community'
    ));

    databases.push(await createDatabase(
      PARENT_PAGE_ID,
      'AI Agent Tasks',
      aiAgentSchema,
      'Dashboard for autonomous AI agents working 24/7'
    ));

    console.log('\n\n✅ SUCCESS! All databases created.');
    console.log('\n📋 Database IDs (save these to .env):');
    databases.forEach((db, index) => {
      const names = [
        'NOTION_DATABASE_CURRENT_SELF',
        'NOTION_DATABASE_BEST_SELF',
        'NOTION_DATABASE_RESISTANCE',
        'NOTION_DATABASE_OPPORTUNITIES',
        'NOTION_DATABASE_INCOME_STREAMS',
        'NOTION_DATABASE_PEOPLE',
        'NOTION_DATABASE_AI_AGENTS'
      ];
      console.log(`${names[index]}=${db.id}`);
    });

    console.log('\n🎯 Next Steps:');
    console.log('1. Add the database IDs above to your .env file');
    console.log('2. Run the initial data entry scripts');
    console.log('3. Deploy the Market Intelligence Agent');
    console.log('4. Start your transformation journey!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.body) {
      console.error('Details:', error.body);
    }
  }
}

// Run the script
createAllDatabases();
