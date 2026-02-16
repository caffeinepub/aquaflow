import { toast } from 'sonner';

interface ReportData {
  title: string;
  dateRange: string;
  data: Array<{ label: string; value: string }>;
}

export function generatePDF(reportData: ReportData) {
  // Create a simple HTML-based PDF generation
  // In production, you would use a library like jsPDF or pdfmake
  
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
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 3px solid #0d9488;
          padding-bottom: 20px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #0d9488;
          margin-bottom: 10px;
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
        <div class="logo">AquaFlow</div>
        <div>Water Supply Management System - Dubai, UAE</div>
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
