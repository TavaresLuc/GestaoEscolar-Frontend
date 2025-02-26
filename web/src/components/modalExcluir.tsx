"use client";

import { Button } from "./button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export default function ModalExcluir({ isOpen, onClose, onConfirm, title, description }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-600 mt-2">{description}</p>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            onClick={onClose}
            className=" cursor-pointer px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Confirmar
          </Button>
        </div>S
      </div>
    </div>
  );
}
