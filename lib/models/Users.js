const pool = require('../utils/pool');

module.exports = class GithubUsers {
  id;
  username;
  email;
  avatar;

  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.email = row.email;
    this.avatar = row.avatar;
  }

  static async createUser({ username, email, avatar }) {
    if (!username) throw new Error('please enter a username');

    return pool
      .query(
        `
        INSERT INTO github_users (username, email, avatar)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [username, email, avatar]
      )
      .then(({ rows }) => new GithubUsers(rows[0]));
  }

  static async getByUsername(username) {
    return pool
      .query(
        `
      SELECT *
      FROM github_users
      WHERE username=$1
      `,
        [username]
      )
      .then(({ rows }) => {
        if (!rows[0]) {
        } else {
          return new GithubUsers(rows[0]);
        }
        return null;
      });
  }
  toJSON() {
    return { ...this };
  }
};
