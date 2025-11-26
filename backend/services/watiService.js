import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const WATI_API_URL = process.env.WATI_API_URL;
const WATI_API_KEY = process.env.WATI_API_KEY;

class WatiService {
  constructor() {
    this.apiUrl = WATI_API_URL;
    this.apiKey = WATI_API_KEY;
    this.headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Send a template message via WhatsApp
   */
  async sendTemplateMessage(phoneNumber, templateName, parameters = []) {
    try {
      // Format phone number (remove + and spaces)
      const formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
      
      const payload = {
        template_name: templateName,
        broadcast_name: `notification_${Date.now()}`,
        parameters: parameters.map(param => ({
          name: param.name,
          value: param.value
        })),
        receivers: [{
          whatsappNumber: formattedPhone
        }]
      };

      const response = await axios.post(
        `${this.apiUrl}/sendTemplateMessages`,
        payload,
        { headers: this.headers }
      );

      return {
        success: true,
        messageId: response.data.messageId || response.data.id,
        data: response.data
      };
    } catch (error) {
      console.error('WATI Template Message Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Send a simple text message via WhatsApp
   */
  async sendTextMessage(phoneNumber, message) {
    try {
      const formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
      
      const payload = {
        phone: formattedPhone,
        message: message
      };

      const response = await axios.post(
        `${this.apiUrl}/sendSessionMessage/${formattedPhone}`,
        payload,
        { headers: this.headers }
      );

      return {
        success: true,
        messageId: response.data.messageId || response.data.id,
        data: response.data
      };
    } catch (error) {
      console.error('WATI Text Message Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Send sanction approval notification
   */
  async sendSanctionApprovalNotification(phoneNumber, sanctionData) {
    const message = `🎉 *Sanction Approved*\n\n` +
      `Sanction Number: ${sanctionData.sanctionNumber}\n` +
      `State: ${sanctionData.state}\n` +
      `Amount: ₹${sanctionData.amount.toLocaleString('en-IN')}\n` +
      `Date: ${new Date(sanctionData.approvalDate).toLocaleDateString('en-IN')}\n\n` +
      `Please check the portal for details.`;
    
    return await this.sendTextMessage(phoneNumber, message);
  }

  /**
   * Send fund transfer notification
   */
  async sendFundTransferNotification(phoneNumber, transferData) {
    const message = `💰 *Fund Transfer Notification*\n\n` +
      `State: ${transferData.state}\n` +
      `Amount: ₹${transferData.amount.toLocaleString('en-IN')}\n` +
      `Please confirm the receipt in the portal.`;
    
    return await this.sendTextMessage(phoneNumber, message);
  }

  /**
   * Send agency assignment notification
   */
  async sendAgencyAssignmentNotification(phoneNumber, assignmentData) {
    const message = `📋 *New Project Assignment*\n\n` +
      `Project: ${assignmentData.projectName}\n` +
      `Role: ${assignmentData.agencyType}\n` +
      `Budget: ₹${assignmentData.budget.toLocaleString('en-IN')}\n\n` +
      `Please accept/reject within 7 days.`;
    
    return await this.sendTextMessage(phoneNumber, message);
  }

  /**
   * Send milestone overdue warning
   */
  async sendMilestoneOverdueWarning(phoneNumber, milestoneData) {
    const message = `⚠️ *Milestone Overdue Alert*\n\n` +
      `Project: ${milestoneData.projectName}\n` +
      `Milestone: ${milestoneData.milestoneName}\n` +
      `Expected Date: ${new Date(milestoneData.expectedDate).toLocaleDateString('en-IN')}\n\n` +
      `Please provide update immediately.`;
    
    return await this.sendTextMessage(phoneNumber, message);
  }

  /**
   * Send escalation notification
   */
  async sendEscalationNotification(phoneNumber, escalationData) {
    const levelEmojis = ['⚠️', '🔶', '🔴', '🚨'];
    const emoji = levelEmojis[escalationData.level - 1] || '⚠️';
    
    const message = `${emoji} *Escalation Alert - Level ${escalationData.level}*\n\n` +
      `Project: ${escalationData.projectName}\n` +
      `Issue: ${escalationData.description}\n` +
      `Days Pending: ${escalationData.daysPending}\n\n` +
      `Immediate action required.`;
    
    return await this.sendTextMessage(phoneNumber, message);
  }

  /**
   * Send UC validation notification
   */
  async sendUCValidationNotification(phoneNumber, ucData) {
    const statusEmoji = ucData.status === 'approved' ? '✅' : '❌';
    
    const message = `${statusEmoji} *UC ${ucData.status === 'approved' ? 'Approved' : 'Rejected'}*\n\n` +
      `Project: ${ucData.projectName}\n` +
      `UC Number: ${ucData.ucNumber}\n` +
      `Amount: ₹${ucData.amount.toLocaleString('en-IN')}\n\n` +
      (ucData.notes ? `Notes: ${ucData.notes}\n\n` : '') +
      `Check portal for details.`;
    
    return await this.sendTextMessage(phoneNumber, message);
  }

  /**
   * Send tranche release notification
   */
  async sendTrancheReleaseNotification(phoneNumber, trancheData) {
    const message = `💵 *Tranche Released*\n\n` +
      `Project: ${trancheData.projectName}\n` +
      `Tranche Number: ${trancheData.trancheNumber}\n` +
      `Amount: ₹${trancheData.amount.toLocaleString('en-IN')}\n` +
      `Released Date: ${new Date(trancheData.releaseDate).toLocaleDateString('en-IN')}\n\n` +
      `Funds have been transferred.`;
    
    return await this.sendTextMessage(phoneNumber, message);
  }

  /**
   * Send query raised notification
   */
  async sendQueryNotification(phoneNumber, queryData) {
    const message = `❓ *Query Raised*\n\n` +
      `Project: ${queryData.projectName}\n` +
      `Query: ${queryData.query}\n` +
      `Raised By: ${queryData.raisedBy}\n\n` +
      `Please respond at the earliest.`;
    
    return await this.sendTextMessage(phoneNumber, message);
  }

  /**
   * Check message delivery status
   */
  async getMessageStatus(messageId) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/getMessageStatus/${messageId}`,
        { headers: this.headers }
      );

      return {
        success: true,
        status: response.data.status,
        data: response.data
      };
    } catch (error) {
      console.error('WATI Message Status Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }
}

export default new WatiService();
