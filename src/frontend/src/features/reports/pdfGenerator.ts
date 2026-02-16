import { toast } from 'sonner';
import { BRANDING } from '../../config/branding';

interface ReportData {
  title: string;
  dateRange: string;
  data: Array<{ label: string; value: string }>;
}

// Convert image to base64 data URL for embedding in standalone HTML
async function getLogoDataUrl(): Promise<string> {
  try {
    const response = await fetch('/assets/generated/aquaflow-icon.dim_256x256.png');
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to load logo for report:', error);
    return '';
  }
}

export async function generatePDF(reportData: ReportData) {
  const logoDataUrl = await getLogoDataUrl();
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${reportData.title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 40px auto;
          padding: 20px;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 40px;
          border-bottom: 3px solid #0d9488;
          padding-bottom: 20px;
        }
        .header-logo {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }
        .header-text {
          text-align: left;
        }
        .logo-title {
          font-size: 28px;
          font-weight: bold;
          color: #0d9488;
          margin: 0;
          line-height: 1.2;
        }
        .logo-subtitle {
          font-size: 14px;
          color: #666;
          margin: 4px 0 0 0;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          margin: 20px 0;
        }
        .date-range {
          color: #666;
          margin-bottom: 30px;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin: 30px 0;
        }
        .data-table th,
        .data-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        .data-table th {
          background-color: #0d9488;
          color: white;
        }
        .signature {
          margin-top: 60px;
          padding-top: 20px;
          border-top: 2px solid #ddd;
        }
        .signature-line {
          margin-top: 40px;
          border-top: 1px solid #000;
          width: 300px;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        ${logoDataUrl ? `<img src="${logoDataUrl}" alt="${BRANDING.appName}" class="header-logo" />` : ''}
        <div class="header-text">
          <h1 class="logo-title">${BRANDING.appName}</h1>
          <p class="logo-subtitle">${BRANDING.tagline} - ${BRANDING.location}</p>
        </div>
      </div>
      
      <div class="title">${reportData.title}</div>
      <div class="date-range">Report Period: ${reportData.dateRange}</div>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          ${reportData.data.map(item => `
            <tr>
              <td>${item.label}</td>
              <td><strong>${item.value}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="signature">
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
        <div class="signature-line">
          Authorized Signature
        </div>
      </div>
    </body>
    </html>
  `;

  // Create a blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${reportData.title.replace(/\s+/g, '_')}_${Date.now()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast.success('Report downloaded successfully');
}
