"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs font-semibold text-white shadow-xl"
      style={{ background: "rgba(15,15,30,0.95)", border: "1px solid rgba(255,255,255,0.12)" }}>
      <p className="text-slate-400 mb-0.5">{label}</p>
      <p style={{ color: payload[0]?.color }}>{payload[0]?.value}</p>
    </div>
  );
}

export default function ChartCard({ title, data, dataKey, color = "#6F27FF" }) {
  return (
    <div className="p-5 h-72">
      <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">{title}</p>
      <ResponsiveContainer width="100%" height="88%">
        <AreaChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#475569" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#grad-${dataKey})`}
            dot={false}
            activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}