export function cleanResponse(schema, options = {}) {
  const { remove = [] } = options;

  function transform(_doc, ret) {
    ret.id = ret._id;
    delete ret._id;

    delete ret.__v;

    for (const key of remove) {
      if (key in ret) delete ret[key];
    }

    if (ret.createdAt) ret.createdAt = String(ret.createdAt);
    if (ret.updatedAt) ret.updatedAt = String(ret.updatedAt);

    return ret;
  }

  schema.set('toJSON', { transform });
  schema.set('toObject', { transform });
}
