// Constants
const DEFAULT_COMPANY_NAME = 'Irrigation Products International Pvt Ltd';
const DEFAULT_SUBTITLE = 'Claims Management System';
const DEFAULT_SUPPORT_EMAIL = 'projects@ipi-india.com';
const DEFAULT_CURRENCY = '₹';
const DEFAULT_PRIMARY_COLOR = '#0f3b5c';
const DEFAULT_SECONDARY_COLOR = '#2c7da0';
const DEFAULT_ACCENT_COLOR = '#61a5c2';

// Modern Email Styles
const emailStyles = {
  container: `
    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  `,
  header: `
    background: linear-gradient(135deg, ${DEFAULT_PRIMARY_COLOR} 0%, ${DEFAULT_SECONDARY_COLOR} 100%);
    padding: 32px 24px;
    text-align: center;
    color: white;
  `,
  content: `
    padding: 32px 24px;
    background: #ffffff;
  `,
  footer: `
    background: #f8f9fa;
    padding: 24px;
    text-align: center;
    border-top: 1px solid #e9ecef;
    font-size: 12px;
    color: #6c757d;
  `,
  card: `
    background: #f8f9fa;
    border-radius: 12px;
    padding: 20px;
    margin: 20px 0;
    border-left: 4px solid ${DEFAULT_SECONDARY_COLOR};
  `,
  button: `
    display: inline-block;
    padding: 12px 28px;
    margin: 8px;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    text-align: center;
    transition: all 0.3s ease;
  `,
  table: `
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 20px 0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  `,
  th: `
    background: #f1f3f5;
    padding: 12px 16px;
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #495057;
    border-bottom: 2px solid #dee2e6;
  `,
  td: `
    padding: 12px 16px;
    font-size: 14px;
    border-bottom: 1px solid #e9ecef;
    vertical-align: top;
  `,
  status: {
    submitted: 'background: #e3f2fd; color: #0b5e7e; border-left-color: #0b5e7e;',
    approved: 'background: #e8f5e9; color: #1e7e34; border-left-color: #1e7e34;',
    rejected: 'background: #ffebee; color: #c62828; border-left-color: #c62828;',
    pending: 'background: #fff3e0; color: #e65100; border-left-color: #e65100;'
  }
};

// Interfaces
interface Attachment {
  name?: string;
  url?: string;
  size?: string;
  type?: string;
}

