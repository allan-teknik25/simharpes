export function getToday() {
  return new Date();
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// timeline real 7 hari (mundur & maju)
export function generateRealtimeTimeline(offset = 0) {
  const today = new Date();

  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + (i - offset));

    return {
      date: d,
      label: formatDate(d),
    };
  });
}