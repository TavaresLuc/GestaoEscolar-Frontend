// src/types.ts

export interface Curso {
    id: string;
    nome: string;
    descricao: string;
  }
  
  export interface Aluno {
    id: string;
    nome: string;
    email: string;
    dataNascimento: string;
  }
  
  export interface Matricula {
    id: string;
    alunoId: string;
    cursoId: string;
    aluno: Aluno;
    curso: Curso;
    dataMatricula: string;
  }
  