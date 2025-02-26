"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { showToast } from "./ToastResponse";
import type { Curso, Aluno, Matricula } from "@/types/types";

interface ModalCreateProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: "cursos" | "alunos" | "matricula";
}


export default function ModalCreate({ isOpen, onClose, activeTab }: ModalCreateProps) {
  if (!isOpen) return null;

  

  const [formData, setFormData] = useState<Curso | Aluno | Matricula>(() => {
    if (activeTab === "cursos") return { nome: "", descricao: "" } as Curso;
    if (activeTab === "alunos") return { id: "", nome: "", email: "", dataNascimento: "" } as Aluno;
    return { id: "", alunoId: "", cursoId: "", dataMatricula: "" } as Matricula;
  });

  const API_BASE_URL = "https://localhost:7194/api";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calcularIdade = (dataNascimento: string): number => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();

    if (mesNascimento > mesAtual || (mesNascimento === mesAtual && nascimento.getDate() > hoje.getDate())) {
      idade--;
    }
    return idade;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação: impede o cadastro de alunos menores de 18 anos
    if (activeTab === "alunos") {
      const idade = calcularIdade((formData as Aluno).dataNascimento);
      if (idade < 18) {
        showToast("Erro: O aluno deve ter no mínimo 18 anos! ❌", "error");
        return;
      }
    }

    const apiEndpoint = activeTab === "cursos" ? "curso" : activeTab === "alunos" ? "aluno" : "matricula";

    console.log("📢 Dados sendo enviados:", JSON.stringify(formData, null, 2)); // ✅ Adicionando console.log()

    try {
      const response = await fetch(`${API_BASE_URL}/${apiEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("❌ Erro da API:", errorResponse);
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      showToast("Registro criado com sucesso! ✅", "success");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      showToast("Erro ao criar registro! ❌", "error");
      console.error("❌ Erro ao enviar requisição:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Criar Novo {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(activeTab === "cursos" || activeTab === "alunos") && (
            <>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                id="nome"
                type="text"
                name="nome"
                value={(formData as Curso | Aluno).nome || ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}

          {activeTab === "cursos" && (
            <>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                value={(formData as Curso).descricao || ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}

          {activeTab === "alunos" && (
            <>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                id="email"
                type="email"
                name="email"
                value={(formData as Aluno).email || ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
              <input
                id="dataNascimento"
                type="date"
                name="dataNascimento"
                value={(formData as Aluno).dataNascimento || ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}

          {activeTab === "matricula" && (
            <>
              <label htmlFor="alunoId" className="block text-sm font-medium text-gray-700">ID do Aluno</label>
              <input
                id="alunoId"
                type="text"
                name="alunoId"
                value={(formData as Matricula).alunoId || ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label htmlFor="cursoId" className="block text-sm font-medium text-gray-700">ID do Curso</label>
              <input
                id="cursoId"
                type="text"
                name="cursoId"
                value={(formData as Matricula).cursoId || ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" className="cursor-pointer bg-gray-300 text-gray-800 px-4 py-2 rounded-md" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
