const DEFAULT_COMPANY_NAME = 'Irrigation Products International Pvt Ltd';
const DEFAULT_SUBTITLE = 'Claims Management System';
const DEFAULT_SUPPORT_EMAIL = 'projects@ipi-india.com';
const DEFAULT_APP_URL = 'https://claimflow-pro-main.vercel.app';
const DEFAULT_CURRENCY = '&#8377;';

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

interface KeyValueItem {
  label: string;
  value: string;
  html?: boolean;
}

const shellStyles = 'max-width: 600px; margin: 0 auto; padding: 20px 10px; background: #f1f5f9;';
const cardStyles = 'background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);';
const heroStyles = 'padding: 32px 24px; background: linear-gradient(135deg, #0f172a 0%, #0ea5e9 100%); color: #ffffff; text-align: center;';
const bodyStyles = 'padding: 32px 28px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #334155; line-height: 1.6; font-size: 14px;';
const footerStyles = 'padding: 24px 28px; border-top: 1px solid #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #64748b; background: #f8fafc; text-align: center;';
const buttonSecondary = 'display: inline-block; padding: 12px 24px; margin: 0 8px 8px 0; border-radius: 8px; font-weight: 700; text-decoration: none; color: #334155; font-size: 14px; background: #f1f5f9; border: 1px solid #cbd5e1;';
const buttonDanger = 'display: inline-block; padding: 12px 24px; margin: 0 8px 8px 0; border-radius: 8px; font-weight: 700; text-decoration: none; color: #ffffff; font-size: 14px; background: #ef4444;';
const buttonSuccess = 'display: inline-block; padding: 12px 24px; margin: 0 8px 8px 0; border-radius: 8px; font-weight: 700; text-decoration: none; color: #ffffff; font-size: 14px; background: #0ea5e9;';
const tableStyles = 'width: 100%; border-collapse: collapse; margin: 24px 0 8px; background: #ffffff; border: 1px solid #e2e8f0; table-layout: fixed;';
const thStyles = 'background: #f8fafc; padding: 12px 14px; border: 1px solid #e2e8f0; text-align: left; font-size: 12px; color: #475569; vertical-align: top; font-weight: 700;';
const tdStyles = 'padding: 14px; border: 1px solid #e2e8f0; font-size: 13px; line-height: 1.5; vertical-align: top; color: #1e293b;';
const softCardStyles = 'padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #0ea5e9; border-radius: 12px; margin: 20px 0;';

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeText(value: unknown) {
  return escapeHtml(value);
}

function currencySymbol(value?: string) {
  const raw = String(value ?? '').trim();
  if (
    !raw ||
    raw === '₹' ||
    raw === '&#8377;' ||
    raw === '&amp;#8377;' ||
    raw === 'â‚¹' ||
    raw === 'INR' ||
    raw.toUpperCase() === 'RS'
  ) {
    return DEFAULT_CURRENCY;
  }
  return DEFAULT_CURRENCY;
}

function absoluteUrl(url?: string, baseUrl = DEFAULT_APP_URL) {
  const value = String(url || '').trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('cid:')) return value;
  const base = String(baseUrl || DEFAULT_APP_URL).trim().replace(/\/+$/, '');
  const path = value.startsWith('/') ? value : `/${value}`;
  return `${base}${path}`;
}

function fmtAmount(value?: number, currency = DEFAULT_CURRENCY) {
  const symbol = currencySymbol(currency);
  const amount = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(Number(value || 0));
  return `${symbol}${amount}`;
}

function fmtDate(value?: string) {
  if (!value) return '';
  return escapeHtml(new Date(value).toLocaleString('en-IN'));
}

function safeLink(url?: string) {
  return escapeHtml((url || '').trim());
}

