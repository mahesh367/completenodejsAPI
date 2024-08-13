class ProductsModel {
    constructor(db) {
        this.db = db;
    }

    createProduct(name, price, stock,image_url, callback) {
        const query = 'INSERT INTO products (name, price, stock,image_url) VALUES (?, ?, ?,?)';
        this.db.query(query, [name, price, stock,image_url], (err, result) => {
            if (err) {
                return callback(err);
            }
            callback(null, result.insertId);
        });
    }

    getAllProducts(callback) {
        const query = 'SELECT * FROM products';
        this.db.query(query, (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    }
}

module.exports = ProductsModel;
