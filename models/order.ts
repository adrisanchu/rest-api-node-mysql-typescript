import { BasicOrder, Order, OrderWithDetails } from "../types/order";
import { db } from "../db";
import { OkPacket, RowDataPacket } from "mysql2";

// create a new order
export const create = (order: BasicOrder, callback: Function) => {
    // define queryString
    const queryString = `
        INSERT INTO 
            ProductOrder (product_id, customer_id, product_quantity) 
            VALUES (?, ?, ?)`;
    // replace '?' with values to avoid SQL injection!
    // using types interfaces in the query in an array
    db.query(
        queryString,
        [order.product.id, order.customer.id, order.productQuantity],
        (err, result) => {
            if (err) { callback(err) };
            // return the insertId of the order record through a callback
            // simple casting to convert it to OkPacket type
            const insertId = (<OkPacket> result).insertId;
            callback(null, insertId);
        }
    );
};

// return one order by id
export const findOne = (orderId: number, callback: Function) => {

    const queryString = `
        SELECT 
            o.*,
            p.*,
            c.name AS customer_name,
            c.email
        FROM ProductOrder AS o
            INNER JOIN Customer AS c ON c.id=o.customer_id
            INNER JOIN Product AS p ON p.id=o.product_id
        WHERE o.order_id=?`;
    
    // pass orderId to the query
    db.query(queryString, orderId, (err, result) => {
        if (err) { callback(err) };
        // the first row from the Packet contains the data
        const row = (<RowDataPacket> result)[0];
        
        // create an object of the Order type
        // user OrderWithDetails to get all params
        const order: OrderWithDetails = {
            orderId: row.order_id,
            customer: {
                id: row.customer_id,
                name: row.customer_name,
                email: row.email
            },
            product: {
                id: row.product_id,
                name: row.name,
                description: row.description,
                instockQuantity: row.instock_quantity,
                price: row.price
            },
            productQuantity: row.product_quantity
        }
        callback(null, order);
    });
};

// return one order by id
export const findAll = (callback: Function) => {

    const queryString = `
        SELECT 
            o.*,
            p.*,
            c.name AS customer_name,
            c.email
        FROM ProductOrder AS o
            INNER JOIN Customer AS c ON c.id=o.customer_id
            INNER JOIN Product AS p ON p.id=o.product_id`;

    db.query(queryString, (err, result) => {
        if (err) { callback(err) };
        // get the whole Data Packet, initialized as an array of Rows
        const rows = <RowDataPacket[]> result;
        // initialize orders as an Order object type
        const orders: Order[] = [];

        // loop through all rows to create the orders object
        rows.forEach(row => {
            const order: OrderWithDetails = {
                orderId: row.order_id,
                customer: {
                    id: row.customer_id,
                    name: row.customer_name,
                    email: row.email
                },
                product: {
                    id: row.product_id,
                    name: row.name,
                    description: row.description,
                    instockQuantity: row.instock_quantity,
                    price: row.price
                },
                productQuantity: row.product_quantity
            }
            // push the order object to the orders array
            orders.push(order);
        });
        callback(null, orders);
    });
}

// update an order by passing the Order object
export const update = (order: Order, callback: Function) => {
    const queryString = `
        UPDATE ProductOrder 
            SET product_id=?, product_quantity=? 
        WHERE order_id=?`;

    db.query(
        queryString, 
        [order.product.id, order.productQuantity, order.orderId],
        (err, result) => {
            if (err) { callback(err) };
            // no need to callback when updating a record
            callback(null);
        }
    );
}