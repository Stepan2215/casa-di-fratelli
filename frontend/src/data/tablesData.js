const sectionMeta = {
  smoking: {
    gradient: "from-red-500/25 via-orange-400/10 to-transparent",
    badge: "text-red-300 border-red-400/30 bg-red-500/10",
  },
  main: {
    gradient: "from-amber-400/20 via-yellow-200/10 to-transparent",
    badge: "text-amber-300 border-amber-400/30 bg-amber-500/10",
  },
  terrace: {
    gradient: "from-emerald-400/20 via-teal-300/10 to-transparent",
    badge: "text-emerald-300 border-emerald-400/30 bg-emerald-500/10",
  },
};

const tables = [
  {
    id: "S1",
    section: "smoking",
    seats: 2,
    position: "left-[12%] top-[22%]",
    free: ["18:00", "20:30", "22:00"],
    busy: ["19:00", "19:30", "21:00"],
  },
  {
    id: "S2",
    section: "smoking",
    seats: 4,
    position: "left-[40%] top-[18%]",
    free: ["18:30", "20:00", "22:30"],
    busy: ["19:00", "21:00"],
  },
  {
    id: "S3",
    section: "smoking",
    seats: 6,
    position: "left-[68%] top-[28%]",
    free: ["17:30", "20:30"],
    busy: ["18:30", "19:30", "21:30"],
  },
  {
    id: "M1",
    section: "main",
    seats: 2,
    position: "left-[15%] top-[24%]",
    free: ["17:00", "18:00", "21:00"],
    busy: ["19:00", "20:00"],
  },
  {
    id: "M2",
    section: "main",
    seats: 4,
    position: "left-[43%] top-[20%]",
    free: ["17:30", "19:30", "22:00"],
    busy: ["18:30", "20:30"],
  },
  {
    id: "M3",
    section: "main",
    seats: 6,
    position: "left-[72%] top-[25%]",
    free: ["18:00", "20:00", "22:30"],
    busy: ["19:00", "21:00"],
  },
  {
    id: "M4",
    section: "main",
    seats: 8,
    position: "left-[32%] top-[58%]",
    free: ["17:00", "19:00", "21:30"],
    busy: ["18:00", "20:00"],
  },
  {
    id: "T1",
    section: "terrace",
    seats: 2,
    position: "left-[14%] top-[26%]",
    free: ["18:00", "19:30", "21:30"],
    busy: ["20:30"],
  },
  {
    id: "T2",
    section: "terrace",
    seats: 4,
    position: "left-[45%] top-[18%]",
    free: ["17:30", "19:00", "22:00"],
    busy: ["18:30", "20:30"],
  },
  {
    id: "T3",
    section: "terrace",
    seats: 6,
    position: "left-[72%] top-[32%]",
    free: ["18:30", "20:00", "22:30"],
    busy: ["19:00", "21:00"],
  },
];
export { tables, sectionMeta };