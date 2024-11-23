function getBrowser() {
  const userAgent = navigator.userAgent.toLowerCase();

  // Verificar Brave de forma específica
  if (navigator.brave) {
      return "brave";
  }

  if (userAgent.includes("chrome") && !userAgent.includes("edg/") && !userAgent.includes("opr/")) {
      return "chrome";
  } else if (userAgent.includes("firefox")) {
      return "firefox";
  } else if (userAgent.includes("edg/")) {
      return "edge";
  } else if (userAgent.includes("opr/") || userAgent.includes("opera")) {
      return "opera";
  } else if (userAgent.includes("vivaldi")) {
      return "vivaldi";
  } else if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
      return "safari";
  } else {const browser = getBrowser();
      return "unknown";
  }
}

// Função para baixar o vídeo
function downloadVideo() {
  const url = document.getElementById('url').value;
  const browser = getBrowser();

  if (!url) {
    alert('Por favor, insira uma URL do YouTube.');
    return;
  }

  window.location.href = `/download-video?url=${url}&browser=${browser}`;
}

// Função para baixar o áudio
function downloadAudio() {
  const url = document.getElementById('url').value;
  const browser = getBrowser();

  if (!url) {
    alert('Por favor, insira uma URL do YouTube.');
    return;
  }
  window.location.href = `/download-audio?url=${url}&browser=${browser}`;
}
