"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BiCamera as CameraIcon, BiTrash, BiFile } from "react-icons/bi";
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
  // Estado dinâmico para substituir o MOCK_VEHICLE_ID antigo
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  
  const [category, setCategory] = useState<Category>("Observation");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  // Estados para controle do arquivo e feedback de envio
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Busca dinamicamente o UUID do carro ativo no carregamento do componente
  useEffect(() => {
    const savedVehicleId = localStorage.getItem("@garagefy:active_vehicle_id");
    if (!savedVehicleId) {
      alert("Nenhum veículo ativo selecionado. Escolha um carro na Garagem primeiro.");
      router.push("/my-garage");
    } else {
      setVehicleId(savedVehicleId);
    }
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || !vehicleId) return;

    setIsSubmitting(true);

    try {
      // Instanciando o FormData para transmissão Multipart (necessário para o c.FormFile do Go)
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      // 2. Transmissão batendo na rota dinâmica injetando o vehicleId real
      const response = await fetch(`http://localhost:8080/api/vehicles/${vehicleId}/logbook`, {
        method: "POST",
        body: formData, // O próprio navegador configura o Content-Type correto com o boundary
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar o registro no servidor.");
      }

      const data = await response.json();
      console.log("Sucesso ao salvar:", data);

      // Redireciona de volta para a listagem do Logbook após o sucesso
      router.push("/logbook");
      
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Houve um erro ao salvar o registro. Verifique o terminal da API.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trava a renderização do formulário se o ID ainda não estiver na memória
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
        {/* Seletor de Categoria */}
        <FilterTab
            options={categoryOptions}
            selectedValue={category}
            onChange={(value) => setCategory(value as Category)}
            size="small"
          />
        

        {/* Campo de Entrada: Title */}
        <MainInput
          label="Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Oil level check"
          required
          disabled={isSubmitting}
        />

        {/* Campo de Texto Expandido: Notes / Description */}
        <MainTextArea
          label="Notes / Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write your observation here..."
          rows={5}
          className="min-h-35"
          required
          disabled={isSubmitting}
        />

        <div className="w-full h-px bg-zinc-900/60 my-2"></div>

        {/* Input de arquivo nativo escondido */}
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,application/pdf"
          className="hidden"
          disabled={isSubmitting}
        />

        {/* Gatilho de Upload Dinâmico */}
        {!selectedFile ? (
          <button
            type="button"
            onClick={handleTriggerUpload}
            disabled={isSubmitting}
            className="w-full flex items-center gap-3 py-2 text-zinc-400 hover:text-zinc-200 transition-colors group text-left disabled:opacity-50"
          >
            <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800/40 group-hover:bg-zinc-800 transition-colors">
              <CameraIcon size={18} />
            </div>
            <span className="text-xs font-bold tracking-wide">
              Attach image or receipt
            </span>
          </button>
        ) : (
          /* Estado com Arquivo Selecionado (Preview) */
          <div className="w-full flex items-center justify-between p-3 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl">
            <div className="flex items-center gap-3 min-w-0">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={previewUrl} 
                  alt="Attachment preview" 
                  className="w-12 h-12 object-cover rounded-xl border border-zinc-800/80"
                />
              ) : (
                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800/40 text-blue-400">
                  <BiFile size={22} />
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-zinc-200 truncate pr-2">
                  {selectedFile.name}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveFile}
              disabled={isSubmitting}
              className="p-3 text-zinc-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl border border-transparent hover:border-red-500/10 transition-all shrink-0 disabled:opacity-50"
              title="Remove attachment"
            >
              <BiTrash size={18} />
            </button>
          </div>
        )}

        <SaveButton title={isSubmitting ? "Saving..." : "Save Entry"} />
      </form>
    </div>
  );
};

export default AddLogbookEntryPage;