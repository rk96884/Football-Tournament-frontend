export function exportPaymentsToCsv(tournament) {
  const rows = [
    ["Player", "Cost", "Paid", "Owed"],
    ...tournament.players.map(p => {
      const cost = p.costOverride ?? tournament.costPerPlayer;
      const owed = cost - p.amountPaid;
      return [p.name, cost, p.amountPaid, owed];
    })
  ];

  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${tournament.name}-payments.csv`;
  a.click();
  URL.revokeObjectURL(url);
}