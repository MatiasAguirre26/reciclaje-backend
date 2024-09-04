const getAllUsers = (req, res) => {

    res.send('Obtener todos los usuarios');
};

const createUser = (req, res) => {
 
    res.send('Crear un nuevo usuario');
};

const getUserById = (req, res) => {
    const userId = req.params.id;
   
    res.send(`Obtener el usuario con ID: ${userId}`);
};

const updateUser = (req, res) => {
    const userId = req.params.id;
  
    res.send(`Actualizar el usuario con ID: ${userId}`);
};

const deleteUser = (req, res) => {
    const userId = req.params.id;
 
    res.send(`Eliminar el usuario con ID: ${userId}`);
};

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser
};
