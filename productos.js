const Knex = require("knex").default;
const options = {
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "productos",
  },
};

class Contenedor {
  constructor(options, table) {
    this.knex = Knex(options);
    this.table = table;
  }
  async createTable() {
    await this.knex.schema.createTable(`${this.table}`, (table) => {
      table.increments("id");
      table.string("title");
      table.integer("price");
      table.string("thumbnail");
    });
  }
  async save(prod) {
    try {
      let arr = await this.getAll();
      if (arr == []) {
        await this.knex(`${this.table}`).insert(prod);
      } else {
        arr = [...arr, prod];
        await this.knex.schema.dropTableIfExists(`${this.table}`);
        await this.createTable();
        await this.knex(`${this.table}`).insert(arr);
      }
    } catch (error) {
      return error;
    }
  }
  async getAll() {
    try {
      let productos = await this.knex
        .from(`${this.table}`)
        .select("*")
        .then((resp) => resp);
      return productos;
    } catch (error) {
      return error;
    }
  }
  async getById(id) {
    let producto = await this.knex
      .from(`${this.table}`)
      .select("*")
      .where("id", "=", id)
      .then((resp) => resp);
    return producto;
  }
  async deteleAll() {
    await this.knex.schema.dropTableIfExists(`${this.table}`);
    await this.createTable();
  }
  async deleteById(id) {
    await this.knex("productos").where({ id: id }).del();
  }
}
const producto = new Contenedor(options, "productos");

producto.createTable().then((resp) => resp);
module.exports = producto;
