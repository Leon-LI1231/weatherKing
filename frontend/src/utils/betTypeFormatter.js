export const formatBetType = (type) => {
  switch (type) {
    case "MAX_TEMP_OVER_UNDER":
      return "Max Temp Over/Under";
    case "RAIN_YES_NO":
      return "Rain (Yes/No)";
    case "CONDITION_MATCH":
      return "Condition Match";
    default:
      return type || "";
  }
};
