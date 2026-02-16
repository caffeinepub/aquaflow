import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useCurrentUser';
import { toast } from 'sonner';
import { generatePDF } from '../features/reports/pdfGenerator';
import { formatAED } from '../utils/currency';

export default function ReportsPage() {
  const { data: userProfile } = useGetCallerUserProfile();

  const handleGenerateReport = (reportType: string) => {
    toast.success(`Generating ${reportType} report...`);
    
    // Generate PDF with mock data - all defaults to 0
    const reportData = {
      title: reportType,
      dateRange: 'February 1-15, 2026',
      data: [
        { label: 'Total Deliveries', value: '0' },
        { label: 'Total Sales', value: formatAED(0) },
        { label: 'Bottles Delivered', value: '0' },
      ]
    };
    
    generatePDF(reportData);
  };

  const customerReports = [
    { id: 'weekly', title: 'Weekly Report', description: 'Your deliveries for the past week' },
    { id: 'monthly', title: 'Monthly Report', description: 'Your deliveries for the past month' },
  ];

  const adminReports = [
    { id: 'daily-sales', title: 'Daily Sales Report', description: 'Today\'s sales and deliveries' },
    { id: 'monthly-sales', title: 'Monthly Sales Report', description: 'Complete monthly sales data' },
    { id: 'customer-report', title: 'Customer Report', description: 'Individual customer analytics' },
    { id: 'complete-analytics', title: 'Complete Analytics', description: 'Comprehensive business analytics' },
  ];

  const reports = userProfile?.appRole === 'admin' ? adminReports : customerReports;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Reports
        </h1>
        <p className="text-muted-foreground mt-1">Generate and download professional PDF reports</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="bg-teal-100 dark:bg-teal-900/20 rounded-lg p-3">
                  <FileText className="h-6 w-6 text-teal-600" />
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="mt-4">{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleGenerateReport(report.title)}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Generate PDF
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Information</CardTitle>
          <CardDescription>What's included in your reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-teal-600" />
                Report Contents
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                <li>AquaFlow company logo and branding</li>
                <li>Explicit date range for the report period</li>
                <li>Detailed delivery and sales data</li>
                <li>Computed totals and summaries</li>
                <li>Professional signature section</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Download className="h-4 w-4 text-teal-600" />
                Download Format
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                <li>Professionally formatted PDF layout</li>
                <li>Structured tables and clear headings</li>
                <li>Print-ready quality</li>
                <li>Consistent spacing and typography</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
