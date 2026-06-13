const db = require('./database');

const products = [
    // Electronics
    { name: "Wireless Noise-Cancelling Headphones", description: "Premium over-ear headphones with active noise cancellation and 30-hour battery life.", price: 299.99, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000", category: "Electronics" },
    { name: "Ultra-Thin Laptop", description: "Lightweight and powerful laptop for professionals on the go.", price: 1299.00, imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1000", category: "Electronics" },
    { name: "4K Action Camera", description: "Rugged, waterproof action camera capturing stunning 4K video.", price: 249.00, imageUrl: "https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&q=80&w=1000", category: "Electronics" },
    { name: "Smart Home Security Camera", description: "1080p HD security camera with night vision and two-way audio.", price: 89.99, imageUrl: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&q=80&w=1000", category: "Electronics" },
    { name: "Curved Gaming Monitor", description: "34-inch ultrawide curved gaming monitor with 144Hz refresh rate.", price: 499.00, imageUrl: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&q=80&w=1000", category: "Electronics" },
    { name: "Professional DSLR Camera", description: "Full-frame DSLR camera with 24.2 MP and 4K video recording.", price: 1999.00, imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000", category: "Electronics" },
    { name: "Wireless Bluetooth Earbuds", description: "Compact true wireless earbuds with deep bass and waterproof design.", price: 129.99, imageUrl: "https://images.unsplash.com/photo-1572569433602-66b40e3ad7bf?auto=format&fit=crop&q=80&w=1000", category: "Electronics" },
    { name: "Portable SSD Drive", description: "1TB external solid state drive for fast and secure data backup.", price: 149.99, imageUrl: "https://images.unsplash.com/photo-1616422285623-14ffea6e0b7b?auto=format&fit=crop&q=80&w=1000", category: "Electronics" },

    // Clothing
    { name: "Classic Denim Jacket", description: "Timeless vintage wash denim jacket for everyday wear.", price: 89.99, imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=1000", category: "Clothing" },
    { name: "Men's Cotton T-Shirt", description: "Breathable and soft 100% cotton crewneck t-shirt.", price: 24.50, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000", category: "Clothing" },
    { name: "Running Sneakers", description: "Lightweight athletic sneakers with responsive cushioning.", price: 119.00, imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000", category: "Clothing" },
    { name: "Women's Summer Dress", description: "Floral pattern midi dress perfect for warm sunny days.", price: 59.99, imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=1000", category: "Clothing" },
    { name: "Cozy Knit Sweater", description: "Warm and comfortable oversized knit sweater.", price: 49.99, imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1000", category: "Clothing" },
    { name: "Slim Fit Chinos", description: "Versatile slim fit trousers for casual or formal settings.", price: 65.00, imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1000", category: "Clothing" },
    { name: "Leather Crossbody Bag", description: "Premium leather crossbody bag with adjustable strap.", price: 139.00, imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1000", category: "Clothing" },

    // Gadgets
    { name: "Minimalist Smartwatch", description: "Sleek smartwatch with fitness tracking, heart rate monitor, and notifications.", price: 199.50, imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000", category: "Gadgets" },
    { name: "Portable Bluetooth Speaker", description: "Waterproof Bluetooth speaker with 360-degree sound and deep bass.", price: 79.99, imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=1000", category: "Gadgets" },
    { name: "Smartphone Gimbal Stabilizer", description: "3-axis handheld gimbal for smooth and professional smartphone videography.", price: 119.99, imageUrl: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&q=80&w=1000", category: "Gadgets" },
    { name: "Wireless Charging Pad", description: "Fast wireless charger compatible with all Qi-enabled devices.", price: 39.99, imageUrl: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?auto=format&fit=crop&q=80&w=1000", category: "Gadgets" },
    { name: "Virtual Reality Headset", description: "Standalone VR headset for immersive gaming and entertainment.", price: 299.00, imageUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=1000", category: "Gadgets" },
    { name: "Smart LED Light Strip", description: "16 million color LED strip compatible with voice assistants.", price: 45.00, imageUrl: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=1000", category: "Gadgets" },
    { name: "Ergonomic Vertical Mouse", description: "Wireless vertical mouse designed to reduce wrist strain.", price: 29.99, imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=1000", category: "Gadgets" },

    // Home & Garden
    { name: "Ceramic Coffee Mug", description: "Handcrafted artisan ceramic mug for your morning brew.", price: 18.50, imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=1000", category: "Home & Garden" },
    { name: "Indoor Potted Succulent", description: "Low-maintenance live succulent plant with a decorative concrete pot.", price: 22.00, imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=1000", category: "Home & Garden" },
    { name: "Bamboo Cutting Board", description: "Durable and eco-friendly bamboo cutting board for the kitchen.", price: 35.00, imageUrl: "https://images.unsplash.com/photo-1581622558667-3419a8dc5f83?auto=format&fit=crop&q=80&w=1000", category: "Home & Garden" },
    { name: "Essential Oil Diffuser", description: "Aromatherapy ultrasonic diffuser with ambient LED lighting.", price: 42.99, imageUrl: "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=1000", category: "Home & Garden" },
    { name: "Woven Throw Blanket", description: "Soft, decorative cotton throw blanket for the living room.", price: 55.00, imageUrl: "https://images.unsplash.com/photo-1580828369019-114251ce76a6?auto=format&fit=crop&q=80&w=1000", category: "Home & Garden" },
    { name: "Robot Vacuum Cleaner", description: "Smart robot vacuum with app control and automatic charging.", price: 249.99, imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=1000", category: "Home & Garden" },
    { name: "Modern Table Lamp", description: "Minimalist brass table lamp with adjustable brightness.", price: 75.00, imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1000", category: "Home & Garden" },
    { name: "Cast Iron Skillet", description: "Pre-seasoned 12-inch cast iron skillet for versatile cooking.", price: 49.50, imageUrl: "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&q=80&w=1000", category: "Home & Garden" }
];

db.serialize(() => {
    db.run("DROP TABLE IF EXISTS Products");
    db.run(`CREATE TABLE IF NOT EXISTS Products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        imageUrl TEXT,
        category TEXT DEFAULT 'Uncategorized'
    )`);

    const stmt = db.prepare("INSERT INTO Products (name, description, price, imageUrl, category) VALUES (?, ?, ?, ?, ?)");
    for (const product of products) {
        stmt.run(product.name, product.description, product.price, product.imageUrl, product.category);
    }
    stmt.finalize();
    console.log("Database seeded with 30 categorized products.");
});
