import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const AdvertiserBillingManagement = ({ data }) => {
  const billingStats = [
    { label: 'Monthly Revenue', value: '$145,670', icon: 'DollarSign', color: 'bg-success/10 text-success', trend: '+12%' },
    { label: 'Active Campaigns', value: '23', icon: 'BarChart3', color: 'bg-primary/10 text-primary', trend: '+5' },
    { label: 'Pending Invoices', value: '8', icon: 'FileText', color: 'bg-accent/10 text-accent', trend: '-3' },
    { label: 'Collection Rate', value: '96.8%', icon: 'TrendingUp', color: 'bg-success/10 text-success', trend: '+2.1%' }
  ];

  const campaigns = [
    { id: 1, name: 'Summer Product Launch', advertiser: 'TechCorp Inc', spend: 12600, participants: 4500, status: 'active', billingCycle: 'monthly', nextBilling: '2026-02-01' },
    { id: 2, name: 'Brand Awareness Q3', advertiser: 'Fashion Brand Co', spend: 12160, participants: 3800, status: 'active', billingCycle: 'monthly', nextBilling: '2026-02-01' },
    { id: 3, name: 'Holiday Special', advertiser: 'Retail Giant', spend: 12480, participants: 5200, status: 'paused', billingCycle: 'weekly', nextBilling: '2026-01-28' },
    { id: 4, name: 'New Market Entry', advertiser: 'StartupXYZ', spend: 11020, participants: 2900, status: 'completed', billingCycle: 'one-time', nextBilling: 'Completed' }
  ];

  const invoices = [
    { id: 'INV-2026-001', advertiser: 'TechCorp Inc', amount: 12600, status: 'paid', dueDate: '2026-01-15', paidDate: '2026-01-14' },
    { id: 'INV-2026-002', advertiser: 'Fashion Brand Co', amount: 12160, status: 'pending', dueDate: '2026-01-25', paidDate: null },
    { id: 'INV-2026-003', advertiser: 'Retail Giant', amount: 12480, status: 'overdue', dueDate: '2026-01-20', paidDate: null },
    { id: 'INV-2026-004', advertiser: 'StartupXYZ', amount: 11020, status: 'paid', dueDate: '2026-01-18', paidDate: '2026-01-17' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': case'paid':
        return 'bg-green-100 text-green-700';
      case 'paused': case'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {billingStats?.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-full ${stat?.color} flex items-center justify-center`}>
                <Icon name={stat?.icon} size={24} />
              </div>
              <span className="text-xs font-medium text-success">{stat?.trend}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat?.label}</p>
            <p className="text-3xl font-heading font-bold text-foreground font-data">
              {stat?.value}
            </p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Campaign Charges
          </h2>
          <Button variant="outline" size="sm" iconName="Download">
            Export Report
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Campaign</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Advertiser</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Spend</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Participants</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Billing Cycle</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Next Billing</th>
              </tr>
            </thead>
            <tbody>
              {campaigns?.map((campaign) => (
                <tr key={campaign?.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{campaign?.name}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{campaign?.advertiser}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-foreground text-right font-data">
                    ${campaign?.spend?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground text-right font-data">
                    {campaign?.participants?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign?.status)}`}>
                      {campaign?.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground capitalize">{campaign?.billingCycle}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{campaign?.nextBilling}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Automated Invoicing
          </h2>
          <Button variant="default" size="sm" iconName="Send">
            Send Pending Invoices
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Invoice ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Advertiser</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Amount</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Due Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Paid Date</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices?.map((invoice) => (
                <tr key={invoice?.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{invoice?.id}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{invoice?.advertiser}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-foreground text-right font-data">
                    ${invoice?.amount?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice?.status)}`}>
                      {invoice?.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{invoice?.dueDate}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{invoice?.paidDate || '-'}</td>
                  <td className="py-3 px-4 text-center">
                    <Button variant="ghost" size="sm" iconName="Download">
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Revenue Recognition
            </h2>
            <Icon name="TrendingUp" size={24} className="text-success" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium text-foreground">Recognized This Month</span>
              <span className="text-lg font-bold text-foreground font-data">$128,450</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium text-foreground">Deferred Revenue</span>
              <span className="text-lg font-bold text-foreground font-data">$17,220</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium text-foreground">Projected Next Month</span>
              <span className="text-lg font-bold text-foreground font-data">$156,800</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Payment Collection
            </h2>
            <Icon name="CreditCard" size={24} className="text-primary" />
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-success/10">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <span className="text-sm font-medium text-foreground">Auto-Charge Enabled</span>
              </div>
              <p className="text-xs text-muted-foreground">Automatic billing on campaign milestones</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Bell" size={20} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Payment Reminders</span>
              </div>
              <p className="text-xs text-muted-foreground">Automated reminders 3 days before due date</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertiserBillingManagement;