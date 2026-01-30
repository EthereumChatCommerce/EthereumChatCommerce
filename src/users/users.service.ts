import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(email: string, password: string, displayName?: string): Promise<UserDocument> {
    const hashed = await bcrypt.hash(password, 10);
    return this.userModel.create({ email, password: hashed, displayName });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async validatePassword(user: UserDocument, plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, user.password);
  }
}
