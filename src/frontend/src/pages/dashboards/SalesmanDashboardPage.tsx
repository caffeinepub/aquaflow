import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SalesmanDashboardPage() {
  const [customerName, setCustomerName] = useState('');
  const [bottlesDelivered, setBottlesDelivered] = useState('0');
  const [bottlesReturned, setBottlesReturned] = useState('0');
  const [failedReturns, setFailedReturns] = useState('0');

  // Mock data - all defaults to 0
  const stats = {
    totalDeliveries: 0,
    completedToday: 0,
    pendingReturns: 0,
  };

  const recentDeliveries = [
    { id: 1, customer: 'John Doe', date: '2026-02-15', delivered: 0, returned: 0, status: 'Completed' },
    { id: 2, customer: 'Jane Smith', date: '2026-02-15', delivered: 0, returned: 0, status: 'Pending' },
    { id: 3, customer: 'Bob Johnson', date: '2026-02-14', delivered: 0, returned: 0, status: 'Completed' },
  ];

  const additionalRequests = [
    { id: 1, customer: 'John Doe', quantity: 0, date: '2026-02-14', status: 'Pending' },
    { id: 2, customer: 'Jane Smith', quantity: 0, date: '2026-02-13', status: 'Fulfilled' },
  ];

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      toast.error('Please enter customer name');
      return;
    }

    const delivered = parseInt(bottlesDelivered) || 0;
    const returned = parseInt(bottlesReturned) || 0;
    const failed = parseInt(failedReturns) || 0;

    if (delivered < 0 || returned < 0 || failed < 0) {
      toast.error('Values cannot be negative');
      return;
    }

    toast.success('Delivery recorded successfully');
    setCustomerName('');
    setBottlesDelivered('0');
    setBottlesReturned('0');
    setFailedReturns('0');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Salesman Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Manage deliveries and customer requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Package className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedToday}</div>
            <p className="text-xs text-muted-foreground">deliveries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Returns</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReturns}</div>
            <p className="text-xs text-muted-foreground">bottles</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="new-delivery" className="space-y-4">
        <TabsList>
          <TabsTrigger value="new-delivery">New Delivery</TabsTrigger>
          <TabsTrigger value="recent">Recent Deliveries</TabsTrigger>
          <TabsTrigger value="requests">Additional Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="new-delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Record New Delivery</CardTitle>
              <CardDescription>Enter delivery details for a customer</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeliverySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="bottlesDelivered">Bottles Delivered</Label>
                    <Input
                      id="bottlesDelivered"
                      type="number"
                      min="0"
                      value={bottlesDelivered}
                      onChange={(e) => setBottlesDelivered(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bottlesReturned">Bottles Returned</Label>
                    <Input
                      id="bottlesReturned"
                      type="number"
                      min="0"
                      value={bottlesReturned}
                      onChange={(e) => setBottlesReturned(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="failedReturns">Failed Returns</Label>
                    <Input
                      id="failedReturns"
                      type="number"
                      min="0"
                      value={failedReturns}
                      onChange={(e) => setFailedReturns(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="bg-gradient-to-r from-teal-600 to-cyan-600">
                  <Truck className="mr-2 h-4 w-4" />
                  Record Delivery
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Deliveries</CardTitle>
              <CardDescription>Your recent delivery records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Delivered</TableHead>
                    <TableHead>Returned</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDeliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.customer}</TableCell>
                      <TableCell>{delivery.date}</TableCell>
                      <TableCell>{delivery.delivered}</TableCell>
                      <TableCell>{delivery.returned}</TableCell>
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
              <CardTitle>Customer Additional Bottle Requests</CardTitle>
              <CardDescription>View and fulfill customer requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {additionalRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.customer}</TableCell>
                      <TableCell>{request.quantity}</TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell>
                        <Badge variant={request.status === 'Fulfilled' ? 'default' : 'secondary'}>
                          {request.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
