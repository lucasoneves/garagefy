export type ServiceType =
  | "oleo_fluidos_filtros"
  | "revisao"
  | "carroceria"
  | "manutencao";

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  oleo_fluidos_filtros: "Óleo, Fluídos e Filtros",
  revisao: "Revisão",
  carroceria: "Carroceria",
  manutencao: "Manutenção",
};

export const SERVICE_TYPE_BADGE_CLASSES: Record<ServiceType, string> = {
  oleo_fluidos_filtros: "bg-blue-500/15 text-blue-400",
  revisao: "bg-emerald-500/15 text-emerald-400",
  carroceria: "bg-purple-500/15 text-purple-400",
  manutencao: "bg-orange-500/15 text-orange-400",
};

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  current_odo: number;
  color: string;
  renavam?: string;
  created_at?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface Service {
  id: string;
  vehicle_id: string;
  title: string;
  description: string;
  shop_name: string;
  current_odo: number;
  cost: number;
  service_date: string;
  service_type: ServiceType;
}
