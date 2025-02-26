"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/button";
import { showToast } from "../ToastResponse";
import type { Aluno, Curso, Matricula } from "@/types/types";

interface ModalEditAlunoProps {
  isOpen: boolean;
  onClose: () => void;
  registroAtual: Aluno | null;
}

export default function ModalEditAluno({ isOpen, onClose, registroAtual }: ModalEditAlunoProps) {
  if (!isOpen || !registroAtual) return null;

  const [formData, setFormData] = useState<Aluno>({ ...registroAtual });
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [matriculaAtual, setMatriculaAtual] = useState<Matricula | null>(null);
  const [cursoSelecionado, setCursoSelecionado] = useState<string>("");

  const API_BASE_URL = "https://localhost:7194/api";

  // ✅ Carrega os cursos disponíveis ao abrir o modal
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

  // ✅ Carrega a matrícula do aluno (se existir)
  useEffect(() => {
    const fetchMatricula = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/matricula/aluno/${registroAtual.id}`);
        if (!response.ok) return;
        const data = await response.json();
        setMatriculaAtual(data);
        setCursoSelecionado(data.cursoId || "");
      } catch (error) {
        console.error("Erro ao carregar matrícula:", error);
      }
    };

    fetchMatricula();
  }, [registroAtual]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "cursoId") {
      setCursoSelecionado(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  

  const calcularIdade = (dataNascimento: string): number => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    if (
      nascimento.getMonth() > hoje.getMonth() ||
      (nascimento.getMonth() === hoje.getMonth() && nascimento.getDate() > hoje.getDate())
    ) {
      idade--;
    }
    return idade;
  };

  const formatarData = (data: string): string => {
    return new Date(data).toISOString().split("T")[0]; // Formata a data para YYYY-MM-DD sem erro de timezone
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
  
    const idade = calcularIdade((formData as Aluno).dataNascimento);
    if (idade < 18) {
      showToast("Erro: O aluno deve ter no mínimo 18 anos! ❌", "error");
      return;
    }
  
    try {
      console.log("📢 Enviando atualização de aluno:", JSON.stringify(formData, null, 2));
  
      // ✅ Atualiza os dados do aluno normalmente
      const response = await fetch(`${API_BASE_URL}/aluno/update/${registroAtual.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
  
      showToast("Aluno atualizado com sucesso! ✅", "success");
    } catch (error) {
      showToast("Erro ao atualizar aluno! ❌", "error");
      console.error("Erro ao atualizar aluno:", error);
      return;
    }
  
    if (cursoSelecionado) { 
        try {
          console.log("📢 Criando nova matrícula:", { alunoId: registroAtual.id, cursoId: cursoSelecionado });
      
          // ✅ Apenas adicionamos uma nova matrícula se um curso for selecionado
          const postResponse = await fetch(`${API_BASE_URL}/matricula`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ alunoId: registroAtual.id, cursoId: cursoSelecionado }),
          });
      
          if (!postResponse.ok) throw new Error(`Erro HTTP: ${postResponse.status}`);
          showToast("Nova matrícula criada com sucesso! ✅", "success");
      
        } catch (error) {
          showToast("Erro ao processar matrícula! ❌", "error");
          console.error("Erro ao processar matrícula:", error);
        }
      } else {
        console.log("⚠️ Nenhum curso selecionado. Matrícula não foi criada.");
      }
      
  
    setTimeout(() => {
      onClose();
    }, 2000);
  };
  

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Editar Aluno</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            id="nome"
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900 cursor-pointer"
          />

          <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900 cursor-pointer"
          />

          <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
          <input
            id="dataNascimento"
            type="date"
            name="dataNascimento"
            value={formatarData(formData.dataNascimento)}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900 cursor-pointer"
          />

          

          <div className="flex justify-end gap-3">
            <Button type="button" className="bg-gray-300 px-4 py-2 rounded-md cursor-pointer" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 px-4 py-2 rounded-md text-white cursor-pointer">
              Atualizar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
