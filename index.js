//  (c) 2012 Moveline
//  MIT Licensed

// Eventify
// -----
// git@github.com:Moveline/mongoose-eventify.git

// Mongoose plugin adding add, remove, and change events for attributes on Model class

module.exports = function events(schema, options) {

  schema.pre('save', function (next) {
    this._changed = this.modifiedPaths();
    this._isNew = this.isNew;
    next();
  });

  schema.post('save', function() {
    const model = this.model(this.constructor.modelName);

    if (this._isNew) {
      model.emit('add', this);
      delete this._isNew;
      return;
    }

    if (this._changed.length) {

      model.emit('change', this);

      const emitted_keys = [];

      this._changed.forEach(path => {
        const key = 'change:' + path;
        if (emitted_keys.includes(key)) return;
        model.emit(key, this);
        emitted_keys.push(key);
      });

      delete this._changed;
    }

  });

  schema.post('remove', function() {
    const model = this.model(this.constructor.modelName);
    model.emit('remove', this);
  });

}
