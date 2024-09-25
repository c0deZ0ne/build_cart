// import { NotFoundException } from '@nestjs/common';
// import {
//   Attributes,
//   FindOptions,
//   InferAttributes,
//   InferCreationAttributes,
//   ModelStatic,
//   QueryOptions,
//   UpdateOptions,
// } from 'sequelize';
// import {
//   Column,
//   CreatedAt,
//   DataType,
//   Default,
//   Model,
//   PrimaryKey,
//   UpdatedAt,
// } from 'sequelize-typescript';

// export abstract class BaseModel<T extends Model = any> extends Model<
//   InferAttributes<T>,
//   InferCreationAttributes<T>
// > {
//   @PrimaryKey
//   @Default(DataType.UUIDV4)
//   @Column(DataType.UUID)
//   id: string;

//   @CreatedAt
//   createdAt: Date;

//   @UpdatedAt
//   updatedAt: Date;

//   /**
//    * Find a single row by ID. If no row is found, throws an error.
//    * @param id - the ID of the row to find
//    * @param options - sequelize find options
//    * @returns the found row
//    * @throws Error if no row is found
//    */
//   static async findByPkOrThrow<M extends BaseModel>(
//     this: ModelStatic<M>,
//     id: string,
//     options?: FindOptions,
//   ) {
//     const res = await this.findByPk(id, options);
//     if (!res) {
//       throw new NotFoundException(`${this.name} Not Found`);
//     }
//     return res as M;
//   }

//   /**
//    * Find a single row that matches the query. If no row is found, throws an error.
//    * @param options - sequelize find options
//    * @returns the found row
//    * @throws Error if no row is found
//    */
//   static async findOrThrow<M extends BaseModel>(
//     this: ModelStatic<M>,
//     options: FindOptions,
//   ) {
//     const res = (await this.findOne(options)) as M | null;
//     if (!res) {
//       throw new NotFoundException(`${this.name}NotFound`);
//     }
//     return res;
//   }

//   /**
//    * @deprecated
//    * Same as update(), but will fire sequelize hooks for each row individually.
//    * Should always be used instead of update() for tables that requires hooks.
//    * @param values the values to set
//    * @param options the sequelize options
//    * @returns an array with one or two elements. The first element is always the number of affected rows, while the second element is the actual affected rows (with options.returning true.)
//    */
//   static async updateWithHooks<M extends BaseModel>(
//     this: { new (): M } & typeof BaseModel, // @todo: fix this
//     values: object,
//     options: UpdateOptions<Attributes<M>>,
//   ) {
//     return this.update(values, {
//       ...options,
//       individualHooks: true,
//     }) as Promise<[number] | [number, M[]]>;
//   }

//   /**
//    * @deprecated
//    * Update a single row by ID and return the updated instance.
//    * @param id - the ID of the row to update
//    * @param values - the values to update
//    * @param queryOptions - sequelize query options
//    * @returns the updated instance
//    */
//   static async updateById<M extends BaseModel>(
//     this: { new (): M } & typeof BaseModel, // @todo: fix this
//     id: string,
//     values: object,
//     queryOptions: QueryOptions = {},
//   ) {
//     const options = {
//       where: {
//         id,
//       },
//       returning: true,
//       ...queryOptions,
//     };
//     const [number, [updatedInstance]] = (await this.updateWithHooks(
//       values,
//       options,
//     )) as [number, M[]];
//     if (!updatedInstance) {
//       throw new Error(
//         `Unexpected error: No row was updated in updateById db response ${JSON.stringify(
//           { number, updatedInstance },
//         )}`,
//       );
//     }
//     return updatedInstance;
//   }
// }

import {
  Attributes,
  FindOptions,
  InferAttributes,
  InferCreationAttributes,
  ModelStatic,
  QueryOptions,
  UpdateOptions,
  RestoreOptions,
} from 'sequelize';
import {
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { NotFoundException } from '@nestjs/common';

export abstract class BaseModel<T extends Model = any> extends Model<
  InferAttributes<T>,
  InferCreationAttributes<T>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  /**
   * Find a single row by ID. If no row is found, throws an error.
   * @param id - the ID of the row to find
   * @param options - sequelize find options
   * @returns the found row
   * @throws Error if no row is found
   */
  static async findByPkOrThrow<M extends BaseModel>(
    this: ModelStatic<M>,
    id: string,
    options?: FindOptions,
  ) {
    const res = await this.findByPk(id, options);
    if (!res) {
      throw new NotFoundException(`${this.name} Not Found`);
    }
    return res as M;
  }

  /**
   * Find a single row that matches the query. If no row is found, throws an error.
   * @param options - sequelize find options
   * @returns the found row
   * @throws Error if no row is found
   */
  static async findOrThrow<M extends BaseModel>(
    this: ModelStatic<M>,
    options?: FindOptions,
  ) {
    const res = (await this.findOne(options)) as M | null;
    if (!res) {
      throw new NotFoundException(`${this.name} Not Found`);
    }
    return res;
  }

  /**
   * Restore a soft-deleted row by ID.
   * @param id - the ID of the row to restore
   * @param options - sequelize restore options
   * @returns the restored row
   */
  static async restoreById<M extends BaseModel>(
    this: ModelStatic<M>,
    id: string,
    options?: RestoreOptions,
  ) {
    await this.restore({ where: { id }, ...options });
    const res = (await this.findOne(options)) as M | null;
    if (!res) {
      throw new NotFoundException(`${this.name} Not Found`);
    }
    return res as M;
  }

  /**
   * @deprecated
   * Same as update(), but will fire sequelize hooks for each row individually.
   * Should always be used instead of update() for tables that requires hooks.
   * @param values the values to set
   * @param options the sequelize options
   * @returns an array with one or two elements. The first element is always the number of affected rows, while the second element is the actual affected rows (with options.returning true.)
   */
  static async updateWithHooks<M extends BaseModel>(
    this: { new (): M } & typeof BaseModel, // @todo: fix this
    values: object,
    options: UpdateOptions<Attributes<M>>,
  ) {
    return this.update(values, {
      ...options,
      individualHooks: true,
    }) as Promise<[number] | [number, M[]]>;
  }

  /**
   * @deprecated
   * Update a single row by ID and return the updated instance.
   * @param id - the ID of the row to update
   * @param values - the values to update
   * @param queryOptions - sequelize query options
   * @returns the updated instance
   */
  static async updateById<M extends BaseModel>(
    this: { new (): M } & typeof BaseModel, // @todo: fix this
    id: string,
    values: object,
    queryOptions: QueryOptions = {},
  ) {
    const options = {
      where: {
        id,
      },
      returning: true,
      ...queryOptions,
    };
    const [number, [updatedInstance]] = (await this.updateWithHooks(
      values,
      options,
    )) as [number, M[]];
    if (!updatedInstance) {
      throw new Error(
        `Unexpected error: No row was updated in updateById db response ${JSON.stringify(
          { number, updatedInstance },
        )}`,
      );
    }
    return updatedInstance;
  }
}
