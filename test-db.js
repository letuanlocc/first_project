const { Client } = require("pg");

const client = new Client({
    host: "localhost",
    port: 5433,
    user: "postgres",
    password: "123456",
    database: "phone_shop"
});

client.connect()
    .then(() => {
        console.log("Kết nối PostgreSQL thành công!");
        return client.query(`
            SELECT
                current_user,
                current_database(),
                inet_server_port()
        `);
    })
    .then(result => {
        console.log(result.rows);
        return client.end();
    })
    .catch(err => {
        console.error("Lỗi:", err);
        client.end();
    });