"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/button";
import { Pencil, Trash, Plus, PlusCircle } from "lucide-react";
import ModalCreate from "./ModalCreate";
import ModalEditAluno from "./modalEdit/modalEditAluno";
import ModalEditCurso from "./modalEdit/modalEditCurso";
import ModalAddCurso from "./modalEdit/modalAddCurso";
import type { Curso, Aluno, Matricula } from "@/types/types";
import { showToast } from "./ToastResponse";

interface ListagemProps {
  data: Curso[] | Aluno[] | Matricula[];
  activeTab: "cursos" | "alunos" | "matricula";
  onDelete: (id: string) => void;
  fetchData: () => Promise<void>;
}

export default function Listagem({ data, activeTab, onDelete, fetchData }: ListagemProps) {
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalAddCursoOpen, setModalAddCursoOpen] = useState(false); 
  const [registroAtual, setRegistroAtual] = useState<Curso | Aluno | Matricula | null>(null);
  const [matriculasAluno, setMatriculasAluno] = useState<{ [alunoId: string]: Matricula[] }>({});
  const [expandirCursos, setExpandirCursos] = useState<{ [alunoId: string]: boolean }>({});
  const [expandirAlunos, setExpandirAlunos] = useState<{ [cursoId: string]: boolean }>({});
  const [alunosPorCurso, setAlunosPorCurso] = useState<{ [cursoId: string]: Aluno[] }>({});


  const API_BASE_URL = "https://localhost:7194/api";
  
  useEffect(() => {
    if (activeTab === "alunos") {
      const fetchMatriculas = async () => {
        try {
          const matriculasMap: { [alunoId: string]: Matricula[] } = {};
  
          for (const aluno of data as Aluno[]) {
            try {
              const response = await fetch(`${API_BASE_URL}/matricula/aluno/${aluno.id}`);
              if (!response.ok) {
                if (response.status === 404) {
                  matriculasMap[aluno.id] = [];
                  continue;
                }
                throw new Error(`Erro ao buscar matrículas para o aluno ${aluno.id}`);
              }
  
              const matriculas = await response.json();
              matriculasMap[aluno.id] = matriculas.$values ?? [];
            } catch (error) {
              console.error(`Erro ao buscar matrículas para o aluno ${aluno.id}:`, error);
              matriculasMap[aluno.id] = [];
            }
          }
  
          setMatriculasAluno(matriculasMap);
        } catch (error) {
          console.error("Erro ao carregar matrículas:", error);
        }
      };
  
      fetchMatriculas();
    }
  
    if (activeTab === "cursos") {
      const fetchAlunosPorCurso = async () => {
        try {
          const alunosMap: { [cursoId: string]: Aluno[] } = {};
  
          for (const curso of data as Curso[]) {
            try {
              const response = await fetch(`${API_BASE_URL}/matricula/curso/${curso.id}`);
              if (!response.ok) {
                if (response.status === 404) {
                  alunosMap[curso.id] = [];
                  continue;
                }
                throw new Error(`Erro ao buscar alunos para o curso ${curso.id}`);
              }
  
              const matriculas = await response.json();
              alunosMap[curso.id] = matriculas.$values.map((matricula: Matricula) => matricula.aluno) ?? [];
            } catch (error) {
              console.error(`Erro ao buscar alunos para o curso ${curso.id}:`, error);
              alunosMap[curso.id] = [];
            }
          }
  
          setAlunosPorCurso(alunosMap);
        } catch (error) {
          console.error("Erro ao carregar alunos por curso:", error);
        }
      };
  
      fetchAlunosPorCurso();
    }
  }, [activeTab, data]);
  
  //  Remove a matrícula do aluno no curso selecionado
  const handleDeleteMatricula = async (alunoId: string, cursoId: string) => {
    if (!window.confirm("Tem certeza que deseja remover esta matrícula?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/matricula/remover/${alunoId}/${cursoId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao remover matrícula");
      }

      showToast("Matrícula removida com sucesso! ✅", "success");

      // Atualiza os dados após remoção
      fetchData();
    } catch (error) {
      showToast("Erro ao remover matrícula! ❌", "error");
      console.error("Erro ao remover matrícula:", error);
    }
  };

  // Expandir listagem de curso
  const toggleExpandirCursos = (alunoId: string) => {
    setExpandirCursos((prev) => ({
      ...prev,
      [alunoId]: !prev[alunoId],
    }));
  };
  
  return (
    <div className="bg-white rounded-2xl p-6 w-full max-w-4xl min-w-[50%] shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Lista de {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h2>

        <Button
          className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition"
          onClick={() => setModalCreateOpen(true)}
        >
          <Plus size={18} /> Novo Registro
        </Button>
      </div>

      {data.length > 0 ? (
        <ul className="space-y-4">
          {data.map((item) => (
            <li
              key={item.id}
              className="bg-gray-100 p-4 rounded-lg flex justify-between items-center shadow-sm border border-gray-300"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {activeTab === "cursos"
                    ? (item as Curso).nome
                    : activeTab === "alunos"
                    ? (item as Aluno).nome
                    : (item as Matricula).aluno?.nome}
                </h3>

                {activeTab === "cursos" && (
                <>
                  <p className="text-sm text-gray-600">
                    <span className="text-gray-800 font-medium">Descrição:</span> {(item as Curso).descricao}
                  </p>

                  {/* ✅ Exibe alunos matriculados no curso, com opção de expandir/recolher */}
                  {alunosPorCurso[item.id]?.length > 0 && (
                    <div className="mt-2">
                  <Button
                    className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-md"
                    onClick={() => setExpandirAlunos((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                  >
                    {expandirAlunos[item.id] ? "Ocultar Alunos" : "Exibir Alunos"}
                  </Button>


                      {expandirAlunos[item.id] && (
                        <ul className="mt-2 space-y-1">
                          {alunosPorCurso[item.id].map((aluno) => (
                            <li
                              key={aluno.id}
                              className="flex justify-between items-center bg-gray-200 p-2 rounded-md"
                            >
                              <span className="text-sm text-gray-800">{aluno.nome}</span>
                              <Button
                                className="ml-16 cursor-pointer text-red-500 hover:text-red-700 text-sm font-medium"
                                onClick={() => handleDeleteMatricula(aluno.id, item.id)}
                              >
                                Remover
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </>
              )}

                {activeTab === "alunos" && (
                  <>
                    <p className="text-sm text-gray-600">
                      <span className="text-gray-800 font-medium">E-mail:</span> {(item as Aluno).email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="text-gray-800 font-medium">Data de Nascimento:</span>{" "}
                      {new Date((item as Aluno).dataNascimento).toLocaleDateString("pt-BR")}
                    </p>

                    {/* Exibe os cursos matriculados do aluno */} 
                    {matriculasAluno[item.id]?.length > 0 && (
                      <div className="mt-2">
                      <Button
                        className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-md"
                        onClick={() => toggleExpandirCursos(item.id)}
                      >
                        {expandirCursos[item.id] ? "Ocultar Cursos" : "Exibir Cursos"}
                      </Button>
                        {expandirCursos[item.id] && (
                          <ul className="mt-2 space-y-1">
                            {matriculasAluno[item.id].map((matricula) => (
                              <li
                                key={matricula.id}
                                className="flex justify-between items-center bg-gray-200 p-2 rounded-md"
                              >
                                <span className="text-sm text-gray-800">{matricula.curso.nome}</span>
                                <Button
                                  className="cursor-pointer text-red-500 hover:text-red-700 text-sm font-medium"
                                  onClick={() => handleDeleteMatricula(matricula.alunoId, matricula.cursoId)}
                                >
                                  Remover
                                </Button>
                              </li>
                            ))}
                          </ul>
                        )}
                          </div>
                        )}

                  </>
                )}
              </div>


              <div className="flex items-center gap-3">
              {/* O botão "Adicionar Curso" só aparece para alunos */}
              {activeTab === "alunos" && (
                <Button
                  className="cursor-pointer p-2 bg-green-500 hover:bg-green-600 rounded-md"
                  title="Adicionar Curso"
                  onClick={() => {
                    setRegistroAtual(item);
                    setModalAddCursoOpen(true);
                  }}
                >
                  <PlusCircle size={18} className="text-white" />
                </Button>
              )}

              {/* O botão "Editar" aparece em todas as abas */}
              <Button
                className="cursor-pointer p-2 bg-blue-500 hover:bg-blue-600 rounded-md"
                title="Editar"
                onClick={() => {
                  setRegistroAtual(item);
                  setModalEditOpen(true);
                }}
              >
                <Pencil size={18} className="text-white" />
              </Button>

              {/* O botão "Excluir" aparece em todas as abas */}
              <Button
                className="cursor-pointer p-2 bg-red-500 hover:bg-red-600 rounded-md"
                title="Excluir"
                onClick={() => onDelete(item.id)}
              >
                <Trash size={18} className="text-white" />
              </Button>
            </div>

            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">Nenhum dado encontrado.</p>
      )}

{/* Modais */}
{modalEditOpen && registroAtual && (
  activeTab === "cursos" ? (
    <ModalEditCurso
      isOpen={modalEditOpen}
      onClose={() => {
        setModalEditOpen(false);
        fetchData();
      }}
      registroAtual={registroAtual as Curso}
    />
  ) : activeTab === "alunos" ? (
    <ModalEditAluno
      isOpen={modalEditOpen}
      onClose={() => {
        setModalEditOpen(false);
        fetchData();
      }}
      registroAtual={registroAtual as Aluno}
    />
  ) : null
)}




        <ModalCreate
          isOpen={modalCreateOpen}
          onClose={() => {
            setModalCreateOpen(false);
            fetchData(); // ✅ Atualiza os dados ao fechar
          }}
          activeTab={activeTab}
        />


      {registroAtual && modalAddCursoOpen && (
        <ModalAddCurso isOpen={modalAddCursoOpen}
         onClose={() =>{
           setModalAddCursoOpen(false);
           fetchData();
          }} aluno={registroAtual as Aluno} />
      )}
    </div>
  );
}
