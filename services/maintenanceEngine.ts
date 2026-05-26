export function calculateRemaining(date: string) {
  const now = new Date();
  const target = new Date(date);

  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function determineTechnicalStatus(days: number) {
  if (days <= 0) return "OVERDUE";
  if (days <= 7) return "DUE SOON";
  return "OK";
}

export function determineReason(status: string) {
  switch (status) {
    case "OVERDUE":
      return "Maintenance overdue";
    case "DUE SOON":
      return "Maintenance approaching";
    default:
      return "Normal operation";
  }
}