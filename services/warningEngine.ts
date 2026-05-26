export function getWarnings(fleet: any[]) {
  const warnings: any[] = [];

  fleet.forEach((f) => {
    if (f.CertificateStatus === "EXPIRED") {
      warnings.push({
        type: "CERTIFICATE",
        aircraft: f.Aircraft,
        message: "Certificate Expired",
      });
    }

    if (f.MaintenanceStatus !== "NONE") {
      warnings.push({
        type: "MAINTENANCE",
        aircraft: f.Aircraft,
        message: `Maintenance Required: ${f.MaintenanceStatus}`,
      });
    }

    if (f.SparepartStatus === "WAITING") {
      warnings.push({
        type: "SPAREPART",
        aircraft: f.Aircraft,
        message: "Awaiting Parts",
      });
    }
  });

  return warnings;
}