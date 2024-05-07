import { AbstractDocument } from "@app/common/database/abstract.schema";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { Logger, NotFoundException } from "@nestjs/common";

export abstract class AbstractRepository<TDocument extends AbstractDocument> {

  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {
  }

  async create(document: Omit<TDocument, "_id" | "joke">): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId()
    });
    const createdDocumentJSON = await createdDocument.save();
    this.logger.debug(`Created document: ${createdDocumentJSON}`);
    return createdDocumentJSON.toJSON() as TDocument;
  }

  async findOne(filter: FilterQuery<TDocument>): Promise<TDocument> {
    let doc = await this.model.findOne(filter).lean<TDocument>(true);

    if (!doc) {
      this.logger.warn(`Document not found with filter: ${filter}`);
      throw new NotFoundException(`Document not found with filter: ${filter}`);
    }

    this.logger.debug(`Found document: ${doc}`);
    return doc;
  }

  async findOneAndUpdate(filter: FilterQuery<TDocument>, update: UpdateQuery<TDocument>): Promise<TDocument> {
    const doc = await this.model
      .findOneAndUpdate(filter, update, { new: true })
      .lean<TDocument>(true);

    if (!doc) {
      this.logger.warn(`Document not found with filter: ${filter}`);
      throw new NotFoundException(`Document not found with filter: ${filter}`);
    }

    this.logger.debug(`Updated document: ${doc}`);
    return doc;
  }

  async find(filter: FilterQuery<TDocument>): Promise<TDocument[]> {
    const docs = await this.model.find(filter)
      .lean<TDocument[]>(true);
    this.logger.debug(`Found documents: ${docs}`);
    return docs;
  }

  async findOneAndDelete(filter: FilterQuery<TDocument>): Promise<TDocument> {
    const doc = await this.model
      .findOneAndDelete(filter)
      .lean<TDocument>(true);

    if (!doc) {
      this.logger.warn(`Document not found with filter: ${filter}`);
      throw new NotFoundException(`Document not found with filter: ${filter}`);
    }

    this.logger.debug(`Deleted document: ${doc}`);
    return doc;
  }

}