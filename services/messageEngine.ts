import { getWarnings } from "./warningEngine";

export function generateMessages(
  fleet: any[]
) {
  const messages: any[] = [];

  const warnings =
    getWarnings(fleet);

  warnings.forEach(
    (w, index) => {

      let type:
        | "critical"
        | "warning"
        | "info"
        | "success" = "info";

      let category:
        | "SYSTEM_ALERT"
        | "MISSION"
        | "MAINTENANCE"
        | "COMMUNICATION" =
        "SYSTEM_ALERT";

      if (
        w.type === "CERTIFICATE"
      ) {
        type = "critical";
        category = "SYSTEM_ALERT";
      }

      else if (
        w.type === "SPAREPART"
      ) {
        type = "warning";
        category = "SYSTEM_ALERT";
      }

      else if (
        w.type === "MAINTENANCE"
      ) {
        type = "info";
        category = "MAINTENANCE";
      }

      messages.push({

        id: index + 1,

        title: w.message,

        desc: w.aircraft,

        category,

        type,

        read: false,

        action:
          "ACTION_REQUIRED",

        time:
          "Realtime",

      });

    }
  );

  return messages;
}