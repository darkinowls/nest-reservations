import { Prop, Schema } from "@nestjs/mongoose";
import { Types, SchemaTypes } from "mongoose";


@Schema()
export abstract class AbstractDocument {
  @Prop({
    type: SchemaTypes.ObjectId
  })
  _id: Types.ObjectId;

}