function brand(data: BrandData) {
  const appUrl = data.appUrl || DEFAULT_APP_URL;
  return {
    companyName: data.companyName || DEFAULT_COMPANY_NAME,
    companySubtitle: data.companySubtitle || DEFAULT_SUBTITLE,
    supportEmail: data.supportEmail || DEFAULT_SUPPORT_EMAIL,
    logoUrl: absoluteUrl(data.logoUrl || '/ipi-logo.jpg', appUrl),
    appUrl,
    loginUrl: data.loginUrl || appUrl,
    userGuideUrl: data.userGuideUrl || appUrl,
    currency: currencySymbol(data.currency || DEFAULT_CURRENCY),
  };
}

function sectionTitle(title: string, subtitle?: string) {
  return `
    <div style="margin: 0 0 24px 0; text-align: center;">
      <div style="display: inline-block; padding: 6px 12px; border-radius: 999px; background: #e0f2fe; color: #0369a1; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">System Notification</div>
      <h2 style="margin: 14px 0 8px; font-size: 24px; color: #0f172a; line-height: 1.2; letter-spacing: -0.02em;">${safeText(title)}</h2>
      ${subtitle ? `<p style="margin: 0; color: #64748b; font-size: 14px;">${safeText(subtitle)}</p>` : ''}
    </div>
  `;
}

function infoGrid(items: KeyValueItem[]) {
  if (!items.length) return '';
  const rows: string[] = [];
  for (let i = 0; i < items.length; i += 2) {
    const item1 = items[i];
    const item2 = items[i + 1];
    rows.push(`
      <tr>
        <td style="padding: 16px; width: 50%; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; vertical-align: top;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 700; margin-bottom: 4px;">${safeText(item1.label)}</div>
          <div style="font-size: 14px; color: #0f172a; font-weight: 700; line-height: 1.45; word-break: break-word;">${item1.html ? item1.value : safeText(item1.value)}</div>
        </td>
        <td style="padding: 16px; width: 50%; border-bottom: 1px solid #e2e8f0; vertical-align: top;">
          ${item2 ? `
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 700; margin-bottom: 4px;">${safeText(item2.label)}</div>
            <div style="font-size: 14px; color: #0f172a; font-weight: 700; line-height: 1.45; word-break: break-word;">${item2.html ? item2.value : safeText(item2.value)}</div>
          ` : '&nbsp;'}
        </td>
      </tr>
    `);
  }
  return `
    <div style="margin: 24px 0; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
      <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
        ${rows.join('')}
      </table>
    </div>
  `;
}

function statusPill(label: string, tone: 'info' | 'success' | 'warning' | 'danger' = 'info') {
  const palette = {
    info: 'background: #dbeafe; color: #075985; border: 1px solid #bfdbfe;',
    success: 'background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;',
    warning: 'background: #fef3c7; color: #92400e; border: 1px solid #fde68a;',
    danger: 'background: #fee2e2; color: #991b1b; border: 1px solid #fecaca;',
  };
  return `<span style="display:inline-block; padding:6px 10px; border-radius:999px; font-size:12px; font-weight:700; ${palette[tone]}">${safeText(label)}</span>`;
}

function renderButtons(buttons: Array<{ href?: string; label: string; tone?: 'success' | 'danger' | 'neutral' }>) {
  const items = buttons
    .filter((button) => button.href)
    .map((button) => {
      const style = button.tone === 'success' ? buttonSuccess : button.tone === 'danger' ? buttonDanger : buttonSecondary;
      return `<a href="${button.href}" style="${style}">${safeText(button.label)}</a>`;
    })
    .join('');
  return items ? `<div style="margin: 32px 0 12px; text-align: center;">${items}</div>` : '';
}

