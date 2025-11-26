import { supabase } from '../config/database.js';
import watiService from './watiService.js';
import notificationService from './notificationService.js';
import cron from 'node-cron';

class EscalationService {
  constructor() {
    this.ESCALATION_WAIT_DAYS = parseInt(process.env.ESCALATION_WAIT_DAYS) || 7;
    this.schedulerRunning = false;
  }

  /**
   * Start the escalation scheduler
   */
  startScheduler() {
    if (this.schedulerRunning) {
      console.log('Escalation scheduler is already running');
      return;
    }

    // Run every 6 hours (0 */6 * * *)
    const cronExpression = process.env.ESCALATION_CHECK_INTERVAL || '0 */6 * * *';
    
    cron.schedule(cronExpression, async () => {
      console.log('Running escalation check...', new Date().toISOString());
      await this.checkAndEscalate();
    });

    this.schedulerRunning = true;
    console.log('Escalation scheduler started with expression:', cronExpression);
  }

  /**
   * Main function to check and escalate overdue items
   */
  async checkAndEscalate() {
    try {
      console.log('Checking for overdue milestones and escalations...');
      
      // Check overdue milestones
      await this.checkOverdueMilestones();
      
      // Check existing escalations for further escalation
      await this.checkExistingEscalations();
      
      console.log('Escalation check completed');
    } catch (error) {
      console.error('Escalation Check Error:', error);
    }
  }

