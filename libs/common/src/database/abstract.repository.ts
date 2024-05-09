import { AbstractDocument } from '@app/common/database/abstract.schema';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {

	protected abstract readonly logger: Logger;

	constructor(protected readonly model: Model<TDocument>) {
	}

	async create(document: Omit<TDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<TDocument> {
		try {
			const createdDocument = new this.model({
				...document,
				createdAt: new Date(),
				updatedAt: new Date(),
				_id: new Types.ObjectId()
			});
			const createdDocumentJSON = await createdDocument.save();
			this.logger.debug(`Created document: ${JSON.stringify(createdDocumentJSON)}`);
			return createdDocumentJSON.toJSON() as TDocument;
		} catch (error) {
			this.logger.error(`Error creating document: ${error}`);
			throw new BadRequestException(`Error creating document: ${error}`)
		}
	}

	async findOne(filter: FilterQuery<TDocument>): Promise<TDocument> {
		const doc = await this.model.findOne(filter).lean<TDocument>(true);

		if (!doc) {
			this.logger.warn(`Document not found with filter: ${JSON.stringify(filter)}`);
			throw new NotFoundException(`Document not found with filter: ${JSON.stringify(filter)}`);
		}

		this.logger.debug(`Found document: ${JSON.stringify(doc)}`);
		return doc;
	}

	async findOneAndUpdate(filter: FilterQuery<TDocument>, update: UpdateQuery<TDocument>): Promise<TDocument> {
		const doc = await this.model
			.findOneAndUpdate(filter, {
				...update,
				updatedAt: new Date()
			}, { new: true })
			.lean<TDocument>(true);

		if (!doc) {
			this.logger.warn(`Document not found with filter: ${JSON.stringify(filter)}`);
			throw new NotFoundException(`Document not found with filter: ${JSON.stringify(filter)}`);
		}

		this.logger.debug(`Updated document: ${JSON.stringify(doc)}`);
		return doc;
	}

	async find(filter: FilterQuery<TDocument>): Promise<TDocument[]> {
		const docs = await this.model.find(filter)
			.lean<TDocument[]>(true);
		this.logger.debug(`Found documents: ${JSON.stringify(docs)}`);
		return docs;
	}

	async findOneAndDelete(filter: FilterQuery<TDocument>): Promise<TDocument> {
		const doc = await this.model
			.findOneAndDelete(filter)
			.lean<TDocument>(true);

		if (!doc) {
			this.logger.warn(`Document not found with filter: ${JSON.stringify(filter)}`);
			throw new NotFoundException(`Document not found with filter: ${JSON.stringify(filter)}`);
		}

		this.logger.debug(`Deleted document: ${JSON.stringify(doc)}`);
		return doc;
	}

}