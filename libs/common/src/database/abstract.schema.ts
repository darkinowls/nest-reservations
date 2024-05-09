import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes } from 'mongoose';


@Schema()
export abstract class AbstractDocument {
	@Prop({
		type: SchemaTypes.ObjectId
	})
		_id: Types.ObjectId;

	@Prop()
		createdAt: Date;

	@Prop()
		updatedAt: Date;

	static get definition(): ModelDefinition {
		throw new Error('Definition not implemented.');
	}

}

