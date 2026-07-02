"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getAircraftData } from "@/services/googleSheet";

import {
  ShieldCheck,
  Wrench,
  ShieldAlert,
  Eye,
  Plane,
} from "lucide-react";

import {

  getServiceable,
  getMaintenance,
  getAOG,
  getHealthScore,
  getBadgeClass,

} from "@/services/fleetEngine";

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
  // STATUS COUNTS
  // ======================================================

  const serviceable =
    getServiceable(fleet);

  const maintenance =
    getMaintenance(fleet);

  const aog =
    getAOG(fleet);

  // ======================================================
  // Badge
  // ======================================================


  function operationalBadge(status:string){

    switch(status){

      case "SERVICEABLE":

        return `
        bg-green-500/20
        text-green-400
        border
        border-green-500/30
        `;


      case "MISSION":

        return `
        bg-blue-500/20
        text-blue-400
        border
        border-blue-500/30
        `;


      case "TRAINING":

        return `
        bg-purple-500/20
        text-purple-400
        border
        border-purple-500/30
        `;


      case "TEST FLIGHT":

        return `
        bg-gray-500/20
        text-gray-300
        border
        border-gray-500/30
        `;


      case "HANGAR":

        return `
        bg-yellow-500/20
        text-yellow-400
        border
        border-yellow-500/30
        `;


      case "AOG":

        return `
        bg-red-500/20
        text-red-400
        border
        border-red-500/30
        `;


      default:

        return `
        bg-gray-500/20
        text-gray-300
        border
        border-gray-500/30
        `;

    }

  }
  // ======================================================
  // UI
  // ======================================================

  return (

<div
className="
p-6
"
>


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div>

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
      {/* TABLE */}
      {/* ================================================= */}

      <div
        className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          overflow-hidden
        "
      >

        <div className="overflow-x-auto">

          <table className="w-full table-fixed">

            <colgroup>

            <col className="w-[70px]" />
            <col className="w-[100px]" />
            <col className="w-[170px]" />
            <col className="w-[170px]" />
            <col className="w-[150px]" />
            <col className="w-[150px]" />
            <col className="w-[150px]" />
            <col className="w-[100px]" />

            </colgroup>

            {/* HEADER */}

            <thead>

            <tr
              className="
                border-b
                border-gray-800
                text-gray-400
              "
            >

              <th className="text-center py-4">
                No
              </th>

              <th className="text-left py-4">
                Tail Number
              </th>

              <th className="text-center py-4">
                Pemeliharaan
              </th>

              <th className="text-left py-4">
                Operasional
              </th>

              <th className="text-center py-4">
                Sertifikat
              </th>

              <th className="text-center py-4">
                Sparepart
              </th>

              <th className="text-center py-4">
                Health
              </th>

              <th className="text-center py-4">
                Detail
              </th>

            </tr>

            </thead>

            {/* BODY */}

            <tbody>

              {filtered.map((f, i) => {

                const health =
                  getHealthScore(f);

                return (

                  <tr
                    key={i}
                    className="
                      border-b
                      border-gray-800
                      hover:bg-[#1F2937]
                      transition-all
                    "
                  >

                  {/* NO */}

                  <td className="py-4 text-center text-gray-400">
                    {i + 1}
                  </td>

                  {/* AIRCRAFT */}

                  <td className="py-4 font-semibold">

                    {f.Aircraft}

                  </td>

                  {/* MAINT */}

                  <td className="py-4 text-center">

                    <div
                      className={`
                        inline-flex
                        items-center
                        gap-2
                        px-3 py-1
                        rounded-lg
                        text-sm
                        whitespace-nowrap

                        ${getBadgeClass(
                          "maint",
                          f.MaintenanceStatus
                        )}
                      `}
                    >

                      <Wrench className="w-4 h-4" />

                      {f.MaintenanceStatus}

                    </div>

                  </td>

                  {/* OPS */}

                  <td className="py-4 text">

                      <div
                      className={`
                      inline-flex
                      items-center
                      gap-2
                      px-3 py-1
                      rounded-lg
                      text-sm
                      whitespace-nowrap

                      ${operationalBadge(
                      f.OperationalStatus
                      )}

                      `}
                      >

                      <ShieldCheck className="w-4 h-4" />

                      {f.OperationalStatus}

                    </div>

                  </td>

                  {/* CERT */}

                  <td className="py-4 text-center">

                    <div
                      className={`
                        inline-flex
                        items-center
                        gap-2
                        px-3 py-1
                        rounded-lg
                        text-sm
                        whitespace-nowrap

                        ${getBadgeClass(
                          "cert",
                          f.CertificateStatus
                        )}
                      `}
                    >

                      <ShieldAlert className="w-4 h-4" />

                      {f.CertificateStatus}

                    </div>

                  </td>

                  {/* SPARE */}

                  <td className="py-4 text-center">

                    <div
                      className={`
                        inline-flex
                        items-center
                        gap-2
                        px-3 py-1
                        rounded-lg
                        text-sm
                        whitespace-nowrap

                        ${getBadgeClass(
                          "spare",
                          f.SparepartStatus
                        )}
                      `}
                    >

                      <ShieldCheck className="w-4 h-4" />

                      {f.SparepartStatus}

                    </div>

                  </td>

                  {/* HEALTH */}

                  <td className="py-4 text-center">

                  <div
                  className="
                  relative
                  w-[150px]
                  h-6
                  bg-gray-700
                  rounded-full
                  overflow-hidden
                  border
                  border-gray-600
                  "
                  >

                  <div
                  className={`
                  absolute
                  left-0
                  top-0
                  h-full
                  rounded-full

                  ${
                  health >= 80
                  ? "bg-green-500"
                  : health >= 60
                  ? "bg-yellow-500"
                  : "bg-red-500"
                  }

                  `}
                  style={{
                  width:`${health}%`
                  }}
                  />


                  <div
                  className="
                  absolute
                  left-0
                  top-0
                  h-full
                  flex
                  items-center
                  font-bold
                  text-xs
                  text-black/80
                  "
                  style={{
                  width:`${health}%`
                  }}
                  >

                  <span
                  className="
                  ml-auto
                  mr-auto
                  "
                  >

                  {health}%

                  </span>


                  </div>


                  </div>

                  </td>

                  {/* DETAIL */}

                  <td className="py-4 text-center">

                    <Link
                      href={`/aircraft/${f.Aircraft}`}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        bg-cyan-500/20
                        hover:bg-cyan-500/30
                        text-cyan-400
                        px-3 py-2
                        rounded-xl
                        transition-all
                      "
                    >

                      <Eye className="w-4 h-4" />

                      

                    </Link>

                  </td>
                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}