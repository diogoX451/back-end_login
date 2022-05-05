const express = require("express");
const http = require("http");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
// console.log(require('crypto').randomBytes(64).toString('hex')); // Gerar o token
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Rota teste");

})

app.get("/client",verifyJWT, (req, res, next) => {
    res.json([{id: 1, nome: "Diogo"}])
});
//Autenticação

app.post("/login",(req, res, next) => {
    if(req.body.user =='Diogo' && req.body.password == "321"){
        const id = 1
        const token = jwt.sign({id}, process.env.SECRET, {
            expiresIn: 300
        });
        return  res.json({auth: true, token: token});
    }
    res.status(500).json({message: 'Login correto'});
})
// sair
app.post("/logout", (req, res) =>{
    res.json({auth: false, token:null});
})

//Verificação

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    if(!token) return res.status(401).json({auth: false, message: 'No token provided.'})
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if(err) return res.status(500).json({auth: false, message: "Erro de autenticação"});
        
        req.userId = decoded.id;
        next();
    });
}

//Port do Servidor 
const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.log(`Servidor aberto na porta ${port}`);