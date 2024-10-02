const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const usuariosFilePath = path.join(__dirname, 'usuarios.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

const lerUsuarios = () => {
    if (!fs.existsSync(usuariosFilePath)) {
        return [];
    }
    const data = fs.readFileSync(usuariosFilePath);
    return JSON.parse(data);
};

const salvarUsuarios = (usuarios) => {
    fs.writeFileSync(usuariosFilePath, JSON.stringify(usuarios, null, 2));
};

app.get('/usuarios', (req, res) => {
    const usuarios = lerUsuarios();
    res.json(usuarios);
});

app.post('/usuarios', (req, res) => {
    const novosUsuarios = lerUsuarios();
    const usuario = req.body;

    if (!usuario.nome || !usuario.idade) {
        return res.status(400).json({ error: 'Nome e idade são obrigatórios' });
    }

    novosUsuarios.push(usuario);
    salvarUsuarios(novosUsuarios);
    res.status(201).json(usuario);
});

app.put('/usuarios/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const usuario = req.body;

    if (!usuario.nome || !usuario.idade) {
        return res.status(400).json({ error: 'Nome e idade são obrigatórios' });
    }

    const usuarios = lerUsuarios();

    if (index < 0 || index >= usuarios.length) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    usuarios[index] = usuario;
    salvarUsuarios(usuarios);
    res.status(200).json(usuario);
});

app.delete('/usuarios/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const usuarios = lerUsuarios();

    if (index < 0 || index >= usuarios.length) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    usuarios.splice(index, 1);
    salvarUsuarios(usuarios);
    res.status(204).send();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
