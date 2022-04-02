const pool = require('../utils/pool');

module.exports = class Posts {
  id;
  userposts;

  constructor(row) {
    this.id = row.id;
    this.userposts = row.userposts;
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
