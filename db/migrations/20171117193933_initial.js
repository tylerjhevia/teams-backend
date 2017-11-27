exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('username').unique();
      table.string('password');
      table.timestamps(true, true);
    }),

    knex.schema.createTable('teams', table => {
      table.increments('id').primary();
      table.string('team_name');
      table.string('player_1');
      table.string('player_2');
      table.string('player_3');
      table.string('player_4');
      table.string('player_5');
      table.integer('user_id');
      table.foreign('user_id').references('users.id').onDelete('cascade');

      table.timestamps(true, true);
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('teams'),
    knex.schema.dropTable('users')
  ]);
};
