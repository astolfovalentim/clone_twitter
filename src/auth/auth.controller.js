const authService = require("./auth.service");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const loginController = async (req, res) => {
    const { email, password } = req.body;

    const user = await authService.loginService(email);

    if (!user) {
      return res.status(400).send({ message: "Usuário não encontrado!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send({ message: "Senha inválida!" });
    }

    const token = authService.generateToken(user.id);
    
    res.send({ token });
  };

  module.exports = { loginController };