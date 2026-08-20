import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { AppText } from '../common/AppText';
import { CATEGORY_META } from '../../constants/categories';
import { ExpenseCategory } from '../../types/models';
import { formatCurrency } from '../../utils/formatters';

interface CategoryPieChartProps {
  breakdown: Record<string, number>;
  currency?: string;
  size?: number;
}

interface Slice {
  category: string;
  value: number;
  percentage: number;
  color: string;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  breakdown,
  currency = 'USD',
  size = 220,
}) => {
  const { colors, spacing } = useTheme();
  const entries = Object.entries(breakdown).filter(([, v]) => v > 0);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  if (!entries.length || total <= 0) {
    return (
      <View
        style={{
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AppText variant="body" color="muted">
          No spending data yet
        </AppText>
      </View>
    );
  }

  let cursor = 0;
  const slices: Slice[] = entries
    .sort((a, b) => b[1] - a[1])
    .map(([category, value], index) => {
      const percentage = (value / total) * 100;
      const slice: Slice = {
        category,
        value,
        percentage,
        color: colors.chartPalette[index % colors.chartPalette.length],
      };
      return slice;
    });

  const radius = size / 2;
  const strokeInset = 2;

  return (
    <View>
      <View style={{ alignItems: 'center' }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {slices.map(slice => {
            const angleSpan = (slice.value / total) * 360;
            const startAngle = cursor;
            const endAngle = cursor + angleSpan;
            cursor = endAngle;
            return (
              <Path
                key={slice.category}
                d={describeArc(
                  radius,
                  radius,
                  radius - strokeInset,
                  startAngle,
                  endAngle,
                )}
                fill={slice.color}
                stroke={colors.surface}
                strokeWidth={2}
              />
            );
          })}
          <Circle cx={radius} cy={radius} r={radius * 0.55} fill={colors.surface} />
        </Svg>
        <View style={{ position: 'absolute', alignItems: 'center' }}>
          <AppText variant="caption" color="muted">
            Total Spent
          </AppText>
          <AppText variant="numericMedium">
            {formatCurrency(total, currency)}
          </AppText>
        </View>
      </View>

      <View style={{ marginTop: spacing.md }}>
        {slices.map(slice => {
          const meta = CATEGORY_META[slice.category as ExpenseCategory];
          return (
            <View
              key={slice.category}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: spacing.xxs,
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: slice.color,
                  marginRight: spacing.xs,
                }}
              />
              <View style={{ flex: 1 }}>
                <AppText variant="body">
                  {meta?.label ?? slice.category}
                </AppText>
              </View>
              <AppText variant="bodyMedium" color="secondary">
                {slice.percentage.toFixed(0)}%
              </AppText>
              <View style={{ width: spacing.sm }} />
              <AppText variant="bodyMedium">
                {formatCurrency(slice.value, currency)}
              </AppText>
            </View>
          );
        })}
      </View>
    </View>
  );
};
