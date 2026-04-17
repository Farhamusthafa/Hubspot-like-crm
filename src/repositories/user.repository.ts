


import { where } from "sequelize";
import { User } from "../models/user.model";

export class UserRepository {
  create(data: any,name:string,companyId:number) {
    return User.create({ ...data,name: name,companyId:companyId });
  }

  findByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  findById(id: number) {
    return User.findByPk(id);
  }

// GET /api/users?companyId=1
  async findAll(companyId?: number) {
     const users = await User.findAll({
      where: { companyId },
      attributes:{ exclude: ['password'] }
    });
    return users
  }

  update(id: number, data: any) {
    return User.update(data, { where: { id } });
  }

  delete(id: number) {
    return User.destroy({ where: { id } });
  }


  findByResetToken(token: string) {
    return User.findOne({ where: { resetToken: token } });
  }
}
