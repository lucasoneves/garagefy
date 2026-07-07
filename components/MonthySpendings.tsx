import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";

interface MonthlySpendingsProps {
  totalSpent: number;
  weeklyData: { day: string; value: number }[];
  percentChange?: number;
}

export default function MonthlySpendings({ totalSpent, weeklyData, percentChange }: MonthlySpendingsProps) {
  return (
    <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] p-8 mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-zinc-500 text-sm font-medium">Monthly Spending</p>
          <h3 className="text-4xl font-bold mt-1">
            R$ {totalSpent.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </h3>
        </div>
        {percentChange !== undefined && (
          <div className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-lg flex items-center gap-1 text-xs font-bold">
            <span className="text-[10px]">{percentChange >= 0 ? "↗" : "↘"}</span>{" "}
            {percentChange >= 0 ? "+" : ""}
            {percentChange}%
          </div>
        )}
      </div>

      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#525252", fontSize: 10, fontWeight: "bold" }}
              dy={10}
            />
            <Bar dataKey="value" radius={[4, 4, 4, 4]}>
              {weeklyData.map((entry, index) => {
                const maxVal = Math.max(...weeklyData.map((d) => d.value), 1);
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.value >= maxVal * 0.9 ? "#007BFF" : "#27272a"}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
