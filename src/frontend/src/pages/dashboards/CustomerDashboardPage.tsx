import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplets, Package, AlertCircle, MessageSquare, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatAED, formatAEDRate } from '../../utils/currency';

export default function CustomerDashboardPage() {
  const [additionalBottles, setAdditionalBottles] = useState('0');
  const [message, setMessage] = useState('');

  // Mock data - backend integration needed
  const deliveries = [
    { id: 1, date: '2026-02-15', delivered: 0, returned: 0, failed: 0, status: 'Completed' },
    { id: 2, date: '2026-02-08', delivered: 0, returned: 0, failed: 0, status: 'Completed' },
    { id: 3, date: '2026-02-01', delivered: 0, returned: 0, failed: 0, status: 'Pending Return' },
  ];

  const bottleRate = 0; // Default to 0
  const totalDelivered = deliveries.reduce((sum, d) => sum + d.delivered, 0);
  const totalPrice = totalDelivered * bottleRate;

  const handleAdditionalBottlesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Additional bottle request submitted');
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent to customer care');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Customer Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Track your water deliveries and manage requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Delivered</CardTitle>
            <Package className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDelivered}</div>
            <p className="text-xs text-muted-foreground">bottles this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returned</CardTitle>
            <Droplets className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveries.reduce((sum, d) => sum + d.returned, 0)}</div>
            <p className="text-xs text-muted-foreground">bottles returned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Returns</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveries.reduce((sum, d) => sum + d.failed, 0)}</div>
            <p className="text-xs text-muted-foreground">bottles unreturned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAED(totalPrice)}</div>
            <p className="text-xs text-muted-foreground">{formatAEDRate(bottleRate)}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="deliveries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="deliveries">Delivery History</TabsTrigger>
          <TabsTrigger value="requests">Additional Bottles</TabsTrigger>
          <TabsTrigger value="messages">Customer Care</TabsTrigger>
        </TabsList>

        <TabsContent value="deliveries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Deliveries</CardTitle>
              <CardDescription>Your water bottle delivery history</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Delivered</TableHead>
                    <TableHead>Returned</TableHead>
                    <TableHead>Failed Returns</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell>{delivery.date}</TableCell>
                      <TableCell>{delivery.delivered}</TableCell>
                      <TableCell>{delivery.returned}</TableCell>
                      <TableCell>{delivery.failed}</TableCell>
                      <TableCell>
                        <Badge variant={delivery.status === 'Completed' ? 'default' : 'secondary'}>
                          {delivery.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Request Additional Bottles</CardTitle>
              <CardDescription>Update your additional bottle requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdditionalBottlesSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="additionalBottles">Number of Additional Bottles</Label>
                  <Input
                    id="additionalBottles"
                    type="number"
                    min="0"
                    value={additionalBottles}
                    onChange={(e) => setAdditionalBottles(e.target.value)}
                  />
                </div>
                <Button type="submit" className="bg-gradient-to-r from-teal-600 to-cyan-600">
                  Submit Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Customer Care</CardTitle>
              <CardDescription>Send a message to our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMessageSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue or inquiry..."
                    rows={5}
                  />
                </div>
                <Button type="submit" className="bg-gradient-to-r from-teal-600 to-cyan-600">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
