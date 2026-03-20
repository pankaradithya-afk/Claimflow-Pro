const DEFAULT_COMPANY_NAME = 'Irrigation Products International Pvt Ltd';
const DEFAULT_SUBTITLE = 'Claims Management System';
const DEFAULT_SUPPORT_EMAIL = 'projects@ipi-india.com';
const DEFAULT_CURRENCY = '₹';

const emailStyles = "font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;";
const containerStyles = "max-width: 760px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff;";
const buttonBase = "display: inline-block; padding: 12px 20px; margin-right: 12px; border-radius: 8px; font-weight: 700; text-decoration: none; color: #ffffff;";
const tableStyles = "width: 100%; border-collapse: collapse; margin: 16px 0; background: #ffffff;";
const thStyles = "background: #f3f4f6; padding: 10px; border: 1px solid #d1d5db; text-align: left; font-size: 13px;";
const tdStyles = "padding: 10px; border: 1px solid #d1d5db; font-size: 13px; vertical-align: top;";

type Attachment = string | { name?: string; url?: string };

interface BrandData {
  companyName?: string;
  companySubtitle?: string;
  supportEmail?: string;
  logoUrl?: string;
  appUrl?: string;
  loginUrl?: string;
  userGuideUrl?: string;
  currency?: string;
}

function normalizeCurrencySymbol(currency?: string) {
  const value = String(currency || '').trim();
  if (!value) return '&#8377;';
  if (value === '₹' || value === 'â‚¹' || value === 'Ã¢â€šÂ¹') return '&#8377;';
  return value;
}

function brand(data: BrandData) {
  return {
    companyName: data.companyName || DEFAULT_COMPANY_NAME,
    companySubtitle: data.companySubtitle || DEFAULT_SUBTITLE,
    supportEmail: data.supportEmail || DEFAULT_SUPPORT_EMAIL,
    logoUrl: data.logoUrl || '/ipi-logo.jpg',
    appUrl: data.appUrl || '',
    loginUrl: data.loginUrl || '',
    userGuideUrl: data.userGuideUrl || '',
    currency: normalizeCurrencySymbol(data.currency || DEFAULT_CURRENCY),
  };
}

function fmtAmount(value?: number, currency = DEFAULT_CURRENCY) {
  return `${normalizeCurrencySymbol(currency)}${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(Number(value || 0))}`;
}

function fmtDate(value?: string) {
  if (!value) return '';
  return new Date(value).toLocaleString('en-IN');
}

function safeLink(url?: string) {
  return (url || '').trim();
}

function renderAttachments(attachments?: Attachment[]) {
  if (!attachments || attachments.length === 0) return '';
  const rows = attachments.map((attachment) => {
    if (typeof attachment === 'string') {
      return `<li style="margin: 4px 0;">${attachment}</li>`;
    }
    if (attachment.url) {
      const label = attachment.name || 'Open attachment';
      return `<li style="margin: 8px 0;"><a href="${attachment.url}" style="color: #2563eb; text-decoration: underline;">${label}</a><div style="font-size: 12px; color: #6b7280;">Open or download this file</div></li>`;
    }
    return `<li style="margin: 4px 0;">${attachment.name || ''}</li>`;
  }).join('');

  return `
    <div style="margin-top: 16px; padding: 14px; background: #f9fafb; border-left: 4px solid #2563eb;">
      <p style="margin: 0 0 8px 0; font-weight: 700;">Attachments</p>
      <ul style="margin: 0; padding-left: 18px;">${rows}</ul>
    </div>
  `;
}

