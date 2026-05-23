"use client";

import { useEffect, useState } from "react";

import { getStaggeringData } from "../../services/googleSheet";

export default function StaggeringPage() {

  const [staggeringData, setStaggeringData] = useState<any[]>([]);

  useEffect(() => {

    async function fetchData() {

      const data = await getStaggeringData();

      setStaggeringData(data);
    }

    fetchData();

  }, []);

  return (

    <>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold text-cyan-400">
            Aircraft Staggering
          </h1>

          <p className="text-gray-400 mt-2">
            Phase Maintenance Distribution Monitoring
          </p>

        </div>

        <div className="bg-yellow-500/20 border border-yellow-500/30 px-5 py-3 rounded-xl text-yellow-400">
          Maintenance Planning
        </div>

      </div>

      {/* Table */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">

        <table className="w-full">

          <thead>

            <tr className="border-b border-gray-800 text-left text-gray-400">

              <th className="pb-4">Aircraft</th>
              <th className="pb-4">TSN</th>
              <th className="pb-4">Next Phase</th>
              <th className="pb-4">Remaining FH</th>
              <th className="pb-4">Status</th>
            </tr>

          </thead>

          <tbody>

            {staggeringData.map((aircraft, index) => (

              <tr
                key={index}
                className="border-b border-gray-800 hover:bg-[#1F2937]"
              >

                <td className="py-4 font-semibold">
                  {aircraft.Aircraft}
                </td>

                <td>
                  {aircraft.TSN} FH
                </td>

                <td>
                  {Math.ceil(Number(aircraft.TSN) / 200) * 200} FH
                </td>

                <td
                  className={
                    (
                      Math.ceil(Number(aircraft.TSN) / 200) * 200
                      -
                      Number(aircraft.TSN)
                    ) <= 10
                      ? "text-red-400 font-bold"
                      : (
                          Math.ceil(Number(aircraft.TSN) / 200) * 200
                          -
                          Number(aircraft.TSN)
                        ) <= 50
                      ? "text-yellow-400 font-bold"
                      : "text-green-400"
                  }
                >
                  {
                    Math.ceil(Number(aircraft.TSN) / 200) * 200
                    -
                    Number(aircraft.TSN)
                  } FH

                </td>

                <td
                  className={
                    (
                      Math.ceil(Number(aircraft.TSN) / 200) * 200
                      -
                      Number(aircraft.TSN)
                    ) <= 10
                      ? "text-red-400 font-bold"
                      : (
                          Math.ceil(Number(aircraft.TSN) / 200) * 200
                          -
                          Number(aircraft.TSN)
                        ) <= 50
                      ? "text-yellow-400 font-bold"
                      : "text-green-400"
                  }
                >

                  {
                    (
                      Math.ceil(Number(aircraft.TSN) / 200) * 200
                      -
                      Number(aircraft.TSN)
                    ) <= 10
                      ? "CRITICAL"
                      : (
                          Math.ceil(Number(aircraft.TSN) / 200) * 200
                          -
                          Number(aircraft.TSN)
                        ) <= 50
                      ? "WARNING"
                      : "NORMAL"
                  }

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </>

  );
}