"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getMaintenanceLogbook,
  getAircraftData,
} from "../../services/googleSheet";

import { submitLogbook }
from "../../services/logbookApi";

import {

  Wrench,
  Plane,
  ShieldCheck,
  Activity,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  Radar,
  Fuel,
  Plus,
  ClipboardList,
  Search,
  Filter,
  Gauge,

} from "lucide-react";

export default function LogbookPage() {

  // =====================================================
  // STATES
  // =====================================================

  const [logs, setLogs] =
    useState<any[]>([]);

  const [aircrafts, setAircrafts] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({

    aircraft: "",

    engineer: "",

    action: "",

    flightHourAdded: 0,

    engine1Added: 0,

    engine2Added: 0,

    hydraulicAdded: 0,

    landingGearAdded: 0,

    maintenanceStatus: "NONE",

    certificateStatus: "VALID",

    sparepartStatus: "READY",

    operationalStatus: "HANGAR",

    remarks: "",

  });

  // =====================================================
  // FETCH DATA
  // =====================================================

  useEffect(() => {

    async function fetchData() {

      const logbook =
        await getMaintenanceLogbook();

      const aircraftData =
        await getAircraftData();

      setLogs(logbook.reverse());

      setAircrafts(aircraftData);

    }

    fetchData();

  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  function handleChange(
    e: any
  ) {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  }

  // =====================================================
  // SUBMIT
  // =====================================================

  async function handleSubmit(
    e: any
  ) {

    e.preventDefault();

    setLoading(true);

    try {

      await submitLogbook(form);

      alert(
        "Maintenance Logbook Submitted"
      );

      window.location.reload();

    } catch (error) {

      console.error(error);

      alert(
        "Failed Submit Logbook"
      );

    }

    setLoading(false);

  }

  // =====================================================
  // FILTERED LOG
  // =====================================================

  const filteredLogs =
    logs.filter((log) =>

      log.Aircraft
        ?.toLowerCase()
        .includes(search.toLowerCase())

    );

  // =====================================================
  // STATS
  // =====================================================

  const totalLogs =
    logs.length;

  const maintenanceToday =
    logs.filter(
      (x) =>
        x.Action
          ?.toLowerCase()
          .includes("p")
    ).length;

  const missionToday =
    logs.filter(
      (x) =>
        x.Action
          ?.toLowerCase()
          .includes("mission")
    ).length;

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="min-h-screen bg-[#0B1120] text-white p-6">

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
          right-[-100px]
          top-[-100px]
          w-[300px]
          h-[300px]
          rounded-full
          bg-cyan-500/10
          blur-3xl
        " />

        <div className="
          relative z-10
          flex justify-between items-center
        ">

          {/* LEFT */}

          <div>

            <div className="
              inline-flex
              items-center gap-2
              bg-cyan-500/10
              border border-cyan-500/20
              px-4 py-2
              rounded-xl
              text-cyan-400
              mb-5
            ">

              <ClipboardList className="w-4 h-4" />

              Engineering Tactical Logbook

            </div>

            <h1 className="text-5xl font-bold">

              Maintenance Logbook

            </h1>

            <p className="text-gray-400 mt-3 text-lg">

              Integrated Aircraft Maintenance
              Activity Monitoring

            </p>

          </div>

          {/* RIGHT */}

          <div className="
            hidden md:flex
            items-center justify-center
            w-32 h-32
            rounded-full
            border-[10px]
            border-cyan-400
          ">

            <Radar className="
              w-16 h-16
              text-cyan-400
            " />

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}

      <div className="
        grid grid-cols-1
        md:grid-cols-3
        gap-5
        mb-6
      ">

        {/* TOTAL */}

        <div className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-5
          hover:border-cyan-400
          transition-all
        ">

          <div className="
            flex justify-between items-center
          ">

            <div className="text-gray-400">
              Total Activities
            </div>

            <Activity className="
              text-cyan-400
            " />

          </div>

          <div className="
            text-5xl font-bold mt-4
          ">

            {totalLogs}

          </div>

        </div>

        {/* MAINT */}

        <div className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-5
          hover:border-yellow-400
          transition-all
        ">

          <div className="
            flex justify-between items-center
          ">

            <div className="text-gray-400">
              Maintenance Action
            </div>

            <Wrench className="
              text-yellow-400
            " />

          </div>

          <div className="
            text-5xl font-bold mt-4
          ">

            {maintenanceToday}

          </div>

        </div>

        {/* MISSION */}

        <div className="
          bg-[#111827]
          border border-gray-800
          rounded-2xl
          p-5
          hover:border-green-400
          transition-all
        ">

          <div className="
            flex justify-between items-center
          ">

            <div className="text-gray-400">
              Mission Activity
            </div>

            <Plane className="
              text-green-400
            " />

          </div>

          <div className="
            text-5xl font-bold mt-4
          ">

            {missionToday}

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* GRID */}
      {/* ================================================= */}

      <div className="
        grid grid-cols-1
        xl:grid-cols-3
        gap-6
      ">

        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <div className="
          xl:col-span-1
          bg-[#111827]
          border border-gray-800
          rounded-3xl
          p-6
          h-fit
          sticky top-4
        ">

          <div className="
            flex items-center gap-3
            mb-6
          ">

            <Plus className="
              text-cyan-400
            " />

            <h2 className="
              text-2xl font-bold
            ">

              Input Maintenance

            </h2>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* AIRCRAFT */}

            <div>

              <p className="
                text-gray-400
                text-sm
                mb-2
              ">

                Aircraft

              </p>

              <select
                name="aircraft"
                onChange={handleChange}
                className="
                  w-full
                  bg-[#1F2937]
                  border border-gray-700
                  p-3
                  rounded-xl
                "
              >

                <option>
                  Select Aircraft
                </option>

                {aircrafts.map(
                  (aircraft, index) => (

                    <option
                      key={index}
                      value={aircraft.Aircraft}
                    >

                      {aircraft.Aircraft}

                    </option>

                  )
                )}

              </select>

            </div>

            {/* ENGINEER */}

            <input
              type="text"
              name="engineer"
              placeholder="Engineer Name"
              onChange={handleChange}
              className="
                w-full
                bg-[#1F2937]
                border border-gray-700
                p-3
                rounded-xl
              "
            />

            {/* ACTION */}

            <input
              type="text"
              name="action"
              placeholder="Action"
              onChange={handleChange}
              className="
                w-full
                bg-[#1F2937]
                border border-gray-700
                p-3
                rounded-xl
              "
            />

            {/* FH GRID */}

            <div className="
              grid grid-cols-2 gap-3
            ">

              <input
                type="number"
                name="flightHourAdded"
                placeholder="Airframe FH"
                onChange={handleChange}
                className="
                  bg-[#1F2937]
                  border border-gray-700
                  p-3
                  rounded-xl
                "
              />

              <input
                type="number"
                name="engine1Added"
                placeholder="Engine 1 FH"
                onChange={handleChange}
                className="
                  bg-[#1F2937]
                  border border-gray-700
                  p-3
                  rounded-xl
                "
              />

              <input
                type="number"
                name="engine2Added"
                placeholder="Engine 2 FH"
                onChange={handleChange}
                className="
                  bg-[#1F2937]
                  border border-gray-700
                  p-3
                  rounded-xl
                "
              />

              <input
                type="number"
                name="hydraulicAdded"
                placeholder="Hydraulic FH"
                onChange={handleChange}
                className="
                  bg-[#1F2937]
                  border border-gray-700
                  p-3
                  rounded-xl
                "
              />

            </div>

            {/* STATUS */}

            <div className="
              grid grid-cols-2 gap-3
            ">

              <select
                name="maintenanceStatus"
                onChange={handleChange}
                className="
                  bg-[#1F2937]
                  border border-gray-700
                  p-3
                  rounded-xl
                "
              >

                <option value="NONE">
                  NONE
                </option>

                <option value="P200">
                  P200
                </option>

                <option value="P400">
                  P400
                </option>

                <option value="HYDRAULIC">
                  HYDRAULIC
                </option>

                <option value="ENGINE">
                  ENGINE
                </option>

              </select>

              <select
                name="operationalStatus"
                onChange={handleChange}
                className="
                  bg-[#1F2937]
                  border border-gray-700
                  p-3
                  rounded-xl
                "
              >

                <option value="HANGAR">
                  HANGAR
                </option>

                <option value="MISSION">
                  MISSION
                </option>

                <option value="TRAINING">
                  TRAINING
                </option>

                <option value="TEST FLIGHT">
                  TEST FLIGHT
                </option>

              </select>

            </div>

            {/* REMARK */}

            <textarea
              name="remarks"
              placeholder="Remarks"
              onChange={handleChange}
              className="
                w-full
                bg-[#1F2937]
                border border-gray-700
                p-3
                rounded-xl
                h-28
              "
            />

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-cyan-500
                hover:bg-cyan-400
                transition-all
                p-4
                rounded-xl
                font-bold
                text-black
              "
            >

              {
                loading
                  ? "Submitting..."
                  : "Submit Maintenance"
              }

            </button>

          </form>

        </div>

        {/* ================================================= */}
        {/* TABLE */}
        {/* ================================================= */}

        <div className="
          xl:col-span-2
          bg-[#111827]
          border border-gray-800
          rounded-3xl
          p-6
        ">

          {/* TOP */}

          <div className="
            flex justify-between
            items-center
            mb-6
          ">

            <div>

              <h2 className="
                text-3xl font-bold
              ">

                Recent Activities

              </h2>

              <p className="
                text-gray-400 mt-2
              ">

                Engineering Activity Timeline

              </p>

            </div>

            {/* SEARCH */}

            <div className="
              flex items-center gap-2
              bg-[#1F2937]
              border border-gray-700
              px-4 py-3
              rounded-xl
              w-[260px]
            ">

              <Search className="
                w-4 h-4 text-gray-400
              " />

              <input
                placeholder="Search aircraft..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="
                  bg-transparent
                  outline-none
                  w-full
                "
              />

            </div>

          </div>

          {/* LOG LIST */}

          <div className="
            space-y-4
            max-h-[900px]
            overflow-y-auto
            pr-2
          ">

            {filteredLogs.map(

              (log, index) => (

                <div
                  key={index}
                  className="
                    bg-[#0F172A]
                    border border-gray-800
                    rounded-2xl
                    p-5
                    hover:border-cyan-400
                    hover:scale-[1.01]
                    transition-all
                  "
                >

                  <div className="
                    flex justify-between
                    items-start
                  ">

                    {/* LEFT */}

                    <div>

                      <div className="
                        flex items-center gap-3
                      ">

                        <div className="
                          w-12 h-12
                          rounded-xl
                          bg-cyan-500/10
                          flex items-center
                          justify-center
                        ">

                          <Plane className="
                            text-cyan-400
                          " />

                        </div>

                        <div>

                          <h3 className="
                            text-xl font-bold
                            text-cyan-400
                          ">

                            {log.Aircraft}

                          </h3>

                          <p className="
                            text-gray-400 text-sm
                          ">

                            {log.Engineer}

                          </p>

                        </div>

                      </div>

                      {/* ACTION */}

                      <div className="
                        mt-5 flex flex-wrap gap-2
                      ">

                        <div className="
                          bg-yellow-500/10
                          text-yellow-400
                          px-3 py-1
                          rounded-lg
                          text-sm
                        ">

                          {log.Action}

                        </div>

                        <div className="
                          bg-green-500/10
                          text-green-400
                          px-3 py-1
                          rounded-lg
                          text-sm
                        ">

                          {log.OperationalStatus}

                        </div>

                      </div>

                      {/* REMARK */}

                      <div className="
                        mt-4 text-gray-300
                      ">

                        {log.Remarks}

                      </div>

                    </div>

                    {/* RIGHT */}

                    <div className="
                      text-right
                    ">

                      <div className="
                        text-sm text-gray-400
                      ">

                        {log.Date}

                      </div>

                      <div className="
                        mt-4
                        flex items-center gap-2
                        justify-end
                      ">

                        <Gauge className="
                          w-4 h-4 text-cyan-400
                        " />

                        <span className="
                          text-cyan-400 font-semibold
                        ">

                          +{log.FlightHourAdded} FH

                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              )

            )}

          </div>

        </div>

      </div>

    </div>

  );

}