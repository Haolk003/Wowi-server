import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'Dulicate email entered'] })
  email: string;

  @Prop()
  password: string;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
