// Cities offered for betting. `id` is the name used for routing and for matching the
// backend's bet.cityName (e.g. "Austin, TX"), `name` is what the UI displays.
export const CITIES = [
  {
    id: "Austin",
    name: "Austin",
    region: "Texas, USA",
    icon: "🤠",
    blurb: "Hot enough? Bet on the next high.",
  },
  {
    id: "Madison",
    name: "Madison",
    region: "Wisconsin, USA",
    icon: "❄️",
    blurb: "Rain, snow or shine on the isthmus.",
  },
  {
    id: "Los Angeles",
    name: "Los Angeles",
    region: "California, USA",
    icon: "🌴",
    blurb: "Sunny again? Don't be so sure.",
  },
  {
    id: "London",
    name: "London",
    region: "United Kingdom",
    icon: "☔",
    blurb: "Will it rain tomorrow? Place your bet.",
  },
];

export const CITY_IDS = CITIES.map((c) => c.id);
