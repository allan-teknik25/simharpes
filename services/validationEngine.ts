export function validateAircraft(
  aircraft: any
) {
  const errors = [];

  if (!aircraft.Aircraft)
    errors.push("Aircraft missing");

  if (
    Number(aircraft.AirframeFH) < 0
  )
    errors.push("Invalid FH");

  return errors;
}