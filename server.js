const express = require('express');
const youtubedl = require('youtube-dl-exec');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Função para transformar texto em snake_case, sem acentos e minúsculas
const toSnakeCase = (str) => {
    return str
        .normalize('NFD') // Remove acentos
        .replace(/[\u0300-\u036f]/g, '') // Remove marcas de diacríticos
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remove caracteres especiais
        .trim()
        .replace(/\s+/g, '_') // Substitui espaços por underscores
        .toLowerCase();
};

// Rota para baixar áudio
app.get('/download-audio', async (req, res) => {
    const audioUrl = req.query.url;
    const browser = req.query.browser || "chrome"; // Padrão para Chrome

    if (!audioUrl) {
        return res.status(400).send('URL do áudio é necessária.');
    }

    try {
        // Obtém o título do vídeo
        const metadata = await youtubedl(audioUrl, {
            dumpSingleJson: true, // Retorna as informações do vídeo em JSON
            cookiesFromBrowser: browser,
        });
        const title = toSnakeCase(metadata.title);
        const outputFileName = `${title}.mp3`;

        // Baixa o áudio
        const filePath = path.join(__dirname, outputFileName);
        await youtubedl(audioUrl, {
            extractAudio: true,
            audioFormat: 'mp3',
            output: filePath,
            cookiesFromBrowser: browser,
        });

        // Envia o arquivo para o cliente
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
    } catch (err) {
        console.error('Erro ao baixar o áudio:', err);
        res.status(500).send('Erro ao processar o download do áudio.');
    }
});

// Rota para baixar vídeo
app.get('/download-video', async (req, res) => {
    const videoUrl = req.query.url;
    const browser = req.query.browser || "chrome";

    if (!videoUrl) {
        return res.status(400).send('URL do vídeo é necessária.');
    }

    try {
        // Obtém o título do vídeo
        const metadata = await youtubedl(videoUrl, {
            dumpSingleJson: true,
            cookiesFromBrowser: browser,
        });
        const title = toSnakeCase(metadata.title);
        const outputFileName = `${title}.mp4`;

        // Baixa o vídeo
        const filePath = path.join(__dirname, outputFileName);
        await youtubedl(videoUrl, {
            format: 'best',
            output: filePath,
            cookiesFromBrowser: browser,
        });

        // Envia o arquivo para o cliente
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
    } catch (err) {
        console.error('Erro ao baixar o vídeo:', err);
        res.status(500).send('Erro ao processar o download do vídeo.');
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
app.use(express.static(path.join(__dirname, 'public')));
