import React from 'react';

// Pure SVG Area Chart
export const OccupancyTrendChart: React.FC<{
  data?: { month: string; rate: number }[];
  color?: string;
}> = ({
  data = [
    { month: 'May', rate: 45 },
    { month: 'Jun', rate: 52 },
    { month: 'Jul', rate: 64 },
    { month: 'Aug', rate: 71 },
    { month: 'Sep', rate: 79 },
    { month: 'Oct', rate: 84 },
  ],
  color = '#4f46e5',
}) => {
  const height = 180;
  const width = 450;
  const padding = 30;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.rate / 100) * (height - padding * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(val => {
          const y = height - padding - (val / 100) * (height - padding * 2);
          return (
            <g key={val}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#f1f5f9" strokeDasharray="3 3" />
              <text x={padding - 6} y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-medium">
                {val}%
              </text>
            </g>
          );
        })}

        {/* Shaded Area */}
        <path d={areaD} fill="url(#areaGradient)" />

        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke={color} strokeWidth="2" />
            <text x={p.x} y={height - 10} textAnchor="middle" className="text-[10px] fill-slate-500 font-medium">
              {p.month}
            </text>
            <text x={p.x} y={p.y - 8} textAnchor="middle" className="text-[10px] fill-slate-800 font-bold">
              {p.rate}%
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// Pure SVG Bar Chart for Monthly Earnings
export const MonthlyEarningsBarChart: React.FC<{
  data?: { month: string; gross: number; net: number }[];
}> = ({
  data = [
    { month: 'Jun', gross: 24000, net: 19200 },
    { month: 'Jul', gross: 32000, net: 25600 },
    { month: 'Aug', gross: 45000, net: 36000 },
    { month: 'Sep', gross: 58000, net: 46400 },
    { month: 'Oct', gross: 64000, net: 51200 },
  ],
}) => {
  const width = 450;
  const height = 180;
  const padding = 35;
  const maxVal = Math.max(...data.map(d => d.gross), 70000);

  const barGroupWidth = (width - padding * 2) / data.length;
  const barWidth = 14;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Horizontal grid */}
        {[0, 25000, 50000, 75000].map(val => {
          const y = height - padding - (val / maxVal) * (height - padding * 2);
          return (
            <g key={val}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#f1f5f9" strokeDasharray="3 3" />
              <text x={padding - 6} y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-medium">
                ₹{val / 1000}k
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const groupX = padding + i * barGroupWidth;
          const grossH = (d.gross / maxVal) * (height - padding * 2);
          const netH = (d.net / maxVal) * (height - padding * 2);
          const grossY = height - padding - grossH;
          const netY = height - padding - netH;

          return (
            <g key={i}>
              {/* Gross bar */}
              <rect
                x={groupX + barGroupWidth / 2 - barWidth - 2}
                y={grossY}
                width={barWidth}
                height={grossH}
                rx="3"
                fill="#cbd5e1"
              />
              {/* Net bar */}
              <rect
                x={groupX + barGroupWidth / 2 + 2}
                y={netY}
                width={barWidth}
                height={netH}
                rx="3"
                fill="#10b981"
              />
              <text
                x={groupX + barGroupWidth / 2}
                y={height - 10}
                textAnchor="middle"
                className="text-[10px] fill-slate-500 font-medium"
              >
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex items-center justify-center gap-6 mt-2 text-xs">
        <span className="flex items-center gap-1.5 text-slate-500">
          <span className="w-2.5 h-2.5 rounded-xs bg-slate-300" /> Gross Booking Revenue
        </span>
        <span className="flex items-center gap-1.5 text-slate-700 font-medium">
          <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" /> Net Owner Payout
        </span>
      </div>
    </div>
  );
};

// Pure SVG Donut Utilization Chart
export const DonutUtilizationChart: React.FC<{
  occupiedSqFt: number;
  totalSqFt: number;
}> = ({ occupiedSqFt, totalSqFt }) => {
  const occupied = Math.max(0, occupiedSqFt);
  const total = Math.max(1, totalSqFt);
  const percent = Math.min(100, Math.round((occupied / total) * 100));
  const available = Math.max(0, total - occupied);

  const size = 160;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#4f46e5"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-slate-900">{percent}%</span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Occupied</span>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-600" />
          <div>
            <p className="text-slate-500">Occupied Storage</p>
            <p className="font-bold text-slate-900">{occupied.toLocaleString('en-IN')} sq ft</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-slate-200" />
          <div>
            <p className="text-slate-500">Available Ready Capacity</p>
            <p className="font-bold text-slate-900">{available.toLocaleString('en-IN')} sq ft</p>
          </div>
        </div>
      </div>
    </div>
  );
};
