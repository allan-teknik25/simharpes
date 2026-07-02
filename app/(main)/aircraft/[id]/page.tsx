"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { getAircraftData } from "@/services/googleSheet";

import {

getServiceable,
getHealthScore,
getAircraftWarnings,

} from "@/services/fleetEngine";

import {
  Plane,
  Wrench,
  ShieldCheck,
  ShieldAlert,
  Gauge,
  Activity,
  AlertTriangle,
  Radar,
  ArrowLeft,
} from "lucide-react";

export default function AircraftDetailPage() {

  const params = useParams();
  const id =
    Array.isArray(params?.id)
    ?
    params.id[0]
    :
    params?.id;

  const [aircraft, setAircraft] = useState<any>(null);

  // =================================================
  // LOAD
  // =================================================

  useEffect(() => {

    async function load() {

      const data = await getAircraftData();

      const found = data.find(
        (x: any) => x.Aircraft === id
      );

      setAircraft(found);

    }

    load();

  }, [id]);

  // =================================================
  // HEALTH
  // =================================================

  const healthScore = useMemo(() => {

    if (!aircraft)
      return 0;

    return getHealthScore(
      aircraft
    );

  }, [aircraft]);

  // =================================================
  // READY STATUS
  // =================================================

  const missionReady =
  aircraft
  ?
  getServiceable([aircraft]).length > 0
  :
  false;

  const warnings =
    aircraft
      ? getAircraftWarnings(
          aircraft
        )
      : [];

  const utilization = [
    {
      title:"Airframe",
      value: aircraft?.AirframeFH,
      unit:"FH",
    },
    {
      title:"Engine 1",
      value: aircraft?.Engine1FH,
      unit:"FH",
    },
    {
      title:"Engine 2",
      value: aircraft?.Engine2FH,
      unit:"FH",
    },
    {
      title:"Hydraulic",
      value: aircraft?.HydraulicFH,
      unit:"FH",
    },
    {
      title:"FCU",
      value: aircraft?.FCUFH,
      unit:"FH",
    },
    {
      title:"F Nozzle",
      value: aircraft?.FNozzleFH,
      unit:"FH",
    },
    {
      title:"Fuel Pump",
      value: aircraft?.FPumpFH,
      unit:"FH",
    },
    {
      title:"Landing Gear",
      value: aircraft?.LandingGearFC,
      unit:"FC",
    },
  ];

  // =================================================
  // LOADING
  // =================================================

  if (!aircraft) {

    return (

      <div className="
        min-h-screen
        bg-[#0B1120]
        flex
        items-center
        justify-center
        text-white
      ">

        Loading Tactical Aircraft Data...

      </div>

    );

  }

  // =================================================
  // UI
  // =================================================

  return (

    <div className="min-h-screen bg-[#0B1120] text-white p-6">

      {/* ============================================= */}
      {/* TOP BAR */}
      {/* ============================================= */}

      <div className="flex justify-between items-center mb-6">

        <Link
          href="/aircraft"
          className="
            flex items-center gap-2
            text-gray-400
            hover:text-cyan-400
            transition-all
          "
        >

          <ArrowLeft className="w-4 h-4" />

          Back to Fleet

        </Link>

        <div className="text-gray-500 text-sm">
          Tactical Fleet Monitoring System
        </div>

      </div>

      {/* ============================================= */}
      {/* HERO */}
      {/* ============================================= */}

      <div className="
        bg-gradient-to-r
        from-[#111827]
        to-[#172033]
        border border-gray-800
        rounded-3xl
        p-8
        mb-6
      ">

        <div className="flex justify-between items-center">

          {/* LEFT */}

          <div>

            <div className="
              inline-flex
              items-center
              gap-2
              bg-cyan-500/10
              border border-cyan-500/20
              px-4 py-2
              rounded-xl
              text-cyan-400
              mb-5
            ">

              <Radar className="w-4 h-4" />

              Aircraft Tactical Profile

            </div>

            <h1 className="text-6xl font-bold">
              {aircraft.Aircraft}
            </h1>

            <div className="text-gray-400 text-xl mt-3">
              {aircraft.AircraftType}
            </div>

            <div className="flex gap-3 mt-6">

              <div className="
                bg-[#1F2937]
                border border-gray-700
                px-4 py-2
                rounded-xl
              ">

                Engine:
                <span className="ml-2 text-cyan-400">
                  {aircraft.EngineType}
                </span>

              </div>

              <div className="
                bg-[#1F2937]
                border border-gray-700
                px-4 py-2
                rounded-xl
              ">

                Serial:
                <span className="ml-2 text-cyan-400">
                  {aircraft.SerialNumber}
                </span>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div
            className={`
              w-48
              h-48
              rounded-full
              border-[10px]
              flex
              items-center
              justify-center

              ${
                healthScore >= 80
                  ? "border-green-400"
                  : healthScore >= 60
                  ? "border-yellow-400"
                  : "border-red-400"
              }
            `}
          >

            <div className="text-center">

              <div className="text-6xl font-bold">
                {healthScore}%
              </div>

              <div className="text-gray-400 mt-2">
                HEALTH
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ============================================= */}
      {/* STATUS */}
      {/* ============================================= */}

      <div className="grid grid-cols-4 gap-5 mb-6">

        {/* READY */}

        <div className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-5
        ">

          <div className="flex justify-between items-center">

            <div className="text-gray-400">
              Mission Capability
            </div>

            <Plane className="text-cyan-400" />

          </div>

          <div
            className={`
              text-3xl font-bold mt-4

              ${
                missionReady
                  ? "text-green-400"
                  : "text-red-400"
              }
            `}
          >

            {
              missionReady
                ? "READY"
                : "NOT READY"
            }

          </div>

        </div>

        {/* MAINT */}

        <div className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-5
        ">

          <div className="flex justify-between items-center">

            <div className="text-gray-400">
              Maintenance
            </div>

            <Wrench className="text-yellow-400" />

          </div>

          <div className="text-3xl font-bold mt-4">
            {aircraft.MaintenanceStatus}
          </div>

        </div>

        {/* CERT */}

        <div className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-5
        ">

          <div className="flex justify-between items-center">

            <div className="text-gray-400">
              Certificate
            </div>

            <ShieldAlert className="text-cyan-400" />

          </div>

          <div className="text-3xl font-bold mt-4">
            {aircraft.CertificateStatus}
          </div>

        </div>

        {/* SPARE */}

        <div className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-5
        ">

          <div className="flex justify-between items-center">

            <div className="text-gray-400">
              Sparepart
            </div>

            <ShieldCheck className="text-green-400" />

          </div>

          <div className="text-3xl font-bold mt-4">
            {aircraft.SparepartStatus}
          </div>

        </div>

      </div>

{/* ============================================= */}
{/* UTILIZATION */}
{/* ============================================= */}

<div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">

  {utilization.map((x, i) => (

    <div
      key={i}
      className="
        bg-[#111827]
        border border-gray-800
        rounded-2xl
        p-5
        hover:border-cyan-400/40
        transition-all
      "
    >

      <div className="text-gray-400 text-sm">
        {x.title}
      </div>

      <div className="mt-3 flex items-end gap-2">

        <div className="text-4xl font-bold text-cyan-400">
          {x.value ?? 0}
        </div>

        <div className="text-sm text-gray-500 mb-1">
          {x.unit}
        </div>

      </div>

    </div>

  ))}

</div>

      {/* ============================================= */}
      {/* ANALYSIS */}
      {/* ============================================= */}

      <div className="grid grid-cols-2 gap-6">

        {/* WARNING */}

        <div className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-6
        ">

          <div className="
            flex items-center gap-3
            text-2xl font-bold
            mb-6
          ">

            <AlertTriangle className="text-yellow-400" />

            Tactical Warning

          </div>

          <div className="space-y-4">

            {warnings.length === 0 && (

              <div
                className="
                  bg-green-500/10
                  border border-green-500/30
                  text-green-400
                  p-4
                  rounded-xl
                "
              >
                No tactical warnings detected.
              </div>

            )}

            {warnings.map((w, i) => (

              <div
              key={i}
              className={`
              p-4
              rounded-xl
              border

              ${
              w.level==="CRITICAL"

              ?

              "bg-red-500/10 border-red-500/30 text-red-400"

              :

              w.level==="MEDIUM"

              ?

              "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"

              :

              "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"

              }

              `}
              >

              {w.message}

              </div>

            ))}

          </div>

        </div>

        {/* RECOMMENDATION */}

        <div className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-6
        ">

          <div className="
            flex items-center gap-3
            text-2xl font-bold
            mb-6
          ">

            <Activity className="text-green-400" />

            Operational Recommendation

          </div>

          <div className="space-y-4">

            <div className="
              bg-[#1F2937]
              border border-gray-700
              p-4
              rounded-xl
            ">

              <div className="text-gray-400 mb-2">
                Suggested Action
              </div>

              <div className="text-xl font-semibold">

                {
                  aircraft.CertificateStatus === "EXPIRED"
                    ? "Immediate Certificate Renewal"
                    : aircraft.SparepartStatus === "WAITING"
                    ? "Prioritize Sparepart Delivery"
                    : aircraft.MaintenanceStatus !== "NONE"
                    ? "Continue Maintenance"
                    : "Ready For Deployment"
                }

              </div>

            </div>

            <div className="
              bg-[#1F2937]
              border border-gray-700
              p-4
              rounded-xl
            ">

              <div className="text-gray-400 mb-2">
                Estimated Downtime
              </div>

              <div className="text-xl font-semibold">

                {
                  aircraft.MaintenanceStatus === "NONE"
                    ? "0 Days"
                    : aircraft.MaintenanceStatus === "P200"
                    ? "3 Days"
                    : aircraft.MaintenanceStatus === "Hydraulic"
                    ? "5 Days"
                    : "7 Days"
                }

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}