function wrapEmail(title: string, body: string, data: BrandData) {
  const info = brand(data);
  const logo = info.logoUrl ? `<img src="${info.logoUrl}" alt="${info.companyName}" style="max-height: 72px; margin-bottom: 12px;" />` : '';

  return `
    <div style="${containerStyles}">
      <div style="text-align: center; padding-bottom: 16px; border-bottom: 2px solid #e5e7eb; margin-bottom: 24px;">
        ${logo}
        <h1 style="margin: 0; font-size: 24px; color: #0f172a;">${info.companyName}</h1>
        <p style="margin: 6px 0 0 0; font-size: 14px; color: #4b5563;">${info.companySubtitle}</p>
      </div>
      <div style="${emailStyles}">
        <h2 style="margin-top: 0; color: #111827;">${title}</h2>
        ${body}
      </div>
      <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
        <p style="margin: 0 0 8px 0;">Need Help?</p>
        <p style="margin: 0 0 8px 0;">Email: ${info.supportEmail}</p>
        <p style="margin: 0;">This is an automated message from ${info.companyName} ${info.companySubtitle}. Please do not reply to this email.</p>
      </div>
    </div>
  `;
}

export function welcomeUserTemplate(data: {
  employeeName?: string;
  name?: string;
  email?: string;
  role?: string;
  tempPassword?: string;
  loginUrl?: string;
  userGuideUrl?: string;
} & BrandData): { subject: string; html: string } {
  const info = brand(data);
  const userName = data.employeeName || data.name || 'User';
  const loginLink = safeLink(data.loginUrl || info.loginUrl);
  const guideLink = safeLink(data.userGuideUrl || info.userGuideUrl);

  const body = `
    <p>Dear ${userName},</p>
    <p>Your account has been successfully created in the ${info.companyName} ${info.companySubtitle} with the role: ${data.role || 'User'}.</p>
    <div style="padding: 16px; background: #f9fafb; border-left: 4px solid #16a34a; margin: 16px 0;">
      <p style="margin: 0 0 8px 0;"><strong>Your Login Credentials:</strong></p>
      <p style="margin: 0 0 6px 0;">Email: ${data.email || ''}</p>
      <p style="margin: 0;">Password: ${data.tempPassword || ''}</p>
    </div>
    <p>Please change your password after first login for security.</p>
    <p><strong>Getting Started:</strong></p>
    <ol>
      <li>Access the system: ${loginLink || ''}</li>
      <li>Download the user guide: ${guideLink || ''}</li>
      <li>Use your credentials above to login</li>
    </ol>
    ${loginLink ? `<p><a href="${loginLink}" style="${buttonBase} background: #2563eb;">Access Claims System</a></p>` : ''}
  `;

  return {
    subject: `Welcome to ${info.companyName}`,
    html: wrapEmail(`Welcome to ${info.companyName}`, body, info),
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
  items: Array<{
    category: string;
    projectCode?: string;
    claimDate?: string;
    description: string;
    amountWithBill?: number;
    amountWithoutBill?: number;
    totalAmount?: number;
    amount?: number;
  }>;
  total_amount: number;
  total_with_bill?: number;
  total_without_bill?: number;
  attachments?: Attachment[];
  employee_name?: string;
} & BrandData): { subject: string; html: string } {
  const info = brand(data);

  const rows = data.items.map((item) => `
    <tr>
      <td style="${tdStyles}">${item.category}</td>
      <td style="${tdStyles}">${item.projectCode || ''}</td>
      <td style="${tdStyles}">${item.claimDate || ''}</td>
      <td style="${tdStyles}">${item.description}</td>
      <td style="${tdStyles}; text-align: right;">${fmtAmount(item.amountWithBill, info.currency)}</td>
      <td style="${tdStyles}; text-align: right;">${fmtAmount(item.amountWithoutBill, info.currency)}</td>
      <td style="${tdStyles}; text-align: right; font-weight: 700;">${fmtAmount(item.totalAmount ?? item.amount, info.currency)}</td>
    </tr>
  `).join('');

  const body = `
    <p>Dear ${data.employee_name || data.submitted_by || 'User'},</p>
    <p>Your claim has been submitted successfully.</p>
    <div style="padding: 16px; background: #f9fafb; border-left: 4px solid #2563eb; margin: 16px 0;">
      <p style="margin: 0 0 6px 0;"><strong>Claim Submitted</strong></p>
      <p style="margin: 0 0 6px 0;">ID: ${data.claim_number} • Generated on ${fmtDate(data.generated_on)}</p>
      <p style="margin: 0 0 6px 0;">Submitted By: ${data.submitted_by || data.employee_name || ''}</p>
      <p style="margin: 0 0 6px 0;">Submission Date: ${fmtDate(data.submission_date)}</p>
      <p style="margin: 0 0 6px 0;">Project Site: ${data.project_site || ''}</p>
      <p style="margin: 0 0 6px 0;">Primary Project Code: ${data.primary_project_code || ''}</p>
      <p style="margin: 0;">Status: ${data.status || 'Pending Manager Approval'}</p>
    </div>
    <table style="${tableStyles}">
      <thead>
        <tr>
          <th style="${thStyles}">Category</th>
          <th style="${thStyles}">Project Code</th>
          <th style="${thStyles}">Claim Date</th>
          <th style="${thStyles}">Description</th>
          <th style="${thStyles}">With Bill Amount (${info.currency})</th>
          <th style="${thStyles}">Without Bill Amount (${info.currency})</th>
          <th style="${thStyles}">Total Amount (${info.currency})</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr>
          <td colspan="4" style="${tdStyles}; text-align: right; font-weight: 700;">Total</td>
          <td style="${tdStyles}; text-align: right; font-weight: 700;">${fmtAmount(data.total_with_bill, info.currency)}</td>
          <td style="${tdStyles}; text-align: right; font-weight: 700;">${fmtAmount(data.total_without_bill, info.currency)}</td>
          <td style="${tdStyles}; text-align: right; font-weight: 700;">${fmtAmount(data.total_amount, info.currency)}</td>
        </tr>
      </tbody>
    </table>
    ${renderAttachments(data.attachments)}
  `;

  return {
    subject: `Claim Submitted - ${data.claim_number}`,
    html: wrapEmail('Claim Submitted', body, info),
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
  items: Array<{
    category: string;
    projectCode?: string;
    claimDate?: string;
    description: string;
    amountWithBill?: number;
    amountWithoutBill?: number;
    totalAmount?: number;
    amount?: number;
  }>;
  total_amount: number;
  attachments?: Attachment[];
  approve_link: string;
  reject_link: string;
} & BrandData): { subject: string; html: string } {
  const info = brand(data);

  const rows = data.items.map((item) => `
    <tr>
      <td style="${tdStyles}">${item.category}</td>
      <td style="${tdStyles}">${item.projectCode || ''}</td>
      <td style="${tdStyles}">${item.claimDate || ''}</td>
      <td style="${tdStyles}">${item.description}</td>
      <td style="${tdStyles}; text-align: right;">${fmtAmount(item.amountWithBill, info.currency)}</td>
      <td style="${tdStyles}; text-align: right;">${fmtAmount(item.amountWithoutBill, info.currency)}</td>
      <td style="${tdStyles}; text-align: right; font-weight: 700;">${fmtAmount(item.totalAmount ?? item.amount, info.currency)}</td>
    </tr>
  `).join('');

  const buttons = `
    ${data.approve_link ? `<a href="${data.approve_link}" style="${buttonBase} background: #16a34a;">Approve</a>` : ''}
    ${data.reject_link ? `<a href="${data.reject_link}" style="${buttonBase} background: #dc2626;">Reject</a>` : ''}
  `;

  const body = `
    <p>A claim has been submitted and requires review.</p>
    <div style="padding: 16px; background: #f9fafb; border-left: 4px solid #0ea5e9; margin: 16px 0;">
      <p style="margin: 0 0 6px 0;">Claim ID: ${data.claim_number}</p>
      <p style="margin: 0 0 6px 0;">Submitted By: ${data.employee_name}</p>
      <p style="margin: 0 0 6px 0;">Submission Date: ${fmtDate(data.submission_date)}</p>
      <p style="margin: 0 0 6px 0;">Project Site: ${data.project_site || ''}</p>
      <p style="margin: 0 0 6px 0;">Primary Project Code: ${data.primary_project_code || ''}</p>
      <p style="margin: 0 0 6px 0;">Manager Approval: ${data.manager_status || 'Pending'}</p>
      <p style="margin: 0;">Admin Approval: ${data.admin_status || 'Pending'}</p>
    </div>
    <table style="${tableStyles}">
      <thead>
        <tr>
          <th style="${thStyles}">Category</th>
          <th style="${thStyles}">Project Code</th>
          <th style="${thStyles}">Claim Date</th>
          <th style="${thStyles}">Description</th>
          <th style="${thStyles}">With Bill</th>
          <th style="${thStyles}">Without Bill</th>
          <th style="${thStyles}">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p><strong>Total Amount:</strong> ${fmtAmount(data.total_amount, info.currency)}</p>
    ${renderAttachments(data.attachments)}
    ${buttons ? `<div style="margin-top: 20px;">${buttons}</div>` : ''}
  `;

  return {
    subject: `Action Required - ${data.claim_number}`,
    html: wrapEmail('Claim Approval Required', body, info),
  };
}

