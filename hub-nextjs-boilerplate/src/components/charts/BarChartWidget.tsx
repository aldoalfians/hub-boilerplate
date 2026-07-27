'use client';

import { useTheme } from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import ChartTooltip from './ChartTooltip';

export interface BarChartWidgetProps {
  data: Record<string, unknown>[];
  dataKeys: string[];
  xKey?: string;
  colors?: string[];
  height?: number;
  showLegend?: boolean;
  formatter?: (value: number, name: string) => string;
  showGrid?: boolean;
  barRadius?: number;
  multiColor?: boolean;
}

const BarChartWidget = ({ data, dataKeys, xKey = 'name', colors, height = 300, showLegend = false, formatter, showGrid = true, barRadius = 6, multiColor = false }: BarChartWidgetProps) => {
  const theme = useTheme();
  const palette = colors ?? theme.chartColors;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />}
        <XAxis dataKey={xKey} tick={{ fill: theme.textMuted, fontSize: 12 }} axisLine={{ stroke: theme.border }} tickLine={false} />
        <YAxis tick={{ fill: theme.textMuted, fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip formatter={formatter} />} cursor={{ fill: theme.primaryGlow }} />
        {showLegend && <Legend wrapperStyle={{ fontSize: 12, color: theme.textSecondary }} />}
        {dataKeys.map((key, i) => (
          <Bar key={key} dataKey={key} fill={palette[i % palette.length]} radius={[barRadius, barRadius, 0, 0]}>
            {multiColor && data.map((_, idx) => <Cell key={idx} fill={palette[idx % palette.length]} />)}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartWidget;
