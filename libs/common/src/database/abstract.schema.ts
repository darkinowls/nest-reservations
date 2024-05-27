import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';


@Schema()
@ObjectType()
export abstract class AbstractDocument {
	@Prop({
		type: SchemaTypes.ObjectId
	})
	@Field(() => String)
		_id: Types.ObjectId;

	@Prop()
	@Field()
		createdAt: Date;

	@Prop()
	@Field()
		updatedAt: Date;

	static get definition(): ModelDefinition {
		throw new Error('Definition not implemented.');
	}

}

