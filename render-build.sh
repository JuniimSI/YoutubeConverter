# Instala dependências necessárias
echo "Instalando yt-dlp..."

# Baixar e instalar o yt-dlp
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o yt-dlp
chmod +x yt-dlp

# Outras dependências do seu projeto (se necessário)
echo "Instalando dependências do npm..."
npm install

echo "yt-dlp instalado e dependências do npm concluídas!"