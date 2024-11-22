// Função para baixar o vídeo
function downloadVideo() {
    const url = document.getElementById('url').value;
    if (!url) {
      alert('Por favor, insira uma URL do YouTube.');
      return;
    }

    window.location.href = `/download-video?url=${url}`;
  }
  
  // Função para baixar o áudio
  function downloadAudio() {
    const url = document.getElementById('url').value;
    if (!url) {
      alert('Por favor, insira uma URL do YouTube.');
      return;
    }
    window.location.href = `/download-audio?url=${url}`;
  }
  