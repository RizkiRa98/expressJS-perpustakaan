import Member from "../../models/MemberModel.js";

// Fungsi View Member
export const getMember = async (req, res) => {
  try {
    const members = await Member.findAll({
      attributes: ["id", "name", "email", "phone", "createdAt"],
    });
    res.json(members);
  } catch (error) {
    console.log(error);
    res.json({ msg: error });
  }
};

// View member by id
export const getMemberById = async (req, res) => {
  try {
    const members = await Member.findOne({
      attributes: ["id", "name", "email", "phone", "createdAt"],
      where: {
        id: req.params.id,
      },
    });
    res.json(members);
  } catch (error) {
    console.log(error);
    res.json({ msg: error });
  }
};
