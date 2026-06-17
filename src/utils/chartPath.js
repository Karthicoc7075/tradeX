export function buildGrowthChartPaths(points, baseline = 200) {
  if (!points?.length) {
    return { line: "", fill: "" };
  }

  const sorted = [...points].sort((a, b) => a.x - b.x);
  let line = `M${sorted[0].x} ${sorted[0].y}`;

  for (let i = 0; i < sorted.length - 1; i += 1) {
    const current = sorted[i];
    const next = sorted[i + 1];
    const midX = (current.x + next.x) / 2;
    line += ` C${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
  }

  const last = sorted[sorted.length - 1];
  const first = sorted[0];
  const fill = `${line} L${last.x} ${baseline} L${first.x} ${baseline} Z`;

  return { line, fill };
}