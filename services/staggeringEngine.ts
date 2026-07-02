import {
  getAircraftData,
  getMaintenanceLogbook,
  getMaintenanceMaster,
  getMaintenancePlan,
} from "./googleSheet";

export async function buildStaggeringData() {

  const aircraft =
    await getAircraftData();

  const logs =
    await getMaintenanceLogbook();

  const master =
    await getMaintenanceMaster();

  const plans =
    await getMaintenancePlan();

  // ==========================
  // COMPONENT STATUS
  // ==========================

  const componentStatus =
    aircraft.map((ac: any) => {

      const result: any = {
        aircraft: ac.Aircraft,
        components: [],
      };

      master.forEach((m: any) => {

        let currentFH = 0;

        switch (m.Item) {

          case "Airframe":
            currentFH =
              Number(ac.AirframeFH);
            break;

          case "Engine":
            currentFH =
              Number(ac.Engine1FH);
            break;

          case "Hydraulic":
            currentFH =
              Number(ac.HydraulicFH);
            break;

          case "LandingGear":
            currentFH =
              Number(ac.LGFC);
            break;

          case "FCU":
            currentFH =
              Number(ac.FCUFH);
            break;

          case "F Nozzle":
            currentFH =
              Number(ac.FNozzleFH);
            break;

          case "F Pump":
            currentFH =
              Number(ac.FPumpFH);
            break;
        }

        const interval =
          Number(m.IntervalFH);

        const warning =
          Number(m.WarningFH);

        const remaining =
          interval -
          (currentFH % interval);

        let status = "NORMAL";

        if (remaining <= warning)
          status = "WARNING";

        if (remaining <= 0)
          status = "OVERDUE";

        result.components.push({

          item: m.Item,

          code: m.Code,

          currentFH,

          interval,

          remaining,

          status,

        });

      });

      return result;

    });

  // ==========================
  // PLAN STATUS
  // ==========================

  const planStatus: any[] = [];

  plans.forEach((row: any) => {

    const aircraft =
      row["Tail Number"];

    Object.keys(row).forEach(
      (key) => {

        if (
          key.includes("M") &&
          row[key] &&
          row[key] !== "NONE"
        ) {

          const found =
            logs.find(
              (log: any) =>
                log.Aircraft === aircraft &&
                log.Action === row[key]
            );

          planStatus.push({

            aircraft,

            week: key,

            maintenance:
              row[key],

            completed:
              !!found,

          });

        }

      }
    );

  });

  // ==========================
  // OVERDUE
  // ==========================

  const overdue =
    componentStatus.flatMap(
      (x: any) =>
        x.components
          .filter(
            (c: any) =>
              c.status === "OVERDUE"
          )
          .map(
            (c: any) => ({
              aircraft:
                x.aircraft,
              ...c,
            })
          )
    );

  // ==========================
  // DUE SOON
  // ==========================

  const dueSoon =
    componentStatus.flatMap(
      (x: any) =>
        x.components
          .filter(
            (c: any) =>
              c.status === "WARNING"
          )
          .map(
            (c: any) => ({
              aircraft:
                x.aircraft,
              ...c,
            })
          )
    );

  return {

    componentStatus,

    planStatus,

    overdue,

    dueSoon,

  };

}