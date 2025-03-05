import { useEffect, useState } from "react";
import { Button } from "@mui/material";

const horariosAlerta = ["08:00", "12:00", "13:30", "18:00"];

const NotificacaoPonto = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    let intervaloPiscar: NodeJS.Timeout | null = null;
    let tituloOriginal = document.title; // Guarda o título original da guia

    // Inicializa o AudioContext apenas se necessário
    const inicializarAudio = () => {
      if (!audioContext || audioContext.state === "suspended") {
        const newAudioContext = new AudioContext();
        newAudioContext.resume(); // Força ativação do áudio
        setAudioContext(newAudioContext);
      }
    };

    // Função para falar uma mensagem usando a API SpeechSynthesis
    const falarMensagem = (mensagem: string) => {
      const utterance = new SpeechSynthesisUtterance(mensagem);
      utterance.lang = "pt-BR"; // Define o idioma como português
      speechSynthesis.speak(utterance);
    };

    // Faz a aba do navegador piscar
    const piscarTitulo = () => {
      let visivel = true;
      intervaloPiscar = setInterval(() => {
        document.title = visivel ? "🔴 Bater o ponto!" : tituloOriginal; // Retorna ao título original
        visivel = !visivel;
      }, 1000);

      setTimeout(() => {
        if (intervaloPiscar) clearInterval(intervaloPiscar);
        document.title = tituloOriginal; // Volta ao título original depois de 10 segundos
      }, 10000); // 10 segundos de notificação
    };

    // Verifica se é um horário de alerta
    const verificarHorario = () => {
      const agora = new Date();
      const horaMinutoAtual = agora
        .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        .replace(" ", "");

      if (horariosAlerta.includes(horaMinutoAtual)) {
        inicializarAudio();
        falarMensagem("Não esqueça de bater o ponto!"); // Voz para o lembrete
        piscarTitulo();
      }
    };

    // Evento para ativar o áudio no primeiro clique do usuário
    document.addEventListener("click", inicializarAudio, { once: true });

    // Checa a cada minuto
    const intervalo = setInterval(verificarHorario, 60 * 1000);
    return () => {
      clearInterval(intervalo);
      if (intervaloPiscar) clearInterval(intervaloPiscar);
      document.removeEventListener("click", inicializarAudio);
    };
  }, [audioContext]);

  return (
    <Button
      onClick={() => {
        if (audioContext?.state === "suspended") {
          audioContext.resume();
        }
      }}
      sx={{ display: "none" }} // Usando sx do MUI para ocultar o botão
    >
      Ativar Som
    </Button>
  );
};

export default NotificacaoPonto;
