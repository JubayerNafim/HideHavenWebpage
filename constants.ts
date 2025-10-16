import { Product, LeatherInfo } from './types';
import { PRODUCT_IMAGES } from './assets';

// Re-export main image assets so other components don't need to change imports
export { LOGO_URL, COVER_URL } from './assets';

export const MESSENGER_LINK = "https://m.me/hidehavenleather";
// Backend API endpoint (PHP on Aeonfree)
export const API_ENDPOINT = "https://hidehaven.iceiy.com/analytics.php";

export const PRODUCTS: Product[] = [
    { 
      id: 3, 
      name: "Premium Trifold Wallet", 
      price: 1250, 
      salePrice: 750, 
      onSale: true, 
      media: [
        { type: 'image', url: 'products/3.jpg' },
        { type: 'image', url: 'products/3-1.jpg' },
        { type: 'image', url: 'products/3-2.jpg' }
      ], 
      stock: true,
      category: "wallet",
      color: ["brown"],
      featured: true
    },
    { 
      id: 7, 
      name: "Luke 1977 Classic Leather Moneybag", 
      price: 1050, 
      salePrice: 650, 
      onSale: true, 
      media: [
        { type: 'image', url: 'products/7.jpg' },
        { type: 'image', url: 'products/7-1.jpg' },
        { type: 'image', url: 'products/7-2.jpg' }
      ], 
      stock: true,
      category: "wallet",
      color: ["black"],
      featured: true
    },
    { 
      id: 9, 
      name: "Premium Biker's Wallet (Chocolate)", 
      price: 1050, 
      salePrice: 650, 
      onSale: true, 
      media: [
        { type: 'image', url: 'products/9.jpg' },
        { type: 'image', url: 'products/9-1.jpg' },
        { type: 'image', url: 'products/9-2.jpg' }
      ], 
      stock: true,
      category: "wallet",
      color: ["chocolate", "brown"]
    },
    { 
      id: 13, 
      name: "Premium Biker's Wallet (Black)", 
      price: 1050, 
      salePrice: 650, 
      onSale: true, 
      media: [
        { type: 'image', url: 'products/13.jpg' },
        { type: 'image', url: 'products/13-1.jpg' },
        { type: 'image', url: 'products/13-2.jpg' }
      ], 
      stock: true,
      category: "wallet",
      color: ["black"]
    },
    { 
      id: 29, 
      name: "Premium Grain Pattern Long Wallet (Dark Chocolate)", 
      price: 1230, 
      salePrice: 799, 
      onSale: true, 
      media: [
        { type: 'image', url: 'products/29.jpg' },
        { type: 'image', url: 'products/29-1.jpg' }
      ], 
      stock: true,
      category: "wallet",
      color: ["chocolate", "brown"],
      featured: true
    },
    {
      id: 30, 
      name: "Premium Grain Pattern Long Wallet (Black)", 
      price: 1230, 
      salePrice: 799, 
      onSale: true, 
      media: [
        { type: 'image', url: 'products/30.jpg' },
        { type: 'image', url: 'products/30-1.jpg' }
      ], 
      stock: true,
      category: "wallet",
      color: ["black"],
      featured: true
    },
    { 
      id: 28, 
      name: "Premium Crosshatched Long Wallet", 
      price: 1230, 
      salePrice: 799, 
      onSale: true, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[28] },
        { type: 'image', url: PRODUCT_IMAGES[29] },
        { type: 'video', url: PRODUCT_IMAGES[30] }
      ], 
      stock: true,
      category: "wallet",
      color: ["black"],
      featured: true,
      description: "Elegant crosshatched leather wallet with premium finish and spacious compartments. The video demonstrates the wallet's generous capacity and elegant finish."
    },
    { 
      id: 23, 
      name: "Auto Gear Belt (Black)", 
      price: 1230, 
      salePrice: 799, 
      onSale: true, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[23] },
        { type: 'image', url: PRODUCT_IMAGES[32] },
        { type: 'image', url: PRODUCT_IMAGES[33] }
      ], 
      stock: true,
      category: "belt",
      color: ["black"],
      featured: true
    },
    { 
      id: 24, 
      name: "Embossed Stitched Moving Belt (Black)", 
      price: 1075, 
      salePrice: 699, 
      onSale: true, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[24] },
        { type: 'image', url: PRODUCT_IMAGES[42] },
        { type: 'image', url: PRODUCT_IMAGES[43] }
      ], 
      stock: true,
      category: "belt",
      color: ["black", "chocolate"],
      description: "Reversible belt with embossed stitching pattern. Rotate the buckle to switch sides between black and chocolate."
    },
    { 
      id: 25, 
      name: "Embossed Stitched Moving Belt (Chocolate)", 
      price: 1075, 
      salePrice: 699, 
      onSale: true, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[25] },
        { type: 'image', url: PRODUCT_IMAGES[42] },
        { type: 'image', url: PRODUCT_IMAGES[43] }
      ], 
      stock: true,
      category: "belt",
      color: ["chocolate", "black", "brown"],
      description: "Reversible belt with embossed stitching pattern. Rotate the buckle to switch sides between chocolate and black."
    },
    { 
      id: 26, 
      name: "Woven Pattern Moving Belt (Black)", 
      price: 1075, 
      salePrice: 699, 
      onSale: true, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[26] },
        { type: 'image', url: PRODUCT_IMAGES[44] },
        { type: 'image', url: PRODUCT_IMAGES[45] }
      ], 
      stock: true,
      category: "belt",
      color: ["black", "chocolate"]
    },
    { 
      id: 27, 
      name: "Woven Pattern Moving Belt (Chocolate)", 
      price: 1075, 
      salePrice: 699, 
      onSale: true, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[27] },
        { type: 'image', url: PRODUCT_IMAGES[44] },
        { type: 'image', url: PRODUCT_IMAGES[45] }
      ], 
      stock: true,
      category: "belt",
      color: ["chocolate", "brown", "black"]
    },
    { 
      id: 16, 
      name: "Premium Formal Moving Belt (Chocolate+Black)", 
      price: 1075, 
      salePrice: 699, 
      onSale: true, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[16] },
        { type: 'image', url: PRODUCT_IMAGES[34] },
        { type: 'image', url: PRODUCT_IMAGES[35] }
      ], 
      stock: true,
      category: "belt",
      color: ["chocolate", "black", "brown"],
      featured: true
    },
    { 
      id: 17, 
      name: "Premium Gridlock Moving Belt (Chocolate)", 
      price: 1075, 
      salePrice: 699, 
      onSale: true, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[17] },
        { type: 'image', url: PRODUCT_IMAGES[36] },
        { type: 'image', url: PRODUCT_IMAGES[37] }
      ], 
      stock: true,
      category: "belt",
      color: ["chocolate", "brown", "black"]
    },
    { 
      id: 18, 
      name: "Premium Formal Moving Belt (Black + Mustard)", 
      price: 1075, 
      salePrice: 699, 
      onSale: true, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[18] }
      ], 
      stock: false,
      category: "belt",
      color: ["black", "mustard", "tan"]
    },
    { 
      id: 19, 
      name: "Premium Basketweave Moving Belt (Chocolate)", 
      price: 1075, 
      salePrice: 699, 
      onSale: true, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[19] },
        { type: 'image', url: PRODUCT_IMAGES[46] },
        { type: 'image', url: PRODUCT_IMAGES[47] }
      ], 
      stock: true,
      category: "belt",
      color: ["chocolate", "brown", "black"]
    },
    { 
      id: 20, 
      name: "Double Stitched Moving Belt (Chocolate)", 
      price: 1075, 
      salePrice: 699, 
      onSale: true, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[20] },
        { type: 'image', url: PRODUCT_IMAGES[38] },
        { type: 'image', url: PRODUCT_IMAGES[39] }
      ], 
      stock: true,
      category: "belt",
      color: ["chocolate", "brown", "black"]
    },
    { 
      id: 21, 
      name: "Premium Basketweave Moving Belt (Black)", 
      price: 1075, 
      salePrice: 699, 
      onSale: true, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[21] },
        { type: 'image', url: PRODUCT_IMAGES[46] },
        { type: 'image', url: PRODUCT_IMAGES[47] }
      ], 
      stock: true,
      category: "belt",
      color: ["black", "chocolate"]
    },
    { 
      id: 22, 
      name: "Premium Gridlock Moving Belt (Black)", 
      price: 1075, 
      salePrice: 699, 
      onSale: true, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[22] },
        { type: 'image', url: PRODUCT_IMAGES[36] },
        { type: 'image', url: PRODUCT_IMAGES[37] }
      ], 
      stock: true,
      category: "belt",
      color: ["black", "chocolate"]
    },
    { 
      id: 10, 
      name: "Premium Dot Moving Black Belt", 
      price: 1075, 
      salePrice: 699, 
      onSale: true, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[10] },
        { type: 'image', url: PRODUCT_IMAGES[40] },
        { type: 'image', url: PRODUCT_IMAGES[41] }
      ], 
      stock: true,
      category: "belt",
      color: ["black", "brown"]
    },
    { 
      id: 11, 
      name: "Premium Dot Moving Brown Belt", 
      price: 1075, 
      salePrice: 699, 
      onSale: true, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[11] },
        { type: 'image', url: PRODUCT_IMAGES[40] },
        { type: 'image', url: PRODUCT_IMAGES[41] }
      ], 
      stock: true,
      category: "belt",
      color: ["brown", "black"]
    },
    { 
      id: 12, 
      name: "Double Stitched Moving Belt (Black)", 
      price: 1075, 
      salePrice: 699, 
      onSale: true, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[12] },
        { type: 'image', url: PRODUCT_IMAGES[38] },
        { type: 'image', url: PRODUCT_IMAGES[39] }
      ], 
      stock: true,
      category: "belt",
      color: ["black", "chocolate"]
    },
    { 
      id: 31, 
      name: "Premium Black Embossed Belt", 
      price: 799, 
      salePrice: 599, 
      onSale: true, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[31] }
      ], 
      stock: true,
      category: "belt",
      color: ["black"]
    },
    { 
      id: 4, 
      name: "Premium Brown Embossed Leather Belt", 
      price: 799, 
      salePrice: 599, 
      onSale: true, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[4] }
      ], 
      stock: true,
      category: "belt",
      color: ["brown"]
    },
    { 
      id: 1, 
      name: "Arrival Brown Belt", 
      price: 550, 
      salePrice: 550, 
      onSale: false, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[1] }
      ], 
      stock: true,
      category: "belt",
      color: ["brown"]
    },
    { 
      id: 2, 
      name: "Premium Formal Black Belt", 
      price: 550, 
      salePrice: 550, 
      onSale: false, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[2] }
      ], 
      stock: true,
      category: "belt",
      color: ["black"]
    },
    { 
      id: 5, 
      name: "Premium Stylish Long Wallets", 
      price: 649, 
      salePrice: 649, 
      onSale: false, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[5] }
      ], 
      stock: true,
      category: "wallet",
      color: ["black", "brown"]
    },
    { 
      id: 6, 
      name: "Spacious Bifold Wallet", 
      price: 549, 
      salePrice: 549, 
      onSale: false, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[6] }
      ], 
      stock: false,
      category: "wallet",
      color: ["brown"]
    },
    { 
      id: 8, 
      name: "Embossed Pattern Wallet", 
      price: 499, 
      salePrice: 499, 
      onSale: false, 
      media: [
        { type: 'image', url: PRODUCT_IMAGES[9] },
        { type: 'image', url: PRODUCT_IMAGES[8] }
      ], 
      stock: true,
      category: "wallet",
      color: ["red", "dark-red"]
    }
];

