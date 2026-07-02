"use client";

import { useEffect, useState } from "react";

import { getAircraftData } from "@/services/googleSheet";

import {
 getServiceable,
 getMaintenance,
 getAOG,
 getReadiness,
 getFleetHealth,
 getAircraftWarnings,
} from "@/services/fleetEngine";

import {
  CheckCircle2,
  Wrench,
  ShieldAlert,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Donut from "@/components/Donut";

export default function Dashboard() {

  // ====================================================
  // STATE
  // ====================================================

  const [fleet, setFleet] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(3);
  const [clock, setClock] = useState("");

  const SASBINPUAN = 80;

  // ====================================================
  // LOAD DATA
  // ====================================================

  useEffect(() => {

    async function load() {

      const data = await getAircraftData();

      setFleet(data);
    }

    load();

  }, []);

  // ====================================================
  // LIVE CLOCK
  // ====================================================

  useEffect(() => {

    const interval = setInterval(() => {

      const now = new Date();

      setClock(
        now.toLocaleTimeString("id-ID")
      );

    }, 1000);

    return () => clearInterval(interval);

  }, []);

  // ====================================================
  // DATE ENGINE
  // ====================================================

  function formatDate(date: Date) {

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  }

  const timeline = Array.from({ length: 7 }).map((_, i) => {

    const d = new Date();

    d.setDate(d.getDate() + (i - 3));

    return {
      date: d,
      label: formatDate(d),
    };

  });

  const currentDate = timeline[selectedDate];

  // ====================================================
  // STATUS ENGINE
  // ====================================================

  const maintenance = fleet.filter(
    (f) => f.MaintenanceStatus !== "NONE"
  );

  const aog = fleet.filter(
    (f) =>
      f.MaintenanceStatus === "NONE" &&
      (
        f.CertificateStatus === "EXPIRED" ||
        f.SparepartStatus === "WAITING"
      )
  );

  const serviceable = fleet.filter(
    (f) =>
      f.MaintenanceStatus === "NONE" &&
      f.CertificateStatus === "VALID" &&
      f.SparepartStatus === "READY"
  );

  const readiness = Math.round(
    (serviceable.length / fleet.length) * 100
  );

  const fleetHealth = getFleetHealth(fleet);

  // ====================================================
  // READINESS STATUS
  // ====================================================

  let readinessStatus = "";
  let readinessColor = "";

  if (readiness >= 90) {

    readinessStatus = "FULL MISSION CAPABLE";
    readinessColor = "text-green-400";

  }

  else if (readiness >= 80) {

    readinessStatus = "MISSION CAPABLE";
    readinessColor = "text-cyan-400";

  }

  else if (readiness >= 60) {

    readinessStatus = "LIMITED OPERATION";
    readinessColor = "text-yellow-400";

  }

  else {

    readinessStatus = "CRITICAL";
    readinessColor = "text-red-400";

  }

  // ====================================================
  // WARNING ENGINE
  // ====================================================

  const warnings: any[] = [];

  fleet.forEach((f)=>{

  const aircraftWarning =
  getAircraftWarnings(f);


  aircraftWarning.forEach(w=>{


  warnings.push({

    level:w.level,

    color:
    w.level==="CRITICAL"
    ?
    "border-red-500 text-red-400"

    :
    w.level==="MEDIUM"
    ?
    "border-yellow-500 text-yellow-400"

    :
    "border-cyan-500 text-cyan-400",


    text:
    `${f.Aircraft} ${w.message}`

  });


  });

  });

  
  // ====================================================
  // COMAMANDER ASSESSMENT
  // ====================================================

  const commanderAssessment = [];

  if (
    readiness >= SASBINPUAN
  ) {

    commanderAssessment.push(
      "Kesiapan pesawat telah memenuhi target operasional Sasbinpuan."
    );

  } else {

    commanderAssessment.push(
      "Kesiapan pesawat berada dibawah target operasional."
    );

  }

  const expired =
    fleet.filter(
      f =>
        f.CertificateStatus ===
        "EXPIRED"
    );

  if (expired.length) {

    commanderAssessment.push(
      `${expired.length} Sertifikat Pesawat Kadaluarsa.`
    );

  }

  const waiting =
    fleet.filter(
      f =>
        f.SparepartStatus ===
        "WAITING"
    );

  if (waiting.length) {

    commanderAssessment.push(
      `${waiting.length} Pesawat dalam kondisi Awaiting Part.`
    );

  }

  

  // ====================================================
  // UI
  // ====================================================

  return (

<div
className="
p-5
"
>

      {/* ================================================= */}
      {/* QUICK STATUS BAR */}
      {/* ================================================= */}

      <div className="
        bg-[#111827]
        border border-gray-800
        rounded-2xl
        p-4
        mb-5
      ">

        <div className="text-gray-400 mb-4">
          Fleet Quick Status
        </div>

        <div className="flex flex-wrap gap-3">

          {fleet.map((f, i) => {

            const ok =
              f.MaintenanceStatus === "NONE" &&
              f.CertificateStatus === "VALID" &&
              f.SparepartStatus === "READY";

            return (

              <div
                key={i}
                className={`
                  px-4 py-2 rounded-xl text-sm font-semibold
                  transition-all duration-300
                  ${ok
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"}
                `}
              >
                {f.Aircraft}
              </div>

            );

          })}

        </div>

      </div>

      {/* ================================================= */}
      {/* TOP KPI */}
      {/* ================================================= */}

      <div className="grid grid-cols-3 gap-5 mb-5">

        {/* SERVICEABLE */}

        <div className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-5
          transition-all
          duration-300
          hover:border-green-400
          hover:shadow-[0_0_25px_rgba(34,197,94,0.25)]
        ">

          <div className="flex justify-between items-center mb-3">

            <div className="text-gray-400">
              Serviceable
            </div>

            <CheckCircle2 className="text-green-400" />

          </div>

          <div className="text-5xl font-bold">
            {serviceable.length}
          </div>

          <div className="text-sm text-gray-500 mt-2">
            Full Mission Capable
          </div>

        </div>

        {/* MAINTENANCE */}

        <div className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-5
          transition-all
          duration-300
          hover:border-yellow-400
          hover:shadow-[0_0_25px_rgba(250,204,21,0.25)]
        ">

          <div className="flex justify-between items-center mb-3">

            <div className="text-gray-400">
              Maintenance
            </div>

            <Wrench className="text-yellow-400" />

          </div>

          <div className="text-5xl font-bold">
            {maintenance.length}
          </div>

          <div className="text-sm text-gray-500 mt-2">
            Under Maintenance
          </div>

        </div>

        {/* AOG */}

        <div className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-5
          transition-all
          duration-300
          hover:border-red-400
          hover:shadow-[0_0_25px_rgba(248,113,113,0.25)]
        ">

          <div className="flex justify-between items-center mb-3">

            <div className="text-gray-400">
              AOG
            </div>

            <ShieldAlert className="text-red-400" />

          </div>

          <div className="text-5xl font-bold">
            {aog.length}
          </div>

          <div className="text-sm text-gray-500 mt-2">
            Not Mission Capable
          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* BOTTOM SECTION */}
      {/* ================================================= */}

      <div className="grid grid-cols-3 gap-5">

        {/* ================================================= */}
        {/* READINESS */}
        {/* ================================================= */}

        <div className="
          col-span-2
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-6
          transition-all
          duration-300
          hover:border-cyan-400
          hover:shadow-[0_0_30px_rgba(34,211,238,0.20)]
        ">

          {/* TOP */}

          <div className="flex justify-between items-center mb-6">

            <div>

              <div className="text-gray-400">
                Persentase Nilai Kesiapan
              </div>

              <div className="text-6xl font-bold mt-2">
                {readiness}%
              </div>

            </div>

            <div className={`${readinessColor} text-xl font-bold`}>
              {readinessStatus}
            </div>

          </div>

          {/* DONUT */}

          <div className="
            grid
            grid-cols-2
            gap-8
            my-8
          ">
            <div
              className="
                flex
                flex-col
                items-center
              "
            >
              <Donut
                value={readiness}
              />

              <div
                className="
                  mt-4
                  text-gray-400
                  text-sm
                "
              >
                READINESS
              </div>
            </div>

            <div
              className="
                flex
                flex-col
                items-center
              "
            >
              <Donut
                value={fleetHealth}
              />

              <div
                className="
                  mt-4
                  text-gray-400
                  text-sm
                "
              >
                FLEET HEALTH
              </div>
            </div>
          </div>

          {/* COMMANDER ASSESSMENT */}
          <div
            className="
              bg-[#1F2937]
              border
              border-gray-700
              rounded-2xl
              p-5
              mb-6
            "
          >
            <div
              className="
                text-lg
                font-bold
                mb-4
                text-cyan-400
              "
            >
              Penilaian Saat Ini :
            </div>

            <div className="space-y-3">

              {commanderAssessment.map(
                (item, i) => (

                  <div
                    key={i}
                    className="
                      flex
                      items-start
                      gap-3
                      text-sm
                    "
                  >

                    <div
                      className="
                        w-2
                        h-2
                        rounded-full
                        bg-cyan-400
                        mt-2
                      "
                    />

                    <div>
                      {item}
                    </div>

                  </div>

                )
              )}

            </div>
          </div>          


          {/* DATE NAV */}

          <div className="flex items-center justify-center gap-5">

            <button
              onClick={() =>
                setSelectedDate((p) =>
                  Math.max(p - 1, 0)
                )
              }
              className="
                bg-[#1F2937]
                hover:bg-[#374151]
                p-3
                rounded-xl
                transition-all
              "
            >
              <ChevronLeft />
            </button>

            <div className="text-center">

              <div className="text-lg font-semibold">
                {currentDate.label}
              </div>

              <div className="text-sm text-gray-400 mt-1">
                Target Sasbinpuan: {SASBINPUAN}%
              </div>

            </div>

            <button
              onClick={() =>
                setSelectedDate((p) =>
                  Math.min(p + 1, 6)
                )
              }
              className="
                bg-[#1F2937]
                hover:bg-[#374151]
                p-3
                rounded-xl
                transition-all
              "
            >
              <ChevronRight />
            </button>

          </div>

        </div>

        {/* ================================================= */}
        {/* WARNING CENTER */}
        {/* ================================================= */}

        <div className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-5
          min-h-[520px]
          transition-all
          duration-300
          hover:border-orange-400
          hover:shadow-[0_0_25px_rgba(251,146,60,0.25)]
        ">

          <div className="flex justify-between items-center mb-5">

            <div className="font-semibold text-lg">
              Warning Center
            </div>

            <AlertTriangle className="text-orange-400" />

          </div>

          <div className="
            space-y-3
            overflow-y-auto
            h-[440px]
            pr-2
            scrollbar-thin
            scrollbar-thumb-gray-700
            scrollbar-track-transparent
          ">

            {warnings.length === 0 && (

              <div className="
                bg-green-500/10
                border border-green-500/20
                rounded-xl
                p-4
                text-green-400
                text-sm
              ">
                No operational warning
              </div>

            )}

            {warnings.map((w, i) => (

              <div
                key={i}
                className={`
                  bg-[#1F2937]
                  border
                  rounded-xl
                  p-4
                  text-sm
                  transition-all
                  ${w.color}
                `}
              >

                <div className="font-bold mb-1">
                  {w.level}
                </div>

                <div>
                  {w.text}
                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}