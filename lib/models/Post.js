const pool = require('../utils/pool');

module.exports = class Posts {
  id;
  userposts;
  username;

  constructor(row) {
    this.id = row.id;
    this.userposts = row.userposts;
    this.username = row.username;
  }

  static async createPost({ userposts }) {
    const { rows } = await pool.query(
      `
        INSERT INTO
        posts (userposts)
        VALUES
        ($1)
        RETURNING
        *
        `,
      [userposts]
    );
    return new Posts(rows[0]);
  }

  static async getAllPosts() {
    const { rows } = await pool.query(
      `
    SELECT
    *
    FROM
    posts`
    );
    return rows.map((row) => new Posts(row));
  }
};
