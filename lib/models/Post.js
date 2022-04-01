const pool = require('../lib/utils/pool');

module.exports = class Posts {
  id;
  text;
  username;

  constructor(row) {
    this.id = row.id;
    this.text = row.text;
    this.username = row.username;
  }

  static async createPost({ text, username }) {
    const { rows } = await pool.query();
  }
};
