"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { HiOutlineCalendar } from "react-icons/hi";
import { api } from "@/lib/api";
import PageNavHeader from "@/components/PageNavHeader";
import SaveButton from "@/components/SaveButton";
import MainInput from "@/components/ui/MainInput";
import MainTextArea from "@/components/ui/MainTextArea";

const EditServicePage = () => {
  const router = useRouter();
  const { id } = useParams(); // Pega o ID do serviço vindo da URL

  const [title, setTitle] = useState("");
  const [shopName, setShopName] = useState("");
  const [cost, setCost] = useState("");
  const [currentOdo, setCurrentOdo] = useState("");
  const [date, setDate] = useState<string>("");
  const [description, setDescription] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Carrega os dados atuais do serviço para preencher o formulário
  useEffect(() => {
    const fetchServiceData = async () => {
      if (!id) return;
      
      try {
        const response = await api.get(`/services/${id}`);
        const data = response.data;
        
        setTitle(data.title || "");
        setShopName(data.shop_name || "");
        setCost(data.cost ? String(data.cost) : "");
        setCurrentOdo(data.current_odo ? String(data.current_odo) : "");
        setDescription(data.description || "");

        // Converte a data ISO vinda do Go (2026-06-10T...) de volta para DD/MM/YYYY
        if (data.service_date) {
          const rawDate = new Date(data.service_date);
          const day = String(rawDate.getUTCDate()).padStart(2, "0");
          const month = String(rawDate.getUTCMonth() + 1).padStart(2, "0");
          const year = rawDate.getUTCFullYear();
          setDate(`${day}/${month}/${year}`);
        }
      } catch (error: any) {
        console.error("Erro ao buscar serviço:", error);
        alert(`Erro ao carregar dados: ${error.message}`);
        router.push("/services");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [id, router]);

  // Máscara de data DD/MM/YYYY
  const formatDateInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    let formatted = "";
    if (digits.length >= 2) formatted += digits.slice(0, 2) + "/";
    else formatted += digits;
    if (digits.length >= 4) formatted += digits.slice(2, 4) + "/";
    else if (digits.length > 2) formatted += digits.slice(2);
    if (digits.length > 4) formatted += digits.slice(4);
    return formatted;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(formatDateInput(e.target.value));
  };

  // 2. Envia as modificações via PUT
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || !id) return;

    setIsSubmitting(true);

    try {
      let isoDate = new Date().toISOString();
      if (date.length === 10) {
        const [day, month, year] = date.split("/");
        const parsedDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
        if (!isNaN(parsedDate.getTime())) {
          isoDate = parsedDate.toISOString();
        }
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        shop_name: shopName.trim(),
        current_odo: parseInt(currentOdo, 10) || 0,
        cost: parseFloat(String(cost).replace(",", ".")) || 0.0,
        service_date: isoDate,
      };

      await api.put(`/services/${id}`, payload);

      router.push("/services");
    } catch (error: any) {
      console.error("Erro ao editar serviço:", error);
      const serverMessage = error.response?.data?.error || error.message || "Erro ao atualizar serviço.";
      alert(`Não foi possível salvar: ${serverMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-sans">
        <p className="text-sm text-zinc-500 animate-pulse">Loading service data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-blue-500/30">
      <PageNavHeader pageTitle="Edit Service" lastPage="/services" />

      <main className="space-y-8 pb-40 mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <MainInput
            label="Service Type"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <MainInput
            label="Provider / Workshop"
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <div className="w-full relative">
            <MainInput
              label="Total Cost"
              type="text"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="w-full relative">
            <MainInput
              label="Current Odometer"
              type="number"
              value={currentOdo}
              onChange={(e) => setCurrentOdo(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <span className="absolute bottom-4 right-5 text-zinc-500 font-bold text-xs uppercase tracking-tighter pointer-events-none">
              KM
            </span>
          </div>

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

          <MainTextArea
            label="Notes"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <SaveButton title={isSubmitting ? "Updating Service..." : "Update Service"} />
        </form>
      </main>
    </div>
  );
};

export default EditServicePage;