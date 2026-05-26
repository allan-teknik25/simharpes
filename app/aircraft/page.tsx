"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getAircraftData } from "@/services/googleSheet";

import {
  Search,
  ShieldCheck,
  Wrench,
  ShieldAlert,
  Eye,
  Plane,
} from "lucide-react";

export default function AircraftPage() {

  const [fleet, setFleet] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // ======================================================
  // LOAD DATA
  // ======================================================

  useEffect(() => {

    async function load() {

      const data = await getAircraftData();

      setFleet(data);

    }

    load();

  }, []);

  // ======================================================
  // FILTER
  // ======================================================

  const filtered = useMemo(() => {

    return fleet.filter((f) =>
      f.Aircraft
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [fleet, search]);

  // ======================================================
  // HEALTH SCORE
  // ======================================================

  function getHealthScore(f: any) {

    let score = 100;

    if (f.MaintenanceStatus !== "NONE")
      score -= 25;

    if (f.CertificateStatus === "EXPIRED")
      score -= 40;

    if (f.SparepartStatus === "WAITING")
      score -= 20;

    if (Number(f.AirframeFH) >= 350)
      score -= 15;

    return Math.max(score, 0);

  }

  // ======================================================
  // BADGE ENGINE
  // ======================================================

  function getBadge(type: string, value: string) {

    if (type === "maint") {

      if (value === "NONE") {
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      }

      return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";

    }

    if (type === "cert") {

      if (value === "VALID") {
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      }

      return "bg-red-500/20 text-red-400 border border-red-500/30";

    }

    if (type === "spare") {

      if (value === "READY") {
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      }

      return "bg-red-500/20 text-red-400 border border-red-500/30";

    }

    return "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30";
  }

  // ======================================================
  // STATUS COUNTS
  // ======================================================

  const serviceable = fleet.filter(
    (f) =>
      f.MaintenanceStatus === "NONE" &&
      f.CertificateStatus === "VALID" &&
      f.SparepartStatus === "READY"
  );

  const maintenance = fleet.filter(
    (f) =>
      f.MaintenanceStatus !== "NONE"
  );

  const aog = fleet.filter(
    (f) =>
      f.CertificateStatus === "EXPIRED" ||
      f.SparepartStatus === "WAITING"
  );

  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="min-h-screen bg-[#0B1120] text-white p-6">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold tracking-wide">
            AIRCRAFT COMMAND CENTER
          </h1>

          <div className="text-gray-400 mt-2">
            Tactical Fleet Monitoring System
          </div>

        </div>

        <div className="
          bg-cyan-500/10
          border border-cyan-500/20
          px-5 py-3
          rounded-2xl
          flex items-center gap-3
        ">

          <Plane className="text-cyan-400" />

          <div>

            <div className="text-sm text-gray-400">
              Fleet Type
            </div>

            <div className="font-semibold">
              Dassault Rafale EH
            </div>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <div className="grid grid-cols-4 gap-5 mb-6">

        {/* TOTAL */}

        <div className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-5
          hover:border-cyan-400
          transition-all
        ">

          <div className="text-gray-400 text-sm">
            Total Aircraft
          </div>

          <div className="text-5xl font-bold mt-3">
            {fleet.length}
          </div>

        </div>

        {/* SERVICEABLE */}

        <div className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-5
          hover:border-green-400
          hover:shadow-[0_0_20px_rgba(34,197,94,0.20)]
          transition-all
        ">

          <div className="text-gray-400 text-sm">
            Serviceable
          </div>

          <div className="text-5xl font-bold text-green-400 mt-3">
            {serviceable.length}
          </div>

        </div>

        {/* MAINT */}

        <div className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-5
          hover:border-yellow-400
          hover:shadow-[0_0_20px_rgba(250,204,21,0.20)]
          transition-all
        ">

          <div className="text-gray-400 text-sm">
            Maintenance
          </div>

          <div className="text-5xl font-bold text-yellow-400 mt-3">
            {maintenance.length}
          </div>

        </div>

        {/* AOG */}

        <div className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-5
          hover:border-red-400
          hover:shadow-[0_0_20px_rgba(248,113,113,0.20)]
          transition-all
        ">

          <div className="text-gray-400 text-sm">
            AOG
          </div>

          <div className="text-5xl font-bold text-red-400 mt-3">
            {aog.length}
          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <div className="
        bg-[#111827]
        border border-gray-800
        rounded-2xl
        p-4
        mb-6
      ">

        <div className="relative">

          <Search
            className="
              absolute
              left-4
              top-3.5
              text-gray-500
              w-5
              h-5
            "
          />

          <input
            type="text"
            placeholder="Search aircraft..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              bg-[#1F2937]
              border border-gray-700
              rounded-xl
              py-3
              pl-12
              pr-4
              outline-none
              focus:border-cyan-400
              transition-all
            "
          />

        </div>

      </div>

      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <div className="
        bg-[#111827]
        border border-gray-800
        rounded-2xl
        overflow-hidden
      ">

        {/* HEADER */}

        <div className="
          grid grid-cols-8
          bg-[#1F2937]
          border-b border-gray-800
          px-6 py-4
          text-sm
          font-semibold
          text-gray-300
        ">

          <div>No</div>
          <div>Tail Number</div>
          <div>Maintenance</div>
          <div>Operational</div>
          <div>Certificate</div>
          <div>Sparepart</div>
          <div>Health</div>
          <div>Detail</div>

        </div>

        {/* BODY */}

        <div>

          {filtered.map((f, i) => (

            <div
              key={i}
              className={`
                grid grid-cols-8
                px-6 py-4
                border-b border-gray-800
                items-center
                transition-all duration-300

                ${
                  f.CertificateStatus === "EXPIRED"
                    ? "hover:bg-red-500/10"
                    : f.MaintenanceStatus !== "NONE"
                    ? "hover:bg-yellow-500/10"
                    : "hover:bg-green-500/10"
                }
              `}
            >

              {/* NO */}

              <div className="text-gray-400">
                {i + 1}
              </div>

              {/* AIRCRAFT */}

              <div className="font-semibold text-white">
                {f.Aircraft}
              </div>

              {/* MAINT */}

              <div>

                <div className={`
                  inline-flex
                  items-center
                  gap-2
                  px-3 py-1
                  rounded-lg
                  text-sm
                  ${getBadge("maint", f.MaintenanceStatus)}
                `}>

                  <Wrench className="w-4 h-4" />

                  {f.MaintenanceStatus}

                </div>

              </div>

              {/* OPS */}

              <div>

                <div className="
                  inline-flex
                  items-center
                  gap-2
                  px-3 py-1
                  rounded-lg
                  text-sm
                  bg-cyan-500/20
                  text-cyan-400
                  border border-cyan-500/30
                ">

                  <ShieldCheck className="w-4 h-4" />

                  {f.OperationalStatus}

                </div>

              </div>

              {/* CERT */}

              <div>

                <div className={`
                  inline-flex
                  items-center
                  gap-2
                  px-3 py-1
                  rounded-lg
                  text-sm
                  ${getBadge("cert", f.CertificateStatus)}
                `}>

                  <ShieldAlert className="w-4 h-4" />

                  {f.CertificateStatus}

                </div>

              </div>

              {/* SPARE */}

              <div>

                <div className={`
                  inline-flex
                  items-center
                  gap-2
                  px-3 py-1
                  rounded-lg
                  text-sm
                  ${getBadge("spare", f.SparepartStatus)}
                `}>

                  <ShieldCheck className="w-4 h-4" />

                  {f.SparepartStatus}

                </div>

              </div>

              {/* HEALTH */}

              <div>

                <div className="flex items-center gap-3">

                  <div className="
                    w-full
                    bg-gray-700
                    rounded-full
                    h-2
                  ">

                    <div
                      className={`
                        h-2 rounded-full
                        ${
                          getHealthScore(f) >= 80
                            ? "bg-green-400"
                            : getHealthScore(f) >= 60
                            ? "bg-yellow-400"
                            : "bg-red-400"
                        }
                      `}
                      style={{
                        width: `${getHealthScore(f)}%`
                      }}
                    />

                  </div>

                  <div className="text-sm font-semibold min-w-[45px]">

                    {getHealthScore(f)}%

                  </div>

                </div>

              </div>

              {/* DETAIL */}

              <div>

                <Link
                  href={`/aircraft/${f.Aircraft}`}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    bg-cyan-500/20
                    hover:bg-cyan-500/30
                    text-cyan-400
                    px-4 py-2
                    rounded-xl
                    transition-all
                  "
                >

                  <Eye className="w-4 h-4" />

                  Detail

                </Link>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}