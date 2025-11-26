import { supabase } from '../config/database.js';
import watiService from './watiService.js';

class NotificationService {
  /**
   * Create and send notification
   */
  async createNotification(notificationData) {
    try {
      const {
        userId,
        type,
        title,
        message,
        referenceId,
        referenceType,
        phoneNumber
      } = notificationData;

      // Save notification to database
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          reference_id: referenceId,
          reference_type: referenceType,
          phone_number: phoneNumber
        })
        .select()
        .single();

      if (error) throw error;

      // Send WhatsApp notification if phone number provided
      if (phoneNumber) {
        const whatsappResult = await watiService.sendTextMessage(phoneNumber, `*${title}*\n\n${message}`);
        
        // Update notification with WhatsApp status
        await supabase
          .from('notifications')
          .update({
            whatsapp_status: whatsappResult.success ? 'sent' : 'failed',
            whatsapp_message_id: whatsappResult.messageId,
            sent_at: new Date().toISOString()
          })
          .eq('id', notification.id);
      }

      return { success: true, data: notification };
    } catch (error) {
      console.error('Create Notification Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send notification to multiple users
   */
  async sendBulkNotifications(users, notificationTemplate) {
    try {
      const results = [];
      
      for (const user of users) {
        const notification = await this.createNotification({
          userId: user.id,
          type: notificationTemplate.type,
          title: notificationTemplate.title,
          message: notificationTemplate.message,
          referenceId: notificationTemplate.referenceId,
          referenceType: notificationTemplate.referenceType,
          phoneNumber: user.phone
        });
        
        results.push(notification);
      }

      return { success: true, results };
    } catch (error) {
      console.error('Bulk Notification Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId, options = {}) {
    try {
      const { limit = 50, offset = 0, unreadOnly = false } = options;

      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (unreadOnly) {
        query = query.eq('is_read', false);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Get Notifications Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Mark Notification Read Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Mark All Read Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Notification Templates for different events
   */
  
  // Sanction Related
  async notifySanctionApproval(sanctionId) {
    try {
      const { data: sanction } = await supabase
        .from('sanctions')
        .select('*, created_by:users!sanctions_created_by_fkey(*)')
        .eq('id', sanctionId)
        .single();

      // Notify State Finance
      const { data: stateFinanceUsers } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'state_finance')
        .eq('state', sanction.state);

      for (const user of stateFinanceUsers || []) {
        await this.createNotification({
          userId: user.id,
          type: 'sanction_approved',
          title: 'Sanction Approved',
          message: `Sanction ${sanction.sanction_number} for ${sanction.state} has been approved. Amount: ₹${sanction.total_amount.toLocaleString('en-IN')}`,
          referenceId: sanctionId,
          referenceType: 'sanction',
          phoneNumber: user.phone
        });

        if (user.phone) {
          await watiService.sendSanctionApprovalNotification(user.phone, {
            sanctionNumber: sanction.sanction_number,
            state: sanction.state,
            amount: sanction.total_amount,
            approvalDate: sanction.approval_date
          });
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Notify Sanction Approval Error:', error);
      return { success: false, error: error.message };
    }
  }

  // Fund Transfer Related
  async notifyFundTransfer(allocationId) {
    try {
      const { data: allocation } = await supabase
        .from('state_allocations')
        .select('*, sanction:sanctions(*)')
        .eq('id', allocationId)
        .single();

      const { data: stateNodalUsers } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'state_nodal')
        .eq('state', allocation.state);

      for (const user of stateNodalUsers || []) {
        await this.createNotification({
          userId: user.id,
          type: 'fund_transfer',
          title: 'Fund Transfer Notification',
          message: `Funds transferred for ${allocation.state}. Amount: ₹${allocation.allocated_amount.toLocaleString('en-IN')}. Please confirm receipt.`,
          referenceId: allocationId,
          referenceType: 'allocation',
          phoneNumber: user.phone
        });

        if (user.phone) {
          await watiService.sendFundTransferNotification(user.phone, {
            state: allocation.state,
            amount: allocation.allocated_amount
          });
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Notify Fund Transfer Error:', error);
      return { success: false, error: error.message };
    }
  }

  // Agency Assignment Related
  async notifyAgencyAssignment(assignmentId) {
    try {
      const { data: assignment } = await supabase
        .from('agency_assignments')
        .select('*, project:projects(*), agency:users!agency_assignments_agency_id_fkey(*)')
        .eq('id', assignmentId)
        .single();

      await this.createNotification({
        userId: assignment.agency_id,
        type: 'agency_assignment',
        title: 'New Project Assignment',
        message: `You have been assigned as ${assignment.agency_type} for project ${assignment.project.project_code}. Please respond within 7 days.`,
        referenceId: assignmentId,
        referenceType: 'assignment',
        phoneNumber: assignment.agency.phone
      });

      if (assignment.agency.phone) {
        await watiService.sendAgencyAssignmentNotification(assignment.agency.phone, {
          projectName: assignment.project.title,
          agencyType: assignment.agency_type,
          budget: assignment.project.total_budget
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Notify Agency Assignment Error:', error);
      return { success: false, error: error.message };
    }
  }

  // UC Related
  async notifyUCStatus(ucId, status, notes = '') {
    try {
      const { data: uc } = await supabase
        .from('utilization_certificates')
        .select('*, project:projects(*), submitted_by:users!utilization_certificates_submitted_by_fkey(*)')
        .eq('id', ucId)
        .single();

      await this.createNotification({
        userId: uc.submitted_by,
        type: `uc_${status}`,
        title: `UC ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        message: `UC ${uc.uc_number} for project ${uc.project.project_code} has been ${status}. ${notes}`,
        referenceId: ucId,
        referenceType: 'uc',
        phoneNumber: uc.submitted_by.phone
      });

      if (uc.submitted_by.phone) {
        await watiService.sendUCValidationNotification(uc.submitted_by.phone, {
          projectName: uc.project.title,
          ucNumber: uc.uc_number,
          amount: uc.amount_utilized,
          status: status,
          notes: notes
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Notify UC Status Error:', error);
      return { success: false, error: error.message };
    }
  }

  // Tranche Related
  async notifyTrancheRelease(trancheId) {
    try {
      const { data: tranche } = await supabase
        .from('tranches')
        .select('*, project:projects(*, executing_agency:users!projects_executing_agency_id_fkey(*))')
        .eq('id', trancheId)
        .single();

      if (tranche.project.executing_agency) {
        await this.createNotification({
          userId: tranche.project.executing_agency.id,
          type: 'tranche_released',
          title: 'Tranche Released',
          message: `Tranche ${tranche.tranche_number} for project ${tranche.project.project_code} has been released. Amount: ₹${tranche.amount.toLocaleString('en-IN')}`,
          referenceId: trancheId,
          referenceType: 'tranche',
          phoneNumber: tranche.project.executing_agency.phone
        });

        if (tranche.project.executing_agency.phone) {
          await watiService.sendTrancheReleaseNotification(tranche.project.executing_agency.phone, {
            projectName: tranche.project.title,
            trancheNumber: tranche.tranche_number,
            amount: tranche.amount,
            releaseDate: tranche.released_date
          });
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Notify Tranche Release Error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new NotificationService();
