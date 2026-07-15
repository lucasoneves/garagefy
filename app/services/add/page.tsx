"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineCalendar } from "react-icons/hi";
import { api } from "@/lib/api";
import { ServiceType } from "@/lib/types";
import PageNavHeader from "@/components/PageNavHeader";
import SaveButton from "@/components/SaveButton";
import MainInput from "@/components/ui/MainInput";
import MainTextArea from "@/components/ui/MainTextArea";
import MainSelect from "@/components/ui/MainSelect";

const AddServicePage = () => {
  const router = useRouter();

  // Estados locais para controle do formulário
  const [title, setTitle] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType | "">("");
  const [shopName, setShopName] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState<string>("");
  const [description, setDescription] = useState("");

  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Validação de segurança: Carrega o ID do veículo ativo para escopar o serviço
  useEffect(() => {
    const savedVehicleId = localStorage.getItem("@garagefy:active_vehicle_id");
    
    if (!savedVehicleId) {
      alert("Nenhum veículo ativo selecionado. Escolha um carro na Garagem primeiro.");
      router.push("/my-garage");
      return;
    }

    // Joga a atualização do estado para a próxima iteração do event loop para evitar renderizações em cascata
    const tempTimeout = setTimeout(() => {
      setVehicleId(savedVehicleId);
    }, 0);

    return () => clearTimeout(tempTimeout);
  }, [router]);

  // Máscara estrita para data no formato DD/MM/YYYY
  const formatDateInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8); // Pega no máximo 8 dígitos puros
    let formatted = "";

    if (digits.length >= 2) {
      formatted += digits.slice(0, 2) + "/";
    } else {
      formatted += digits;
    }

    if (digits.length >= 4) {
      formatted += digits.slice(2, 4) + "/";
    } else if (digits.length > 2) {
      formatted += digits.slice(2);
    }

    if (digits.length > 4) {
      formatted += digits.slice(4);
    }

    return formatted;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(formatDateInput(e.target.value));
  };

  // 2. Submissão do payload em formato JSON limpo para a API em Go
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || !vehicleId || !serviceType) return;

    setIsSubmitting(true);

    try {
      // Converte a string de data DD/MM/YYYY para o formato aceito pelo parser de tempo do Go (RFC3339 ou ISO)
      let isoDate = new Date().toISOString(); // Fallback caso a data falhe
      if (date.length === 10) {
        const [day, month, year] = date.split("/");
        const parsedDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
        if (!isNaN(parsedDate.getTime())) {
          isoDate = parsedDate.toISOString();
        }
      }

      const payload = {
        vehicle_id: vehicleId,
        title: title.trim(),
        service_type: serviceType,
        description: description.trim(),
        shop_name: shopName.trim(),
        cost: parseFloat(cost.replace(",", ".")) || 0.0,
        service_date: isoDate,
      };

      await api.post("/services", payload);

      // Redireciona de volta para a listagem de serviços após o sucesso
      router.push("/services");
    } catch (error: any) {
      console.error("Erro ao cadastrar serviço:", error);
      const serverMessage = error.response?.data?.error || error.message || "Erro desconhecido ao salvar o serviço.";
      alert(`Não foi possível salvar o serviço: ${serverMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-blue-500/30">
      <PageNavHeader pageTitle="Novo Serviço" lastPage="/services" />

      <main className="space-y-8 pb-40">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Tipo de Serviço */}
          <MainSelect
            label="Tipo de Serviço"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as ServiceType)}
            required
            disabled={isSubmitting}
          >
            <option value="" disabled>Selecione o tipo de serviço</option>
            <option value="oleo_fluidos_filtros">Óleo, Fluídos e Filtros</option>
            <option value="revisao">Revisão</option>
            <option value="carroceria">Carroceria</option>
            <option value="manutencao">Manutenção</option>
          </MainSelect>

          <MainInput
            label="Nome do Serviço"
            type="text"
            placeholder="Troca de óleo, Alinhamento..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <MainInput
            label="Oficina / Prestador"
            type="text"
            placeholder="Nome da oficina"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <div className="w-full relative">
            <MainInput
              label="Custo Total"
              type="text"
              placeholder="0.00"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="w-full relative">
            <MainInput
              label="Data do Serviço"
              type="text"
              value={date}
              onChange={handleDateChange}
              placeholder="DD/MM/YYYY"
              maxLength={10}
              required
              disabled={isSubmitting}
            />
            <span className="absolute bottom-4 right-5 text-zinc-600 pointer-events-none">
              <HiOutlineCalendar size={20} />
            </span>
          </div>

          <MainTextArea
            label="Observações"
            placeholder="Descreva o serviço realizado..."
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />

          <SaveButton title={isSubmitting ? "Salvando..." : "Salvar Serviço"} />
        </form>
      </main>
    </div>
  );
};

export default AddServicePage;