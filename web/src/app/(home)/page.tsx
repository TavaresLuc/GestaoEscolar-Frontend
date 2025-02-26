"use client";

import { ArrowRight, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/button'
import { InputField, InputIcon, InputRoot } from '@/components/Input'
import { useRouter } from 'next/navigation' 

export default function Home() {
  const router = useRouter()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault() 
    router.push('/gestao') 
  }

  return (
    <main className="max-w-[1240px] mx-auto px-5 py-8 md:py-0">
      <div className="min-h-dvh flex flex-col justify-center gap-16">
        <div className="flex flex-col gap-8 items-center md:items-start">
          <h1 className="text-4xl text-center leading-none font-heading font-medium flex flex-col md:text-7xl md:text-left">
            <span className="text-blue">Tavares School 🚀</span> De Dev, para Devs.
          </h1>
        </div>

        <div className="flex gap-5 items-stretch flex-col md:flex-row">
          <div className="flex-1 bg-gray-700 border border-gray-600 rounded-2xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-gray-200 text-xl">
                Sobre a Tavares School
              </h2>
              <span className="flex items-center gap-2 text-purple font-semibold text-xs">
                + 5000 ALUNOS
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              Tavares School é uma plataforma virtual inovadora, criada por desenvolvedores, 
              para desenvolvedores. Com o objetivo de conectar pessoas apaixonadas por tecnologia e aprendizado, ela oferece cursos online, 
              gratuitos e para sempre, sobre as últimas tendências em desenvolvimento de software, arquitetura de sistemas, e as tecnologias 
              emergentes que estão moldando o futuro da indústria.
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              Online & Gratuito. Para Sempre.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full bg-gray-700 border border-gray-600 rounded-2xl p-8 space-y-6 md:max-w-[440px]">
            <h2 className="font-heading font-semibold text-gray-200 text-xl">
              Entre na sua Conta
            </h2>

            <div className="space-y-3">
              <InputRoot>
                <InputIcon>
                  <Mail />
                </InputIcon>
                <InputField type="text" placeholder="E-mail" />
              </InputRoot>

              <InputRoot>
                <InputIcon>
                  <Lock />
                </InputIcon>
                <InputField type="password" placeholder="Senha" />
              </InputRoot>
            </div>

            <Button type="submit">
              Confirmar
              <ArrowRight className="size-6" />
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
