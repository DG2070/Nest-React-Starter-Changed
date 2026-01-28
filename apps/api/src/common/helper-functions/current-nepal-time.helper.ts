export function nepalDateOnly(date: Date | string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date));
}

export function nepalTimestamp(date: Date | string = new Date()): string {
  const dt = new Date(date);

  const utcTime = dt.getTime();

  const nepalOffset = 5 * 60 * 60 * 1000 + 45 * 60 * 1000; // 5h45m in ms

  const nepalTime = utcTime + nepalOffset;

  return nepalTime.toString();
}
