import { AbstractDocument } from '@app/common/database/abstract.schema';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

@Schema({
	versionKey: false
})
@ObjectType()
export class UserDocument extends AbstractDocument {

	@Field()
	@Prop({
		unique: true
	})
		email: string;

	@Field()
	@Prop()
		password: string;

	@Field(() => [String], {
		nullable: true
	})
	@Prop()
		roles?: string[];

	static get definition(): ModelDefinition {
		return {
			name: UserDocument.name,
			schema: SchemaFactory.createForClass(UserDocument)
		};
	}

}
