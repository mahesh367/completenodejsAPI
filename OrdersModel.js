class OrdersModel {
    constructor(db) {
        this.db = db;
    }

    createOrder(userId, productIds, callback) {
        const query = 'INSERT INTO orders (user_id, product_ids) VALUES (?, ?)';
        this.db.query(query, [userId, productIds.join(',')], (err, result) => {
            if (err) {
                return callback(err);
            }
            callback(null, result.insertId);
        });
    }

    getAllOrders(callback) {
        const query = 'SELECT * FROM orders';
        this.db.query(query, (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    }
}

module.exports = OrdersModel;
