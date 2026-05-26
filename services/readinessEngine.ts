export function getStatus(item: any) {
  const isAOG =
    item.MaintenanceStatus !== "NONE" ||
    item.CertificateStatus === "EXPIRED" ||
    item.SparepartStatus === "WAITING";

  const isMaintenance = item.MaintenanceStatus !== "NONE";

  const serviceable = !isAOG;

  return {
    serviceable,
    isAOG,
    isMaintenance,
  };
}