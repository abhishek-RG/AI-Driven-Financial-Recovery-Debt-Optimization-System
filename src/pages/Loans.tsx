import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { loansAPI } from "@/integrations/mongodb/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { emitFinancialDataUpdate } from "@/lib/realtime";

interface Loan {
  id: string;
  loan_name: string;
  principal_amount: number;
  interest_rate: number;
  start_date: string;
  end_date: string;
  monthly_payment: number;
  status: 'active' | 'paid' | 'defaulted';
}

const Loans = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [formData, setFormData] = useState({
    loan_name: '',
    principal_amount: '',
    interest_rate: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    monthly_payment: '',
    status: 'active' as 'active' | 'paid' | 'defaulted'
  });

  useEffect(() => {
    if (user) {
      fetchLoans();
      
      // Poll for updates every 5 seconds
      const interval = setInterval(() => {
        fetchLoans();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchLoans = async () => {
    if (!user) return;
    try {
      const data = await loansAPI.getAll();
      setLoans(data as Loan[]);
    } catch (error) {
      console.error('Failed to fetch loans:', error);
      toast.error('Failed to fetch loans');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const data = await loansAPI.create({
        loan_name: formData.loan_name,
        principal_amount: parseFloat(formData.principal_amount),
        interest_rate: parseFloat(formData.interest_rate),
        start_date: formData.start_date,
        end_date: formData.end_date,
        monthly_payment: parseFloat(formData.monthly_payment),
        status: formData.status
      });

      toast.success('Loan added successfully');
      emitFinancialDataUpdate({ entity: 'loan', action: 'create' });
      // Immediately refresh to get latest data from backend
      await fetchLoans();
      setFormData({
        loan_name: '',
        principal_amount: '',
        interest_rate: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        monthly_payment: '',
        status: 'active'
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to add loan');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await loansAPI.delete(id);
      toast.success('Loan deleted');
      emitFinancialDataUpdate({ entity: 'loan', action: 'delete' });
      // Immediately refresh to get latest data
      await fetchLoans();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete loan');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      paid: "secondary",
      defaulted: "destructive"
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Loans</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Loan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="loan_name">Loan Name</Label>
                <Input
                  id="loan_name"
                  value={formData.loan_name}
                  onChange={(e) => setFormData({...formData, loan_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="principal_amount">Principal Amount</Label>
                <Input
                  id="principal_amount"
                  type="number"
                  step="0.01"
                  value={formData.principal_amount}
                  onChange={(e) => setFormData({...formData, principal_amount: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="interest_rate">Interest Rate (%)</Label>
                <Input
                  id="interest_rate"
                  type="number"
                  step="0.01"
                  value={formData.interest_rate}
                  onChange={(e) => setFormData({...formData, interest_rate: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="monthly_payment">Monthly Payment</Label>
                <Input
                  id="monthly_payment"
                  type="number"
                  step="0.01"
                  value={formData.monthly_payment}
                  onChange={(e) => setFormData({...formData, monthly_payment: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="defaulted">Defaulted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Add Loan</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {loans.map((loan) => (
                <div key={loan.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{loan.loan_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Principal: ${loan.principal_amount.toFixed(2)} • {loan.interest_rate}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Monthly: ${loan.monthly_payment.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      {getStatusBadge(loan.status)}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(loan.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {loans.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No loans yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Loans;
