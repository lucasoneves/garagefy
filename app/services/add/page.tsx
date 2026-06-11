"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineCalendar } from "react-icons/hi";
import PageNavHeader from "@/components/PageNavHeader";
import SaveButton from "@/components/SaveButton";
import MainInput from "@/components/ui/MainInput";
import MainTextArea from "@/components/ui/MainTextArea";

const AddServicePage = () => {
  const router = useRouter();

  // Estados locais para controle do formulário
  const [title, setTitle] = useState("");
  const [shopName, setShopName] = useState("");
  const [cost, setCost] = useState("");
  const [currentOdo, setCurrentOdo] = useState("");
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
    if (isSubmitting || !vehicleId) return;

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
        description: description.trim(),
        shop_name: shopName.trim(),
        current_odo: parseInt(currentOdo, 10) || 0,
        cost: parseFloat(cost.replace(",", ".")) || 0.0, // Trata separadores decimais do teclado BR
        service_date: isoDate,
      };

      const response = await fetch("http://localhost:8080/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const serverMessage = errorData?.error || "Erro desconhecido ao salvar o serviço.";
        throw new Error(serverMessage);
      }

      // Redireciona de volta para a listagem de serviços após o sucesso
      router.push("/services");
    } catch (error: any) {
      console.error("Erro ao cadastrar serviço:", error);
      alert(`Não foi possível salvar o serviço: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-blue-500/30">
      <PageNavHeader pageTitle="Add Service" lastPage="/services" />

      <main className="space-y-8 pb-40">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Service Type */}
          <MainInput
            label="Service Type"
            type="text"
            placeholder="Maintenance, Car Wash..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isSubmitting}
          />

          {/* Provider / Workshop */}
          <MainInput
            label="Provider / Workshop"
            type="text"
            placeholder="Garage or Shop Name"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
            disabled={isSubmitting}
          />

          {/* Total Cost */}
          <div className="w-full relative">
            <MainInput
              label="Total Cost"
              type="text"
              placeholder="0.00"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Current Odometer */}
          <div className="w-full relative">
            <MainInput
              label="Current Odometer"
              type="number"
              placeholder="0"
              value={currentOdo}
              onChange={(e) => setCurrentOdo(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <span className="absolute bottom-4 right-5 text-zinc-500 font-bold text-xs uppercase tracking-tighter pointer-events-none">
              KM
            </span>
          </div>

          {/* Service Date com Máscara e Ícone Duplo */}
          <div className="w-full relative">
            <MainInput
              label="Service Date"
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

          {/* Notes */}
          <MainTextArea
            label="Notes"
            placeholder="Describe the service performed..."
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <SaveButton title={isSubmitting ? "Saving Service..." : "Save Service"} />
        </form>
      </main>
    </div>
  );
};

export default AddServicePage;