function renderAttachments(attachments?: Attachment[]) {
  if (!attachments || attachments.length === 0) return '';
  const rows = attachments.map((attachment) => {
    if (typeof attachment === 'string') {
      return `<li style="margin: 4px 0;">${safeText(attachment)}</li>`;
    }
    if (attachment.url) {
      const label = attachment.name || 'Open attachment';
      return `<li style="margin: 10px 0;"><a href="${safeLink(attachment.url)}" style="color: #0ea5e9; text-decoration: none; font-weight: 700;">${safeText(label)}</a><div style="font-size: 12px; color: #64748b; margin-top: 4px;">Open or download this file</div></li>`;
    }
    return `<li style="margin: 4px 0;">${safeText(attachment.name || '')}</li>`;
  }).join('');
  return `
    <div style="${softCardStyles}">
      <p style="margin: 0 0 8px 0; font-weight: 700; color: #0f172a;">Attachments</p>
      <ul style="margin: 0; padding-left: 18px;">${rows}</ul>
    </div>
  `;
}

function claimTableHeaderCell(style: string, width?: string) {
  return `${style}${width ? ` width: ${width};` : ''}`;
}

function wrapEmail(title: string, body: string, data: BrandData) {
  const info = brand(data);
  const logo = info.logoUrl ? `<img src="${safeLink(info.logoUrl)}" alt="${safeText(info.companyName)}" style="max-height: 48px; margin: 0 auto 16px; display: block; border-radius: 8px;" />` : '';
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin:0; padding:0; background:#f1f5f9; -webkit-font-smoothing: antialiased;">
        <div style="${shellStyles}">
          <div style="${cardStyles}">
            <div style="${heroStyles}">
              ${logo}
              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.85; font-weight: 700;">${safeText(info.companySubtitle)}</div>
              <div style="font-size: 26px; font-weight: 800; line-height: 1.2; margin-top: 8px;">${safeText(info.companyName)}</div>
              <div style="font-size: 14px; margin-top: 8px; opacity: 0.92;">Automated system notification from ${safeText(info.companyName)}</div>
            </div>
            <div style="${bodyStyles}">
              ${sectionTitle(title, 'This is an automated message. Please review the details below.')}
              ${body}
            </div>
            <div style="${footerStyles}">
              <p style="margin: 0 0 8px 0; font-weight: 700; color: #475569;">Need help?</p>
              <p style="margin: 0 0 10px 0;">Support: <a href="mailto:${safeText(info.supportEmail)}" style="color: #0ea5e9; text-decoration: none;">${safeText(info.supportEmail)}</a></p>
              <p style="margin: 0;">If this email was unexpected, please contact your system administrator.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
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
    <p style="margin-top: 0;">Dear ${safeText(userName)},</p>
    <p>Your account has been successfully created in the ${safeText(info.companyName)} ${safeText(info.companySubtitle)} with the role ${statusPill(data.role || 'User', 'info')}.</p>
    ${infoGrid([
      { label: 'Email', value: data.email || '' },
      { label: 'Temporary Password', value: data.tempPassword || '' },
    ])}
    <div style="${softCardStyles}; border-left-color: #16a34a;">
      <p style="margin: 0 0 8px 0; font-weight: 700; color: #0f172a;">Next steps</p>
      <ol style="margin: 0; padding-left: 18px;">
        <li>Sign in to the claims system.</li>
        <li>Change your password after first login.</li>
        <li>Use the user guide if you need help getting started.</li>
      </ol>
    </div>
    ${renderButtons([
      { href: loginLink, label: 'Access Claims System', tone: 'success' },
      { href: guideLink, label: 'View User Guide', tone: 'neutral' },
    ])}
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
      <td style="${tdStyles}; width: 22%; word-break: break-word;">${safeText(item.category)}</td>
      <td style="${tdStyles}; width: 18%; word-break: break-word;">${safeText(item.projectCode || '')}</td>
      <td style="${tdStyles}; width: 16%; white-space: nowrap;">${safeText(item.claimDate || '')}</td>
      <td style="${tdStyles}; width: 24%; word-break: break-word;">${safeText(item.description)}</td>
      <td style="${tdStyles}; text-align: right;">${fmtAmount(item.amountWithBill, info.currency)}</td>
      <td style="${tdStyles}; text-align: right;">${fmtAmount(item.amountWithoutBill, info.currency)}</td>
      <td style="${tdStyles}; text-align: right; font-weight: 700;">${fmtAmount(item.totalAmount ?? item.amount, info.currency)}</td>
    </tr>
  `).join('');
  const body = `
    <p style="margin-top: 0;">Dear ${safeText(data.employee_name || data.submitted_by || 'User')},</p>
    <p>Your claim has been submitted successfully and is now in the workflow queue.</p>
    ${infoGrid([
      { label: 'Claim Number', value: data.claim_number || '' },
      { label: 'Status', value: data.status || 'Pending Manager Approval' },
      { label: 'Submitted By', value: data.submitted_by || data.employee_name || '' },
      { label: 'Submission Date', value: fmtDate(data.submission_date) },
      { label: 'Project Site', value: data.project_site || '' },
      { label: 'Primary Project Code', value: data.primary_project_code || '' },
    ])}
    <div style="${softCardStyles}">
      <p style="margin: 0 0 8px 0; font-weight: 700; color: #0f172a;">Claim Summary</p>
      <div style="font-size: 13px; color: #475569;">${safeText(data.claim_number)} has been recorded with ${data.items.length} line item(s).</div>
    </div>
    <table style="${tableStyles}">
      <thead>
        <tr>
          <th style="${claimTableHeaderCell(thStyles, '22%')}">Category</th>
          <th style="${claimTableHeaderCell(thStyles, '18%')}">Project Code</th>
          <th style="${claimTableHeaderCell(thStyles, '16%')}">Claim Date</th>
          <th style="${claimTableHeaderCell(thStyles, '24%')}">Description</th>
          <th style="${claimTableHeaderCell(thStyles, '6%')}">With Bill</th>
          <th style="${claimTableHeaderCell(thStyles, '6%')}">Without Bill</th>
          <th style="${claimTableHeaderCell(thStyles, '8%')}">Total</th>
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

export function claimSubmittedAdminTemplate(data: {
  claim_number: string;
  employee_name: string;
  employee_email?: string;
  project_site?: string;
  primary_project_code?: string;
  submission_date?: string;
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
  review_link: string;
} & BrandData): { subject: string; html: string } {
  const info = brand(data);
  const rows = data.items.map((item) => `
    <tr>
      <td style="${tdStyles}; width: 24%; word-break: break-word;">
        <div style="font-weight: 700; color: #0f172a;">${safeText(item.category)}</div>
        ${item.projectCode ? `<div style="margin-top: 2px; font-size: 11px; color: #64748b;">${safeText(item.projectCode)}</div>` : ''}
      </td>
      <td style="${tdStyles}; width: 14%; white-space: nowrap;">${safeText(item.claimDate || '')}</td>
      <td style="${tdStyles}; width: 46%; word-break: break-word;">${safeText(item.description)}</td>
      <td style="${tdStyles}; text-align: right; font-weight: 700;">${fmtAmount(item.totalAmount ?? item.amount, info.currency)}</td>
    </tr>
  `).join('');
  const body = `
    <p style="margin-top: 0;">A new claim is waiting for your review in the <strong>Admin Approval</strong> section.</p>
    ${infoGrid([
      { label: 'Claim Number', value: data.claim_number },
      { label: 'Submitted By', value: data.employee_name },
      { label: 'Submission Date', value: fmtDate(data.submission_date) },
      { label: 'Project Site', value: data.project_site || '' },
      { label: 'Admin Status', value: data.admin_status || 'Pending Review' },
    ])}
    ${data.primary_project_code ? infoGrid([
      { label: 'Primary Project Code', value: data.primary_project_code },
    ]) : ''}
    <div style="${softCardStyles}">
      <p style="margin: 0 0 8px 0; font-weight: 700; color: #0f172a;">What the admin should do</p>
      <div style="font-size: 13px; color: #475569; margin-bottom: 8px;">Open the claim, review each line item, enter the approved amount or deduction amount, add remarks where needed, then send it for final approval.</div>
      <div style="font-size: 13px; color: #475569;">Use the button below, or open the <strong>Admin Approval</strong> page in the app sidebar.</div>
    </div>
    <table style="${tableStyles}">
      <thead>
        <tr>
          <th style="${claimTableHeaderCell(thStyles, '24%')}">Category / Project</th>
          <th style="${claimTableHeaderCell(thStyles, '14%')}">Date</th>
          <th style="${claimTableHeaderCell(thStyles, '46%')}">Description</th>
          <th style="${claimTableHeaderCell(thStyles, '16%')}">Original Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr>
          <td colspan="3" style="${tdStyles}; text-align: right; font-weight: 700;">Total</td>
          <td style="${tdStyles}; text-align: right; font-weight: 700;">${fmtAmount(data.total_amount, info.currency)}</td>
        </tr>
      </tbody>
    </table>
    ${renderAttachments(data.attachments)}
    ${renderButtons([
      { href: safeLink(data.review_link), label: 'Open Admin Approval', tone: 'success' },
    ])}
  `;
  return {
    subject: `Admin Review Required - ${data.claim_number}`,
    html: wrapEmail('Admin Review Required', body, info),
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
  admin_remarks?: string;
  original_amount?: number;
  deduction_total?: number;
  items: Array<{
    category: string;
    projectCode?: string;
    claimDate?: string;
    description: string;
    amountWithBill?: number;
    amountWithoutBill?: number;
    totalAmount?: number;
    amount?: number;
    approvedAmount?: number;
    deductionAmount?: number;
    remarks?: string;
  }>;
  total_amount: number;
  attachments?: Attachment[];
  review_link: string;
} & BrandData): { subject: string; html: string } {
  const info = brand(data);
  const rows = data.items.map((item) => `
    <tr>
      <td style="${tdStyles}; width: 24%; word-break: break-word;">
        <div style="font-weight: 700; color: #0f172a;">${safeText(item.category)}</div>
        ${item.projectCode ? `<div style="margin-top: 2px; font-size: 11px; color: #64748b;">${safeText(item.projectCode)}</div>` : ''}
      </td>
      <td style="${tdStyles}; width: 14%; white-space: nowrap;">${safeText(item.claimDate || '')}</td>
      <td style="${tdStyles}; width: 30%; word-break: break-word;">
        <div>${safeText(item.description)}</div>
        ${item.remarks ? `<div style="margin-top: 4px; font-size: 11px; color: #92400e;">Admin note: ${safeText(item.remarks)}</div>` : ''}
      </td>
      <td style="${tdStyles}; text-align: right;">${fmtAmount(item.totalAmount ?? item.amount, info.currency)}</td>
      <td style="${tdStyles}; text-align: right;">${fmtAmount(item.approvedAmount ?? item.totalAmount ?? item.amount, info.currency)}</td>
      <td style="${tdStyles}; text-align: right;">${fmtAmount(item.deductionAmount, info.currency)}</td>
    </tr>
  `).join('');
  const adminSummaryLine = (data.deduction_total != null || data.admin_remarks)
    ? `Admin review is complete. Final approval is now required for ${fmtAmount(data.total_amount, info.currency)} after a deduction of ${fmtAmount(data.deduction_total || 0, info.currency)}.`
    : 'Admin review is complete. Final approval is now required.';
  const body = `
    <p style="margin-top: 0;">${safeText(adminSummaryLine)}</p>
    ${infoGrid([
      { label: 'Claim Number', value: data.claim_number },
      { label: 'Submitted By', value: data.employee_name },
      { label: 'Submission Date', value: fmtDate(data.submission_date) },
      { label: 'Project Site', value: data.project_site || '' },
      { label: 'Final Approval', value: data.manager_status || 'Pending Final Approval' },
      { label: 'Admin Review', value: data.admin_status || 'Verified' },
    ])}
    ${data.primary_project_code ? infoGrid([
      { label: 'Primary Project Code', value: data.primary_project_code },
    ]) : ''}
    ${(data.admin_remarks || data.deduction_total != null) ? `
      <div style="${softCardStyles}; border-left-color: #f59e0b;">
        <p style="margin: 0 0 6px 0; font-weight: 700; color: #0f172a;">Admin review summary</p>
        <p style="margin: 0 0 4px 0; color: #475569;">Approved total: <strong>${fmtAmount(data.total_amount, info.currency)}</strong></p>
        ${data.original_amount != null ? `<p style="margin: 0 0 4px 0; color: #475569;">Original total: <strong>${fmtAmount(data.original_amount, info.currency)}</strong></p>` : ''}
        ${data.deduction_total != null ? `<p style="margin: 0 0 4px 0; color: #475569;">Deduction total: <strong>${fmtAmount(data.deduction_total, info.currency)}</strong></p>` : ''}
        ${data.admin_remarks ? `<p style="margin: 6px 0 0; color: #0f172a;">Remarks: ${safeText(data.admin_remarks)}</p>` : ''}
      </div>
    ` : ''}
    <div style="${softCardStyles}">
      <p style="margin: 0 0 6px 0; font-weight: 700; color: #0f172a;">Review in the app</p>
      <p style="margin: 0; color: #475569;">Open the claim in the app, sign in with your approver account, then complete final approval or rejection there.</p>
    </div>
    <table style="${tableStyles}">
      <thead>
        <tr>
          <th style="${claimTableHeaderCell(thStyles, '24%')}">Category / Project</th>
          <th style="${claimTableHeaderCell(thStyles, '14%')}">Date</th>
          <th style="${claimTableHeaderCell(thStyles, '30%')}">Description</th>
          <th style="${claimTableHeaderCell(thStyles, '11%')}">Original</th>
          <th style="${claimTableHeaderCell(thStyles, '11%')}">Approved</th>
          <th style="${claimTableHeaderCell(thStyles, '10%')}">Deduction</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="margin: 10px 0 0;"><strong>Final approved total:</strong> ${fmtAmount(data.total_amount, info.currency)}</p>
    ${renderAttachments(data.attachments)}
    ${renderButtons([
      { href: safeLink(data.review_link), label: 'Open Final Review', tone: 'success' },
    ])}
  `;
  return {
    subject: `Final Approval Required - ${data.claim_number}`,
    html: wrapEmail('Final Approval Required', body, info),
  };
}

export function claimApprovedTemplate(data: {
  claim_no: string;
  total: number;
  approved_by: string;
  employee_name?: string;
  status?: string;
  original_total?: number;
  deduction_total?: number;
  remarks?: string;
  project_site?: string;
  items?: Array<{
    category?: string;
    projectCode?: string;
    claimDate?: string;
    description?: string;
    totalAmount?: number;
    amount?: number;
    approvedAmount?: number;
    deductionAmount?: number;
    remarks?: string;
  }>;
} & BrandData): { subject: string; html: string } {
  const info = brand(data);
  const rows = (data.items || []).map((item) => `
    <tr>
      <td style="${tdStyles}; width: 24%; word-break: break-word;">
        <div style="font-weight: 700; color: #0f172a;">${safeText(item.category || '')}</div>
        ${item.projectCode ? `<div style="margin-top: 2px; font-size: 11px; color: #64748b;">${safeText(item.projectCode)}</div>` : ''}
      </td>
      <td style="${tdStyles}; width: 14%; white-space: nowrap;">${safeText(item.claimDate || '')}</td>
      <td style="${tdStyles}; width: 30%; word-break: break-word;">
        <div>${safeText(item.description || '')}</div>
        ${item.remarks ? `<div style="margin-top: 4px; font-size: 11px; color: #92400e;">Review note: ${safeText(item.remarks)}</div>` : ''}
      </td>
      <td style="${tdStyles}; text-align: right;">${fmtAmount(item.totalAmount ?? item.amount, info.currency)}</td>
      <td style="${tdStyles}; text-align: right;">${fmtAmount(item.approvedAmount ?? item.totalAmount ?? item.amount, info.currency)}</td>
      <td style="${tdStyles}; text-align: right;">${fmtAmount(item.deductionAmount, info.currency)}</td>
    </tr>
  `).join('');
  const body = `
    <p style="margin-top: 0;">Dear ${safeText(data.employee_name || 'User')},</p>
    <p>Your claim has been approved and the workflow has been completed.</p>
    ${infoGrid([
      { label: 'Claim ID', value: data.claim_no },
      { label: 'Approved By', value: data.approved_by },
      { label: 'Project Site', value: data.project_site || '' },
      { label: 'Approved Total', value: fmtAmount(data.total, info.currency), html: true },
    ])}
    <div style="${softCardStyles}; border-left-color: #16a34a;">
      <p style="margin: 0 0 6px 0; color: #166534; font-weight: 700;">Approval complete</p>
      <p style="margin: 0; color: #0f172a;">Status: <strong>${safeText(data.status || 'Approved')}</strong></p>
      <p style="margin: 6px 0 0; color: #0f172a;">Approved total: <strong>${fmtAmount(data.total, info.currency)}</strong></p>
      ${data.original_total != null ? `<p style="margin: 6px 0 0; color: #0f172a;">Original total: <strong>${fmtAmount(data.original_total, info.currency)}</strong></p>` : ''}
      ${data.deduction_total != null ? `<p style="margin: 6px 0 0; color: #0f172a;">Deduction total: <strong>${fmtAmount(data.deduction_total, info.currency)}</strong></p>` : ''}
      ${data.remarks ? `<p style="margin: 6px 0 0; color: #0f172a;">Remarks: <strong>${safeText(data.remarks)}</strong></p>` : ''}
    </div>
    ${(data.items || []).length > 0 ? `
      <div style="${softCardStyles}">
        <p style="margin: 0 0 6px 0; font-weight: 700; color: #0f172a;">Claim summary</p>
        <table style="${tableStyles}">
          <thead>
            <tr>
              <th style="${claimTableHeaderCell(thStyles, '24%')}">Category / Project</th>
              <th style="${claimTableHeaderCell(thStyles, '14%')}">Date</th>
              <th style="${claimTableHeaderCell(thStyles, '30%')}">Description</th>
              <th style="${claimTableHeaderCell(thStyles, '11%')}">Original</th>
              <th style="${claimTableHeaderCell(thStyles, '11%')}">Approved</th>
              <th style="${claimTableHeaderCell(thStyles, '10%')}">Deduction</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    ` : ''}
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
    <p style="margin-top: 0;">Dear ${safeText(data.employee_name || 'User')},</p>
    <p>Your claim has been rejected during review.</p>
    ${infoGrid([
      { label: 'Claim ID', value: data.claim_no },
      { label: 'Rejected By', value: data.rejected_by },
      { label: 'Claim Amount', value: fmtAmount(data.total, info.currency), html: true },
    ])}
    <div style="${softCardStyles}; border-left-color: #dc2626;">
      <p style="margin: 0 0 6px 0; font-weight: 700; color: #991b1b;">Reason</p>
      <div style="color: #0f172a;">${safeText(data.reason)}</div>
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
    <p style="margin-top: 0;">Dear ${safeText(data.employeeName || 'User')},</p>
    <p>A password reset request was received for your account.</p>
    ${infoGrid([
      { label: 'Reset Link', value: data.resetLink || '' },
      { label: 'Expires In', value: data.expiresIn || '1 hour' },
    ])}
    <div style="${softCardStyles}; border-left-color: #0284c7;">
      <p style="margin: 0 0 8px 0; font-weight: 700; color: #0f172a;">Security note</p>
      <p style="margin: 0; color: #475569;">If you did not request this, you can safely ignore this email.</p>
    </div>
    ${renderButtons([
      { href: safeLink(data.resetLink), label: 'Reset Password', tone: 'success' },
    ])}
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
  | 'claim_submitted_admin'
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
    case 'claim_submitted_admin':
      return claimSubmittedAdminTemplate(data);
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
