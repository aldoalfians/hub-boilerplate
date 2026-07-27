import { useTheme } from 'styled-components';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import ChartTooltip from './ChartTooltip';

export interface PieChartWidgetProps {
  /** data items: { name: string, value: number } */
  data: Array<{ name: string; value: number }>;
  /** Key for value. Default: 'value' */
  dataKey?: string;
  /** Override colors. Falls back to theme.chartColors */
  colors?: string[];
  height?: number;
  showLegend?: boolean;
  formatter?: (value: number, name: string) => string;
  /** Inner radius % for donut. 0 = full pie. Default: 0 */
  innerRadius?: number;
  /** Outer radius %. Default: 80 */
  outerRadius?: number;
}

const PieChartWidget = ({
  data,
  dataKey = 'value',
  colors,
  height = 300,
  showLegend = true,
  formatter,
  innerRadius = 0,
  outerRadius = 80,
}: PieChartWidgetProps) => {
  const theme = useTheme();
  const palette = colors ?? theme.chartColors;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={palette[i % palette.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip formatter={formatter} />} />
        {showLegend && (
          <Legend
            wrapperStyle={{ fontSize: 12, color: theme.textSecondary }}
            iconType="circle"
            iconSize={8}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartWidget;
