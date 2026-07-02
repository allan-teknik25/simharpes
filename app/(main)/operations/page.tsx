"use client";

import { useEffect, useState } from "react";
import {
  getAircraftData,
  getMaintenanceApproval,
  updateMaintenanceApproval,
  getMaintenanceMaster,
} from "@/services/googleSheet";
import {
  getHealthScore,
  getMaintenanceForecast,
} from "@/services/fleetEngine";
import {
  Plane,
  BrainCircuit,
  ShieldAlert,
  ShieldCheck,
  X,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";

// =======================
// TYPES & INTERFACES
// =======================
interface Aircraft {
  Aircraft: string;
  AirframeFH: number;
  Engine1FH: number;
  HydraulicFH: number;
  FCUFH: number;
  FNozzleFH: number;
  FPumpFH: number;
  LandingGearFC: number;
  OperationalStatus: string;
  MaintenanceStatus: string;
  CertificateStatus: string;
  SparepartStatus: string;
  [key: string]: any;
}

interface ApprovalItem {
  ID: string;
  Aircraft: string;
  RequestType: string;
  Action: string;
  CurrentValue: string; // <-- Tambahkan ini sesuai kolom baru di Google Sheet
  RequestDate: string;
  ApprovalStatus: string; 
  ApprovedDate: string;
  ApprovedBy: string;
  Remarks?: string;
}

interface ForecastItem {
  Aircraft: string;
  Remaining: number;
  Unit: string;
  Item: string;
}

type ActionType = "APPROVE" | "REJECT" | null;

export default function OperationsPage() {
  // States
  const [fleet, setFleet] = useState<Aircraft[]>([]);
  const [approval, setApproval] = useState<ApprovalItem[]>([]);
  const [maintenanceMaster, setMaintenanceMaster] = useState<any[]>([]);
  
  // Modal & Actions
  const [selected, setSelected] = useState<ApprovalItem | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [code, setCode] = useState("");
  const [modal, setModal] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [remarks, setRemarks] = useState("");
  
  // UX States
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [success, setSuccess] = useState("");

  // =======================
  // LOAD DATA
  // =======================
  async function load() {
    setIsFetching(true);
    try {
      const [aircraftData, approvalsData, masterData] = await Promise.all([
        getAircraftData(),
        getMaintenanceApproval(),
        getMaintenanceMaster(),
      ]);

      setFleet(aircraftData || []);
      setMaintenanceMaster(masterData || []);
      setApproval(
        (approvalsData || []).filter(
          (x: ApprovalItem) => x.ApprovalStatus === "PENDING"
        )
      );
    } catch (error) {
      console.error("Gagal memuat data operasional:", error);
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // =======================
  // APPROVAL HANDLER
  // =======================

  function handleActionClick(item: ApprovalItem, action: ActionType) {
  setSelected(item);
  setActionType(action);
  setRemarks("");
  setModal(true);
}

  async function executeAction() {
    if (!selected || !actionType) return;

    setLoading(true);
    try {
      const res = await updateMaintenanceApproval(
        selected.ID,
        code,
        actionType,
        remarks
      );

      if (res.success) {
        setSuccess(`Berhasil melakukan ${actionType} pada ${selected.Aircraft}`);
        closeModal();
        await load();
        
        // Hapus notifikasi sukses setelah 4 detik
        setTimeout(() => setSuccess(""), 4000);
      } else {
        alert(res.error || "Aksi gagal dieksekusi. Periksa kembali kode Anda.");
      }
    } catch (error:any) {

console.error("ERROR APPROVAL:", error);

alert(
"ERROR: " + error.message
);

} finally {
      setLoading(false);
    }
  }

  function closeModal() {
    setModal(false);
    setCode("");
    setSelected(null);
    setActionType(null);
    setShowCode(false);
    setRemarks("");
  }

  function getMaintenanceBadge(status: string) {
    return status === "NONE"
      ? "bg-green-500/20 text-green-400"
      : "bg-yellow-500/20 text-yellow-400";
  }

  function getOperationalBadge(status: string) {
    switch (status) {
      case "SERVICEABLE":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      case "MISSION":
        return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      case "TRAINING":
        return "bg-purple-500/20 text-purple-400 border-purple-500/40";
      case "TEST FLIGHT":
        return "bg-gray-500/20 text-gray-300 border-gray-500/40";
      case "AOG":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "HANGAR":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/20";
    }
  }

  function getHealthColor(score: number) {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  }

  // =======================
  // DERIVED DATA
  // =======================
  const mission = fleet.filter(
    (x) =>
      x.OperationalStatus === "SERVICEABLE" &&
      x.MaintenanceStatus === "NONE" &&
      x.CertificateStatus === "VALID" &&
      x.SparepartStatus === "READY"
  );

  const forecast: ForecastItem[] = getMaintenanceForecast(
    fleet,
    maintenanceMaster,
    approval
  ) || [];

  // =======================
  // RENDER
  // =======================
  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b0f19]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="p-5 text-gray-100 min-h-screen bg-[#0b0f19] font-sans">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* ======================
            PENDING APPROVAL
        ====================== */}
        <div className="bg-[#111827] border border-yellow-500/30 rounded-3xl p-6 shadow-lg shadow-black/20">
          <h2 className="text-2xl font-bold text-yellow-400 mb-5 flex items-center gap-2">
            <AlertTriangle className="text-yellow-400" /> Pending Maintenance Approval
          </h2>

{approval.length === 0 ? (
  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-green-400 flex items-center gap-2">
    <CheckCircle size={20} /> No Pending Approval
  </div>
) : (
  <div className="space-y-4">

    {approval.map((item) => (

      <div
        key={item.ID}
        className="bg-[#1F2937] rounded-2xl p-5 border border-gray-700 hover:border-gray-500 transition-colors"
      >

        <div className="flex justify-between items-start">

          <h3 className="text-xl font-bold text-cyan-400">
            {item.Aircraft}
          </h3>

          <p className="text-gray-400">
            Current:
            <span className="text-yellow-400 font-bold ml-2">
              {item.CurrentValue || "-"}
            </span>
          </p>

        </div>


        <div className="mt-4">

          <div className="inline-block bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-xl font-bold text-sm">
            {item.RequestType} : {item.Action}
          </div>


          <div className="flex gap-2 mt-4">

            <button
              onClick={() => handleActionClick(item,"APPROVE")}
              className="
              bg-green-600
              hover:bg-green-800
              text-white
              px-5 py-2
              rounded-xl
              font-bold
              flex items-center gap-1
              "
            >
              <CheckCircle size={16}/>
              APPROVE
            </button>


            <button
              onClick={() => handleActionClick(item,"REJECT")}
              className="
              bg-red-600
              hover:bg-red-800
              text-white
              px-5 py-2
              rounded-xl
              font-bold
              flex items-center gap-1
              "
            >
              <XCircle size={16}/>
              REJECT
            </button>


          </div>

        </div>

      </div>

    ))}

  </div>
)}
</div>
        {/* ======================
            MISSION RECOMMENDATION
        ====================== */}
        <div className="bg-[#111827] border border-cyan-500/30 rounded-3xl p-6 shadow-lg shadow-black/20">
          <h2 className="text-2xl font-bold text-cyan-400 mb-5 flex items-center gap-2">
            <BrainCircuit /> Mission Recommendation
          </h2>

          {mission.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-xl text-gray-400">
              No aircraft currently fits the mission criteria.
            </div>
          ) : (
            <div className="space-y-4">
              {mission.map((x) => (
                <div
                  key={x.Aircraft}
                  className="bg-[#1F2937] rounded-2xl p-5 border border-gray-700/50 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-xl font-bold text-cyan-400">{x.Aircraft}</h3>
                    <p className="text-gray-400 mt-1">
                      Health :{" "}
                      <span className={`font-bold ${getHealthColor(getHealthScore(x))}`}>
                        {getHealthScore(x)}%
                      </span>
                    </p>
                  </div>
                  <div className="text-green-400 font-bold bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/30 shadow-inner">
                    FMC
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ======================
            FLEET STATUS BOARD
        ====================== */}
        <div className="bg-[#111827] rounded-3xl border border-gray-800 p-6 shadow-lg shadow-black/20 xl:col-span-1 overflow-hidden">
          <h2 className="text-2xl font-bold mb-5 flex items-center gap-2 text-white">
            <Plane className="text-blue-400" /> Fleet Status Board
          </h2>

          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-[#172033] text-gray-400">
                <tr>
                  <th className="p-4 font-semibold">Aircraft</th>
                  <th className="p-4 font-semibold">Maintenance</th>
                  <th className="p-4 font-semibold">Health</th>
                  <th className="p-4 font-semibold">Operational</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {fleet.map((x) => (
                  <tr key={x.Aircraft} className="hover:bg-[#172033]/60 transition-colors">
                    <td className="p-4 font-bold">
                      <span className={x.OperationalStatus === "AOG" ? "text-red-400" : "text-cyan-400"}>
                        {x.Aircraft}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1.5 rounded-lg font-bold text-xs tracking-wide ${getMaintenanceBadge(x.MaintenanceStatus)}`}>
                        {x.MaintenanceStatus}
                      </span>
                    </td>
                    <td className="p-4 font-bold">
                      <span className={getHealthColor(getHealthScore(x))}>
                        {getHealthScore(x)}%
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1.5 rounded-lg font-bold text-xs tracking-wide border ${getOperationalBadge(x.OperationalStatus)}`}>
                        {x.OperationalStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ======================
            MAINTENANCE FORECAST
        ====================== */}
        <div className="bg-[#111827] border border-yellow-500/30 rounded-3xl p-6 shadow-lg shadow-black/20">
          <h2 className="text-2xl font-bold text-yellow-400 mb-5 flex items-center gap-2">
            <ShieldAlert /> Maintenance Forecast
          </h2>

          {forecast.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-xl text-gray-400">
              No upcoming maintenance required.
            </div>
          ) : (
            <div className="space-y-4">
              {forecast.map((x, i) => (
                <div
                  key={i}
                  className="bg-[#1F2937] rounded-2xl p-5 border border-gray-700/50 hover:border-yellow-500/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-cyan-400">{x.Aircraft}</h3>
                    <p className="text-gray-400">
                      Remaining :{" "}
                      <span className="text-yellow-400 font-bold">
                        {x.Remaining} {x.Unit}
                      </span>
                    </p>
                  </div>
                  <div className="mt-3 text-yellow-400 bg-[#111827]/80 px-4 py-2 rounded-xl border border-gray-700/50 inline-block text-sm font-medium">
                    <span className="text-gray-500 mr-1">Maintenance :</span> {x.Item}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ======================
          TOAST NOTIFICATION
      ====================== */}
      {success && (
        <div className="fixed bottom-6 right-6 md:top-6 md:bottom-auto md:right-6 z-50 bg-green-500/20 border border-green-500 text-green-300 px-6 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="text-green-400" /> {success}
        </div>
      )}

      {/* ======================
          AUTHORIZATION MODAL
      ====================== */}
      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-gray-700 rounded-3xl p-8 w-full max-w-sm shadow-2xl relative">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex gap-2 items-center text-white">
                <ShieldCheck className={actionType === "APPROVE" ? "text-green-400" : "text-red-400"} /> 
                Izin Otorisasi
              </h2>
              <button 
                onClick={closeModal} 
                className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-1.5 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6 bg-[#1F2937] p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm mb-1">
                {actionType === "APPROVE" ? "Approve" : "Reject"} untuk :
              </p>
              <h3 className="text-cyan-400 text-2xl font-black tracking-wider">
                {selected?.Aircraft}
              </h3>
            </div>
{actionType === "REJECT" && (
  <textarea
    value={remarks}
    onChange={(e) => setRemarks(e.target.value)}
    placeholder="Masukkan alasan reject"
    rows={4}
    className="
      w-full
      mb-4
      bg-[#1F2937]
      border
      border-gray-700
      focus:border-red-500
      p-3
      rounded-xl
      text-white
      outline-none
    "
  />
)}
            <div className="relative mb-6">
              <input
                type={showCode ? "text" : "password"}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Masukkan Kode Approval"
                className="w-full bg-[#1F2937] border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 p-3.5 rounded-xl pr-12 text-white font-mono placeholder:font-sans transition-all outline-none"
                autoFocus
              />
              <button
                type="button"
                className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowCode(!showCode)}
              >
                {showCode ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              disabled={loading || !code.trim()}
              onClick={executeAction}
              className={`w-full p-3.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg ${
                actionType === "APPROVE"
                  ? "bg-green-600 hover:bg-green-500 shadow-green-900/20"
                  : "bg-red-600 hover:bg-red-500 shadow-red-900/20"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <CheckCircle size={20} />
                  {actionType === "APPROVE" ? "VERIFY APPROVE" : "VERIFY REJECT"}
                </>
              )}
            </button>

          </div>
        </div>
      )}
    </div>
  );
}