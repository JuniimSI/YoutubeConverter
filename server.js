const express = require('express');
const { exec } = require('child_process');
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
app.get('/download-audio', (req, res) => {
    const audioUrl = req.query.url; // Obtém a URL do áudio a partir dos parâmetros da query
    const browser = req.query.browser || "chrome"; // Default para Chrome
    console.log(browser); //

    if (!audioUrl) {
        return res.status(400).send('URL do áudio é necessária.');
    }

    // Comando para obter o título do vídeo
    const getTitleCommand = `./yt-dlp --print title "${audioUrl}"  --cookies cookies.txt`;

    exec(getTitleCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao obter o título: ${stderr}`);
            return res.status(500).send('Erro ao obter o título do vídeo.');
        }

        // Processa o título para snake_case
        const title = toSnakeCase(stdout.trim());
        const outputFileName = `${title}.mp3`;

        // Comando para baixar o áudio em formato MP3
        const downloadCommand = `./yt-dlp -x --audio-format mp3 -o "${outputFileName}" "${audioUrl}"`;

        exec(downloadCommand, (error, stdout, stderr) => {
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
});

// Rota para baixar vídeo
app.get('/download-video', (req, res) => {
    const videoUrl = req.query.url; // Obtém a URL do vídeo a partir dos parâmetros da query
    const browser = req.query.browser || "chrome"; // Default para Chrome

    if (!videoUrl) {
        return res.status(400).send('URL do vídeo é necessária.');
    }

    // Comando para obter o título do vídeo
    const getTitleCommand = `./yt-dlp --print title "${videoUrl} --cookies-from-browser ${browser}"`;

    exec(getTitleCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao obter o título: ${stderr}`);
            return res.status(500).send('Erro ao obter o título do vídeo.');
        }

        // Processa o título para snake_case
        const title = toSnakeCase(stdout.trim());
        const outputFileName = `${title}.mp4`;

        // Comando para baixar o vídeo em qualidade máxima
        const downloadCommand = `./yt-dlp -f best -o "${outputFileName}" "${videoUrl}"`;

        exec(downloadCommand, (error, stdout, stderr) => {
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
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
app.use(express.static(path.join(__dirname, 'public')));
