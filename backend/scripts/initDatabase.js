import { supabase } from '../config/database.js';
import { hashPassword } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const seedUsers = async () => {
  console.log('Seeding users...');

  const users = [
    {
      email: 'admin@mosje.gov.in',
      password: 'Admin@123',
      name: 'Central Admin',
      phone: '+919876543210',
      role: 'central_admin',
      organization: 'Ministry of Social Justice & Empowerment'
    },
    {
      email: 'finance@mosje.gov.in',
      password: 'Finance@123',
      name: 'Central Finance Officer',
      phone: '+919876543211',
      role: 'central_finance',
      organization: 'Ministry of Social Justice & Empowerment'
    },
    {
      email: 'nodal.maharashtra@gov.in',
      password: 'Nodal@123',
      name: 'Maharashtra State Nodal Officer',
      phone: '+919876543212',
      role: 'state_nodal',
      state: 'Maharashtra',
      organization: 'Maharashtra Social Welfare Department'
    },
    {
      email: 'finance.maharashtra@gov.in',
      password: 'Finance@123',
      name: 'Maharashtra State Finance Officer',
      phone: '+919876543213',
      role: 'state_finance',
      state: 'Maharashtra',
      organization: 'Maharashtra Finance Department'
    },
    {
      email: 'nodal.karnataka@gov.in',
      password: 'Nodal@123',
      name: 'Karnataka State Nodal Officer',
      phone: '+919876543214',
      role: 'state_nodal',
      state: 'Karnataka',
      organization: 'Karnataka Social Welfare Department'
    },
    {
      email: 'finance.karnataka@gov.in',
      password: 'Finance@123',
      name: 'Karnataka State Finance Officer',
      phone: '+919876543215',
      role: 'state_finance',
      state: 'Karnataka',
      organization: 'Karnataka Finance Department'
    },
    {
      email: 'do.pune@gov.in',
      password: 'District@123',
      name: 'District Officer - Pune',
      phone: '+919876543216',
      role: 'district_officer',
      state: 'Maharashtra',
      district: 'Pune',
      organization: 'Pune District Administration'
    },
    {
      email: 'ia.pune@gov.in',
      password: 'Agency@123',
      name: 'Implementing Agency - Pune PWD',
      phone: '+919876543217',
      role: 'implementing_agency',
      state: 'Maharashtra',
      district: 'Pune',
      organization: 'Public Works Department - Pune'
    },
    {
      email: 'ea.abc@construction.com',
      password: 'Agency@123',
      name: 'ABC Construction Pvt Ltd',
      phone: '+919876543218',
      role: 'executing_agency',
      state: 'Maharashtra',
      district: 'Pune',
      organization: 'ABC Construction Pvt Ltd'
    },
    {
      email: 'auditor@mosje.gov.in',
      password: 'Auditor@123',
      name: 'National Auditor',
      phone: '+919876543219',
      role: 'auditor',
      organization: 'Audit Department'
    }
  ];

  for (const userData of users) {
    const { password, ...userInfo } = userData;
    const passwordHash = await hashPassword(password);

    const { data, error } = await supabase
      .from('users')
      .insert({
        ...userInfo,
        password_hash: passwordHash
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Duplicate key
        console.log(`User ${userData.email} already exists, skipping...`);
      } else {
        console.error(`Error creating user ${userData.email}:`, error.message);
      }
    } else {
      console.log(`✓ Created user: ${userData.email}`);
    }
  }

  console.log('Users seeding completed!\n');
};

const seedSanctions = async () => {
  console.log('Seeding sanctions...');

  // Get central admin user
  const { data: admin } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'central_admin')
    .limit(1)
    .single();

  if (!admin) {
    console.log('No central admin found, skipping sanction seeding');
    return;
  }

  const sanctions = [
    {
      sanction_number: 'SAN-MH-2024001',
      title: 'Infrastructure Development for SC/ST Communities - Maharashtra',
      description: 'Sanction for infrastructure development including roads, water supply, and community centers',
      total_amount: 50000000,
      state: 'Maharashtra',
      status: 'approved',
      created_by: admin.id,
      approved_by: admin.id,
      approval_date: new Date('2024-01-15').toISOString(),
      pdf_url: 'https://example.com/sanctions/MH-2024001.pdf'
    },
    {
      sanction_number: 'SAN-KA-2024001',
      title: 'Educational Infrastructure Development - Karnataka',
      description: 'Sanction for building schools and educational facilities for SC/ST students',
      total_amount: 35000000,
      state: 'Karnataka',
      status: 'approved',
      created_by: admin.id,
      approved_by: admin.id,
      approval_date: new Date('2024-01-20').toISOString(),
      pdf_url: 'https://example.com/sanctions/KA-2024001.pdf'
    },
    {
      sanction_number: 'SAN-MH-2024002',
      title: 'Healthcare Infrastructure - Maharashtra',
      description: 'Sanction for primary health centers and medical facilities',
      total_amount: 25000000,
      state: 'Maharashtra',
      status: 'pending_approval',
      created_by: admin.id,
      pdf_url: 'https://example.com/sanctions/MH-2024002.pdf'
    }
  ];

  for (const sanction of sanctions) {
    const { data, error } = await supabase
      .from('sanctions')
      .insert(sanction)
      .select()
      .single();

    if (error) {
      console.error(`Error creating sanction ${sanction.sanction_number}:`, error.message);
    } else {
      console.log(`✓ Created sanction: ${sanction.sanction_number}`);

      // Create state allocation for approved sanctions
      if (sanction.status === 'approved') {
        const { error: allocError } = await supabase
          .from('state_allocations')
          .insert({
            sanction_id: data.id,
            state: sanction.state,
            allocated_amount: sanction.total_amount,
            transferred_amount: sanction.total_amount,
            transfer_date: new Date().toISOString()
          });

        if (allocError) {
          console.error(`Error creating allocation for ${sanction.sanction_number}:`, allocError.message);
        } else {
          console.log(`  ✓ Created allocation for ${sanction.sanction_number}`);
        }
      }
    }
  }

  console.log('Sanctions seeding completed!\n');
};

