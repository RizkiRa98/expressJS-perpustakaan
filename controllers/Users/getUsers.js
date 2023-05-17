import Users from "../../models/userModel.js";

// fungsi get user menggunakan async agar bisa dilakukan saat melakukan proses yg lain
export const getUser = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email", "role"],
    });
    res.json(users); //berikan response berupa data users berbentuk JSON
  } catch (error) {
    console.log(error);
  }
};
