import { useThemeColor } from '@/hooks/useThemeColor';
import { useGetPriceChart } from '@/services/api/useGetPriceChart';
import React from 'react';
import { ActivityIndicator, Platform, Text, View } from 'react-native';
import { CartesianChart, Line, useChartPressState } from 'victory-native';
import { useFont } from "@shopify/react-native-skia";
import inter from "../../assets/fonts/Inter.ttf";
import { Circle, Text as SkiaText } from "@shopify/react-native-skia";
import type { SharedValue } from "react-native-reanimated";
import { useDerivedValue } from "react-native-reanimated";
import { StyleSheet } from 'react-native';

const LoadingState = () => (
  <View style={styles.stateContainer}>
    <ActivityIndicator />
  </View>
);

const ErrorState = () => (
  <View style={styles.stateContainer}>
    <Text style={styles.errorText}>Failed to load chart data</Text>
  </View>
);

const ToolTip = ({ x, y, value, date }: {
  x: SharedValue<number>;
  y: SharedValue<number>;
  value: SharedValue<number>;
  date: SharedValue<string>;
}) => {
  const textColor = useThemeColor({}, 'text');
  const font = useFont(inter, 12);

  const tooltipText = useDerivedValue(() => {
    return `${date.value}: $${value.value.toFixed(2)}`;
  });

  if (!font) return null;

  return (
    <>
      <Circle cx={x} cy={y} r={4} color="blue" />
      <SkiaText
        x={10}
        y={20}
        font={font}
        text={tooltipText}
        color={textColor}
      />
    </>
  );
};

const PriceChart = ({ id }: { id: string | undefined }) => {
  const textColor = useThemeColor({}, 'text');
  const { data, error, isLoading } = useGetPriceChart(id);
  const font = useFont(inter, 12);
  const { state, isActive } = useChartPressState({
    x: data?.[0]?.day || "",
    y: { price: data?.[0]?.price || 0 }
  });

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <View style={styles.container}>
      {data ? (
        <>
          <CartesianChart
            data={data}
            xKey="day"
            yKeys={["price"]}
            axisOptions={{ font }}
            chartPressState={state}
            xAxis={{
              tickCount: 6,
              labelColor: 'black',
              formatXLabel: (value) => new Date(value).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })
            }}
            yAxis={[{
              tickCount: 5,
              labelColor: 'black',
              formatYLabel: (value) => `$${value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`
            }]}
          >
            {({ points }) => (
              <>
                <Line
                  points={points.price}
                  color="blue"
                  strokeWidth={1}
                  animate={{ type: "timing", duration: 300 }}
                />
                {isActive && (
                  <ToolTip
                    x={state.x.position}
                    y={state.y.price.position}
                    value={state.y.price.value}
                    date={state.x.value}
                  />
                )}
              </>
            )}
          </CartesianChart>
        </>
      ) : null}
      <Text style={[styles.title, { color: textColor }]}>Price Last 30 Days</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    height: 300,
  },
  title: {
    textAlign: 'center',
    padding: 8,
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default Platform.OS === 'web' ? ({id}: {id: string | undefined}) => null : PriceChart;
