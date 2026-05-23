"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import { getAircraftData } from "../../services/googleSheet";

export default function AircraftPage() {

  const [aircraftData, setAircraftData] = useState<any[]>([]);

  useEffect(() => {

    async function fetchData() {

      const data = await getAircraftData();

      setAircraftData(data);
    }

    fetchData();

  }, []);

  return (

    <>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold text-cyan-400">
            Aircraft Fleet
          </h1>

          <p className="text-gray-400 mt-2">
            Rafale Fleet Monitoring & Readiness
          </p>

        </div>

        <div className="bg-cyan-500/20 border border-cyan-500/30 px-5 py-3 rounded-xl text-cyan-400">
          Live Database
        </div>

      </div>

      {/* Table */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">

        <table className="w-full">

          <thead>

            <tr className="border-b border-gray-800 text-left text-gray-400">

              <th className="pb-4">Aircraft</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">TSN</th>
              <th className="pb-4">Remaining</th>

            </tr>

          </thead>

          <tbody>

            {aircraftData.map((aircraft, index) => (

              <tr
                key={index}
                className="border-b border-gray-800 hover:bg-[#1F2937]"
              >

              <td className="py-4 font-semibold text-cyan-400">

                <Link href={`/aircraft/${aircraft.Aircraft}`}>

                  {aircraft.Aircraft}

                </Link>

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
                      : "text-green-400 font-bold"
                  }
                >

                  {
                    (
                      Math.ceil(Number(aircraft.TSN) / 200) * 200
                      -
                      Number(aircraft.TSN)
                    ) <= 10
                      ? "AOG"
                      : (
                          Math.ceil(Number(aircraft.TSN) / 200) * 200
                          -
                          Number(aircraft.TSN)
                        ) <= 50
                      ? "MAINTENANCE"
                      : "SERVICEABLE"
                  }

                </td>

                <td>
                  {aircraft.TSN} FH
                </td>

                <td>
                  {aircraft.Remaining} FH
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </>

  );
}