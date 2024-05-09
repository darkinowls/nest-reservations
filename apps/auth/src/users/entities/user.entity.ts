import { AbstractDocument } from '@app/common/database/abstract.schema';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
	versionKey: false
})
export class UserDocument extends AbstractDocument {

	@Prop({
		unique: true,
	})
		email: string;

	@Prop()
		password: string;

	static get definition(): ModelDefinition {
		return {
			name: UserDocument.name,
			schema: SchemaFactory.createForClass(UserDocument)
		};
	}

}
