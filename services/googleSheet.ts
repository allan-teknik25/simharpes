import axios from "axios";

const SPREADSHEET_ID = "1tCJ8k8AwpQesVvx9bfH4mm7m-RYQ6FZPei6xmiI-w8E";

function sheetUrl(sheetName: string) {
  return `https://opensheet.elk.sh/${SPREADSHEET_ID}/${encodeURIComponent(sheetName)}`;
}

export async function getAircraftData() {
  const res = await axios.get(sheetUrl("Aircraft_Master"));
  return res.data;
}

export async function getMaintenanceRules() {
  const res = await axios.get(sheetUrl("Maintenance_Rules"));
  return res.data;
}

export async function getMaintenanceLogbook() {
  const res = await axios.get(sheetUrl("Maintenance_Logbook"));
  return res.data;
}

export async function getReadinessTrend() {
  const res = await axios.get(sheetUrl("Readiness_Trend"));
  return res.data;
}