import { AbstractDocument } from '@app/common/database/abstract.schema';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

@Schema({
	versionKey: false
})
@ObjectType()
export class ReservationDocument extends AbstractDocument {

	@Prop()
	@Field()
		startDate: Date;
	@Prop()
	@Field()
		endDate: Date;
	@Prop()
	@Field()
		userId: string;
	@Prop()
	@Field()
		placeId: string;
	@Prop()
	@Field()
		invoiceId: string;


	static get definition(): ModelDefinition {
		return {
			name: ReservationDocument.name,
			schema: SchemaFactory.createForClass(ReservationDocument)
		};
	}


}

