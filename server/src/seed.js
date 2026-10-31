import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { prisma } from './config/prisma.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    const hairstyleCount = await prisma.hairstyle.count();
    if (hairstyleCount > 0) {
      console.log('Database already populated with hairstyles. Skipping full seed.');
      return;
    }

    console.log('Seeding initial PostgreSQL data for Braiding with Nkathaa via Prisma...');

    // 1. Admin User
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@nkathaa.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: 'ADMIN' },
      create: {
        name: 'Nkathaa (Salon Founder)',
        email: adminEmail,
        password: hashedPassword,
        phone: '+254 712 345 678',
        role: 'ADMIN'
      }
    });
    console.log(`Admin user ready: ${adminEmail}`);

    // Sample Customer
    const customerPassword = await bcrypt.hash('ClientPassword123!', 10);
    const customer = await prisma.user.upsert({
      where: { email: 'sharon.otieno@gmail.com' },
      update: {},
      create: {
        name: 'Sharon Otieno',
        email: 'sharon.otieno@gmail.com',
        phone: '+254 712 345 678',
        password: customerPassword,
        role: 'CUSTOMER'
      }
    });

    // 2. Hairstyles
    const sampleHairstyles = [
      {
        name: 'Medium Knotless Braids',
        slug: 'medium-knotless-braids',
        category: 'Knotless Braids',
        price: 4500,
        duration: '4 - 5 hours',
        durationMinutes: 270,
        hairLength: 'At least 3-4 inches',
        imageUrl: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=1000&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1584297091622-af8e5fdcf123?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1000&auto=format&fit=crop'
        ],
        shortDescription: 'Tension-free, natural scalp root parting with seamless extensions for maximum movement and comfort.',
        description: 'Our signature Medium Knotless Braids are the ultimate protective style. Starting with your natural hair and gradually feeding in premium synthetic or human hair blend fibers, these braids lie completely flat against your scalp with zero tension, no bumps, and immediate styling flexibility.',
        isPopular: true,
        isTrending: true,
        maintenanceTips: [
          'Sleep with a silk or satin bonnet or pillowcase every night.',
          'Spritz scalp with rosewater or lightweight tea tree scalp tonic every 2-3 days.',
          'Apply braid mousse weekly and set under a silk scarf for 10 minutes to melt flyaways.'
        ],
        faqs: [
          {
            question: 'How long do knotless braids last?',
            answer: 'With proper nighttime satin protection and light scalp hydration, medium knotless braids look pristine for 6 to 8 weeks.'
          },
          {
            question: 'Can I wash my hair while in knotless braids?',
            answer: 'Yes! We recommend using a diluted gentle scalp cleanser focused on the roots, followed by thorough drying with a hooded dryer or cool air dryer.'
          }
        ]
      },
      {
        name: 'Luxury Boho Knotless Braids',
        slug: 'luxury-boho-knotless-braids',
        category: 'Boho Braids',
        price: 6500,
        duration: '5 - 6 hours',
        durationMinutes: 330,
        hairLength: 'At least 4 inches',
        imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1597225244660-1cd128c64284?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?q=80&w=1000&auto=format&fit=crop'
        ],
        shortDescription: 'Ethereal curly strands framing bohemian braids for a romantic, goddess-inspired vacation look.',
        description: 'Goddess Boho Knotless Braids combine clean, crisp square or triangular parts with lightweight curly human hair tendrils cascading throughout the length and ends. Perfect for vacations, weddings, or everyday glamour.',
        isPopular: true,
        isTrending: true,
        maintenanceTips: [
          'Finger-detangle curly tendrils gently using water and leave-in conditioner.',
          'Never brush dry human curls with fine-tooth combs.',
          'Section into 2-4 large loose braids before putting on your satin bonnet.'
        ],
        faqs: [
          {
            question: 'Do you provide the human hair curls?',
            answer: 'We provide 100% virgin human hair bulk curls for purchase at our studio, or you may bring your preferred curls.'
          }
        ]
      },
      {
        name: 'Passion Twists (Water Wave)',
        slug: 'passion-twists-water-wave',
        category: 'Twists',
        price: 5000,
        duration: '3.5 - 4.5 hours',
        durationMinutes: 240,
        hairLength: 'At least 3 inches',
        imageUrl: 'https://images.unsplash.com/photo-1584297091622-af8e5fdcf123?q=80&w=1000&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1584297091622-af8e5fdcf123?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=1000&auto=format&fit=crop'
        ],
        shortDescription: 'Bohemian textured two-strand twists with a lustrous, bouncy, natural bounce.',
        description: 'Passion twists give a textured, modern look created with water-wave extensions. They are soft, bouncy, featherlight on the scalp, and age gracefully as the texture blends naturally with your hair growth.',
        isPopular: true,
        isTrending: false,
        maintenanceTips: [
          'Moisturize your natural hair underneath using a liquid spray.',
          'Avoid heavy oils that weigh down the bouncy water-wave curls.'
        ],
        faqs: [
          {
            question: 'Are passion twists heavy?',
            answer: 'Not at all! Passion twists are significantly lighter than traditional Havana or Marley twists.'
          }
        ]
      },
      {
        name: 'Fulani Tribal Cornrows with Beads',
        slug: 'fulani-tribal-cornrows-with-beads',
        category: 'Cornrows',
        price: 4800,
        duration: '3.5 - 4 hours',
        durationMinutes: 210,
        hairLength: 'At least 3 inches',
        imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1000&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1000&auto=format&fit=crop'
        ],
        shortDescription: 'Intricate tribal geometric parting with side hanging plaits and authentic wooden or brass beads.',
        description: 'Inspired by traditional West African Fulani hair artistry, this hairstyle features feed-in stitch cornrows down the center with braids looped forward over the shoulders, finished with custom decorative cowrie shells and brass cuffs.',
        isPopular: false,
        isTrending: true,
        maintenanceTips: [
          'Oil parted rows directly with an applicator bottle using peppermint jojoba oil.',
          'Wrap with a silk band at bedtime to preserve crisp lines.'
        ],
        faqs: [
          {
            question: 'Are beads included in the appointment?',
            answer: 'Yes! We offer a complimentary selection of wooden, gold brass, and transparent beads.'
          }
        ]
      },
      {
        name: 'French Curl Braids (Super Soft)',
        slug: 'french-curl-braids-super-soft',
        category: 'Trending Styles',
        price: 5800,
        duration: '4.5 - 5.5 hours',
        durationMinutes: 300,
        hairLength: 'At least 4 inches',
        imageUrl: 'https://images.unsplash.com/photo-1597225244660-1cd128c64284?q=80&w=1000&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1597225244660-1cd128c64284?q=80&w=1000&auto=format&fit=crop'
        ],
        shortDescription: 'Silky, voluminous bouncy curls at the ends that cascade over shoulders like spun silk.',
        description: 'The reigning viral favorite! French Curl Braids feature neat box or knotless roots that transition into bouncy, silky French spiral curls at the mid-lengths. Incredible bounce, silky sheen, and lightweight comfort.',
        isPopular: true,
        isTrending: true,
        maintenanceTips: [
          'Use a wide-tooth comb or loop brush on the curl ends only.',
          'Pin curls in loose rollers inside your bonnet to preserve curl definition.'
        ],
        faqs: []
      },
      {
        name: 'Goddess Soft Faux Locs',
        slug: 'goddess-soft-faux-locs',
        category: 'Locs & Faux Locs',
        price: 6000,
        duration: '4.5 - 5 hours',
        durationMinutes: 270,
        hairLength: 'At least 3 inches',
        imageUrl: 'https://images.unsplash.com/photo-1584297091622-af8e5fdcf123?q=80&w=1000&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1584297091622-af8e5fdcf123?q=80&w=1000&auto=format&fit=crop'
        ],
        shortDescription: 'Effortlessly soft, textured bohemian faux locs with natural wavy ends and zero stiffness.',
        description: 'Unlike heavy traditional locs, our Goddess Soft Locs are flexible from day one! Wrapped gently with soft textured water-wave hair, leaving curls exposed along the shaft for an authentic bohemian vibe.',
        isPopular: false,
        isTrending: true,
        maintenanceTips: [
          'Keep your natural roots moisturized with leave-in spray.',
          'Smooth sweet almond oil down the loc shafts.'
        ],
        faqs: []
      },
      {
        name: 'Feed-in Stitch Cornrows (6-8 Rows)',
        slug: 'feed-in-stitch-cornrows-6-8-rows',
        category: 'Cornrows',
        price: 3500,
        duration: '2.5 - 3 hours',
        durationMinutes: 160,
        hairLength: 'At least 3 inches',
        imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1000&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1000&auto=format&fit=crop'
        ],
        shortDescription: 'Ultra-crisp razor-clean stitch lines that lay flat, chic, and polished.',
        description: 'Razor-sharp precision parting with uniform stitch lines that feed in hair cleanly. Minimalist, modern, and perfectly suited for workouts, business travel, and formal galas.',
        isPopular: false,
        isTrending: false,
        maintenanceTips: [
          'Tie down with an elastic satin edge wrap every evening.'
        ],
        faqs: []
      },
      {
        name: 'Natural Two-Strand Mini Twists',
        slug: 'natural-two-strand-mini-twists',
        category: 'Twists',
        price: 3800,
        duration: '3 - 4 hours',
        durationMinutes: 210,
        hairLength: 'Natural hair 4+ inches',
        imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop'
        ],
        shortDescription: 'Gentle two-strand twists using your natural hair or lightweight extensions for deep moisture retention.',
        description: 'Celebrate natural hair health! Our mini twists are infused with organic shea butter, flaxseed gel, and rosemary oil to retain maximum length while giving you versatile daily styling options.',
        isPopular: false,
        isTrending: false,
        maintenanceTips: [
          'Mist with aloe vera juice and rosewater spray daily.'
        ],
        faqs: []
      }
    ];

    const createdHairstyles = [];
    for (const style of sampleHairstyles) {
      const created = await prisma.hairstyle.create({ data: style });
      createdHairstyles.push(created);
    }
    console.log(`Seeded ${createdHairstyles.length} hairstyles.`);

    // 3. Gallery Items
    const sampleGallery = [
      {
        title: 'Waist-Length Honey Blonde Boho Knotless',
        category: 'Boho Braids',
        imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop',
        aspectRatio: 'tall',
        tags: ['#Knotless', '#Boho', '#HoneyBlonde', '#Summer'],
        likes: 142,
        featured: true
      },
      {
        title: 'Precision Stitch Cornrows & Clean Edges',
        category: 'Cornrows',
        imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1000&auto=format&fit=crop',
        aspectRatio: 'square',
        tags: ['#StitchBraids', '#CleanLines', '#Precision'],
        likes: 98,
        featured: true
      },
      {
        title: 'Midnight Black Knotless with Wispy Curls',
        category: 'Knotless',
        imageUrl: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=1000&auto=format&fit=crop',
        aspectRatio: 'tall',
        tags: ['#KnotlessBraids', '#NairobiBraider', '#ProtectiveStyle'],
        likes: 215,
        featured: true
      },
      {
        title: 'Goddess Curly Ends Close-up',
        category: 'Goddess',
        imageUrl: 'https://images.unsplash.com/photo-1597225244660-1cd128c64284?q=80&w=1000&auto=format&fit=crop',
        aspectRatio: 'tall',
        tags: ['#GoddessBraids', '#HumanHairCurls'],
        likes: 184,
        featured: false
      },
      {
        title: 'Textured Water Wave Passion Twists',
        category: 'Twists',
        imageUrl: 'https://images.unsplash.com/photo-1584297091622-af8e5fdcf123?q=80&w=1000&auto=format&fit=crop',
        aspectRatio: 'tall',
        tags: ['#PassionTwists', '#BouncyHair', '#TwistStyles'],
        likes: 129,
        featured: false
      },
      {
        title: 'Editorial Braided Crown Updo for Gala',
        category: 'Editorial',
        imageUrl: 'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?q=80&w=1000&auto=format&fit=crop',
        aspectRatio: 'square',
        tags: ['#Editorial', '#BraidedCrown', '#HighFashion'],
        likes: 310,
        featured: true
      }
    ];

    for (const gal of sampleGallery) {
      await prisma.galleryItem.create({ data: gal });
    }
    console.log(`Seeded ${sampleGallery.length} gallery photos.`);

    // 4. Reviews
    const sampleReviews = [
      {
        customerName: 'Amina Muthoni',
        rating: 5,
        comment: 'Nkathaa is hands down the gentlest braider in Nairobi! I have a super sensitive scalp and always dread tight braiding, but with her knotless braids I had ZERO pain and slept like a baby on the very first night. 10/10 service!',
        hairstyleCategory: 'Knotless Braids',
        hairstyleName: 'Medium Knotless Braids',
        customerLocation: 'Kilimani, Nairobi',
        isApproved: true
      },
      {
        customerName: 'Zawadi Chebet',
        rating: 5,
        comment: 'My Boho braids lasted 7 full weeks on my Diani beach vacation! The human hair curls never matted and Nkathaa explained exactly how to maintain them. The studio ambiance with soothing lavender vibes makes the appointment fly by.',
        hairstyleCategory: 'Boho Braids',
        hairstyleName: 'Luxury Boho Knotless Braids',
        customerLocation: 'Westlands, Nairobi',
        isApproved: true
      },
      {
        customerName: 'Brenda Kerubo',
        rating: 5,
        comment: 'Punctual, professional, and immaculate parting! Stitch cornrows were sharp and neat. Plus online booking and deposit was seamless with M-Pesa. Nkathaa is my forever stylist.',
        hairstyleCategory: 'Cornrows',
        hairstyleName: 'Feed-in Stitch Cornrows',
        customerLocation: 'Lavington, Nairobi',
        isApproved: true
      },
      {
        customerName: 'Faith Wanjiku',
        rating: 5,
        comment: 'The passion twists are so lightweight and bouncy! I got countless compliments at the office. Love how clean and modern her workspace is.',
        hairstyleCategory: 'Twists',
        hairstyleName: 'Passion Twists',
        customerLocation: 'Kileleshwa, Nairobi',
        isApproved: true
      }
    ];

    for (const rev of sampleReviews) {
      await prisma.review.create({ data: rev });
    }
    console.log(`Seeded ${sampleReviews.length} client reviews.`);

    // 5. Coupons
    const sampleCoupons = [
      {
        code: 'FIRST10',
        discountPercent: 10,
        description: 'Welcome gift: 10% off your first appointment!',
        maxUses: 200,
        usedCount: 14,
        isActive: true
      },
      {
        code: 'NKATHAAVIP',
        discountPercent: 15,
        description: 'VIP member exclusive discount',
        maxUses: 50,
        usedCount: 8,
        isActive: true
      },
      {
        code: 'SUMMERGLOW',
        discountPercent: 20,
        description: 'Holiday styling special',
        maxUses: 100,
        usedCount: 22,
        isActive: true
      }
    ];

    for (const coup of sampleCoupons) {
      await prisma.coupon.create({ data: coup });
    }
    console.log(`Seeded ${sampleCoupons.length} promotional coupons.`);

    // 6. Bookings & Payments
    const today = new Date();
    const formatDate = (offsetDays) => {
      const d = new Date(today);
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString().split('T')[0];
    };

    const b1 = await prisma.booking.create({
      data: {
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone || '+254 712 345 678',
        customerEmail: customer.email,
        hairstyleId: createdHairstyles[0].id,
        hairstyleName: createdHairstyles[0].name,
        date: formatDate(1),
        timeSlot: '10:00 AM',
        preferredHairColor: '#1B - Natural Black',
        notes: 'Please tuck edges very gently.',
        status: 'CONFIRMED',
        totalAmount: 4500,
        depositAmount: 1000,
        depositPaid: true
      }
    });

    // 1-to-1 Payment relation
    await prisma.payment.create({
      data: {
        bookingId: b1.id,
        amount: 1000,
        transactionCode: 'QKD829104B',
        status: 'COMPLETED',
        paymentMethod: 'M-PESA'
      }
    });

    const b2 = await prisma.booking.create({
      data: {
        customerId: customer.id,
        customerName: 'Grace Njeri',
        customerPhone: '+254 722 889 900',
        customerEmail: 'grace.njeri@yahoo.com',
        hairstyleId: createdHairstyles[1].id,
        hairstyleName: createdHairstyles[1].name,
        date: formatDate(2),
        timeSlot: '01:00 PM',
        preferredHairColor: '#27 / #30 Honey Ombre Blend',
        notes: 'Traveling on Saturday, excited for boho curls!',
        status: 'PENDING',
        totalAmount: 6500,
        depositAmount: 1000,
        depositPaid: false
      }
    });

    console.log('Seeded sample bookings and payments.');
    console.log('PostgreSQL Prisma database seeding finished successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Allow standalone execution: `node src/seed.js`
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(async () => {
      await prisma.$disconnect();
      process.exit(0);
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
