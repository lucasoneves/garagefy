"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import PageNavHeader from "@/components/PageNavHeader";
import SaveButton from "@/components/SaveButton";
import MainInput from "@/components/ui/MainInput";
import MainTextArea from "@/components/ui/MainTextArea";
import FilterTab, { FilterOption } from "@/components/ui/FilterTab";

type Category = "Observation" | "Reminder" | "To-do";

const categoryOptions: FilterOption[] = [
  { value: "Observation", label: "Observation" },
  { value: "Reminder", label: "Reminder" },
  { value: "To-do", label: "To-do" },
];

const EditLogbookEntryPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [vehicleId, setVehicleId] = useState<string | null>(null);

  const [category, setCategory] = useState<Category>("Observation");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const loadEntryData = async () => {
      if (!vehicleId || !id) return;

      try {
        const response = await api.get(`/vehicles/${vehicleId}/logbook/${id}`);
        const data = response.data;
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar dados do registro.");
        router.push("/logbook");
      } finally {
        setLoading(false);
      }
    };

    loadEntryData();
  }, [id, vehicleId, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || !vehicleId) return;

    setIsSubmitting(true);

    try {
      await api.put(`/vehicles/${vehicleId}/logbook/${id}`, {
        title: title.trim(),
        description: description.trim(),
        category,
      });

      router.push("/logbook");
    } catch (error) {
      console.error(error);
      alert("Houve um erro ao atualizar o registro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !vehicleId) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex items-center justify-center">
        <p className="text-sm text-zinc-500 text-center animate-pulse">Loading entry data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-32 font-sans selection:bg-blue-500/30">
      <PageNavHeader pageTitle="Edit Entry" lastPage="/logbook" />

      <div className="mt-4 px-1">
        <span className="text-xl font-black py-1 rounded-md w-max mb-1 block">
          Modify Entry
        </span>
        <p className="text-sm text-zinc-400 font-medium">
          Update vehicle log record information
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#121212] border border-zinc-900/60 rounded-[2.5rem] mt-10 p-6 space-y-6"
      >
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase block pl-1">
            Category
          </label>
          <FilterTab
            options={categoryOptions}
            selectedValue={category}
            onChange={(value) => setCategory(value as Category)}
            size="small"
          />
        </div>

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
          className="min-h-[140px]"
          disabled={isSubmitting}
        />

        <SaveButton title={isSubmitting ? "Updating..." : "Update Entry"} />
      </form>
    </div>
  );
};

export default EditLogbookEntryPage;
