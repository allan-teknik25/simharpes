"use client";

import { useParams } from "next/navigation";

export default function AircraftDetailPage() {

  const params = useParams();

  const aircraftId = params.id;

  const tsn = 176;

  const nextPhase =
    Math.ceil(tsn / 200) * 200;

  const remaining =
    nextPhase - tsn;

  return (

    <>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold text-cyan-400">
            Aircraft Detail
          </h1>

          <p className="text-gray-400 mt-2">
            {aircraftId}
          </p>

        </div>

        <div className="bg-cyan-500/20 border border-cyan-500/30 px-5 py-3 rounded-xl text-cyan-400">
          Live Monitoring
        </div>

      </div>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">

        <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800">

          <p className="text-gray-400 mb-2">
            TSN
          </p>

          <h3 className="text-5xl font-bold text-cyan-400">
            {tsn}
          </h3>

        </div>

        <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800">

          <p className="text-gray-400 mb-2">
            Next Phase
          </p>

          <h3 className="text-5xl font-bold text-yellow-400">
            {nextPhase}
          </h3>

        </div>

        <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800">

          <p className="text-gray-400 mb-2">
            Remaining FH
          </p>

          <h3
            className={
              remaining <= 10
                ? "text-5xl font-bold text-red-400"
                : remaining <= 50
                ? "text-5xl font-bold text-yellow-400"
                : "text-5xl font-bold text-green-400"
            }
          >
            {remaining}
          </h3>

        </div>

        <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800">

          <p className="text-gray-400 mb-2">
            Readiness
          </p>

          <h3 className="text-5xl font-bold text-green-400">
            FMC
          </h3>

        </div>

      </div>

      {/* Maintenance */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          Maintenance History
        </h2>

        <div className="space-y-4">

          <div className="border border-gray-800 rounded-xl p-4">

            <p className="text-cyan-400 font-semibold">
              12 MAY 2026
            </p>

            <p className="text-gray-300 mt-1">
              200 FH Phase Inspection Completed
            </p>

          </div>

          <div className="border border-gray-800 rounded-xl p-4">

            <p className="text-cyan-400 font-semibold">
              20 APR 2026
            </p>

            <p className="text-gray-300 mt-1">
              Engine Ground Run Completed
            </p>

          </div>

          <div className="border border-gray-800 rounded-xl p-4">

            <p className="text-cyan-400 font-semibold">
              02 APR 2026
            </p>

            <p className="text-gray-300 mt-1">
              Hydraulic Leak Rectification
            </p>

          </div>

        </div>

      </div>

    </>

  );
}