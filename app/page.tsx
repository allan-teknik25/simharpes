"use client";

import ThemeToggle from "./components/ThemeToggle";

import { useEffect, useState } from "react";

import { getAircraftData } from "../services/googleSheet";

import { getStaggeringData } from "../services/googleSheet";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", readiness: 60 },
  { month: "Feb", readiness: 68 },
  { month: "Mar", readiness: 72 },
  { month: "Apr", readiness: 75 },
  { month: "May", readiness: 70 },
];

export default function Home() {

  const [notifications, setNotifications] = useState<any[]>([]);

  const [fleetData, setFleetData] = useState<any[]>([]);

  useEffect(() => {

    async function fetchNotifications() {

      const data = await getStaggeringData();

      const criticalAircraft = data.filter((aircraft: any) => {

        const remaining =
          Math.ceil(Number(aircraft.TSN) / 200) * 200
          -
          Number(aircraft.TSN);

        return remaining <= 50;

      });

      setNotifications(criticalAircraft);
    }

    fetchNotifications();

  }, []);

  useEffect(() => {

    async function fetchFleet() {

      const data = await getAircraftData();

      setFleetData(data);
    }

    fetchFleet();

  }, []);

  // 👇 LANGKAH 5 TARUH DI SINI 😄🔥

  const serviceableCount = fleetData.filter((aircraft) => {

    const remaining =
      Math.ceil(Number(aircraft.TSN) / 200) * 200
      -
      Number(aircraft.TSN);

    return remaining > 50;

  }).length;

  const maintenanceCount = fleetData.filter((aircraft) => {

    const remaining =
      Math.ceil(Number(aircraft.TSN) / 200) * 200
      -
      Number(aircraft.TSN);

    return remaining > 10 && remaining <= 50;

  }).length;

  const aogCount = fleetData.filter((aircraft) => {

    const remaining =
      Math.ceil(Number(aircraft.TSN) / 200) * 200
      -
      Number(aircraft.TSN);

    return remaining <= 10;

  }).length;

  // 👇 BARU RETURN

  return (

    <>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <div>

          <h2 className="text-4xl font-bold">
            Aircraft Readiness Dashboard
          </h2>

          <p className="text-gray-400 mt-2">
            Skadron Udara X • Rafale Fleet Monitoring
          </p>

        </div>

        <ThemeToggle />

        <div className="bg-green-500/20 border border-green-500/30 px-5 py-3 rounded-xl text-green-400">
          Fleet Ready
        </div>

      </div>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">

        <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800">
          <p className="text-gray-400 mb-2">SERVICEABLE</p>
          <h3 className="text-5xl font-bold text-green-400">{serviceableCount}</h3>
        </div>

        <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800">
          <p className="text-gray-400 mb-2">MAINTENANCE</p>
          <h3 className="text-5xl font-bold text-yellow-400">{maintenanceCount}</h3>
        </div>

        <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800">
          <p className="text-gray-400 mb-2">AOG</p>
          <h3 className="text-5xl font-bold text-red-400">{aogCount}</h3>
        </div>

        <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800">
          <p className="text-gray-400 mb-2">Fleet Readiness</p>
          <h3 className="text-5xl font-bold text-cyan-400">
            {Math.round(
              (serviceableCount / fleetData.length) * 100
            ) || 0}% 
          </h3>
        </div>

      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-6">

        {/* Chart */}
        <div className="col-span-2 bg-[#111827] rounded-2xl border border-gray-800 p-6">

          <h3 className="text-xl font-bold mb-6">
            Fleet Readiness Trend
          </h3>

          <ResponsiveContainer width="100%" height={250}>

            <LineChart data={data}>

              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="readiness"
                stroke="#22D3EE"
                strokeWidth={4}
                dot={{ r: 6 }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* Warning */}
        <div className="bg-[#111827] rounded-2xl border border-gray-800 p-6">

          <h3 className="text-xl font-bold mb-6">
            Warning Panel
          </h3>

            <div className="space-y-4">

              {notifications.map((aircraft, index) => {

                const remaining =
                  Math.ceil(Number(aircraft.TSN) / 200) * 200
                  -
                  Number(aircraft.TSN);

                return (

                  <div
                    key={index}
                    className={
                      remaining <= 10
                        ? "bg-red-500/10 border border-red-500/20 p-4 rounded-xl"
                        : "bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl"
                    }
                  >

                    <p
                      className={
                        remaining <= 10
                          ? "text-red-400 font-semibold"
                          : "text-yellow-400 font-semibold"
                      }
                    >

                      {aircraft.Aircraft}
                      {" "}
                      Remaining
                      {" "}
                      {remaining}
                      {" "}
                      FH

                    </p>

                  </div>

                );

              })}

            </div>

        </div>

      </div>

    </>

  );
}