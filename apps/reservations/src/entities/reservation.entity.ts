import { AbstractDocument } from "@app/common/database/abstract.schema";
import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  versionKey: false,
})
export class ReservationDocument extends AbstractDocument {
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
  @Prop()
  startDate: Date;
  @Prop()
  endDate: Date;
  @Prop()
  userId: string;
  @Prop()
  placeId: string;
  @Prop()
  invoiceId: string;

  static get definition() :  ModelDefinition {
    return {
      name: ReservationDocument.name,
      schema: SchemaFactory.createForClass(ReservationDocument)
    };
  }
}

