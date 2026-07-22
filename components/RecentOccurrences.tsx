import Link from "next/link";
import { HiOutlineChevronRight } from "react-icons/hi";
import { BsWrench, BsFuelPump, BsJournalText } from "react-icons/bs";

export interface Occurrence {
  id: string;
  type: "service" | "fuel" | "logbook";
  title: string;
  date: string;
  cost: number | null;
  editUrl: string;
}

const TYPE_CONFIG = {
  service: {
    label: "Serviço",
    icon: BsWrench,
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  fuel: {
    label: "Combustível",
    icon: BsFuelPump,
    badgeClass: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  logbook: {
    label: "Logbook",
    icon: BsJournalText,
    badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
} as const;

interface RecentOccurrencesProps {
  occurrences: Occurrence[];
}

export default function RecentOccurrences({ occurrences }: RecentOccurrencesProps) {
  if (occurrences.length === 0) return null;

  return (
    <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] p-8 mb-8">
      <div className="mb-6">
        <p className="text-zinc-500 text-sm font-medium">Últimas Ocorrências</p>
      </div>

      <div className="space-y-3">
        {occurrences.map((occ) => {
          const config = TYPE_CONFIG[occ.type];
          const Icon = config.icon;

          return (
            <div
              key={`${occ.type}-${occ.id}`}
              className="bg-[#121212] border border-zinc-900/80 rounded-2xl p-4 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`p-2.5 rounded-xl border ${config.badgeClass}`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-zinc-200 truncate">
                    {occ.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${config.badgeClass.split(" ").slice(1).join(" ")}`}>
                      {config.label}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {new Date(occ.date).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
                {occ.cost !== null && (
                  <p className="text-sm font-bold text-zinc-300 whitespace-nowrap">
                    R$ {occ.cost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>

              <Link
                href={occ.editUrl}
                className="flex items-center gap-1 text-[11px] font-bold text-zinc-500 hover:text-blue-400 transition-colors whitespace-nowrap"
              >
                Ver detalhe
                <HiOutlineChevronRight size={14} />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
