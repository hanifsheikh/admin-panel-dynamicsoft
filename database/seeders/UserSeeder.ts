import bcrypt from "bcryptjs";

const UsersData = [
  {
    name: "Admin",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("admin@500error"),
    role: 'admin',
  }
];

export default UsersData;