export function claimApprovedTemplate(data: {
  claim_no: string;
  total: number;
  approved_by: string;
  employee_name?: string;
  status?: string;
} & BrandData): { subject: string; html: string } {
  const info = brand(data);
  const body = `
    <p>Dear ${data.employee_name || 'User'},</p>
    <p>Your claim has been approved.</p>
    <div style="padding: 16px; background: #f0fdf4; border-left: 4px solid #16a34a; margin: 16px 0;">
      <p style="margin: 0 0 6px 0;">Claim ID: ${data.claim_no}</p>
      <p style="margin: 0 0 6px 0;">Approved By: ${data.approved_by}</p>
      <p style="margin: 0 0 6px 0;">Status: ${data.status || 'Approved'}</p>
      <p style="margin: 0;">Amount: ${fmtAmount(data.total, info.currency)}</p>
    </div>
  `;

  return {
    subject: `Claim Approved - ${data.claim_no}`,
    html: wrapEmail('Claim Approved', body, info),
  };
}

export function claimRejectedTemplate(data: {
  claim_no: string;
  total: number;
  rejected_by: string;
  reason: string;
  employee_name?: string;
} & BrandData): { subject: string; html: string } {
  const info = brand(data);
  const body = `
    <p>Dear ${data.employee_name || 'User'},</p>
    <p>Your claim has been rejected.</p>
    <div style="padding: 16px; background: #fef2f2; border-left: 4px solid #dc2626; margin: 16px 0;">
      <p style="margin: 0 0 6px 0;">Claim ID: ${data.claim_no}</p>
      <p style="margin: 0 0 6px 0;">Rejected By: ${data.rejected_by}</p>
      <p style="margin: 0 0 6px 0;">Amount: ${fmtAmount(data.total, info.currency)}</p>
      <p style="margin: 0;">Reason: ${data.reason}</p>
    </div>
  `;

  return {
    subject: `Claim Rejected - ${data.claim_no}`,
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
} & BrandData): { subject: string; html: string } {
  const info = brand(data);
  const body = `
    <p>Dear ${data.employeeName || 'User'},</p>
    <p>A password reset request was received for your account.</p>
    ${data.resetLink ? `<p><a href="${data.resetLink}" style="${buttonBase} background: #2563eb;">Reset Password</a></p>` : ''}
    <p>Reset Link: ${data.resetLink || ''}</p>
    <p>This link expires in ${data.expiresIn || '1 hour'}.</p>
  `;

  return {
    subject: `Password Reset - ${info.companyName}`,
    html: wrapEmail('Password Reset', body, info),
  };
}

export type EmailTemplateType =
  | 'welcome_user'
  | 'claim_submitted'
  | 'claim_submitted_user'
  | 'claim_submitted_manager'
  | 'claim_approved'
  | 'claim_rejected'
  | 'user_created'
  | 'password_reset';

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
