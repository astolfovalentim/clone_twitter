const userService = require("./users.service");
const authService = require("../auth/auth.service");

const createUserController = async (req, res) => {
  const { username, name, email, password, avatar } = req.body;
  
  if (!username || !name || !email || !password || !avatar) {
      return res.status(400).send({
        message:
          "Alguns campos estão faltando. Os campos são: 'username', 'name', email, 'password' ou 'avatar'",
      });
  }

  const foundUser = await userService.findByEmailUserService(email);

  if (foundUser) {
    return res.status(400).send({
      message: "Usuário já existe!",
    });
  }

  const user = await userService
  .createUserService(req.body)
  .catch((err) => console.log(err, message));

  if (!user) {
      return res.status(400).send({
      message: "Erro ao criar Usuário!",
      });
  }

  const token = await authService.generateToken(user.id);

  res.status(201).send({
  user: {
    id: user.id,
    name,
    username,
    email,
    avatar,
  },
  token,
  });
};

const findAllUserController = async (req, res) => {
  const users = await userService.findAllUserService();

  if (users.length === 0) {
    return res.status(400).send({
      message: "Não existem usuários cadastrados!",
    });
  }

  res.send(users);
};

module.exports = { createUserController, findAllUserController};