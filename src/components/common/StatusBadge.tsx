import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const norm = status.toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (['active', 'verified', 'paid', 'delivered', 'resolved', 'confirmed', 'available'].includes(norm)) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (['pending', 'payment pending', 'requested', 'open', 'under_review', 'under review', 'in escrow'].includes(norm)) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (['in transit', 'assigned'].includes(norm)) {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (['cancelled', 'rejected', 'failed', 'suspended', 'expired'].includes(norm)) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (['occupied', 'disputed', 'expiring soon'].includes(norm)) {
    colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses} ${colorClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status.replace(/_/g, ' ')}
    </span>
  );
};
