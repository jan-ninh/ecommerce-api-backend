export function cleanResponse(schema) {
  schema.set('toJSON', {
    transform: (_doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      if (ret.createdAt) {
        ret.createdAt = String(ret.createdAt);
      }
      if (ret.updatedAt) {
        ret.updatedAt = String(ret.updatedAt);
      }
    }
  });

  schema.set('toObject', {
    transform: (_doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      if (ret.createdAt) {
        ret.createdAt = String(ret.createdAt);
      }
      if (ret.updatedAt) {
        ret.updatedAt = String(ret.updatedAt);
      }
    }
  });
}