const seedProjects = async () => {
  console.log('Seeding projects...');

  // Get required users
  const { data: stateNodal } = await supabase
    .from('users')
    .select('id')
    .eq('email', 'nodal.maharashtra@gov.in')
    .single();

  const { data: implementingAgency } = await supabase
    .from('users')
    .select('id')
    .eq('email', 'ia.pune@gov.in')
    .single();

  const { data: executingAgency } = await supabase
    .from('users')
    .select('id')
    .eq('email', 'ea.abc@construction.com')
    .single();

  // Get sanction
  const { data: sanction } = await supabase
    .from('sanctions')
    .select('id')
    .eq('sanction_number', 'SAN-MH-2024001')
    .single();

  if (!stateNodal || !implementingAgency || !executingAgency || !sanction) {
    console.log('Required data not found, skipping project seeding');
    return;
  }

  const projects = [
    {
      project_code: 'PRJ-MH-001',
      sanction_id: sanction.id,
      title: 'Road Construction - Pune District',
      description: 'Construction of 10km road connecting SC/ST villages',
      state: 'Maharashtra',
      district: 'Pune',
      location: 'Villages: Shirur, Daund',
      total_budget: 15000000,
      component: 'Infrastructure',
      implementing_agency_id: implementingAgency.id,
      executing_agency_id: executingAgency.id,
      status: 'in_progress',
      start_date: '2024-02-01',
      expected_end_date: '2024-12-31',
      created_by: stateNodal.id
    },
    {
      project_code: 'PRJ-MH-002',
      sanction_id: sanction.id,
      title: 'Community Center Construction - Pune',
      description: 'Building community center with hall, library, and training rooms',
      state: 'Maharashtra',
      district: 'Pune',
      location: 'Shirur Village',
      total_budget: 8000000,
      component: 'Social Infrastructure',
      implementing_agency_id: implementingAgency.id,
      executing_agency_id: executingAgency.id,
      status: 'in_progress',
      start_date: '2024-03-01',
      expected_end_date: '2024-11-30',
      created_by: stateNodal.id
    }
  ];

  for (const project of projects) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) {
      console.error(`Error creating project ${project.project_code}:`, error.message);
    } else {
      console.log(`✓ Created project: ${project.project_code}`);

      // Create milestones
      const milestones = [
        {
          project_id: data.id,
          milestone_number: 1,
          title: 'Site Preparation',
          description: 'Land clearing and site preparation',
          expected_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'completed',
          actual_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
          project_id: data.id,
          milestone_number: 2,
          title: 'Foundation Work',
          description: 'Foundation and base construction',
          expected_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'in_progress'
        },
        {
          project_id: data.id,
          milestone_number: 3,
          title: 'Main Construction',
          description: 'Main structure construction',
          expected_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'pending'
        },
        {
          project_id: data.id,
          milestone_number: 4,
          title: 'Finishing Work',
          description: 'Final touches and completion',
          expected_date: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'pending'
        }
      ];

      const { error: milestoneError } = await supabase
        .from('milestones')
        .insert(milestones);

      if (milestoneError) {
        console.error(`Error creating milestones for ${project.project_code}:`, milestoneError.message);
      } else {
        console.log(`  ✓ Created milestones for ${project.project_code}`);
      }

      // Create tranches
      const tranches = [
        {
          project_id: data.id,
          tranche_number: 1,
          amount: project.total_budget * 0.3,
          status: 'released',
          requested_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          approved_date: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
          released_date: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
          released_by: stateNodal.id
        },
        {
          project_id: data.id,
          tranche_number: 2,
          amount: project.total_budget * 0.3,
          status: 'pending',
          notes: 'Pending UC approval for tranche 1'
        },
        {
          project_id: data.id,
          tranche_number: 3,
          amount: project.total_budget * 0.4,
          status: 'pending',
          notes: 'Final tranche'
        }
      ];

      const { error: trancheError } = await supabase
        .from('tranches')
        .insert(tranches);

      if (trancheError) {
        console.error(`Error creating tranches for ${project.project_code}:`, trancheError.message);
      } else {
        console.log(`  ✓ Created tranches for ${project.project_code}`);
      }
    }
  }

  console.log('Projects seeding completed!\n');
};

const initializeDatabase = async () => {
  console.log('='.repeat(60));
  console.log('PM Ajay Database Initialization');
  console.log('='.repeat(60));
  console.log();

  try {
    await seedUsers();
    await seedSanctions();
    await seedProjects();

    console.log('='.repeat(60));
    console.log('✅ Database initialization completed successfully!');
    console.log('='.repeat(60));
    console.log('\nDefault User Credentials:');
    console.log('------------------------');
    console.log('Central Admin: admin@mosje.gov.in / Admin@123');
    console.log('Central Finance: finance@mosje.gov.in / Finance@123');
    console.log('State Nodal (MH): nodal.maharashtra@gov.in / Nodal@123');
    console.log('State Finance (MH): finance.maharashtra@gov.in / Finance@123');
    console.log('District Officer: do.pune@gov.in / District@123');
    console.log('Implementing Agency: ia.pune@gov.in / Agency@123');
    console.log('Executing Agency: ea.abc@construction.com / Agency@123');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }

  process.exit(0);
};

// Run initialization
initializeDatabase();
