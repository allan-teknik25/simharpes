export function evaluateOps(
  readiness: number,
  sasbinpuan: number
) {

  let status = "";
  let severity = "";

  if (readiness >= sasbinpuan + 15) {

    status = "FULLY CAPABLE";
    severity = "GREEN";

  }

  else if (readiness >= sasbinpuan) {

    status = "CAPABLE";
    severity = "CYAN";

  }

  else if (readiness >= sasbinpuan - 15) {

    status = "LIMITED";
    severity = "YELLOW";

  }

  else {

    status = "NOT CAPABLE";
    severity = "RED";

  }

  return {
    readiness,
    sasbinpuan,
    status,
    severity,
  };
}