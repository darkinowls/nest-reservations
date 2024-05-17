import { AbstractRepository } from '@app/common/database/abstract.repository';
import { UserDocument } from './entities/user.entity';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class UserRepository extends AbstractRepository<UserDocument> {
	logger = new Logger(UserRepository.name);

	constructor(
		@InjectModel(UserDocument.name) userModel: Model<UserDocument>
	) {
		super(userModel);
	}
}