  /**
   * Check for overdue milestones
   */
  async checkOverdueMilestones() {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get all overdue milestones
      const { data: overdueMilestones, error } = await supabase
        .from('milestones')
        .select('*, project:projects(*, executing_agency:users!projects_executing_agency_id_fkey(*))')
        .lt('expected_date', today)
        .in('status', ['pending', 'in_progress'])
        .is('actual_date', null);

      if (error) throw error;

      for (const milestone of overdueMilestones || []) {
        // Mark milestone as overdue
        await supabase
          .from('milestones')
          .update({ 
            status: 'overdue',
            is_overdue: true 
          })
          .eq('id', milestone.id);

        // Check if escalation already exists
        const { data: existingEscalation } = await supabase
          .from('escalations')
          .select('*')
          .eq('milestone_id', milestone.id)
          .eq('status', 'open')
          .single();

        if (!existingEscalation) {
          // Create initial escalation (Level 1 - Executing Agency)
          await this.createEscalation({
            projectId: milestone.project_id,
            milestoneId: milestone.id,
            level: 1,
            type: 'milestone_overdue',
            description: `Milestone "${milestone.title}" is overdue. Expected date: ${milestone.expected_date}`,
            escalatedTo: milestone.project.executing_agency_id
          });
        }
      }
    } catch (error) {
      console.error('Check Overdue Milestones Error:', error);
    }
  }

  /**
   * Check existing escalations for further escalation
   */
  async checkExistingEscalations() {
    try {
      // Get all open escalations
      const { data: escalations, error } = await supabase
        .from('escalations')
        .select('*, project:projects(*, executing_agency:users!projects_executing_agency_id_fkey(*), implementing_agency:users!projects_implementing_agency_id_fkey(*)), milestone:milestones(*)')
        .eq('status', 'open');

      if (error) throw error;

      for (const escalation of escalations || []) {
        const daysSinceEscalation = this.calculateDaysDifference(escalation.created_at);

        // If 7 days have passed and escalation is still open, escalate to next level
        if (daysSinceEscalation >= this.ESCALATION_WAIT_DAYS) {
          await this.escalateToNextLevel(escalation);
        }
      }
    } catch (error) {
      console.error('Check Existing Escalations Error:', error);
    }
  }

  /**
   * Create new escalation
   */
  async createEscalation(escalationData) {
    try {
      const {
        projectId,
        milestoneId,
        level,
        type,
        description,
        escalatedTo
      } = escalationData;

      // Insert escalation
      const { data: escalation, error } = await supabase
        .from('escalations')
        .insert({
          project_id: projectId,
          milestone_id: milestoneId,
          escalation_level: level,
          escalation_type: type,
          description: description,
          escalated_to: escalatedTo,
          status: 'open'
        })
        .select()
        .single();

      if (error) throw error;

      // Get project and user details
      const { data: project } = await supabase
        .from('projects')
        .select('*, executing_agency:users!projects_executing_agency_id_fkey(*)')
        .eq('id', projectId)
        .single();

      const { data: escalatedToUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', escalatedTo)
        .single();

      // Send notification
      if (escalatedToUser) {
        const daysPending = milestoneId ? 
          this.calculateDaysDifference((await supabase.from('milestones').select('expected_date').eq('id', milestoneId).single()).data?.expected_date) : 0;

        await notificationService.createNotification({
          userId: escalatedToUser.id,
          type: 'escalation',
          title: `Escalation Alert - Level ${level}`,
          message: description,
          referenceId: escalation.id,
          referenceType: 'escalation',
          phoneNumber: escalatedToUser.phone
        });

        if (escalatedToUser.phone) {
          await watiService.sendEscalationNotification(escalatedToUser.phone, {
            level: level,
            projectName: project.title,
            description: description,
            daysPending: daysPending
          });
        }
      }

      console.log(`Escalation created - Level ${level} for project ${projectId}`);
      return { success: true, data: escalation };
    } catch (error) {
      console.error('Create Escalation Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Escalate to next level
   */
  async escalateToNextLevel(currentEscalation) {
    try {
      const nextLevel = currentEscalation.escalation_level + 1;
      
      if (nextLevel > 4) {
        // Maximum escalation level reached - notify Central Admin and freeze tranche
        await this.handleMaxEscalation(currentEscalation);
        return;
      }

      // Close current escalation
      await supabase
        .from('escalations')
        .update({ status: 'closed' })
        .eq('id', currentEscalation.id);

      // Determine who to escalate to
      let escalatedTo;
      const project = currentEscalation.project;

      switch (nextLevel) {
        case 2:
          // Level 2: District Officer
          const { data: districtOfficer } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'district_officer')
            .eq('district', project.district)
            .limit(1)
            .single();
          escalatedTo = districtOfficer?.id;
          break;

        case 3:
          // Level 3: State Nodal Officer
          const { data: stateNodal } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'state_nodal')
            .eq('state', project.state)
            .limit(1)
            .single();
          escalatedTo = stateNodal?.id;
          break;

        case 4:
          // Level 4: Central Admin
          const { data: centralAdmin } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'central_admin')
            .limit(1)
            .single();
          escalatedTo = centralAdmin?.id;
          break;
      }

      if (escalatedTo) {
        // Create new escalation at next level
        await this.createEscalation({
          projectId: currentEscalation.project_id,
          milestoneId: currentEscalation.milestone_id,
          level: nextLevel,
          type: currentEscalation.escalation_type,
          description: `${currentEscalation.description} (Escalated from Level ${currentEscalation.escalation_level})`,
          escalatedTo: escalatedTo
        });

        console.log(`Escalated to Level ${nextLevel} for project ${currentEscalation.project_id}`);
      }
    } catch (error) {
      console.error('Escalate to Next Level Error:', error);
    }
  }

  /**
   * Handle maximum escalation level - freeze next tranche
   */
  async handleMaxEscalation(escalation) {
    try {
      // Freeze next pending tranche
      const { data: nextTranche } = await supabase
        .from('tranches')
        .select('*')
        .eq('project_id', escalation.project_id)
        .eq('status', 'pending')
        .order('tranche_number', { ascending: true })
        .limit(1)
        .single();

      if (nextTranche) {
        await supabase
          .from('tranches')
          .update({ 
            status: 'frozen',
            notes: 'Frozen due to unresolved escalation at maximum level'
          })
          .eq('id', nextTranche.id);

        console.log(`Tranche ${nextTranche.tranche_number} frozen for project ${escalation.project_id}`);
      }

      // Notify Central Admin
      const { data: centralAdmins } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'central_admin');

      for (const admin of centralAdmins || []) {
        await notificationService.createNotification({
          userId: admin.id,
          type: 'critical_escalation',
          title: 'Critical: Maximum Escalation Reached',
          message: `Project ${escalation.project.project_code} has reached maximum escalation level. Next tranche frozen. Immediate action required.`,
          referenceId: escalation.id,
          referenceType: 'escalation',
          phoneNumber: admin.phone
        });
      }

      // Mark escalation as requiring admin action
      await supabase
        .from('escalations')
        .update({ 
          status: 'requires_admin_action',
          description: escalation.description + ' [CRITICAL - Max level reached, tranche frozen]'
        })
        .eq('id', escalation.id);

    } catch (error) {
      console.error('Handle Max Escalation Error:', error);
    }
  }

  /**
   * Resolve escalation
   */
  async resolveEscalation(escalationId, resolutionNotes) {
    try {
      const { data: escalation, error } = await supabase
        .from('escalations')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolution_notes: resolutionNotes
        })
        .eq('id', escalationId)
        .select()
        .single();

      if (error) throw error;

      // If milestone was overdue, update its status
      if (escalation.milestone_id) {
        await supabase
          .from('milestones')
          .update({ 
            status: 'completed',
            actual_date: new Date().toISOString()
          })
          .eq('id', escalation.milestone_id);
      }

      // Unfreeze any frozen tranches
      await supabase
        .from('tranches')
        .update({ status: 'pending' })
        .eq('project_id', escalation.project_id)
        .eq('status', 'frozen');

      console.log(`Escalation ${escalationId} resolved`);
      return { success: true, data: escalation };
    } catch (error) {
      console.error('Resolve Escalation Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Calculate days difference
   */
  calculateDaysDifference(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Get escalations for a project
   */
  async getProjectEscalations(projectId) {
    try {
      const { data, error } = await supabase
        .from('escalations')
        .select('*, escalated_to:users!escalations_escalated_to_fkey(*), milestone:milestones(*)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Get Project Escalations Error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new EscalationService();
