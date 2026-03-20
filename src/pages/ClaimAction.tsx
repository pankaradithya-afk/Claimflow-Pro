import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { approveClaimAsAdmin, approveClaimAsManager, getClaimById, rejectClaim } from '@/lib/claims-api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function ClaimAction() {
  const [searchParams] = useSearchParams();
  const [claim, setClaim] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [autoProcessed, setAutoProcessed] = useState(false);

  const claimId = searchParams.get('claimId') || '';
  const role = (searchParams.get('role') || '').toLowerCase();
  const action = (searchParams.get('action') || '').toLowerCase();
  const approverEmail = searchParams.get('approverEmail') || '';

  const mode = useMemo(() => ({
    isApprove: action === 'approve',
    isReject: action === 'reject',
    isManager: role === 'manager',
    isAdmin: role === 'admin',
  }), [action, role]);

  useEffect(() => {
    async function loadClaim() {
      if (!claimId) {
        setMessage('Missing claim id.');
        setLoading(false);
        return;
      }
      const data = await getClaimById(claimId);
      setClaim(data);
      setLoading(false);
    }

    void loadClaim();
  }, [claimId]);

  useEffect(() => {
    if (loading || autoProcessed || message || !mode.isApprove || !claimId || !approverEmail) return;
    setAutoProcessed(true);
    void processApprove();
  }, [loading, autoProcessed, message, mode.isApprove, claimId, approverEmail]);

  const processApprove = async () => {
    if (!claimId || !approverEmail) return;
    setProcessing(true);
    try {
      if (mode.isManager) {
        await approveClaimAsManager(claimId, approverEmail, 'Approved from email link');
      } else if (mode.isAdmin) {
        await approveClaimAsAdmin(claimId, approverEmail, 'Approved from email link');
      } else {
        throw new Error('Invalid approval role');
      }
      setMessage('Claim approved successfully.');
    } catch (error: any) {
      setMessage(error.message || 'Failed to approve claim.');
    }
    setProcessing(false);
  };

  const processReject = async () => {
    if (!claimId || !approverEmail || !rejectReason.trim()) return;
    setProcessing(true);
    try {
      await rejectClaim(claimId, rejectReason.trim(), approverEmail, mode.isManager ? 'Manager' : 'Admin');
      setMessage('Claim rejected successfully.');
    } catch (error: any) {
      setMessage(error.message || 'Failed to reject claim.');
    }
    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Claim Email Action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="space-y-1 text-sm">
                <p><strong>Claim:</strong> {claim?.claimId || claimId}</p>
                <p><strong>Status:</strong> {claim?.status || '-'}</p>
                <p><strong>Submitted By:</strong> {claim?.submittedBy || '-'}</p>
                <p><strong>Site:</strong> {claim?.site || '-'}</p>
              </div>

              {mode.isReject && !message && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rejection Reason</label>
                  <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} placeholder="Enter rejection reason" />
                </div>
              )}

              {message ? (
                <div className="rounded border border-border bg-muted/40 p-4 text-sm">{message}</div>
              ) : (
                <div className="flex gap-2">
                  {mode.isApprove && (
                    <Button onClick={() => void processApprove()} disabled={processing || !approverEmail}>
                      {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {processing ? 'Processing Approval...' : 'Approve Claim'}
                    </Button>
                  )}
                  {mode.isReject && (
                    <Button variant="destructive" onClick={() => void processReject()} disabled={processing || !approverEmail || !rejectReason.trim()}>
                      {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Reject Claim
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
