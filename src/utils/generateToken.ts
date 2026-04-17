import jwt from "jsonwebtoken";

export const generateToken = (id: number,name: string, role: string,companyId:number) => {
  return jwt.sign(
    { id, name,role,companyId},
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );
};
