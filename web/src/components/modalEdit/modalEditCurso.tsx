"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/button";
import { showToast } from "../ToastResponse";
import type { Curso } from "@/types/types";

interface ModalEditCursoProps {
  isOpen: boolean;
  onClose: () => void;
  registroAtual: Curso | null;
}

export default function ModalEditCurso({ isOpen, onClose, registroAtual }: ModalEditCursoProps) {
  if (!isOpen || !registroAtual) return null;

  const [formData, setFormData] = useState<Curso>({ ...registroAtual });

  const API_BASE_URL = "https://localhost:7194/api";

  useEffect(() => {
    if (registroAtual) {
      setFormData({ ...registroAtual });
    }
  }, [registroAtual]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("📢 Enviando atualização do curso:", JSON.stringify(formData, null, 2));

      const response = await fetch(`${API_BASE_URL}/curso/update/${registroAtual.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      showToast("Curso atualizado com sucesso! ✅", "success");

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      showToast("Erro ao atualizar curso! ❌", "error");
      console.error("Erro ao atualizar curso:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Editar Curso</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            id="nome"
            type="text"
            name="nome"
            value={formData.nome || ""}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900"
          />

          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao || ""}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900"
          />

          <div className="flex justify-end gap-3">
            <Button type="button" className="bg-gray-300 px-4 py-2 rounded-md cursor-pointer" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-blue-600 px-4 py-2 rounded-md text-white cursor-pointer">Atualizar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
