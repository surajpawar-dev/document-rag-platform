export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  return <span className={`status-badge status-${normalized}`}>{status.replace(/_/g, " ")}</span>;
}
