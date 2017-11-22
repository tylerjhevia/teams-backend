exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('username').unique();
      table.string('email').unique();
      table.string('password');
      table.timestamps(true, true);
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([knex.schema.dropTable('users')]);
};
