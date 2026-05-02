export const emptyForm = {
  title: "", description: "", venueId: "", category: "",
  eventDate: "", bannerUrl: "", documentUrl: "", capacity: ""
};

export const toDateTimeLocalValue = (value) => (!value ? "" : value.slice(0, 16));

export const formatEventDate = (date) => {
  return new Date(date).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
};

export const exportEventsToCSV = (events) => {
  if (!events.length) return;
  const headers = ["ID", "Title", "Category", "Date", "Capacity", "Venue"];
  const csvRows = [headers.join(",")];
  
  events.forEach(event => {
    const row = [
      event.id,
      `"${event.title?.replace(/"/g, '""') || ""}"`,
      `"${event.category || ""}"`,
      event.eventDate,
      event.capacity,
      `"${event.venue?.name || "No Venue"}"`
    ];
    csvRows.push(row.join(","));
  });
  
  const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "my_events.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
