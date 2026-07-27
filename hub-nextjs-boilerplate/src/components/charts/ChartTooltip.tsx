'use client';

import styled from 'styled-components';

const TooltipWrapper = styled.div`
  background: ${({ theme }) => theme.bgCard};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radiusMd};
  padding: 10px 14px;
  box-shadow: ${({ theme }) => theme.shadowCard};
  font-size: 13px;
`;
const TooltipLabel = styled.p`
  margin: 0 0 6px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;
const TooltipItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.textSecondary};
  margin: 2px 0;
`;
const TooltipDot = styled.span<{ $color: string }>`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  formatter?: (value: number, name: string) => string;
}

const ChartTooltip = ({ active, payload, label, formatter }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <TooltipWrapper>
      {label && <TooltipLabel>{label}</TooltipLabel>}
      {payload.map((entry) => (
        <TooltipItem key={entry.name}>
          <TooltipDot $color={entry.color} />
          <span>{entry.name}:</span>
          <strong style={{ color: entry.color }}>
            {formatter ? formatter(entry.value, entry.name) : entry.value}
          </strong>
        </TooltipItem>
      ))}
    </TooltipWrapper>
  );
};

export default ChartTooltip;
