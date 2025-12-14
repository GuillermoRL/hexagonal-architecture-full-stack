import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  const promotion1 = await prisma.promotion.create({
    data: {
      code: 'SUMMER2024',
      discount: 20,
    },
  });

  const promotion2 = await prisma.promotion.create({
    data: {
      code: 'WINTER2024',
      discount: 30,
    },
  });

  console.log('Created promotions:', { promotion1, promotion2 });

  const products = await prisma.product.createMany({
    data: [
      {
        title: 'Laptop Pro 15',
        description: 'High-performance laptop with 16GB RAM and 512GB SSD',
        price: 1299.99,
        image_url: 'https://example.com/laptop-pro.jpg',
        promo_id: promotion1.id,
      },
      {
        title: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with Bluetooth connectivity',
        price: 29.99,
        image_url: 'https://example.com/mouse.jpg',
      },
      {
        title: 'Mechanical Keyboard',
        description: 'RGB mechanical keyboard with Cherry MX switches',
        price: 149.99,
        image_url: 'https://example.com/keyboard.jpg',
        promo_id: promotion2.id,
      },
      {
        title: 'USB-C Hub',
        description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
        price: 49.99,
        image_url: 'https://example.com/hub.jpg',
      },
      {
        title: 'Monitor 27" 4K',
        description: '4K UHD monitor with HDR support and 144Hz refresh rate',
        price: 599.99,
        image_url: 'https://example.com/monitor.jpg',
        promo_id: promotion1.id,
      },
      {
        title: 'Webcam HD',
        description: '1080p webcam with built-in microphone and auto-focus',
        price: 79.99,
        image_url: 'https://example.com/webcam.jpg',
      },
      {
        title: 'Laptop Stand',
        description: 'Adjustable aluminum laptop stand for better ergonomics',
        price: 39.99,
        image_url: 'https://example.com/stand.jpg',
      },
      {
        title: 'External SSD 1TB',
        description: 'Portable SSD with USB 3.2 Gen 2 and read speeds up to 1050MB/s',
        price: 129.99,
        image_url: 'https://example.com/ssd.jpg',
        promo_id: promotion2.id,
      },
      {
        title: 'Headphones Bluetooth',
        description: 'Noise-cancelling wireless headphones with 30h battery life',
        price: 199.99,
        image_url: 'https://example.com/headphones.jpg',
      },
      {
        title: 'Desk Lamp LED',
        description: 'Smart LED desk lamp with adjustable brightness and color temperature',
        price: 59.99,
        image_url: 'https://example.com/lamp.jpg',
      },
    ],
  });

  console.log(`Created ${products.count} products`);
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
