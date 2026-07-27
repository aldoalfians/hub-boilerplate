import { useTheme } from 'styled-components';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import ChartTooltip from './ChartTooltip';

export interface LineChartWidgetProps {
  data: Record<string, unknown>[];
  dataKeys: string[];
  xKey?: string;
  colors?: string[];
  height?: number;
  showLegend?: boolean;
  formatter?: (value: number, name: string) => string;
  showGrid?: boolean;
  /** Line stroke width. Default: 2.5 */
  strokeWidth?: number;
  /** Show dots on data points. Default: false */
  showDots?: boolean;
}

const LineChartWidget = ({
  data,
  dataKeys,
  xKey = 'name',
  colors,
  height = 300,
  showLegend = false,
  formatter,
  showGrid = true,
  strokeWidth = 2.5,
  showDots = false,
}: LineChartWidgetProps) => {
  const theme = useTheme();
  const palette = colors ?? theme.chartColors;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
        )}
        <XAxis
          dataKey={xKey}
          tick={{ fill: theme.textMuted, fontSize: 12 }}
          axisLine={{ stroke: theme.border }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: theme.textMuted, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<ChartTooltip formatter={formatter} />} />
        {showLegend && <Legend wrapperStyle={{ fontSize: 12, color: theme.textSecondary }} />}
        {dataKeys.map((key, i) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={palette[i % palette.length]}
            strokeWidth={strokeWidth}
            dot={showDots ? { fill: palette[i % palette.length], r: 4 } : false}
            activeDot={{ r: 5, strokeWidth: 2 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartWidget;
