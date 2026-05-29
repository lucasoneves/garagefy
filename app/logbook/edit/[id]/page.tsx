"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { BiCamera as CameraIcon, BiTrash, BiFile } from "react-icons/bi";
import PageNavHeader from "@/components/PageNavHeader";
import SaveButton from "@/components/SaveButton";
import MainInput from "@/components/ui/MainInput";
import MainTextArea from "@/components/ui/MainTextArea";
import FilterTab, { FilterOption } from "@/components/ui/FilterTab";
import Image from "next/image";

type Category = "Observation" | "Reminder" | "To-do";

const categoryOptions: FilterOption[] = [
  { value: "Observation", label: "Observation" },
  { value: "Reminder", label: "Reminder" },
  { value: "To-do", label: "To-do" },
];

const MOCK_VEHICLE_ID = "c303282d-f2e6-48ec-a34d-16be2e68407a";

const EditLogbookEntryPage = () => {
  const router = useRouter();
  const { id } = useParams(); // Captura o ID do registro vindo da URL da rota

  const [category, setCategory] = useState<Category>("Observation");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Carrega os dados antigos do registro para preencher o formulário
  useEffect(() => {
    const loadEntryData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/vehicles/${MOCK_VEHICLE_ID}/logbook/${id}`
        );
        if (!response.ok) throw new Error("Registro não encontrado");
        
        const data = await response.json();
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        
        if (data.attachment_url) {
          setPreviewUrl(`http://localhost:8080${data.attachment_url}`);
        }
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar dados do registro.");
        router.push("/logbook");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadEntryData();
  }, [id, router]);

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
      // Se era uma URL local Blob, revoga. Se era o link da API, só limpa o estado.
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      // Requisição PUT atualizando o ID específico
      const response = await fetch(
        `http://localhost:8080/api/vehicles/${MOCK_VEHICLE_ID}/logbook/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Erro ao atualizar o registro.");

      router.push("/logbook");
    } catch (error) {
      console.error(error);
      alert("Houve um erro ao atualizar o registro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
        <p className="text-sm text-zinc-500 text-center py-20">Loading entry data...</p>
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
        {/* Seletor de Categoria */}
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
          className="min-h-[140px]"
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
        {!previewUrl && !selectedFile ? (
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
              Replace image or receipt
            </span>
          </button>
        ) : (
          /* Preview do arquivo antigo ou do novo selecionado */
          <div className="w-full flex items-center justify-between p-3 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl">
            <div className="flex items-center gap-3 min-w-0">
              {previewUrl && !selectedFile ? (
                // Se for a imagem antiga vinda do back-end
                <Image 
                  src={previewUrl} 
                  width={48}
                  height={48}
                  alt="Current attachment" 
                  className="w-12 h-12 object-cover rounded-xl border border-zinc-800/80"
                />
              ) : selectedFile?.type.startsWith("image/") && previewUrl ? (
                // Se for a nova imagem selecionada localmente
                <Image 
                  width={48}
                  height={48}
                  src={previewUrl} 
                  alt="New attachment preview" 
                  className="w-12 h-12 object-cover rounded-xl border border-zinc-800/80"
                />
              ) : (
                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800/40 text-blue-400">
                  <BiFile size={22} />
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-zinc-200 truncate pr-2">
                  {selectedFile ? selectedFile.name : "Current Attachment File"}
                </span>
                {selectedFile && (
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                )}
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

        <SaveButton title={isSubmitting ? "Updating..." : "Update Entry"} />
      </form>
    </div>
  );
};

export default EditLogbookEntryPage;