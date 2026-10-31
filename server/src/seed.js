import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Hairstyle } from './models/Hairstyle.js';
import { AdminUser } from './models/AdminUser.js';
import { Review } from './models/Review.js';
import { GalleryItem } from './models/GalleryItem.js';
import { Booking } from './models/Booking.js';
import { Coupon } from './models/Coupon.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    const hairstyleCount = await Hairstyle.countDocuments();
    if (hairstyleCount > 0) {
      console.log('Database already populated with hairstyles. Skipping full seed.');
      return;
    }

    console.log('Seeding initial data for Braiding with Nkathaa...');

    // 1. Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@nkathaa.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
    
    let admin = await AdminUser.findOne({ email: adminEmail.toLowerCase() });
    if (!admin) {
      admin = new AdminUser({
        name: 'Nkathaa (Salon Founder)',
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: 'admin'
      });
      await admin.save();
      console.log(`Admin user created: ${adminEmail} / ${adminPassword}`);
    }

    // 2. Hairstyles
    const sampleHairstyles = [
      {
        name: 'Medium Knotless Braids',
        category: 'Knotless Braids',
        price: 4500, // KES
        duration: '4 - 5 hours',
        durationMinutes: 270,
        hairLengthRequired: 'At least 3-4 inches',
        shortDescription: 'Tension-free, natural scalp root parting with seamless extensions for maximum movement and comfort.',
        description: 'Our signature Medium Knotless Braids are the ultimate protective style. Starting with your natural hair and gradually feeding in premium synthetic or human hair blend fibers, these braids lie completely flat against your scalp with zero tension, no bumps, and immediate styling flexibility.',
        images: [
          'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1584297091622-af8e5fdcf123?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1000&auto=format&fit=crop'
        ],
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
        category: 'Boho Braids',
        price: 6500,
        duration: '5 - 6 hours',
        durationMinutes: 330,
        hairLengthRequired: 'At least 4 inches',
        shortDescription: 'Ethereal curly strands framing bohemian braids for a romantic, goddess-inspired vacation look.',
        description: 'Goddess Boho Knotless Braids combine clean, crisp square or triangular parts with lightweight curly human hair tendrils cascading throughout the length and ends. Perfect for vacations, weddings, or everyday glamour.',
        images: [
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1597225244660-1cd128c64284?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?q=80&w=1000&auto=format&fit=crop'
        ],
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
          },
          {
            question: 'Will the curly ends tangle?',
            answer: 'Human hair curls behave just like natural hair. With light mousse and gentle finger-separation, tangling is minimized.'
          }
        ]
      },
      {
        name: 'Passion Twists (Water Wave)',
        category: 'Twists',
        price: 5000,
        duration: '3.5 - 4.5 hours',
        durationMinutes: 240,
        hairLengthRequired: 'At least 3 inches',
        shortDescription: 'Bohemian textured two-strand twists with a lustrous, bouncy, natural bounce.',
        description: 'Passion twists give a textured, modern look created with water-wave extensions. They are soft, bouncy, featherlight on the scalp, and age gracefully as the texture blends naturally with your hair growth.',
        images: [
          'https://images.unsplash.com/photo-1584297091622-af8e5fdcf123?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=1000&auto=format&fit=crop'
        ],
        isPopular: true,
        isTrending: false,
        maintenanceTips: [
          'Moisturize your natural hair underneath using a liquid spray.',
          'Avoid heavy oils that weigh down the bouncy water-wave curls.',
          'Protect edges with a silk scarf tied snugly around the perimeter.'
        ],
        faqs: [
          {
            question: 'Are passion twists heavy?',
            answer: 'Not at all! Passion twists are significantly lighter than traditional Havana or Marley twists because of the hollow water-wave texture.'
          }
        ]
      },
      {
        name: 'Fulani Tribal Cornrows with Beads',
        category: 'Cornrows',
        price: 4800,
        duration: '3.5 - 4 hours',
        durationMinutes: 210,
        hairLengthRequired: 'At least 3 inches',
        shortDescription: 'Intricate tribal geometric parting with side hanging plaits and authentic wooden or brass beads.',
        description: 'Inspired by traditional West African Fulani hair artistry, this hairstyle features feed-in stitch cornrows down the center with braids looped forward over the shoulders, finished with custom decorative cowrie shells and brass cuffs.',
        images: [
          'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop'
        ],
        isPopular: false,
        isTrending: true,
        maintenanceTips: [
          'Oil parted rows directly with an applicator bottle using peppermint jojoba oil.',
          'Do not pull tightly on hanging beaded ends.',
          'Wrap with a silk band at bedtime to preserve crisp lines.'
        ],
        faqs: [
          {
            question: 'Are beads included in the appointment?',
            answer: 'Yes! We offer a complimentary selection of wooden, gold brass, and transparent beads with every Fulani style.'
          }
        ]
      },
      {
        name: 'French Curl Braids (Super Soft)',
        category: 'Trending Styles',
        price: 5800,
        duration: '4.5 - 5.5 hours',
        durationMinutes: 300,
        hairLengthRequired: 'At least 4 inches',
        shortDescription: 'Silky, voluminous bouncy curls at the ends that cascade over shoulders like spun silk.',
        description: 'The reigning viral favorite! French Curl Braids feature neat box or knotless roots that transition into bouncy, silky French spiral curls at the mid-lengths. Incredible bounce, silky sheen, and lightweight comfort.',
        images: [
          'https://images.unsplash.com/photo-1597225244660-1cd128c64284?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?q=80&w=1000&auto=format&fit=crop'
        ],
        isPopular: true,
        isTrending: true,
        maintenanceTips: [
          'Use a wide-tooth comb or loop brush on the curl ends only.',
          'Pin curls in loose rollers or loose twists inside your bonnet to preserve curl definition.'
        ],
        faqs: [
          {
            question: 'Can French curls get wet in the shower?',
            answer: 'We recommend wearing a waterproof shower cap to preserve the heat-set spiral formation of French curl extensions.'
          }
        ]
      },
      {
        name: 'Goddess Soft Faux Locs',
        category: 'Locs & Faux Locs',
        price: 6000,
        duration: '4.5 - 5 hours',
        durationMinutes: 270,
        hairLengthRequired: 'At least 3 inches',
        shortDescription: 'Effortlessly soft, textured bohemian faux locs with natural wavy ends and zero stiffness.',
        description: 'Unlike heavy traditional locs, our Goddess Soft Locs are flexible from day one! Wrapped gently with soft textured water-wave hair, leaving curls exposed along the shaft for an authentic bohemian vibe.',
        images: [
          'https://images.unsplash.com/photo-1584297091622-af8e5fdcf123?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=1000&auto=format&fit=crop'
        ],
        isPopular: false,
        isTrending: true,
        maintenanceTips: [
          'Keep your natural roots moisturized with leave-in spray.',
          'Rub sweet almond oil between your palms and smooth down the loc shafts.'
        ],
        faqs: [
          {
            question: 'Are soft locs stiff when newly done?',
            answer: 'No! We use a special tension-free technique so you can put your hair into an updo or ponytail on day one without pain.'
          }
        ]
      },
      {
        name: 'Feed-in Stitch Cornrows (6-8 Rows)',
        category: 'Cornrows',
        price: 3500,
        duration: '2.5 - 3 hours',
        durationMinutes: 160,
        hairLengthRequired: 'At least 3 inches',
        shortDescription: 'Ultra-crisp razor-clean stitch lines that lay flat, chic, and polished.',
        description: 'Razor-sharp precision parting with uniform stitch lines that feed in hair cleanly. Minimalist, modern, and perfectly suited for workouts, business travel, and formal galas.',
        images: [
          'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1000&auto=format&fit=crop'
        ],
        isPopular: false,
        isTrending: false,
        maintenanceTips: [
          'Tie down with an elastic satin edge wrap every evening.',
          'Keep edge control clean and refresh every 3 days.'
        ],
        faqs: [
          {
            question: 'How long do stitch cornrows last?',
            answer: 'Stitch cornrows typically look freshest for 3 to 4 weeks depending on natural hair growth and edge care.'
          }
        ]
      },
      {
        name: 'Natural Two-Strand Mini Twists',
        category: 'Twists',
        price: 3800,
        duration: '3 - 4 hours',
        durationMinutes: 210,
        hairLengthRequired: 'Natural hair 4+ inches',
        shortDescription: 'Gentle two-strand twists using your natural hair or lightweight extensions for deep moisture retention.',
        description: 'Celebrate natural hair health! Our mini twists are infused with organic shea butter, flaxseed gel, and rosemary oil to retain maximum length while giving you versatile daily styling options.',
        images: [
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop'
        ],
        isPopular: false,
        isTrending: false,
        maintenanceTips: [
          'Mist with aloe vera juice and rosewater spray daily.',
          'Gently squeeze twists rather than rubbing to avoid frizz.'
        ],
        faqs: [
          {
            question: 'Can I undo them into a twist-out?',
            answer: 'Absolutely! After 3 weeks, undoing them produces gorgeous, defined, heatless curls that last another full week.'
          }
        ]
      }
    ];

    const preparedHairstyles = sampleHairstyles.map(item => ({
      ...item,
      slug: item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }));

    const insertedHairstyles = await Hairstyle.insertMany(preparedHairstyles);
    console.log(`Seeded ${insertedHairstyles.length} hairstyles.`);

    // 3. Pinterest-style Gallery Items
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

    await GalleryItem.insertMany(sampleGallery);
    console.log(`Seeded ${sampleGallery.length} gallery photos.`);

    // 4. Authentic Reviews
    const sampleReviews = [
      {
        customerName: 'Amina Muthoni',
        rating: 5,
        reviewText: 'Nkathaa is hands down the gentlest braider in Nairobi! I have a super sensitive scalp and always dread tight braiding, but with her knotless braids I had ZERO pain and slept like a baby on the very first night. 10/10 service!',
        hairstyleCategory: 'Knotless Braids',
        hairstyleName: 'Medium Knotless Braids',
        customerLocation: 'Kilimani, Nairobi',
        isApproved: true
      },
      {
        customerName: 'Zawadi Chebet',
        rating: 5,
        reviewText: 'My Boho braids lasted 7 full weeks on my Diani beach vacation! The human hair curls never matted and Nkathaa explained exactly how to maintain them. The studio ambiance with soothing lavender vibes makes the appointment fly by.',
        hairstyleCategory: 'Boho Braids',
        hairstyleName: 'Luxury Boho Knotless Braids',
        customerLocation: 'Westlands, Nairobi',
        isApproved: true
      },
      {
        customerName: 'Brenda Kerubo',
        rating: 5,
        reviewText: 'Punctual, professional, and immaculate parting! Stitch cornrows were sharp and neat. Plus online booking and deposit was seamless with M-Pesa. Nkathaa is my forever stylist.',
        hairstyleCategory: 'Cornrows',
        hairstyleName: 'Feed-in Stitch Cornrows',
        customerLocation: 'Lavington, Nairobi',
        isApproved: true
      },
      {
        customerName: 'Faith Wanjiku',
        rating: 5,
        reviewText: 'The passion twists are so lightweight and bouncy! I got countless compliments at the office. Love how clean and modern her workspace is.',
        hairstyleCategory: 'Twists',
        hairstyleName: 'Passion Twists',
        customerLocation: 'Kileleshwa, Nairobi',
        isApproved: true
      }
    ];

    await Review.insertMany(sampleReviews);
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

    await Coupon.insertMany(sampleCoupons);
    console.log(`Seeded ${sampleCoupons.length} promotional coupons.`);

    // 6. Sample Bookings for realistic dashboard
    const today = new Date();
    const formatDate = (offsetDays) => {
      const d = new Date(today);
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString().split('T')[0];
    };

    const sampleBookings = [
      {
        customerName: 'Sharon Otieno',
        customerPhone: '+254 712 345 678',
        customerEmail: 'sharon.otieno@gmail.com',
        hairstyle: insertedHairstyles[0]._id,
        hairstyleName: insertedHairstyles[0].name,
        date: formatDate(1),
        timeSlot: '10:00 AM',
        preferredHairColor: '#1B - Natural Black',
        additionalNotes: 'Please tuck edges very gently.',
        status: 'Confirmed',
        totalAmount: 4500,
        depositAmount: 1000,
        depositPaid: true,
        paymentStatus: 'Deposit_Paid',
        mpesaReference: 'QKD829104B'
      },
      {
        customerName: 'Grace Njeri',
        customerPhone: '+254 722 889 900',
        customerEmail: 'grace.njeri@yahoo.com',
        hairstyle: insertedHairstyles[1]._id,
        hairstyleName: insertedHairstyles[1].name,
        date: formatDate(2),
        timeSlot: '01:00 PM',
        preferredHairColor: '#27 / #30 Honey Ombre Blend',
        additionalNotes: 'Traveling on Saturday, excited for boho curls!',
        status: 'Pending',
        totalAmount: 6500,
        depositAmount: 1000,
        depositPaid: false,
        paymentStatus: 'Unpaid'
      },
      {
        customerName: 'Esther Makena',
        customerPhone: '+254 733 456 789',
        customerEmail: 'esther.makena@gmail.com',
        hairstyle: insertedHairstyles[3]._id,
        hairstyleName: insertedHairstyles[3].name,
        date: formatDate(3),
        timeSlot: '11:30 AM',
        preferredHairColor: '#1 Jet Black',
        additionalNotes: 'Include gold beads and shells please!',
        status: 'Confirmed',
        totalAmount: 4800,
        depositAmount: 1000,
        depositPaid: true,
        paymentStatus: 'Deposit_Paid',
        mpesaReference: 'QKD948271B'
      },
      {
        customerName: 'Vanessa Moraa',
        customerPhone: '+254 701 223 344',
        customerEmail: 'vanessa.m@outlook.com',
        hairstyle: insertedHairstyles[0]._id,
        hairstyleName: insertedHairstyles[0].name,
        date: formatDate(-3),
        timeSlot: '08:30 AM',
        preferredHairColor: '#1B - Natural Black',
        status: 'Completed',
        totalAmount: 4500,
        depositAmount: 1000,
        depositPaid: true,
        paymentStatus: 'Full_Paid',
        mpesaReference: 'QKD710293B'
      }
    ];

    await Booking.insertMany(sampleBookings);
    console.log(`Seeded ${sampleBookings.length} realistic initial bookings.`);
    console.log('Seeding finished successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
