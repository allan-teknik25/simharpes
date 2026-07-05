"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function Donut({ value = 0 }: { value?: number }) {

  const safeValue = Math.max(
    0,
    Math.min(
      100,
      Number(value) || 0
    )
  );

  const data = [
    {
      name: "ready",
      value: safeValue,
    },
    {
      name: "gap",
      value: 100 - safeValue,
    },
  ];

  const COLORS = [
    "#22c55e",
    "#1f2937",
  ];

  return (

    <div className="w-full h-64">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            innerRadius={70}
            outerRadius={100}
            stroke="none"
          >

            {data.map((_, i) => (

              <Cell
                key={i}
                fill={COLORS[i]}
              />

            ))}

          </Pie>

        </PieChart>

      </ResponsiveContainer>

    </div>

  );

}