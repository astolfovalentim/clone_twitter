const User = require("../model/User");

const findByEmailUserService =  (email) =>  User.findOne({ email: email });

const createUserService =  (body) =>  User.create(body);

const findAllUserService =  () =>  User.find();

const  findByIdUserService  = async (idUser) => await User.findById(idUser);

module.exports = { 
    findByEmailUserService, 
    createUserService, 
    findAllUserService, 
    findByIdUserService
};