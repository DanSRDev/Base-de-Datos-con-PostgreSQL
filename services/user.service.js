const boom = require('@hapi/boom');

const pool = require('../libs/postgres.pool');
const { models } = require('../libs/sequelize');

class UserService {
  constructor() {
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  async create(data) {
    const { email, password, role } = data;
    const query = `INSERT INTO users (email, password, role) VALUES ('${email}', '${password}', '${role}')`;
    await this.pool.query(query);
    return data;
  }

  async find() {
    const rta = await models.User.findAll();
    return rta;
  }

  async findOne(id) {
    const query = `SELECT * FROM users WHERE id = ${id}`;
    const rta = await this.pool.query(query);
    return rta.rows;
  }

  async update(id, changes) {
    const data = [];

    Object.entries(changes).forEach(entry => {
      data.push(`${entry[0]} = '${entry[1]}'`);
    });
    const query = `UPDATE users SET ${data.join(', ')} WHERE id = ${id}`;
    await this.pool.query(query);
    return {
      id,
      changes,
    };
  }

  async delete(id) {
    const query = `DELETE FROM users WHERE id = ${id}`;
    await this.pool.query(query);
    return { id };
  }
}

module.exports = UserService;
