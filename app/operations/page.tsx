"use client";

import { useEffect, useMemo, useState } from "react";

import {

  getAircraftData,
  getMaintenanceRules,

} from "@/services/googleSheet";

import {

  Radar,
  Plane,
  AlertTriangle,
  ShieldCheck,
  Wrench,
  Activity,
  ChevronRight,
  Gauge,
  BrainCircuit,
  ShieldAlert,

} from "lucide-react";

export default function OperationsPage() {

  // =====================================================
  // STATES
  // =====================================================

  const [fleet, setFleet] =
    useState<any[]>([]);

  const [rules, setRules] =
    useState<any[]>([]);

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    async function load() {

      const aircraft =
        await getAircraftData();

      const maintenanceRules =
        await getMaintenanceRules();

      setFleet(aircraft);

      setRules(maintenanceRules);

    }

    load();

  }, []);

  // =====================================================
  // READINESS
  // =====================================================

  const serviceable =
    fleet.filter((x) =>

      x.MaintenanceStatus === "NONE" &&
      x.CertificateStatus === "VALID" &&
      x.SparepartStatus === "READY"

    );

  const maintenance =
    fleet.filter((x) =>

      x.MaintenanceStatus !== "NONE"

    );

  const aog =
    fleet.filter((x) =>

      x.CertificateStatus === "EXPIRED" ||
      x.SparepartStatus === "WAITING"

    );

  const readinessRate =
    ((serviceable.length / 10) * 100)
      .toFixed(1);

  // =====================================================
  // HEALTH ENGINE
  // =====================================================

  function getHealth(
    aircraft: any
  ) {

    let score = 100;

    if (
      aircraft.MaintenanceStatus !== "NONE"
    )
      score -= 25;

    if (
      aircraft.CertificateStatus === "EXPIRED"
    )
      score -= 40;

    if (
      aircraft.SparepartStatus === "WAITING"
    )
      score -= 20;

    if (
      Number(aircraft.AirframeFH) >= 350
    )
      score -= 15;

    return Math.max(score, 0);

  }

  // =====================================================
  // MISSION RECOMMENDATION
  // =====================================================

  const missionRecommendation =
    [...fleet]

      .filter((x) =>

        x.MaintenanceStatus === "NONE" &&
        x.CertificateStatus === "VALID" &&
        x.SparepartStatus === "READY"

      )

      .sort(
        (a, b) =>
          getHealth(b) - getHealth(a)
      )

      .slice(0, 3);

  // =====================================================
  // FORECAST
  // =====================================================

  const forecast =
    fleet.map((x) => {

      const remain =
        400 - Number(x.AirframeFH);

      return {

        aircraft:
          x.Aircraft,

        remaining:
          remain,

      };

    })

    .sort(
      (a, b) =>
        a.remaining - b.remaining
    )

    .slice(0, 5);

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="
      min-h-screen
      bg-[#0B1120]
      text-white
      p-6
    ">

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <div className="
        bg-gradient-to-r
        from-[#111827]
        to-[#172033]
        border border-gray-800
        rounded-3xl
        p-8
        mb-6
        relative
        overflow-hidden
      ">

        {/* GLOW */}

        <div className="
          absolute
          top-[-100px]
          right-[-100px]
          w-[320px]
          h-[320px]
          rounded-full
          bg-cyan-500/10
          blur-3xl
        " />

        <div className="
          relative z-10
          flex justify-between
          items-center
        ">

          {/* LEFT */}

          <div>

            <div className="
              inline-flex
              items-center gap-2
              bg-cyan-500/10
              border border-cyan-500/20
              text-cyan-400
              px-4 py-2
              rounded-xl
              mb-5
            ">

              <Radar className="
                w-4 h-4
              " />

              Tactical Operations Center

            </div>

            <h1 className="
              text-5xl font-bold
            ">

              Fleet Operations

            </h1>

            <p className="
              text-gray-400
              mt-3
              text-lg
            ">

              Real-Time Tactical Readiness
              Monitoring System

            </p>

          </div>

          {/* RIGHT */}

          <div className="
            hidden lg:flex
            w-40 h-40
            rounded-full
            border-[10px]
            border-cyan-400
            items-center
            justify-center
          ">

            <Radar className="
              w-20 h-20
              text-cyan-400
              animate-pulse
            " />

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* TOP CARDS */}
      {/* ================================================= */}

      <div className="
        grid grid-cols-1
        md:grid-cols-3
        gap-5
        mb-6
      ">

        {/* SERVICEABLE */}

        <div className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-6
          hover:border-green-400
          hover:scale-[1.02]
          transition-all
        ">

          <div className="
            flex justify-between
            items-center
          ">

            <div className="
              text-gray-400
            ">

              Serviceable

            </div>

            <ShieldCheck className="
              text-green-400
            " />

          </div>

          <div className="
            text-6xl font-bold
            mt-5
            text-green-400
          ">

            {serviceable.length}

          </div>

        </div>

        {/* MAINT */}

        <div className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-6
          hover:border-yellow-400
          hover:scale-[1.02]
          transition-all
        ">

          <div className="
            flex justify-between
            items-center
          ">

            <div className="
              text-gray-400
            ">

              Maintenance

            </div>

            <Wrench className="
              text-yellow-400
            " />

          </div>

          <div className="
            text-6xl font-bold
            mt-5
            text-yellow-400
          ">

            {maintenance.length}

          </div>

        </div>

        {/* AOG */}

        <div className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-6
          hover:border-red-400
          hover:scale-[1.02]
          transition-all
        ">

          <div className="
            flex justify-between
            items-center
          ">

            <div className="
              text-gray-400
            ">

              AOG

            </div>

            <AlertTriangle className="
              text-red-400
            " />

          </div>

          <div className="
            text-6xl font-bold
            mt-5
            text-red-400
          ">

            {aog.length}

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* MAIN GRID */}
      {/* ================================================= */}

      <div className="
        grid grid-cols-1
        xl:grid-cols-3
        gap-6
      ">

        {/* ================================================= */}
        {/* LEFT */}
        {/* ================================================= */}

        <div className="
          xl:col-span-2
          space-y-6
        ">

          {/* ============================================= */}
          {/* READINESS */}
          {/* ============================================= */}

          <div className="
            bg-[#111827]
            border border-gray-800
            rounded-3xl
            p-6
          ">

            <div className="
              flex justify-between
              items-center
              mb-6
            ">

              <div>

                <h2 className="
                  text-3xl font-bold
                ">

                  Operational Readiness

                </h2>

                <p className="
                  text-gray-400 mt-2
                ">

                  Tactical Readiness Rate

                </p>

              </div>

              <Gauge className="
                w-8 h-8
                text-cyan-400
              " />

            </div>

            {/* DONUT */}

            <div className="
              flex flex-col
              items-center
              justify-center
            ">

              <div className="
                relative
                w-72 h-72
                rounded-full
                border-[18px]
                border-cyan-400
                flex
                items-center
                justify-center
                hover:scale-105
                transition-all
              ">

                <div className="
                  text-center
                ">

                  <div className="
                    text-6xl font-bold
                  ">

                    {readinessRate}%

                  </div>

                  <div className="
                    text-gray-400 mt-2
                  ">

                    READINESS

                  </div>

                </div>

              </div>

              {/* STATUS */}

              <div className={`
                mt-6
                px-5 py-3
                rounded-xl
                text-lg font-semibold

                ${
                  Number(readinessRate) >= 70
                    ? "bg-green-500/10 text-green-400 border border-green-500/30"
                    : "bg-red-500/10 text-red-400 border border-red-500/30"
                }
              `}>

                {
                  Number(readinessRate) >= 70
                    ? "GOOD — ABOVE SASBINPUAN"
                    : "WARNING — BELOW SASBINPUAN"
                }

              </div>

            </div>

          </div>

          {/* ============================================= */}
          {/* FLEET STATUS */}
          {/* ============================================= */}

          <div className="
            bg-[#111827]
            border border-gray-800
            rounded-3xl
            p-6
          ">

            <div className="
              flex justify-between
              items-center
              mb-6
            ">

              <div>

                <h2 className="
                  text-3xl font-bold
                ">

                  Fleet Status Board

                </h2>

                <p className="
                  text-gray-400 mt-2
                ">

                  Real-Time Aircraft Tactical Status

                </p>

              </div>

              <Plane className="
                text-cyan-400
              " />

            </div>

            {/* TABLE */}

            <div className="
              overflow-x-auto
            ">

              <table className="
                w-full
              ">

                <thead>

                  <tr className="
                    border-b border-gray-800
                    text-gray-400
                  ">

                    <th className="text-left py-4">
                      Aircraft
                    </th>

                    <th className="text-left py-4">
                      Status
                    </th>

                    <th className="text-left py-4">
                      Health
                    </th>

                    <th className="text-left py-4">
                      Operational
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {fleet.map((x, i) => {

                    const health =
                      getHealth(x);

                    return (

                      <tr
                        key={i}
                        className="
                          border-b border-gray-900
                          hover:bg-[#1F2937]
                          transition-all
                        "
                      >

                        <td className="
                          py-4 font-semibold
                        ">

                          {x.Aircraft}

                        </td>

                        <td className="py-4">

                          <span className={`
                            px-3 py-1
                            rounded-lg
                            text-sm

                            ${
                              x.MaintenanceStatus === "NONE"
                                ? "bg-green-500/10 text-green-400"
                                : "bg-yellow-500/10 text-yellow-400"
                            }
                          `}>

                            {x.MaintenanceStatus}

                          </span>

                        </td>

                        <td className="
                          py-4
                        ">

                          <span className={`
                            font-bold

                            ${
                              health >= 80
                                ? "text-green-400"
                                : health >= 60
                                ? "text-yellow-400"
                                : "text-red-400"
                            }
                          `}>

                            {health}%

                          </span>

                        </td>

                        <td className="
                          py-4 text-gray-300
                        ">

                          {x.OperationalStatus}

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* RIGHT */}
        {/* ================================================= */}

        <div className="
          space-y-6
        ">

          {/* ============================================= */}
          {/* MISSION RECOMMENDATION */}
          {/* ============================================= */}

          <div className="
            bg-[#111827]
            border border-gray-800
            rounded-3xl
            p-6
          ">

            <div className="
              flex items-center gap-3
              mb-6
            ">

              <BrainCircuit className="
                text-cyan-400
              " />

              <h2 className="
                text-2xl font-bold
              ">

                Mission Recommendation

              </h2>

            </div>

            <div className="
              space-y-4
            ">

              {missionRecommendation.map(
                (x, i) => (

                  <div
                    key={i}
                    className="
                      bg-[#1F2937]
                      border border-gray-700
                      rounded-2xl
                      p-4
                      hover:border-cyan-400
                      transition-all
                    "
                  >

                    <div className="
                      flex justify-between
                      items-center
                    ">

                      <div>

                        <div className="
                          text-xl font-bold
                          text-cyan-400
                        ">

                          {x.Aircraft}

                        </div>

                        <div className="
                          text-gray-400 text-sm mt-1
                        ">

                          Health:
                          {" "}
                          {getHealth(x)}%

                        </div>

                      </div>

                      <ChevronRight className="
                        text-gray-500
                      " />

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

          {/* ============================================= */}
          {/* FORECAST */}
          {/* ============================================= */}

          <div className="
            bg-[#111827]
            border border-gray-800
            rounded-3xl
            p-6
          ">

            <div className="
              flex items-center gap-3
              mb-6
            ">

              <ShieldAlert className="
                text-yellow-400
              " />

              <h2 className="
                text-2xl font-bold
              ">

                Maintenance Forecast

              </h2>

            </div>

            <div className="
              space-y-4
            ">

              {forecast.map(
                (x, i) => (

                  <div
                    key={i}
                    className="
                      bg-[#1F2937]
                      border border-gray-700
                      rounded-2xl
                      p-4
                    "
                  >

                    <div className="
                      flex justify-between
                      items-center
                    ">

                      <div>

                        <div className="
                          text-lg font-bold
                          text-cyan-400
                        ">

                          {x.aircraft}

                        </div>

                        <div className="
                          text-gray-400 text-sm mt-1
                        ">

                          Remaining:
                          {" "}
                          {x.remaining}
                          {" "}
                          FH

                        </div>

                      </div>

                      <AlertTriangle className="
                        text-yellow-400
                      " />

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}