interface BrandData {
  companyName?: string;
  companySubtitle?: string;
  supportEmail?: string;
  logoUrl?: string;
  appUrl?: string;
  loginUrl?: string;
  userGuideUrl?: string;
  currency?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

interface ClaimItem {
  category: string;
  projectCode?: string;
  claimDate?: string;
  description: string;
  amountWithBill?: number;
  amountWithoutBill?: number;
  totalAmount?: number;
  amount?: number;
  billNumber?: string;
  billDate?: string;
  remarks?: string;
}

// Helper Functions
function normalizeCurrencySymbol(currency?: string): string {
  const value = String(currency || '').trim();
  if (!value) return '₹';
  if (value === '₹' || value === 'â‚¹' || value === 'Ã¢â€šÂ¹') return '₹';
  return value;
}

function brand(data: BrandData) {
  return {
    companyName: data.companyName || DEFAULT_COMPANY_NAME,
    companySubtitle: data.companySubtitle || DEFAULT_SUBTITLE,
    supportEmail: data.supportEmail || DEFAULT_SUPPORT_EMAIL,
    logoUrl: data.logoUrl || '/api/placeholder/150/60',
    appUrl: data.appUrl || '',
    loginUrl: data.loginUrl || '',
    userGuideUrl: data.userGuideUrl || '',
    currency: normalizeCurrencySymbol(data.currency || DEFAULT_CURRENCY),
    primaryColor: data.primaryColor || DEFAULT_PRIMARY_COLOR,
    secondaryColor: data.secondaryColor || DEFAULT_SECONDARY_COLOR,
  };
}

function fmtAmount(value?: number, currency = DEFAULT_CURRENCY): string {
  const amount = Number(value || 0);
  return `${normalizeCurrencySymbol(currency)}${new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(amount)}`;
}

function fmtDate(value?: string | Date): string {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatCurrency(value?: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value || 0);
}

function renderAttachments(attachments?: Attachment[]): string {
  if (!attachments || attachments.length === 0) return '';
  
  const attachmentsHtml = attachments.map(attachment => {
    if (typeof attachment === 'string') {
      return `
        <div style="display: flex; align-items: center; padding: 8px; background: white; border-radius: 8px; margin-bottom: 8px;">
          <span style="margin-right: 8px;">📎</span>
          <span>${attachment}</span>
        </div>
      `;
    }
    
    const fileIcon = attachment.type?.startsWith('image/') ? '🖼️' : 
                     attachment.type === 'application/pdf' ? '📄' : '📎';
    
    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: white; border-radius: 8px; margin-bottom: 8px; border: 1px solid #e9ecef;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 20px;">${fileIcon}</span>
          <div>
            <div style="font-weight: 500;">${attachment.name || 'Attachment'}</div>
            ${attachment.size ? `<div style="font-size: 11px; color: #6c757d;">${attachment.size}</div>` : ''}
          </div>
        </div>
        ${attachment.url ? `
          <a href="${attachment.url}" style="background: ${DEFAULT_SECONDARY_COLOR}; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 12px;">
            Download
          </a>
        ` : ''}
      </div>
    `;
  }).join('');
  
  return `
    <div style="margin-top: 24px;">
      <h3 style="margin: 0 0 12px 0; font-size: 16px;">📎 Attachments (${attachments.length})</h3>
      ${attachmentsHtml}
    </div>
  `;
}

function wrapEmail(title: string, body: string, data: BrandData): string {
  const info = brand(data);
  
  return `
    <div style="${emailStyles.container}">
      <div style="${emailStyles.header}">
        ${info.logoUrl ? `<img src="${info.logoUrl}" alt="${info.companyName}" style="max-height: 50px; margin-bottom: 16px;" />` : ''}
        <h1 style="margin: 0; font-size: 24px; font-weight: 600;">${info.companyName}</h1>
        <p style="margin: 8px 0 0 0; opacity: 0.9;">${info.companySubtitle}</p>
      </div>
      
      <div style="${emailStyles.content}">
        <h2 style="margin: 0 0 20px 0; font-size: 20px; color: ${info.primaryColor};">${title}</h2>
        ${body}
      </div>
      
      <div style="${emailStyles.footer}">
        <p style="margin: 0 0 12px 0;"><strong>Need Help?</strong></p>
        <p style="margin: 0 0 8px 0;">
          📧 <a href="mailto:${info.supportEmail}" style="color: ${info.secondaryColor}; text-decoration: none;">${info.supportEmail}</a>
        </p>
        <p style="margin: 0; font-size: 11px;">
          This is an automated message from ${info.companyName}. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;
}

// Template Functions
export function welcomeUserTemplate(data: {
  employeeName?: string;
  name?: string;
  email?: string;
  role?: string;
  tempPassword?: string;
  loginUrl?: string;
  userGuideUrl?: string;
  additionalInfo?: string;
} & BrandData): { subject: string; html: string } {
  const info = brand(data);
  const userName = data.employeeName || data.name || 'User';
  const loginLink = data.loginUrl || info.loginUrl;
  const guideLink = data.userGuideUrl || info.userGuideUrl;

  const body = `
    <p>Dear <strong>${userName}</strong>,</p>
    <p>Welcome to the ${info.companyName} Claims Management System! Your account has been successfully created with the role: <strong>${data.role || 'User'}</strong>.</p>
    
    <div style="${emailStyles.card}">
      <h3 style="margin: 0 0 12px 0; font-size: 16px;">🔐 Your Login Credentials</h3>
      <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${data.email || ''}</p>
      <p style="margin: 0;"><strong>Temporary Password:</strong> <code style="background: white; padding: 4px 8px; border-radius: 4px;">${data.tempPassword || ''}</code></p>
    </div>
    
    <div style="background: #fff3e0; border-radius: 8px; padding: 12px; margin: 16px 0;">
      <p style="margin: 0; font-size: 13px;">⚠️ For security reasons, please change your password after your first login.</p>
    </div>
    
    <h3 style="margin: 24px 0 12px 0; font-size: 16px;">📋 Getting Started</h3>
    <ol style="margin: 0 0 20px 0; padding-left: 20px;">
      <li style="margin-bottom: 8px;">Access the system: ${loginLink ? `<a href="${loginLink}" style="color: ${info.secondaryColor};">${loginLink}</a>` : 'Link not provided'}</li>
      ${guideLink ? `<li style="margin-bottom: 8px;">Download the <a href="${guideLink}" style="color: ${info.secondaryColor};">User Guide</a> for detailed instructions</li>` : ''}
      <li>Use your credentials above to log in</li>
    </ol>
    
    ${data.additionalInfo ? `<p style="margin-top: 20px;">${data.additionalInfo}</p>` : ''}
    
    ${loginLink ? `
      <div style="text-align: center; margin-top: 28px;">
        <a href="${loginLink}" style="${emailStyles.button} background: ${info.secondaryColor}; color: white;">
          Access Claims System →
        </a>
      </div>
    ` : ''}
  `;

  return {
    subject: `🎉 Welcome to ${info.companyName} Claims System`,
    html: wrapEmail('Welcome Aboard!', body, info),
  };
}

export function claimSubmittedUserTemplate(data: {
  claim_id?: string;
  claim_number: string;
  generated_on?: string;
  submitted_by?: string;
  submission_date?: string;
  project_site?: string;
  primary_project_code?: string;
  status?: string;
  items: ClaimItem[];
  total_amount: number;
  total_with_bill?: number;
  total_without_bill?: number;
  attachments?: Attachment[];
  employee_name?: string;
  summary_note?: string;
} & BrandData): { subject: string; html: string } {
  const info = brand(data);
  const status = data.status || 'Pending Manager Approval';
  const statusStyle = status.includes('Approved') ? 'approved' : 
                      status.includes('Rejected') ? 'rejected' : 'submitted';

  const rows = data.items.map((item) => `
    <tr>
      <td style="${emailStyles.td}"><strong>${item.category}</strong></td>
      <td style="${emailStyles.td}">${item.projectCode || '-'}</td>
      <td style="${emailStyles.td}">${item.claimDate ? fmtDate(item.claimDate) : '-'}</td>
      <td style="${emailStyles.td}">${item.description}</td>
      <td style="${emailStyles.td}; text-align: right;">${fmtAmount(item.amountWithBill, info.currency)}</td>
      <td style="${emailStyles.td}; text-align: right;">${fmtAmount(item.amountWithoutBill, info.currency)}</td>
      <td style="${emailStyles.td}; text-align: right; font-weight: 700;">${fmtAmount(item.totalAmount ?? item.amount, info.currency)}</td>
    </tr>
  `).join('');

  const body = `
    <p>Dear <strong>${data.employee_name || data.submitted_by || 'User'}</strong>,</p>
    <p>Your claim has been submitted successfully and is now under review.</p>
    
    <div style="${emailStyles.card}">
      <h3 style="margin: 0 0 12px 0; font-size: 16px;">📋 Claim Details</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        <div><strong>Claim ID:</strong> ${data.claim_number}</div>
        <div><strong>Status:</strong> <span style="display: inline-block; padding: 2px 8px; background: #e3f2fd; border-radius: 12px; font-size: 12px;">${status}</span></div>
        <div><strong>Generated On:</strong> ${fmtDate(data.generated_on)}</div>
        <div><strong>Submitted By:</strong> ${data.submitted_by || data.employee_name || ''}</div>
        <div><strong>Project Site:</strong> ${data.project_site || '-'}</div>
        <div><strong>Project Code:</strong> ${data.primary_project_code || '-'}</div>
      </div>
    </div>
    
    <h3 style="margin: 24px 0 12px 0; font-size: 16px;">💰 Claim Items</h3>
    <table style="${emailStyles.table}">
      <thead>
        <tr>
          <th style="${emailStyles.th}">Category</th>
          <th style="${emailStyles.th}">Project Code</th>
          <th style="${emailStyles.th}">Claim Date</th>
          <th style="${emailStyles.th}">Description</th>
          <th style="${emailStyles.th}">With Bill</th>
          <th style="${emailStyles.th}">Without Bill</th>
          <th style="${emailStyles.th}">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr style="background: #f8f9fa; font-weight: 700;">
          <td colspan="4" style="${emailStyles.td}; text-align: right;">Total</td>
          <td style="${emailStyles.td}; text-align: right;">${fmtAmount(data.total_with_bill, info.currency)}</td>
          <td style="${emailStyles.td}; text-align: right;">${fmtAmount(data.total_without_bill, info.currency)}</td>
          <td style="${emailStyles.td}; text-align: right;">${fmtAmount(data.total_amount, info.currency)}</td>
        </tr>
      </tfoot>
    </table>
    
    ${data.summary_note ? `
      <div style="background: #e8f0fe; border-radius: 8px; padding: 12px; margin: 16px 0;">
        <strong>📝 Summary Note:</strong>
        <p style="margin: 8px 0 0 0;">${data.summary_note}</p>
      </div>
    ` : ''}
    
    ${renderAttachments(data.attachments)}
    
    <div style="background: #e8f5e9; border-radius: 8px; padding: 12px; margin-top: 20px;">
      <p style="margin: 0; font-size: 13px;">✓ You will receive a notification once your claim is reviewed by the manager.</p>
    </div>
  `;

  return {
    subject: `📝 Claim Submitted - ${data.claim_number}`,
    html: wrapEmail('Claim Submitted Successfully', body, info),
  };
}

export function claimSubmittedManagerTemplate(data: {
  claim_number: string;
  employee_name: string;
  employee_email?: string;
  project_site?: string;
  primary_project_code?: string;
  submission_date?: string;
  manager_status?: string;
  admin_status?: string;
  items: ClaimItem[];
  total_amount: number;
  attachments?: Attachment[];
  approve_link: string;
  reject_link: string;
  deadline_days?: number;
  priority?: 'high' | 'medium' | 'low';
} & BrandData): { subject: string; html: string } {
  const info = brand(data);
  const priority = data.priority || 'medium';
  const priorityColor = priority === 'high' ? '#dc2626' : priority === 'medium' ? '#f59e0b' : '#10b981';

  const rows = data.items.map((item) => `
    <tr>
      <td style="${emailStyles.td}"><strong>${item.category}</strong></td>
      <td style="${emailStyles.td}">${item.projectCode || '-'}</td>
      <td style="${emailStyles.td}">${item.claimDate ? fmtDate(item.claimDate) : '-'}</td>
      <td style="${emailStyles.td}">${item.description}</td>
      <td style="${emailStyles.td}; text-align: right;">${fmtAmount(item.amountWithBill, info.currency)}</td>
      <td style="${emailStyles.td}; text-align: right;">${fmtAmount(item.amountWithoutBill, info.currency)}</td>
      <td style="${emailStyles.td}; text-align: right; font-weight: 700;">${fmtAmount(item.totalAmount ?? item.amount, info.currency)}</td>
    </tr>
  `).join('');

  const body = `
    <div style="display: inline-block; padding: 4px 12px; background: ${priorityColor}10; border-radius: 20px; margin-bottom: 16px;">
      <span style="color: ${priorityColor}; font-size: 12px; font-weight: 600;">🔴 ${priority.toUpperCase()} PRIORITY</span>
    </div>
    
    <p>A new claim requires your review and approval.</p>
    
    <div style="${emailStyles.card}">
      <h3 style="margin: 0 0 12px 0; font-size: 16px;">📋 Claim Information</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        <div><strong>Claim ID:</strong> ${data.claim_number}</div>
        <div><strong>Submitted By:</strong> ${data.employee_name}</div>
        <div><strong>Submission Date:</strong> ${fmtDate(data.submission_date)}</div>
        <div><strong>Project Site:</strong> ${data.project_site || '-'}</div>
        <div><strong>Project Code:</strong> ${data.primary_project_code || '-'}</div>
        ${data.deadline_days ? `<div><strong>Review Deadline:</strong> ${data.deadline_days} days</div>` : ''}
      </div>
    </div>
    
    <h3 style="margin: 24px 0 12px 0; font-size: 16px;">💰 Claim Items</h3>
    <table style="${emailStyles.table}">
      <thead>
        <tr>
          <th style="${emailStyles.th}">Category</th>
          <th style="${emailStyles.th}">Project Code</th>
          <th style="${emailStyles.th}">Claim Date</th>
          <th style="${emailStyles.th}">Description</th>
          <th style="${emailStyles.th}">With Bill</th>
          <th style="${emailStyles.th}">Without Bill</th>
          <th style="${emailStyles.th}">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr style="background: #f8f9fa; font-weight: 700;">
          <td colspan="6" style="${emailStyles.td}; text-align: right;">Total Amount</td>
          <td style="${emailStyles.td}; text-align: right;">${fmtAmount(data.total_amount, info.currency)}</td>
        </tr>
      </tfoot>
    </table>
    
    ${renderAttachments(data.attachments)}
    
    <div style="text-align: center; margin: 32px 0 24px 0;">
      <a href="${data.approve_link}" style="${emailStyles.button} background: #10b981; color: white; margin-right: 12px;">
        ✓ Approve Claim
      </a>
      <a href="${data.reject_link}" style="${emailStyles.button} background: #ef4444; color: white;">
        ✗ Reject Claim
      </a>
    </div>
    
    <div style="background: #fff3e0; border-radius: 8px; padding: 12px;">
      <p style="margin: 0; font-size: 13px;">
        💡 <strong>Tip:</strong> You can add comments while approving or rejecting the claim.
      </p>
    </div>
  `;

  return {
    subject: `⚠️ Action Required: Claim ${data.claim_number} - ${data.employee_name}`,
    html: wrapEmail('Claim Approval Required', body, info),
  };
}

export function claimApprovedTemplate(data: {
  claim_no: string;
  total: number;
  approved_by: string;
  employee_name?: string;
  status?: string;
  approval_comments?: string;
  next_step?: string;
} & BrandData): { subject: string; html: string } {
  const info = brand(data);
  
  const body = `
    <p>Dear <strong>${data.employee_name || 'User'}</strong>,</p>
    <p>Great news! Your claim has been approved and is now proceeding to the next stage.</p>
    
    <div style="${emailStyles.card} background: ${emailStyles.status.applied}">
      <h3 style="margin: 0 0 12px 0; font-size: 16px;">✅ Approval Details</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        <div><strong>Claim ID:</strong> ${data.claim_no}</div>
        <div><strong>Approved By:</strong> ${data.approved_by}</div>
        <div><strong>Amount:</strong> ${fmtAmount(data.total, info.currency)}</div>
        <div><strong>Status:</strong> <span style="display: inline-block; padding: 2px 8px; background: #10b98120; color: #10b981; border-radius: 12px;">${data.status || 'Approved'}</span></div>
      </div>
      ${data.approval_comments ? `
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
          <strong>📝 Comments:</strong>
          <p style="margin: 8px 0 0 0;">${data.approval_comments}</p>
        </div>
      ` : ''}
    </div>
    
    ${data.next_step ? `
      <div style="background: #e8f0fe; border-radius: 8px; padding: 12px; margin: 16px 0;">
        <strong>⏭️ Next Step:</strong>
        <p style="margin: 8px 0 0 0;">${data.next_step}</p>
      </div>
    ` : ''}
    
    <p>If you have any questions about this approval, please reach out to your manager or the finance team.</p>
  `;

  return {
    subject: `✅ Claim Approved - ${data.claim_no}`,
    html: wrapEmail('Claim Approved', body, info),
  };
}

export function claimRejectedTemplate(data: {
  claim_no: string;
  total: number;
  rejected_by: string;
  reason: string;
  employee_name?: string;
  appeal_link?: string;
  additional_instructions?: string;
} & BrandData): { subject: string; html: string } {
  const info = brand(data);
  
  const body = `
    <p>Dear <strong>${data.employee_name || 'User'}</strong>,</p>
    <p>We regret to inform you that your claim has been rejected after review.</p>
    
    <div style="${emailStyles.card} background: ${emailStyles.status.rejected}">
      <h3 style="margin: 0 0 12px 0; font-size: 16px;">❌ Rejection Details</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        <div><strong>Claim ID:</strong> ${data.claim_no}</div>
        <div><strong>Rejected By:</strong> ${data.rejected_by}</div>
        <div><strong>Amount:</strong> ${fmtAmount(data.total, info.currency)}</div>
      </div>
      <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
        <strong>📝 Reason for Rejection:</strong>
        <p style="margin: 8px 0 0 0; background: white; padding: 12px; border-radius: 8px;">${data.reason}</p>
      </div>
    </div>
    
    ${data.additional_instructions ? `
      <div style="background: #fff3e0; border-radius: 8px; padding: 12px; margin: 16px 0;">
        <strong>📌 Important:</strong>
        <p style="margin: 8px 0 0 0;">${data.additional_instructions}</p>
      </div>
    ` : ''}
    
    <p>You can review the rejection reason, make necessary corrections, and submit a new claim.</p>
    
    ${data.appeal_link ? `
      <div style="text-align: center; margin: 24px 0;">
        <a href="${data.appeal_link}" style="${emailStyles.button} background: ${info.secondaryColor}; color: white;">
          Review & Resubmit →
        </a>
      </div>
    ` : ''}
  `;

  return {
    subject: `❌ Claim Rejected - ${data.claim_no}`,
    html: wrapEmail('Claim Rejected', body, info),
  };
}

export function userCreatedTemplate(data: any) {
  return welcomeUserTemplate(data);
}

export function passwordResetTemplate(data: {
  employeeName?: string;
  resetLink?: string;
  expiresIn?: string;
  ip_address?: string;
  device_info?: string;
} & BrandData): { subject: string; html: string } {
  const info = brand(data);
  
  const body = `
    <p>Dear <strong>${data.employeeName || 'User'}</strong>,</p>
    <p>We received a request to reset your password for the ${info.companyName} Claims Management System.</p>
    
    <div style="${emailStyles.card}">
      <h3 style="margin: 0 0 12px 0; font-size: 16px;">🔐 Password Reset Request</h3>
      <p style="margin: 0 0 12px 0;">Click the button below to reset your password. This link will expire in <strong>${data.expiresIn || '1 hour'}</strong>.</p>
      
      ${data.resetLink ? `
        <div style="text-align: center; margin: 20px 0;">
          <a href="${data.resetLink}" style="${emailStyles.button} background: ${info.secondaryColor}; color: white;">
            Reset Password →
          </a>
        </div>
      ` : ''}
      
      <p style="margin: 12px 0 0 0; font-size: 12px; color: #6c757d;">
        Or copy this link: <a href="${data.resetLink}" style="color: ${info.secondaryColor};">${data.resetLink}</a>
      </p>
    </div>
    
    ${data.ip_address || data.device_info ? `
      <div style="background: #f8f9fa; border-radius: 8px; padding: 12px; margin: 16px 0;">
        <strong>🔒 Security Information:</strong>
        <p style="margin: 8px 0 0 0; font-size: 12px;">
          ${data.ip_address ? `IP Address: ${data.ip_address}<br>` : ''}
          ${data.device_info ? `Device: ${data.device_info}` : ''}
        </p>
        <p style="margin: 8px 0 0 0; font-size: 11px; color: #6c757d;">
          If you did not request this password reset, please ignore this email or contact support immediately.
        </p>
      </div>
    ` : ''}
  `;

  return {
    subject: `🔒 Password Reset Request - ${info.companyName}`,
    html: wrapEmail('Password Reset Request', body, info),
  };
}

// Type Definitions
export type EmailTemplateType =
  | 'welcome_user'
  | 'claim_submitted'
  | 'claim_submitted_user'
  | 'claim_submitted_manager'
  | 'claim_approved'
  | 'claim_rejected'
  | 'user_created'
  | 'password_reset';

// Template Router
export function getTemplate(type: EmailTemplateType, data: any): { subject: string; html: string } {
  switch (type) {
    case 'welcome_user':
      return welcomeUserTemplate(data);
    case 'claim_submitted':
    case 'claim_submitted_user':
      return claimSubmittedUserTemplate(data);
    case 'claim_submitted_manager':
      return claimSubmittedManagerTemplate(data);
    case 'claim_approved':
      return claimApprovedTemplate(data);
    case 'claim_rejected':
      return claimRejectedTemplate(data);
    case 'user_created':
      return userCreatedTemplate(data);
    case 'password_reset':
      return passwordResetTemplate(data);
    default:
      throw new Error(`Unknown email template type: ${type}`);
  }
}

// Export utilities for external use
export const EmailUtils = {
  formatCurrency,
  formatDate: fmtDate,
  formatAmount: fmtAmount,
  normalizeCurrency: normalizeCurrencySymbol,
};