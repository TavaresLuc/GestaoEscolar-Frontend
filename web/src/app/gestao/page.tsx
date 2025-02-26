"use client";

import Navbar from "@/components/navbar";
import Listagem from "@/components/listagem";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/button";
import ModalExcluir from "@/components/modalExcluir";

// Tipos dos dados
interface Curso {
  id: string;
  nome: string;
  descricao: string;
}

interface Aluno {
  id: string;
  nome: string;
  email: string;
  dataNascimento: string;
}

interface Matricula {
  id: string;
  alunoId: string;
  cursoId: string;
  aluno: Aluno;
  curso: Curso;
  dataMatricula: string;
}

export default function Gestao() {
  const [activeTab, setActiveTab] = useState<"cursos" | "alunos" | "matricula">("cursos");
  const [data, setData] = useState<Curso[] | Aluno[] | Matricula[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // URL base da API
  const API_BASE_URL = "https://localhost:7194/api";

  // ✅ Atualiza a listagem de dados com base na aba ativa
  const fetchData = useCallback(async () => {
    const apiEndpoint = activeTab === "cursos" ? "curso" : activeTab === "alunos" ? "aluno" : "matricula";

    try {
      const response = await fetch(`${API_BASE_URL}/${apiEndpoint}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log(`📢 Dados recebidos de ${apiEndpoint}:`, result);

      // Define o tipo correto para `data`
      if (activeTab === "cursos") {
        setData(result?.$values ?? [] as Curso[]);
      } else if (activeTab === "alunos") {
        setData(result?.$values ?? [] as Aluno[]);
      } else {
        setData(result?.$values ?? [] as Matricula[]);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setData([]); // Garante que `data` não fique indefinido
    }
  }, [activeTab]);

  // ✅ Atualiza os dados sempre que a aba mudar
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ Função para abrir o modal de exclusão
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  // ✅ Função para confirmar a exclusão
  const handleDelete = async () => {
    if (!deleteId) return;

    const apiEndpoint = activeTab === "cursos" ? "curso" : activeTab === "alunos" ? "aluno" : "matricula";

    try {
      const response = await fetch(`${API_BASE_URL}/${apiEndpoint}/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      setModalOpen(false);
      setDeleteId(null);
      fetchData(); // ✅ Atualiza a listagem após exclusão
    } catch (error) {
      console.error("Erro ao excluir item:", error);
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar />

      <div className="min-w-[50%] flex flex-col items-center flex-grow pt-20 px-5 max-w-[1240px] mx-auto">
        <h1 className="text-4xl font-heading font-semibold text-blue md:text-7xl text-center">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h1>

        {/* ✅ Botões de troca de seção */}
        <div className="flex gap-4 my-6">
          <Button onClick={() => setActiveTab("cursos")} className={`px-6 py-2 rounded-md cursor-pointer ${activeTab === "cursos" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}>
            Cursos
          </Button>
          <Button onClick={() => setActiveTab("alunos")} className={`px-6 py-2 rounded-md cursor-pointer ${activeTab === "alunos" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}>
            Alunos
          </Button>
        </div>

        {/* ✅ Listagem de itens + Modal de Novo Registro */}
        <Listagem data={data} activeTab={activeTab} onDelete={openDeleteModal} fetchData={fetchData} />

        {/* ✅ Modal de Confirmação de Exclusão */}
        <ModalExcluir
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleDelete}
          title="Confirmar Exclusão"
          description="Tem certeza que deseja excluir este item? Essa ação não pode ser desfeita."
        />
      </div>
    </main>
  );
}
