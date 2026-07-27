'use client';

import { useTheme } from 'styled-components';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartTooltip from './ChartTooltip';

export interface AreaChartWidgetProps {
  data: Record<string, unknown>[];
  dataKeys: string[];
  xKey?: string;
  colors?: string[];
  height?: number;
  showLegend?: boolean;
  formatter?: (value: number, name: string) => string;
  showGrid?: boolean;
  fillOpacity?: number;
  smooth?: boolean;
}

const AreaChartWidget = ({ data, dataKeys, xKey = 'name', colors, height = 300, showLegend = false, formatter, showGrid = true, fillOpacity = 0.15, smooth = true }: AreaChartWidgetProps) => {
  const theme = useTheme();
  const palette = colors ?? theme.chartColors;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <defs>
          {dataKeys.map((key, i) => (
            <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={palette[i % palette.length]} stopOpacity={0.4} />
              <stop offset="95%" stopColor={palette[i % palette.length]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />}
        <XAxis dataKey={xKey} tick={{ fill: theme.textMuted, fontSize: 12 }} axisLine={{ stroke: theme.border }} tickLine={false} />
        <YAxis tick={{ fill: theme.textMuted, fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip formatter={formatter} />} />
        {showLegend && <Legend wrapperStyle={{ fontSize: 12, color: theme.textSecondary }} />}
        {dataKeys.map((key, i) => (
          <Area key={key} type={smooth ? 'monotone' : 'linear'} dataKey={key}
            stroke={palette[i % palette.length]} strokeWidth={2.5}
            fill={`url(#grad-${key})`} fillOpacity={fillOpacity}
            dot={false} activeDot={{ r: 5, strokeWidth: 2 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartWidget;
