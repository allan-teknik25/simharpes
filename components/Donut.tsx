"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function Donut({ value }: any) {
  const data = [
    { name: "ready", value },
    { name: "gap", value: 100 - value },
  ];

  const COLORS = ["#22c55e", "#1f2937"];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            innerRadius={70}
            outerRadius={100}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}