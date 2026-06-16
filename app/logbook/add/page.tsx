"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import PageNavHeader from "@/components/PageNavHeader";
import SaveButton from "@/components/SaveButton";
import MainInput from "@/components/ui/MainInput";
import FilterTab, { FilterOption } from "@/components/ui/FilterTab";
import MainTextArea from "@/components/ui/MainTextArea";
import PageDescription from "@/components/ui/PageDescription";

type Category = "Observation" | "Reminder" | "To-do";

const AddLogbookEntryPage = () => {
  const router = useRouter();
  const categoryOptions: FilterOption[] = [
    { value: "Observation", label: "Observation" },
    { value: "Reminder", label: "Reminder" },
    { value: "To-do", label: "To-do" },
  ];
  const [vehicleId, setVehicleId] = useState<string | null>(null);

  const [category, setCategory] = useState<Category>("Observation");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedVehicleId = localStorage.getItem("@garagefy:active_vehicle_id");
    if (!savedVehicleId) {
      alert("Nenhum veículo ativo selecionado. Escolha um carro na Garagem primeiro.");
      router.push("/my-garage");
    } else {
      setVehicleId(savedVehicleId);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || !vehicleId) return;

    setIsSubmitting(true);

    try {
      await api.post(`/vehicles/${vehicleId}/logbook`, {
        title: title.trim(),
        description: description.trim(),
        category,
      });

      router.push("/logbook");
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Houve um erro ao salvar o registro. Verifique o terminal da API.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!vehicleId) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-sans">
        <p className="text-zinc-500 text-sm animate-pulse">Verificando garagem...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-32 font-sans selection:bg-blue-500/30">
      <PageNavHeader pageTitle="New Entry" lastPage="/logbook" />

      <PageDescription
        pageTitle="New Logbook Entry"
        pageDescription="Create a new entry in the vehicle logbook"
      />

      <form
        onSubmit={handleSubmit}
        className="bg-[#121212] border border-zinc-900/60 rounded-[2.5rem] mt-10 p-6 space-y-6"
      >
        <FilterTab
          options={categoryOptions}
          selectedValue={category}
          onChange={(value) => setCategory(value as Category)}
          size="small"
        />

        <MainInput
          label="Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Oil level check"
          required
          disabled={isSubmitting}
        />

        <MainTextArea
          label="Notes / Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write your observation here..."
          rows={5}
          className="min-h-35"
          disabled={isSubmitting}
        />

        <SaveButton title={isSubmitting ? "Saving..." : "Save Entry"} />
      </form>
    </div>
  );
};

export default AddLogbookEntryPage;
