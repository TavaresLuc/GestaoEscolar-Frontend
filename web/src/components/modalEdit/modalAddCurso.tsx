"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/button";
import { showToast } from "../ToastResponse";
import type { Aluno, Curso } from "@/types/types";

interface ModalAddCursoProps {
  isOpen: boolean;
  onClose: () => void;
  aluno: Aluno;
}

export default function ModalAddCurso({ isOpen, onClose, aluno }: ModalAddCursoProps) {
  if (!isOpen) return null;

  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoSelecionado, setCursoSelecionado] = useState<string>("");
  const API_BASE_URL = "https://localhost:7194/api";

  // ✅ Carrega todos os cursos disponíveis
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/curso`);
        if (!response.ok) throw new Error("Erro ao buscar cursos");
        const data = await response.json();
        setCursos(data.$values ?? []);
      } catch (error) {
        console.error("Erro ao carregar cursos:", error);
      }
    };

    fetchCursos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cursoSelecionado) {
      showToast("Erro: Selecione um curso! ❌", "error");
      return;
    }

    try {
      console.log("📢 Criando nova matrícula:", { alunoId: aluno.id, cursoId: cursoSelecionado });

      const response = await fetch(`${API_BASE_URL}/matricula`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alunoId: aluno.id, cursoId: cursoSelecionado }),
      });

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      showToast("Aluno matriculado com sucesso! ✅", "success");

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      showToast("Erro ao processar matrícula! ❌", "error");
      console.error("Erro ao processar matrícula:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Adicionar Curso para {aluno.nome}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="cursoId" className="block text-sm font-medium text-gray-700">
            Selecione um curso
          </label>
          <select
            id="cursoId"
            name="cursoId"
            value={cursoSelecionado}
            onChange={(e) => setCursoSelecionado(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900"
          >
            <option value="">Escolha um curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nome}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-3">
            <Button type="button" className="cursor-pointer bg-gray-300 text-gray-800 px-4 py-2 rounded-md" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Matricular
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
