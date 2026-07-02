"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getMaintenanceLogbook,
  getAircraftData,
  getMaintenanceApproval,
} from "../../../services/googleSheet";

import { submitLogbook }
from "../../../services/logbookApi";

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

  const [approvals,setApprovals]=useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({

    aircraft: "",

    engineer: "",

    action: "MAINTENANCE",

    flightHourAdded: 0,

    engine1Added: 0,

    engine2Added: 0,

    hydraulicAdded: 0,

    landingGearAdded: 0,

    fcuAdded: 0,

    fNozzleAdded: 0,
    
    fPumpAdded: 0,
                    
    maintenanceStatus: "NONE",

    operationalStatus: "HANGAR",

    remarks: "",

  });

  const [maintenanceOptions,setMaintenanceOptions]=useState<string[]>([]);
// =====================================================
// FETCH DATA
// =====================================================

useEffect(() => {

async function fetchData(){

  const logbook =
    await getMaintenanceLogbook();

  const aircraftData =
    await getAircraftData();

  const approvalData =
    await getMaintenanceApproval();

  setLogs(logbook.reverse());

  setAircrafts(aircraftData);

  setApprovals(approvalData);

}

  fetchData();

}, []);

// =====================================================
// UPDATE MAINTENANCE OPTION
// =====================================================

useEffect(() => {

  if (!form.aircraft) {

    setMaintenanceOptions([]);

    return;

  }

  // =============================
  // MAINTENANCE BIASA
  // =============================

  if (form.action !== "TEST FLIGHT") {

    setMaintenanceOptions([
      "NONE",
      "P200",
      "P400",
      "ENG1200",
      "HYD1500",
      "LG50",
      "FCU1200",
      "FN1200",
      "FP1200",
    ]);

    return;

  }

  // =============================
  // TEST FLIGHT
  // =============================

  const lastMaintenance = approvals
    .filter(
      x =>
        x.Aircraft === form.aircraft &&
        x.RequestType === "MAINTENANCE" &&
        x.ApprovalStatus === "APPROVED"
    )
    .sort(
      (a,b)=>
        new Date(b.RequestDate).getTime()-
        new Date(a.RequestDate).getTime()
    )[0];

  if(!lastMaintenance){

    setMaintenanceOptions([]);

    return;

  }

  setMaintenanceOptions([
    lastMaintenance.Action
  ]);

  setForm(prev=>({

    ...prev,

    maintenanceStatus:
      lastMaintenance.Action

  }));

},[
  form.aircraft,
  form.action,
  approvals
]);


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

  function handleActionChange(
  e:any
  ){

  const value =
  e.target.value;


  let operational =
  "HANGAR";


  if(value==="TEST FLIGHT")
  operational="TEST FLIGHT";


  if(value==="MISSION")
  operational="MISSION";


  if(value==="TRAINING")
  operational="TRAINING";



  setForm({

  ...form,

  action:value,

  operationalStatus:operational

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

    const result =
    await submitLogbook(form);


    if(result.success){

      alert(
        "Logbook berhasil disimpan"
      );

      window.location.reload();

    }

    else{

      alert(
        result.error
      );

    }


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
        x.MaintenanceStatus &&
        x.MaintenanceStatus !== "NONE"
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

<div
className="
p-6
"
>

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
              Total Aktivitas
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
              Aktivitas Pemeliharaan
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
              Riwayat Misi
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

              Input Logbook

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
                  Pilih Pesawat
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
              placeholder="Masukkan Nama"
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

            <div>

            <p
            className="
            text-gray-400
            text-sm
            mb-2
            "
            >

            Jenis Logbook 

            </p>


            <select

            name="action"

            value={form.action}

            onChange={handleActionChange}

            className="
            w-full
            bg-[#1F2937]
            border border-gray-700
            p-3
            rounded-xl
            "

            >


            <option value="MAINTENANCE">

            MAINTENANCE

            </option>


            <option value="TEST FLIGHT">

            TEST FLIGHT

            </option>


            <option value="MISSION">

            MISSION

            </option>


            <option value="TRAINING">

            TRAINING

            </option>



            </select>


            </div>

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

              <input
                type="number"
                name="landingGearAdded"
                placeholder="L/G FC"
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
                name="fcuAdded"
                placeholder="FCU FH"
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
                name="fNozzleAdded"
                placeholder="F Nozzle FH"
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
                name="fPumpAdded"
                placeholder="F Pump FH"
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
  value={form.maintenanceStatus}
  onChange={handleChange}
  disabled={form.action==="TEST FLIGHT"}
  className="
    bg-[#1F2937]
    border border-gray-700
    p-3
    rounded-xl
  "
>

{maintenanceOptions.map((item)=>(
  <option
    key={item}
    value={item}
  >
    {item}
  </option>
))}

</select>

{form.action !== "TEST FLIGHT" && (

              <select
                name="operationalStatus"
                value={form.operationalStatus}
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

                <option value="AOG">
                  AOG
                </option>             

              </select>

              )}

            </div>

            {/* REMARK */}

            <textarea
              name="remarks"
              placeholder="Catatan"
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

                Riwayat Logbook

              </h2>

              <p className="
                text-gray-400 mt-2
              ">

                Rekam Pengisian Logbook

              </p>

            </div>

            {/* SEARCH */}

            <div className="
              flex items-center gap-2
              bg-[#1F2937]
              border border-gray-700
              px-4 py-3
              rounded-xl
              w-[170px]
            ">

              <Search className="
                w-4 h-4 text-gray-400
              " />

              <input
                placeholder="Cari Pesawat..."
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

                          <p className="
                             text-cyan-300 text-sm mt-1
                          ">

                            {log.Action}

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

                          {log.MaintenanceStatus}

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

                          <div className="mt-3 text-xs text-gray-400 space-y-1">

                            {Number(log.FlightHourAdded) > 0 && (
                              <div>AF: +{log.FlightHourAdded}</div>
                            )}

                            {Number(log.Engine1Added) > 0 && (
                              <div>ENG1: +{log.Engine1Added}</div>
                            )}

                            {Number(log.Engine2Added) > 0 && (
                              <div>ENG2: +{log.Engine2Added}</div>
                            )}

                            {Number(log.HydraulicAdded) > 0 && (
                              <div>HYD: +{log.HydraulicAdded}</div>
                            )}

                            {Number(log.LandingGearAdded) > 0 && (
                              <div>LG FC: +{log.LandingGearAdded}</div>
                            )}

                            {Number(log.FCUAdded) > 0 && (
                              <div>FCU: +{log.FCUAdded}</div>
                            )}

                            {Number(log.FNozzleAdded) > 0 && (
                              <div>FN: +{log.FNozzleAdded}</div>
                            )}

                            {Number(log.FPumpAdded) > 0 && (
                              <div>FP: +{log.FPumpAdded}</div>
                            )}

                          </div>

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