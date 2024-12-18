use intermediate;

db.users.drop();
db.products.drop();
db.orders.drop();

// Users
// _id: ObjectId
// name: String
// email: String
// password: String
db.users.insertOne({
    _id: ObjectId("6763243e67a06dca92d0a06b"),
    name: "Jane Doe",
    email: "janedoe@gmail.com",
    password: "!@#$%12345",
});
db.users.insertOne({
    _id: ObjectId("6763244b52309710820aecda"),
    name: "John Doe",
    email: "johndoe@gmail.com",
    password: "123ASD@!#",
});
db.users.insertOne({
    _id: ObjectId("67632451f3fda881886a6d30"),
    name: "Billy Doe",
    email: "billydoe@gmail.com",
    password: "ASDAS!@#!@#adasd",
});

// Products
// _id: ObjectId
// name: String
// category: String
// price: Number
// stock: Number
db.products.insertOne({
    _id: ObjectId("67632456421257241873030a"),
    name: "Flashlight",
    category: "Electronics",
    price: 5,
    stock: 100,
});
db.products.insertOne({
    _id: ObjectId("67632483142998b3c6a04317"),
    name: "Gardening Gloves",
    category: "Garden Tools",
    price: 3,
    stock: 50,
});
db.products.insertOne({
    _id: ObjectId("67632461719b2f147021272a"),
    name: "Frying Pan",
    category: "Kitchen ",
    price: 10,
    stock: 25,
});

// Orders;
// _id: ObjectId
// userId: ObjectId
// products: [{ productId: ObjectId, quantity: number }];
// orderDate: Date
// status: String
db.orders.insertOne({
    _id: ObjectId("67632483142998b3c6a04317"),
    userId: ObjectId("6763243e67a06dca92d0a06b"),
    products: [
        { productId: ObjectId("67632456421257241873030a"), quantity: 10 },
        { productId: ObjectId("67632483142998b3c6a04317"), quantity: 2 },
        { productId: ObjectId("67632461719b2f147021272a"), quantity: 1 },
    ],
    orderDate: "2024-11-06",
    status: "Completed",
});
db.orders.insertOne({
    _id: ObjectId("676326d7568bc932d5299493"),
    userId: ObjectId("6763244b52309710820aecda"),
    products: [{ productId: ObjectId("67632456421257241873030a"), quantity: 5 }],
    orderDate: "2024-11-09",
    status: "Completed",
});
db.orders.insertOne({
    _id: ObjectId("676326e1226cc9794921b500"),
    userId: ObjectId("67632451f3fda881886a6d30"),
    products: [
        { productId: ObjectId("67632483142998b3c6a04317"), quantity: 2 },
        { productId: ObjectId("67632461719b2f147021272a"), quantity: 1 },
    ],
    orderDate: "2024-12-03",
    status: "Completed",
});

// Advanced indexing for improved performance
db.products.createIndex({ category: 1, price: -1 });
db.users.createIndex({ email: 1 }, { unique: true });
db.products.createIndex({ name: "text", category: "text" });

// Examples queries with optimization
db.products.find({ category: "Electronics", price: { $lt: 50 } }).sort({ price: -1 });
db.products.find({ $text: { $search: "Flashlight Electronics" } });
db.products.createIndex({ name: "text", category: "text" });


// Aggregation Pipeline that gets the available stock of products based from orders
db.products.aggregate([
    // Lookup orders to fetch the products ordered and their quantities
    {
        $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "products.productId",
            as: "orderDetails",
        },
    },
    // Unwind the orderDetails array to process each order
    {
        $unwind: {
            path: "$orderDetails",
            preserveNullAndEmptyArrays: true, // Include products with no orders
        },
    },
    // Unwind the products array inside each order
    {
        $unwind: {
            path: "$orderDetails.products",
            preserveNullAndEmptyArrays: true, // Include products with no specific quantities ordered
        },
    },
    // Match only the products with the current product ID
    {
        $match: {
            $expr: { $eq: ["$orderDetails.products.productId", "$_id"] },
        },
    },
    // Group by product ID to calculate the total quantity ordered
    {
        $group: {
            _id: "$_id",
            name: { $first: "$name" },
            category: { $first: "$category" },
            initialStock: { $first: "$stock" },
            totalOrdered: { $sum: "$orderDetails.products.quantity" },
        },
    },
    // Calculate the remaining stock for each product
    {
        $addFields: {
            availableStock: { $subtract: ["$initialStock", "$totalOrdered"] },
        },
    },
    // Handle products with no orders by setting totalOrdered to 0
    {
        $project: {
            _id: 1,
            name: 1,
            category: 1,
            availableStock: {
                $cond: {
                    if: { $gte: ["$availableStock", 0] },
                    then: "$availableStock",
                    else: "$initialStock",
                },
            },
        },
    },
]);
