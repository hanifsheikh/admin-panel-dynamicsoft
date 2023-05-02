import User from "@/models/User";
import UsersData from "@/database/seeders/UserSeeder";
import db from "@/database/db";

const handler = async (req:any, res:any) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(UsersData);
  await db.disconnect();
  res.send({ message: "Database seeded successfully" });
};
export default handler;
