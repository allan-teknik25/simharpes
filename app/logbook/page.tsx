"use client";

import { useEffect, useState } from "react";

import { getMaintenanceLogbook } from "../../services/googleSheet";

export default function LogbookPage() {

  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {

    async function fetchData() {

      const data = await getMaintenanceLogbook();

      setLogs(data);
    }

    fetchData();

  }, []);

  return (

    <>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold text-cyan-400">
            Maintenance Logbook
          </h1>

          <p className="text-gray-400 mt-2">
            Realtime Maintenance Activity Monitoring
          </p>

        </div>

        <div className="bg-cyan-500/20 border border-cyan-500/30 px-5 py-3 rounded-xl text-cyan-400">
          Live Activity
        </div>

      </div>

      {/* Table */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">

        <table className="w-full">

          <thead>

            <tr className="border-b border-gray-800 text-left text-gray-400">

              <th className="pb-4">Date</th>
              <th className="pb-4">Aircraft</th>
              <th className="pb-4">Action</th>
              <th className="pb-4">Engineer</th>
              <th className="pb-4">Status</th>

            </tr>

          </thead>

          <tbody>

            {logs.map((log, index) => (

              <tr
                key={index}
                className="border-b border-gray-800 hover:bg-[#1F2937]"
              >

                <td className="py-4">
                  {log.Date}
                </td>

                <td className="font-semibold text-cyan-400">
                  {log.Aircraft}
                </td>

                <td>
                  {log.Action}
                </td>

                <td>
                  {log.Engineer}
                </td>

                <td
                  className={
                    log.Status === "COMPLETE"
                      ? "text-green-400 font-bold"
                      : log.Status === "ONGOING"
                      ? "text-yellow-400 font-bold"
                      : "text-red-400 font-bold"
                  }
                >
                  {log.Status}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </>

  );
}