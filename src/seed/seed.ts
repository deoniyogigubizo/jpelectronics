import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = 'jptech';

async function seedDatabase(): Promise<void> {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  // Clear existing data
  await db.collection('products').deleteMany({});
  await db.collection('categories').deleteMany({});

  // 20 Electronics Categories with at least 5 products each = 100+ products
  const categories = [
    { name: { en: 'Smartphones', rw: 'Telefoni' }, slug: 'smartphones', image: 'https://loremflickr.com/400/300/smartphone', featured: true, productCount: 8 },
    { name: { en: 'Laptops', rw: 'Laptops' }, slug: 'laptops', image: 'https://loremflickr.com/400/300/laptop', featured: true, productCount: 7 },
    { name: { en: 'Tablets', rw: 'Tablets' }, slug: 'tablets', image: 'https://loremflickr.com/400/300/tablet', featured: true, productCount: 6 },
    { name: { en: 'Smart TVs', rw: 'TV Zishinzwe Umuryango' }, slug: 'smart-tvs', image: 'https://loremflickr.com/400/300/tv', featured: true, productCount: 6 },
    { name: { en: 'Audio Systems', rw: 'Ibyikoreswa byo ku Ijwi' }, slug: 'audio-systems', image: 'https://loremflickr.com/400/300/speaker', featured: true, productCount: 6 },
    { name: { en: 'Gaming Consoles', rw: 'Imikorere y\'Igikoni' }, slug: 'gaming-consoles', image: 'https://loremflickr.com/400/300/game+console', featured: false, productCount: 6 },
    { name: { en: 'Wearables', rw: 'Ibikoreswa byo Ku Mubiri' }, slug: 'wearables', image: 'https://loremflickr.com/400/300/watch', featured: true, productCount: 6 },
    { name: { en: 'Cameras', rw: 'Foto' }, slug: 'cameras', image: 'https://loremflickr.com/400/300/camera', featured: false, productCount: 6 },
    { name: { en: 'Drones', rw: 'Drones' }, slug: 'drones', image: 'https://loremflickr.com/400/300/drone', featured: false, productCount: 5 },
    { name: { en: 'Smart Home', rw: 'Urubohe rw\'Amahigi' }, slug: 'smart-home', image: 'https://loremflickr.com/400/300/smart+home', featured: false, productCount: 6 },
    { name: { en: 'Networking', rw: 'Imikorere myinshi' }, slug: 'networking', image: 'https://loremflickr.com/400/300/router', featured: false, productCount: 6 },
    { name: { en: 'Printers & Scanners', rw: 'Ibyicishwa & Kugurisha' }, slug: 'printers-scanners', image: 'https://loremflickr.com/400/300/printer', featured: false, productCount: 6 },
    { name: { en: 'Monitors', rw: 'Moniita' }, slug: 'monitors', image: 'https://loremflickr.com/400/300/monitor', featured: false, productCount: 6 },
    { name: { en: 'Keyboards & Mice', rw: 'Imice & Ibikinwa' }, slug: 'keyboards-mice', image: 'https://loremflickr.com/400/300/keyboard', featured: false, productCount: 6 },
    { name: { en: 'Headphones', rw: 'Amahirwe yo kugira imyitwarire' }, slug: 'headphones', image: 'https://loremflickr.com/400/300/headphones', featured: true, productCount: 6 },
    { name: { en: 'Speakers', rw: 'Amahirwe yo gusabwa' }, slug: 'speakers', image: 'https://loremflickr.com/400/300/speaker', featured: false, productCount: 6 },
    { name: { en: 'Smart Watches', rw: 'Amahirwe ashobora kuba Smartphone' }, slug: 'smart-watches', image: 'https://loremflickr.com/400/300/smartwatch', featured: false, productCount: 6 },
    { name: { en: 'Chargers & Cables', rw: 'Amahirwe yo kuvamo & Imibanire' }, slug: 'chargers-cables', image: 'https://loremflickr.com/400/300/charger', featured: false, productCount: 5 },
    { name: { en: 'Power Banks', rw: 'Amahirwe yo Kwifashisha' }, slug: 'power-banks', image: 'https://loremflickr.com/400/300/power+bank', featured: false, productCount: 5 },
    { name: { en: 'VR Headsets', rw: 'Amahirwe yo Kubona Ubusobanuro' }, slug: 'vr-headsets', image: 'https://loremflickr.com/400/300/vr', featured: false, productCount: 5 },
  ];

  const categoriesResult = await db.collection('categories').insertMany(categories as any);
  console.log(`Inserted ${categories.length} categories`);

  // Brand lists per category
  const brands: Record<string, string[]> = {
    smartphones: ['Apple', 'Samsung', 'Tecno', 'Infinix', 'Xiaomi', 'Oppo', 'Vivo', 'OnePlus'],
    laptops: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Microsoft', 'Razer'],
    tablets: ['Apple', 'Samsung', 'Huawei', 'Lenovo', 'Amazon'],
    'smart-tvs': ['Samsung', 'LG', 'Sony', 'TCL', 'Hisense', 'Philips'],
    'audio-systems': ['Sony', 'Bose', 'JBL', 'Sennheiser', 'Audio-Technica', 'Marshall'],
    'gaming-consoles': ['Sony', 'Microsoft', 'Nintendo'],
    wearables: ['Apple', 'Samsung', 'Fitbit', 'Garmin', 'Huawei', 'Xiaomi'],
    cameras: ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Panasonic', 'GoPro'],
    drones: ['DJI', 'Autel', 'Parrot'],
    'smart-home': ['Philips', 'TP-Link', 'Xiaomi', 'Samsung', 'Google', 'Amazon'],
    networking: ['TP-Link', 'Netgear', 'Ubiquiti', 'Asus', 'D-Link'],
    'printers-scanners': ['HP', 'Canon', 'Epson', 'Brother'],
    monitors: ['Dell', 'LG', 'Samsung', 'Asus', 'Acer', 'BenQ'],
    'keyboards-mice': ['Logitech', 'Razer', 'Corsair', 'SteelSeries', 'Microsoft'],
    headphones: ['Sony', 'Bose', 'Sennheiser', 'Audio-Technica', 'Beats', 'JBL'],
    speakers: ['JBL', 'Bose', 'Sony', 'Ultimate Ears', 'Anker'],
    'smart-watches': ['Apple', 'Samsung', 'Garmin', 'Fossil', 'TicWatch'],
    'chargers-cables': ['Anker', 'Baseus', 'Belkin', 'UGreen', 'Aukey'],
    'power-banks': ['Anker', 'Xiaomi', 'RAVPower', 'Baseus', 'Nitecore'],
    'vr-headsets': ['Meta', 'Sony', 'HTC', 'Pico'],
  };

  const now = new Date();
  let allProducts: any[] = [];
  let productId = 1;

  // Generate products for each category
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const catKey = cat.slug as keyof typeof brands;
    const categoryBrands = brands[catKey] || brands['smartphones'];
    const numProducts = cat.productCount;
    
    for (let j = 0; j < numProducts; j++) {
      const brand = categoryBrands[j % categoryBrands.length];
      const modelNum = j + 1;
      const basePrice = Math.floor(Math.random() * 800000) + 50000;
      const hasDiscount = Math.random() > 0.6;
      const discount = hasDiscount ? Math.floor(Math.random() * 30) + 5 : 0;
      const isFeatured = Math.random() > 0.8;
      const isHotDeal = Math.random() > 0.85;
      const inStock = Math.random() > 0.15;
      const stockQty = Math.floor(Math.random() * 50) + 5;
      
      const productNameEn = `${brand} ${cat.name.en} ${modelNum}`;
      const productNameRw = `${brand} ${cat.name.rw} Igice ${modelNum}`;
      
      const compareAtPrice = hasDiscount ? Math.floor(basePrice * (1 + discount / 100)) : 0;

       allProducts.push({
         name: { en: productNameEn, rw: productNameRw },
         description: { 
           en: `High-quality ${cat.name.en} from ${brand}. Perfect for your everyday needs in Rwanda.`,
           rw: `${cat.name.rw} bikomeye bivuye ${brand}. Bifite ahoza mu Rwanda.`
         },
         shortDescription: { 
           en: `${productNameEn} - ${brand}`,
           rw: `${productNameRw} - ${brand}`
         },
         price: basePrice,
         compareAtPrice: compareAtPrice > basePrice ? compareAtPrice : undefined,
          images: [`https://loremflickr.com/600/600/${cat.slug.replace('-', '+')}`],
        category: cat.name.en,
        categorySlug: cat.slug,
        brand,
        inStock,
        stockQuantity: stockQty,
        tags: [brand.toLowerCase(), cat.name.en.toLowerCase(), 'electronics'],
        specs: {
          'Brand': brand,
          'Model': `${cat.name.en} ${modelNum}`,
          'Warranty': '1 Year',
          'Origin': 'Global'
        },
        featured: isFeatured,
        hotDeal: isHotDeal,
        discount,
        createdAt: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: now
      });
      productId++;
    }
  }

  console.log(`Generated ${allProducts.length} products`);
  await db.collection('products').insertMany(allProducts as any);
  console.log(`✅ Successfully seeded ${allProducts.length} products across ${categories.length} categories`);
  
  // Print summary
  console.log('\n=== SEED SUMMARY ===');
  for (let i = 0; i < categories.length; i++) {
    const catProducts = allProducts.filter(p => p.category === categories[i].name.en);
    console.log(`${categories[i].name.en}: ${catProducts.length} products`);
  }
  console.log(`=================\nTotal: ${allProducts.length} products`);
  
  await client.close();
}

seedDatabase().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