export const CONTACT_INFO = {
  phone: "01764228339",
  email: "hidehaven.contact@gmail.com",
  instagram: "_hide.haven",
  tiktok: "_hide.haven",
  facebookPage: "https://www.facebook.com/hidehavenleather",
};

export const LEATHER_INFO: LeatherInfo = {
    leatherTypes: [
        {
            name: "Full-Grain Leather",
            description: "The highest quality grade of leather. It comes from the top layer of the hide and includes all of the natural grain. It's known for its strength, durability, and character, developing a beautiful patina over time. It is used in the outer covering of our product like belts and wallets."
        },
        {
            name: "Top-Grain Leather",
            description: "The second-highest quality. It's split from the top layer of a hide, then sanded and refinished. This makes it more uniform and stain-resistant than full-grain, but slightly less durable. It is used in the inner lining of our products."
        },
        {
            name: "Genuine Leather",
            description: "A term that can be misleading. While it is real leather, it's typically made from the lower-quality layers of the hide. It doesn't have the same durability or character as full-grain or top-grain leather. We don't use genuine leather in our products."
        }
    ],
    qualityHallmarks: [
        {
            hallmark: "Rich, Natural Aroma",
            description: "High-quality leather has a distinct, rich smell, unlike the chemical odor of fake or low-grade materials."
        },
        {
            hallmark: "Natural Imperfections",
            description: "Look for small marks, scars, or variations in the grain. These are signs of true full-grain leather and add to its unique character."
        },
        {
            hallmark: "Solid Hardware",
            description: "Buckles, zippers, and clasps should feel heavy and durable. Quality craftsmanship extends to every part of the product."
        }
    ],
    careTips: [
        {
            tip: "Clean Gently",
            description: "Wipe with a soft, damp cloth. For tougher stains, use a cleaner specifically designed for leather. Avoid harsh chemicals."
        },
        {
            tip: "Condition Regularly",
            description: "Apply a leather conditioner every 6-12 months to keep the leather moisturized and prevent it from drying out or cracking."
        },
        {
            tip: "Store Properly",
            description: "Keep your leather goods in a cool, dry place away from direct sunlight. Use dust bags for storage to prevent scratches. Don't keep the leather items in damp or humid areas like soaked in water or longer time water contact."
        }
    ]
}