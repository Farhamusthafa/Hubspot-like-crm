export class BaseRepository<T extends { id: number }> {
  constructor(private model: any) { }

  create(data: any): Promise<T> {
    return this.model.create(data).then((result: any) => {
      // Add activity type based on the model name
      const modelName = this.model.name.toLowerCase();
      return { ...result.toJSON(), type: modelName };
    });
  }

  findByEntity(entityType: string, entityId: number): Promise<T[]> {
    return this.model.findAll({ where: { entityType, entityId } }).then((results: any[]) => {
      // Add activity type based on the model name
      const modelName = this.model.name.toLowerCase();
      return results.map(result => ({ ...result.toJSON(), type: modelName }));
    });
  }

  findById(entityType: string, entityId: number, id: number): Promise<T | null> {
    return this.model.findOne({ where: { entityType, entityId, id } }).then((result: any) => {
      if (result) {
        const modelName = this.model.name.toLowerCase();
        return { ...result.toJSON(), type: modelName };
      }
      return null;
    });
  }

  update(entityType: string, entityId: number, id: number, updates: Partial<T>): Promise<T | null> {
    return this.model.findOne({ where: { entityType, entityId, id } }).then((item: any) => {
      if (item) return item.update(updates).then((updatedItem: any) => {
        const modelName = this.model.name.toLowerCase();
        return { ...updatedItem.toJSON(), type: modelName };
      });
      return null;
    });
  }

  delete(entityType: string, entityId: number, id: number): Promise<void> {
    return this.model.destroy({ where: { entityType, entityId, id } }).then(() => { });
  }
}