const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Rota para baixar áudio
app.get('/download-audio', (req, res) => {
    const audioUrl = req.query.url; // Obtém a URL do áudio a partir dos parâmetros da query

    if (!audioUrl) {
        return res.status(400).send('URL do áudio é necessária.');
    }

    // Nome do arquivo de saída
    const outputFileName = 'audio.mp3';

    // Comando para baixar o áudio em formato MP3
    const command = `yt-dlp -x --audio-format mp3 -o "${outputFileName}" "${audioUrl}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao baixar o áudio: ${stderr}`);
            return res.status(500).send('Erro ao baixar o áudio.');
        }

        // Verifica se o arquivo foi criado
        const filePath = path.join(__dirname, outputFileName);
        if (fs.existsSync(filePath)) {
            res.download(filePath, (err) => {
                if (err) {
                    console.error(`Erro ao enviar o arquivo: ${err}`);
                }
                // Remove o arquivo após o download
                fs.unlinkSync(filePath);
            });
        } else {
            res.status(500).send('Arquivo não encontrado após o download.');
        }
    });
});

// Rota para baixar vídeo
app.get('/download-video', (req, res) => {
    const videoUrl = req.query.url; // Obtém a URL do vídeo a partir dos parâmetros da query

    if (!videoUrl) {
        return res.status(400).send('URL do vídeo é necessária.');
    }

    // Nome do arquivo de saída
    const outputFileName = 'video.mp4';

    // Comando para baixar o vídeo em qualidade máxima
    const command = `yt-dlp -f best -o "${outputFileName}" "${videoUrl}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao baixar o vídeo: ${stderr}`);
            return res.status(500).send('Erro ao baixar o vídeo.');
        }

        // Verifica se o arquivo foi criado
        const filePath = path.join(__dirname, outputFileName);
        if (fs.existsSync(filePath)) {
            res.download(filePath, (err) => {
                if (err) {
                    console.error(`Erro ao enviar o arquivo: ${err}`);
                }
                // Remove o arquivo após o download
                fs.unlinkSync(filePath);
            });
        } else {
            res.status(500).send('Arquivo não encontrado após o download.');
        }
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
app.use(express.static(path.join(__dirname, 'public')));
