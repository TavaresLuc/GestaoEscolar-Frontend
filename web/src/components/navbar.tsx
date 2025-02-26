"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Ícones de menu hambúrguer e fechar
import { Button } from "@/components/button";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    console.log("Usuário deslogado!");
    router.push("/");
  };

  return (
    <nav className="bg-gray-800 text-white w-full fixed top-0 left-0 z-50">
      <div className="max-w-[1240px] mx-auto flex justify-between items-center px-5 py-4">
        {/* Logo */}
        <h1 className="text-xl font-bold text-blue">Tavares School</h1>

        {/* Menu Desktop */}
        <ul className="hidden md:flex gap-6">

          <li>
            <Button
              onClick={handleLogout}
              className="bg-red-600 px-12 py-2 rounded-md hover:bg-red-500 transition cursor-pointer"
            >
              Sair
            </Button>
          </li>
        </ul>

        {/* Botão Hambúrguer para Mobile */}
        <Button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </Button>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <ul className="md:hidden flex flex-col gap-4 bg-gray-900 py-4">
          <li>
          </li>
          <li>
            <Button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full bg-red-600 py-2 rounded-md hover:bg-red-500 transition text-center"
            >
              Sair
            </Button>
          </li>
        </ul>
      )}
    </nav>
  );
}
