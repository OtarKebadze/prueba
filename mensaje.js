const Knex = require("knex").default;
const options = {
  client: "sqlite3",
  connection: { filename: "./ecommerce/db.sqlite" },
  useNullAsDefault: true,
};

class Mensaje {
  constructor(options, table) {
    (this.knex = Knex(options)), (this.table = table);
  }
  async newTable() {
    await this.knex.schema.createTable(`${this.table}`, (table) => {
      table.increments("id");
      table.string("mail");
      table.string("text");
    });
  }
  async saveMessage(message) {
    try {
        let arr = await this.allMessages();
        console.log(arr)
        if (arr == []) {
          await this.knex(`${this.table}`).insert(prod);
        } else {
          arr = [...arr, message];
          await this.knex.schema.dropTableIfExists(`${this.table}`);
          await this.newTable();
          await this.knex(`${this.table}`).insert(arr);
        }
      } catch (error) {
        return error;
      }
  }
  async allMessages() {
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
}

const mensaje = new Mensaje(options, "mensajes");

mensaje.newTable().then(resp=>resp)

module.exports = mensaje;
