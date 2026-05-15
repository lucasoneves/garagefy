
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";
export default function MonthlySpendings() {
  // Dados fictícios para o gráfico baseado na imagem
  const data = [
    { day: "MON", value: 40 },
    { day: "TUE", value: 55 },
    { day: "WED", value: 30 },
    { day: "THU", value: 95 }, // Destaque na imagem
    { day: "FRI", value: 50 },
    { day: "SAT", value: 25 },
  ];
  return (
    <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-zinc-500 text-sm font-medium">
              Monthly Spending
            </p>
            <h3 className="text-4xl font-bold mt-1">$650.00</h3>
          </div>
          <div className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-lg flex items-center gap-1 text-xs font-bold">
            <span className="text-[10px]">↗</span> +12%
          </div>
        </div>

        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#525252", fontSize: 10, fontWeight: "bold" }}
                dy={10}
              />
              <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.day === "THU" ? "#007BFF" : "#27272a"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
  );
}
