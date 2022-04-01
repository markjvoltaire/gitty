const pool = require('../utils/pool');

module.exports = class GithubUsers {
  id;
  username;
  email;

  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.email = row.email;
  }

  static async createUser({ username, email }) {
    if (!username) throw new Error('please enter a username');

    const { rows } = await pool.query(
      `
        INSERT INTO github_users (username, email)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
      [username, email]
    );
    return new GithubUsers(rows[0]);
  }
};
