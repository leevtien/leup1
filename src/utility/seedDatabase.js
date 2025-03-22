// scripts/initializeDatabase.js
const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  serverTimestamp,
  Timestamp
} = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

// Your Firebase config from environment variables
const firebaseConfig = {
  aapiKey: "AIzaSyAsPE7UwcsLRyDExYHtyAnF9hBgr0Z0lKc",
  authDomain: "ecommerce-22984.firebaseapp.com",
  projectId: "ecommerce-22984",
  storageBucket: "ecommerce-22984.firebasestorage.app",
  messagingSenderId: "982247400347",
  appId: "1:982247400347:web:9fec7244a2678b5604773e",
  measurementId: "G-1LNBV0R9WV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper function to create a timestamp for a specific date
const createTimestamp = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return Timestamp.fromDate(date);
};

const initializeDatabase = async () => {
  try {
    console.log('Starting database initialization...');

    // 1. Seed Users Collection
    console.log('Seeding users collection...');
    const users = [
      {
        id: 'user1',
        email: 'customer@example.com',
        displayName: 'John Customer',
        photoURL: 'https://randomuser.me/api/portraits/men/1.jpg',
        phoneNumber: '+1234567890',
        role: 'customer',
        createdAt: createTimestamp(60),
        lastLoginAt: createTimestamp(1),
        addresses: {
          billing: {
            name: 'John Customer',
            line1: '123 Main St',
            line2: 'Apt 4B',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'US'
          },
          shipping: {
            name: 'John Customer',
            line1: '123 Main St',
            line2: 'Apt 4B',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'US'
          }
        },
        wishlist: ['netflix-premium', 'spotify-premium']
      },
      {
        id: 'admin1',
        email: 'admin@example.com',
        displayName: 'Admin User',
        photoURL: 'https://randomuser.me/api/portraits/women/1.jpg',
        phoneNumber: '+1987654321',
        role: 'admin',
        createdAt: createTimestamp(90),
        lastLoginAt: createTimestamp(0)
      }
    ];

    for (const user of users) {
      const { id, ...userData } = user;
      await setDoc(doc(db, 'users', id), userData);
    }

    // 2. Seed Categories Collection
    console.log('Seeding categories collection...');
    const categories = [
      {
        id: 'entertainment',
        name: 'Entertainment',
        slug: 'entertainment',
        description: 'Digital entertainment products and subscriptions',
        image: '/images/categories/entertainment.jpg',
        icon: 'FaFilm',
        displayOrder: 1,
        isActive: true
      },
      {
        id: 'productivity',
        name: 'Productivity',
        slug: 'productivity',
        description: 'Software and tools to boost your productivity',
        image: '/images/categories/productivity.jpg',
        icon: 'FaLaptopCode',
        displayOrder: 2,
        isActive: true
      },
      {
        id: 'security',
        name: 'Security',
        slug: 'security',
        description: 'Protect your devices and data with security software',
        image: '/images/categories/security.jpg',
        icon: 'FaShieldAlt',
        displayOrder: 3,
        isActive: true
      },
      {
        id: 'education',
        name: 'Education',
        slug: 'education',
        description: 'Digital learning resources and courses',
        image: '/images/categories/education.jpg',
        icon: 'FaGraduationCap',
        displayOrder: 4,
        isActive: true
      }
    ];

    for (const category of categories) {
      const { id, ...categoryData } = category;
      await setDoc(doc(db, 'categories', id), {
        ...categoryData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    // 3. Seed Products Collection
    console.log('Seeding products collection...');
    const products = [
      {
        id: 'netflix-premium',
        name: 'Netflix Premium',
        slug: 'netflix-premium',
        description: '<p>Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.</p><p>You can watch as much as you want, whenever you want without a single commercial – all for one low monthly price. There\'s always something new to discover and new TV shows and movies are added every week!</p>',
        shortDescription: 'Stream unlimited movies and TV shows in 4K across all your devices',
        price: 19.99,
        salePrice: 17.99,
        images: ['/images/products/netflix-premium.jpg'],
        thumbnail: '/images/products/netflix-premium.jpg',
        category: 'entertainment',
        subcategory: 'streaming',
        tags: ['streaming', 'movies', 'tv-shows', 'subscription'],
        features: [
          'Unlimited movies and TV shows',
          'Watch on 4 screens at once',
          '4K Ultra HD available',
          'Cancel anytime',
          'No ads or commercials'
        ],
        isActive: true,
        isFeatured: true,
        isNew: false,
        soldCount: 150,
        rating: {
          average: 4.8,
          count: 48
        },
        createdAt: createTimestamp(120),
        updatedAt: createTimestamp(5),
        productType: 'subscription',
        subscriptionDetails: {
          billingCycle: 'monthly',
          trialDays: 30,
          features: [
            'Full HD streaming',
            'Multiple device access',
            'New releases every week'
          ]
        },
        deliveryInfo: 'Account details will be delivered via email within 24 hours of purchase.'
      },
      {
        id: 'spotify-premium',
        name: 'Spotify Premium',
        slug: 'spotify-premium',
        description: '<p>Spotify Premium is a subscription-based music streaming service that gives you access to millions of songs, podcasts, and videos from artists all over the world.</p><p>With Spotify Premium, you can listen to music ad-free, download songs for offline listening, and enjoy better sound quality.</p>',
        shortDescription: 'Ad-free music streaming with offline listening and unlimited skips',
        price: 9.99,
        salePrice: null,
        images: ['/images/products/spotify.jpg'],
        thumbnail: '/images/products/spotify.jpg',
        category: 'entertainment',
        subcategory: 'music',
        tags: ['music', 'streaming', 'subscription'],
        features: [
          'Ad-free music listening',
          'Download to listen offline',
          'Play songs in any order',
          'Higher sound quality',
          'Unlimited skips'
        ],
        isActive: true,
        isFeatured: true,
        isNew: false,
        soldCount: 130,
        rating: {
          average: 4.7,
          count: 36
        },
        createdAt: createTimestamp(110),
        updatedAt: createTimestamp(10),
        productType: 'subscription',
        subscriptionDetails: {
          billingCycle: 'monthly',
          trialDays: 7,
          features: [
            'Ad-free music',
            'Offline downloads',
            'Premium sound quality'
          ]
        },
        deliveryInfo: 'Account details will be delivered via email within 24 hours of purchase.'
      },
      {
        id: 'office-365',
        name: 'Microsoft Office 365',
        slug: 'office-365',
        description: '<p>Microsoft Office 365 is a cloud-based subscription service that brings together premium versions of the best-in-class Office applications with cloud services, device management, and advanced security.</p><p>Get the power and flexibility to work from virtually anywhere on almost any device using web, mobile, and desktop applications.</p>',
        shortDescription: 'Complete productivity suite with Word, Excel, PowerPoint and more',
        price: 99.99,
        salePrice: 69.99,
        images: ['/images/products/office-365.jpg'],
        thumbnail: '/images/products/office-365.jpg',
        category: 'productivity',
        tags: ['office', 'productivity', 'microsoft', 'subscription'],
        features: [
          'Word, Excel, PowerPoint, Outlook',
          'OneDrive cloud storage (1TB)',
          'Use on multiple devices',
          'Regular updates and new features',
          'Technical support included'
        ],
        isActive: true,
        isFeatured: true,
        isNew: false,
        soldCount: 95,
        rating: {
          average: 4.6,
          count: 29
        },
        createdAt: createTimestamp(100),
        updatedAt: createTimestamp(15),
        productType: 'subscription',
        subscriptionDetails: {
          billingCycle: 'yearly',
          trialDays: 30,
          features: [
            'Full Office suite',
            'Cloud storage',
            'Multi-device access'
          ]
        },
        requirements: [
          'Windows 10 or macOS Sierra and above',
          'Internet connection',
          'Microsoft account'
        ],
        deliveryInfo: 'Product key and download instructions will be sent via email immediately after purchase.'
      },
      {
        id: 'adobe-cc',
        name: 'Adobe Creative Cloud',
        slug: 'adobe-creative-cloud',
        description: '<p>Adobe Creative Cloud gives you the world\'s best creative apps and services so you can make anything you can imagine, wherever you\'re inspired.</p><p>Get over 20 desktop and mobile apps including Photoshop, Illustrator, InDesign, Premiere Pro, and Acrobat Pro DC, plus 100GB of cloud storage.</p>',
        shortDescription: 'Access all creative apps for photo, video, and design',
        price: 52.99,
        salePrice: 49.99,
        images: ['/images/products/adobe-cc.jpg'],
        thumbnail: '/images/products/adobe-cc.jpg',
        category: 'productivity',
        tags: ['design', 'creative', 'adobe', 'subscription'],
        features: [
          'Over 20 creative desktop and mobile apps',
          '100GB of cloud storage',
          'Adobe Fonts and Adobe Portfolio',
          'Regular updates with new features',
          'Adobe Stock integration'
        ],
        isActive: true,
        isFeatured: true,
        isNew: false,
        soldCount: 85,
        rating: {
          average: 4.7,
          count: 32
        },
        createdAt: createTimestamp(95),
        updatedAt: createTimestamp(20),
        productType: 'subscription',
        subscriptionDetails: {
          billingCycle: 'monthly',
          trialDays: 7,
          features: [
            'Complete creative suite',
            'Cloud storage',
            'Font library access'
          ]
        },
        requirements: [
          'Windows 10 (64-bit) or macOS 10.14 or higher',
          'Internet connection',
          'Adobe ID'
        ],
        deliveryInfo: 'Account details and activation instructions will be sent via email within 24 hours of purchase.'
      },
      {
        id: 'nordvpn',
        name: 'NordVPN Premium',
        slug: 'nordvpn-premium',
        description: '<p>NordVPN gives you military-grade encryption and a strict no-logs policy for top-notch security and privacy. Our VPN servers are located in 59 countries around the world, ensuring you have a stable and secure connection wherever you go.</p><p>With one NordVPN account, you can protect up to 6 devices at the same time, including your laptop, smartphone, tablet, and more.</p>',
        shortDescription: 'Secure your online activity with advanced encryption',
        price: 11.99,
        salePrice: 9.99,
        images: ['/images/products/nordvpn.jpg'],
        thumbnail: '/images/products/nordvpn.jpg',
        category: 'security',
        tags: ['vpn', 'security', 'privacy', 'subscription'],
        features: [
          'Military-grade encryption',
          'No-logs policy',
          'Connect up to 6 devices',
          'Access 5200+ servers in 59 countries',
          'Block ads and malware with CyberSec'
        ],
        isActive: true,
        isFeatured: false,
        isNew: false,
        soldCount: 78,
        rating: {
          average: 4.5,
          count: 24
        },
        createdAt: createTimestamp(90),
        updatedAt: createTimestamp(25),
        productType: 'subscription',
        subscriptionDetails: {
          billingCycle: 'yearly',
          trialDays: 30,
          features: [
            'Global server network',
            'No-logs policy',
            'Military-grade encryption'
          ]
        },
        requirements: [
          'Windows, macOS, iOS, Android, Linux, or Router',
          'Internet connection'
        ],
        deliveryInfo: 'Login details will be sent via email immediately after purchase.'
      }
    ];

    for (const product of products) {
      const { id, ...productData } = product;
      await setDoc(doc(db, 'products', id), productData);
    }

    // 4. Seed Orders Collection
    console.log('Seeding orders collection...');
    const orders = [
      {
        id: 'order1',
        userId: 'user1',
        orderNumber: 'ORD-2025-001',
        items: [
          {
            productId: 'netflix-premium',
            name: 'Netflix Premium',
            price: 17.99,
            quantity: 1,
            image: '/images/products/netflix-premium.jpg'
          }
        ],
        subtotal: 17.99,
        tax: 0,
        discount: 0,
        total: 17.99,
        status: 'completed',
        paymentStatus: 'paid',
        paymentMethod: 'credit_card',
        paymentId: 'pay_abc123',
        createdAt: createTimestamp(30),
        updatedAt: createTimestamp(29),
        billingAddress: {
          name: 'John Customer',
          line1: '123 Main St',
          line2: 'Apt 4B',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'US'
        },
        deliveryMethod: 'email',
        deliveryEmail: 'customer@example.com',
        deliveryDetails: {
          sentAt: createTimestamp(29),
          deliveryData: 'Email: netflix_premium@example.com\nPassword: P@ssw0rd123\n\nActivation Instructions: Log in at netflix.com'
        }
      },
      {
        id: 'order2',
        userId: 'user1',
        orderNumber: 'ORD-2025-002',
        items: [
          {
            productId: 'office-365',
            name: 'Microsoft Office 365',
            price: 69.99,
            quantity: 1,
            image: '/images/products/office-365.jpg'
          }
        ],
        subtotal: 69.99,
        tax: 0,
        discount: 0,
        total: 69.99,
        status: 'completed',
        paymentStatus: 'paid',
        paymentMethod: 'paypal',
        paymentId: 'pay_def456',
        createdAt: createTimestamp(15),
        updatedAt: createTimestamp(14),
        billingAddress: {
          name: 'John Customer',
          line1: '123 Main St',
          line2: 'Apt 4B',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'US'
        },
        deliveryMethod: 'email',
        deliveryEmail: 'customer@example.com',
        deliveryDetails: {
          sentAt: createTimestamp(14),
          deliveryData: 'Product Key: XXXX-XXXX-XXXX-XXXX\n\nDownload Instructions: Visit office.com/setup'
        }
      }
    ];

    for (const order of orders) {
      const { id, ...orderData } = order;
      await setDoc(doc(db, 'orders', id), orderData);
    }

    // 5. Seed Reviews Collection
    console.log('Seeding reviews collection...');
    const reviews = [
      {
        id: 'review1',
        userId: 'user1',
        productId: 'netflix-premium',
        userName: 'John Customer',
        rating: 5,
        title: 'Excellent streaming service',
        content: 'Netflix Premium offers an amazing selection of movies and TV shows. The 4K streaming quality is outstanding, and being able to watch on multiple devices simultaneously is perfect for my family.',
        createdAt: createTimestamp(25),
        isVerified: true,
        isApproved: true,
        helpfulCount: 8
      },
      {
        id: 'review2',
        userId: 'user1',
        productId: 'office-365',
        userName: 'John Customer',
        rating: 4,
        title: 'Great productivity suite',
        content: 'Microsoft Office 365 has all the tools I need for work and personal projects. The cloud integration works seamlessly, and I love having access on multiple devices. Only giving 4 stars because the price is a bit high.',
        createdAt: createTimestamp(10),
        isVerified: true,
        isApproved: true,
        helpfulCount: 5,
        response: {
          content: 'Thank you for your review! Were glad youre enjoying Office 365. We try to provide the best value possible with regular updates and cloud storage included.',
          createdAt: createTimestamp(9),
          responderName: 'Support Team',
          responderRole: 'admin'
        }
      }
    ];

    for (const review of reviews) {
      const { id, ...reviewData } = review;
      await setDoc(doc(db, 'reviews', id), reviewData);
    }

    // 6. Seed Coupons Collection
    console.log('Seeding coupons collection...');
    const coupons = [
      {
        id: 'coupon1',
        code: 'WELCOME20',
        description: 'Get 20% off your first purchase',
        discountType: 'percentage',
        discountValue: 20,
        minOrderValue: 10,
        maxDiscount: 100,
        startDate: createTimestamp(60),
        endDate: createTimestamp(-60), // 60 days in the future
        isActive: true,
        usageLimit: 1000,
        usedCount: 120,
        applicableProducts: [],
        applicableCategories: []
      },
      {
        id: 'coupon2',
        code: 'ENTERTAINMENT15',
        description: '15% off Entertainment products',
        discountType: 'percentage',
        discountValue: 15,
        minOrderValue: 0,
        maxDiscount: 50,
        startDate: createTimestamp(30),
        endDate: createTimestamp(-30), // 30 days in the future
        isActive: true,
        usageLimit: 500,
        usedCount: 85,
        applicableProducts: [],
        applicableCategories: ['entertainment']
      }
    ];

    for (const coupon of coupons) {
      const { id, ...couponData } = coupon;
      await setDoc(doc(db, 'coupons', id), couponData);
    }

    // 7. Seed Transactions Collection
    console.log('Seeding transactions collection...');
    const transactions = [
      {
        id: 'transaction1',
        userId: 'user1',
        orderId: 'order1',
        amount: 17.99,
        currency: 'USD',
        status: 'successful',
        paymentMethod: 'credit_card',
        paymentGateway: 'stripe',
        gatewayTransactionId: 'ch_abc123',
        createdAt: createTimestamp(30)
      },
      {
        id: 'transaction2',
        userId: 'user1',
        orderId: 'order2',
        amount: 69.99,
        currency: 'USD',
        status: 'successful',
        paymentMethod: 'paypal',
        paymentGateway: 'paypal',
        gatewayTransactionId: 'pay_def456',
        createdAt: createTimestamp(15)
      }
    ];

    for (const transaction of transactions) {
      const { id, ...transactionData } = transaction;
      await setDoc(doc(db, 'transactions', id), transactionData);
    }

    // 8. Seed Settings Collection (optional)
    console.log('Seeding settings collection...');
    const settings = {
      site: {
        name: 'Digital Products Store',
        logo: '/images/logo.png',
        contactEmail: 'support@digitalstore.com',
        supportPhone: '+1234567890',
        socialLinks: {
          facebook: 'https://facebook.com/digitalstore',
          twitter: 'https://twitter.com/digitalstore',
          instagram: 'https://instagram.com/digitalstore'
        },
        metaTitle: 'Digital Products Store - Premium Digital Goods',
        metaDescription: 'Shop for premium digital products including software, subscriptions, and more.'
      },
      payments: {
        enabledMethods: ['credit_card', 'paypal'],
        currencies: ['USD'],
        defaultCurrency: 'USD'
      }
    };

    await setDoc(doc(db, 'settings', 'site'), settings.site);
    await setDoc(doc(db, 'settings', 'payments'), settings.payments);

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Execute the initialization
initializeDatabase()
  .then(() => console.log('Script completed!'))
  .catch(err => console.error('Script failed:', err));