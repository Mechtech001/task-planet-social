const SECONDS = [
  [31536000, "year"],
  [2592000, "month"],
  [86400, "day"],
  [3600, "hour"],
  [60, "minute"],
  [1, "second"],
];

export default function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);

  if (seconds < 5) return "just now";

  for (const [value, unit] of SECONDS) {
    const count = Math.floor(seconds / value);
    if (count >= 1) {
      return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}
