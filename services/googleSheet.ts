import axios from "axios";

const SHEET_ID = "1tCJ8k8AwpQesVvx9bfH4mm7m-RYQ6FZPei6xmiI-w8E";

export async function getAircraftData() {

  const url = `https://opensheet.elk.sh/${SHEET_ID}/Aircraft_Master`;

  const response = await axios.get(url);

  return response.data;
}

export async function getStaggeringData() {

  const url = `https://opensheet.elk.sh/${SHEET_ID}/Staggering`;

  const response = await axios.get(url);

  return response.data;
}

export async function getMaintenanceLogbook() {

  const url = `https://opensheet.elk.sh/${SHEET_ID}/Maintenance_Logbook`;

  const response = await axios.get(url);

  return response.data;
}