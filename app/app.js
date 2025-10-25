const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa o pacote CORS
const path = require('path');
const app = express();
const port = process.env.PORT || 21072; // Adicionei process.env.PORT para compatibilidade com ambientes

// Middleware para habilitar CORS
app.use(cors());

// Middleware para processar os dados do formulário
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurar o transporte de e-mail com o Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Seu e-mail
    pass: process.env.EMAIL_PASS, // Sua senha de e-mail (ou chave de aplicação)
  },
});

// Função para formatar as escolhas anteriores em HTML
function formatarEscolhasHTML(escolhas) {
  return escolhas.map((escolha, index) => {
    if (typeof escolha === 'object') {
      return `
        <h4>Opção ${index + 1}:</h4>
        <ul>
          ${Object.entries(escolha).map(([chave, valor]) => `<li><strong>${chave}:</strong> ${valor}</li>`).join('')}
        </ul>
      `;
    } else {
      return `<p><strong>Opção ${index + 1}:</strong> ${escolha}</p>`;
    }
  }).join('');
}

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para o envio de e-mail
app.post('/app/enviar-email', (req, res) => {
  const {
    nome,
    cpf,
    dataNascimento,
    whatsapp,
    email,
    profissao,
    cep,
    estado,
    cidade,
    bairro,
    rua,
    numero,
    estadoCivil,
    nomeConjuge,
    cpfConjuge,
    dataNascimentoConjuge,
    profissaoConjuge,
    emailConjuge,
    whatsappConjuge,
    escolhasAnteriores
  } = req.body;

  // Formatando as escolhas anteriores para inclusão no e-mail
  const escolhasFormatadasHTML = escolhasAnteriores ? formatarEscolhasHTML(escolhasAnteriores) : '<p>Nenhuma escolha anterior.</p>';

  // Configuração do e-mail a ser enviado
  const mailOptions = {
    from: 'formulario.012@gmail.com', // Seu endereço de e-mail
    to: 'central@wecredassessoria.com.br', // E-mail de destino
    subject: 'Dados do Formulário - Simulador WeCred',
    html: `
      <h3>Dados do Formulário Principal:</h3>
      <p><strong>Nome Completo:</strong> ${nome}</p>
      <p><strong>CPF:</strong> ${cpf}</p>
      <p><strong>Data de Nascimento:</strong> ${dataNascimento}</p>
      <p><strong>Whatsapp:</strong> ${whatsapp}</p>
      <p><strong>E-mail:</strong> ${email}</p>
      <p><strong>Profissão:</strong> ${profissao}</p>
      <p><strong>CEP:</strong> ${cep}</p>
      <p><strong>Estado:</strong> ${estado}</p>
      <p><strong>Cidade:</strong> ${cidade}</p>
      <p><strong>Bairro:</strong> ${bairro}</p>
      <p><strong>Rua:</strong> ${rua}</p>
      <p><strong>Número:</strong> ${numero}</p>
      <p><strong>Estado Civil:</strong> ${estadoCivil}</p>

      ${nomeConjuge ? `
      <h3>Dados do Cônjuge:</h3>
      <p><strong>Nome Completo (Parceiro):</strong> ${nomeConjuge}</p>
      <p><strong>CPF (Parceiro):</strong> ${cpfConjuge}</p>
      <p><strong>Data de Nascimento (Parceiro):</strong> ${dataNascimentoConjuge}</p>
      <p><strong>Profissão (Parceiro):</strong> ${profissaoConjuge}</p>
      <p><strong>E-mail (Parceiro):</strong> ${emailConjuge}</p>
      <p><strong>Whatsapp (Parceiro):</strong> ${whatsappConjuge}</p>
      ` : ''}

      <h3>Escolhas Anteriores:</h3>
      ${escolhasFormatadasHTML}
    `,
  };

  // Enviar e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erro ao enviar o e-mail:', error);
      res.status(500).send('Erro ao enviar o e-mail.');
    } else {
      console.log('E-mail enviado:', info.response);
      res.send('E-mail enviado com sucesso!');
    }
  });
});

// Rota para a página inicial
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
