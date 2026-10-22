import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Dispute, DisputeCategory } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ShieldAlert,
  MessageSquare,
  CheckCircle,
  X,
  Send,
  AlertTriangle,
  Clock,
  User,
} from 'lucide-react';

export const AdminDisputesPage: React.FC = () => {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadDisputes();
  }, []);

  const loadDisputes = async () => {
    setIsLoading(true);
    try {
      const res = await api.getDisputes();
      setDisputes(res.disputes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute || !replyMessage || !user) return;

    try {
      await api.addDisputeMessage(selectedDispute.id, {
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        message: replyMessage,
      });

      setReplyMessage('');
      loadDisputes();
      // refresh local modal
      const updated = (await api.getDisputes()).disputes.find(d => d.id === selectedDispute.id);
      if (updated) setSelectedDispute(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolve = async () => {
    if (!selectedDispute) return;
    setIsSubmitting(true);
    try {
      await api.resolveDispute(selectedDispute.id, resolutionNotes || 'Resolved mutually by StoreFlex Admin Operations');
      setSelectedDispute(null);
      setResolutionNotes('');
      loadDisputes();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
            Escalation Management
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Complaints & Dispute Resolution
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Arbitrate gate access disputes, inventory damage claims, deposit settlements, and commercial facility disagreements.
          </p>
        </div>
      </div>

      {/* Disputes Table (#30) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Dispute Ref</th>
                <th className="py-3 px-4">Category & Subject</th>
                <th className="py-3 px-4">Parties Involved</th>
                <th className="py-3 px-4">Facility</th>
                <th className="py-3 px-4">Filed Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">Loading dispute records...</td>
                </tr>
              ) : disputes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">No disputes filed on the platform.</td>
                </tr>
              ) : (
                disputes.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-600">
                      {d.disputeNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{d.title}</span>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium inline-block mt-0.5">
                        {d.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="block font-semibold text-slate-800">Tenant: {d.businessName}</span>
                      <span className="block text-[10px] text-slate-400">Host: {d.ownerName}</span>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {d.propertyName}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={d.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedDispute(d)}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-[11px] flex items-center gap-1 mx-auto transition-colors"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Inspect ({d.messages.length})
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispute Thread & Resolution Modal (#30) */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div>
                <span className="font-mono text-xs font-bold text-rose-600">{selectedDispute.disputeNumber}</span>
                <h3 className="font-bold text-slate-900 text-sm mt-0.5">{selectedDispute.title}</h3>
                <p className="text-[11px] text-slate-500">{selectedDispute.propertyName} • {selectedDispute.category}</p>
              </div>
              <button onClick={() => setSelectedDispute(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Timeline */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs">
              {selectedDispute.messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                    m.senderRole === 'admin'
                      ? 'bg-purple-50/80 border-purple-200 text-purple-950 ml-4'
                      : m.senderRole === 'business'
                      ? 'bg-indigo-50/80 border-indigo-200 text-indigo-950 mr-4'
                      : 'bg-emerald-50/80 border-emerald-200 text-emerald-950 mr-4'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-[10px]">
                    <span className="uppercase">{m.senderName} ({m.senderRole})</span>
                    <span className="text-slate-400 font-normal">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="leading-relaxed">{m.message}</p>
                </div>
              ))}

              {selectedDispute.resolution && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-medium">
                  <strong>Official Resolution:</strong> {selectedDispute.resolution}
                </div>
              )}
            </div>

            {/* Admin Message Reply */}
            {selectedDispute.status !== 'Resolved' && (
              <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-3">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Post arbitration message to thread..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"
                  >
                    Reply
                  </button>
                </form>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <input
                    type="text"
                    placeholder="Enter final resolution note..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleResolve}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs"
                  >
                    Resolve Dispute
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
