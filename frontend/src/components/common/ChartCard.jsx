import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function ChartCard({
  title,
  data,
  dataKey,
  xKey,
  color = "#2563eb",
}) {
  return (
    <div className="chart-card">
      <h3>{title}</h3>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey={xKey} />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey={dataKey}
            fill={color}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartCard;