import Users from "../../models/userModel.js";

// fungsi get user menggunakan async agar bisa dilakukan saat melakukan proses yg lain
export const getUser = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email", "role", "createdAt"],
    });
    res.json(users); //berikan response berupa data users berbentuk JSON
  } catch (error) {
    console.log(error);
  }
};

// View User by id
export const getUserById = async (req, res) => {
  try {
    const users = await Users.findOne({
      attributes: ["id", "name", "email", "role", "createdAt"],
      where: {
        id: req.params.id,
      },
    });
    res.json(users); //berikan response berupa data users berbentuk JSON
  } catch (error) {
    console.log(error);
  }
};
