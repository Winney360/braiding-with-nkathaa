import { prisma } from '../config/prisma.js';

const normalizeHairstyle = (h) => ({
  ...h,
  _id: h.id // For backwards compatibility with frontend components expecting _id
});

// GET /api/hairstyles
export const getHairstyles = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, trending, popular, sort } = req.query;
    const where = {};

    if (search && search.trim() !== '') {
      const term = search.trim();
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
        { shortDescription: { contains: term, mode: 'insensitive' } },
        { category: { contains: term, mode: 'insensitive' } }
      ];
    }

    if (category && category !== 'All' && category !== '') {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (trending === 'true') {
      where.isTrending = true;
    }

    if (popular === 'true') {
      where.isPopular = true;
    }

    let orderBy = [{ isPopular: 'desc' }, { createdAt: 'desc' }];
    if (sort === 'price_asc') {
      orderBy = [{ price: 'asc' }];
    } else if (sort === 'price_desc') {
      orderBy = [{ price: 'desc' }];
    } else if (sort === 'duration') {
      orderBy = [{ durationMinutes: 'asc' }];
    }

    const hairstyles = await prisma.hairstyle.findMany({
      where,
      orderBy
    });

    res.json({
      success: true,
      count: hairstyles.length,
      data: hairstyles.map(normalizeHairstyle)
    });
  } catch (error) {
    console.error('Error fetching hairstyles:', error);
    res.status(500).json({ success: false, message: 'Server error fetching hairstyles' });
  }
};

// GET /api/hairstyles/:idOrSlug
export const getHairstyleById = async (req, res) => {
  try {
    const { id } = req.params;

    let hairstyle = await prisma.hairstyle.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      }
    });

    if (!hairstyle) {
      return res.status(404).json({ success: false, message: 'Hairstyle not found' });
    }

    const related = await prisma.hairstyle.findMany({
      where: {
        category: hairstyle.category,
        id: { not: hairstyle.id }
      },
      take: 3
    });

    res.json({
      success: true,
      data: normalizeHairstyle(hairstyle),
      related: related.map(normalizeHairstyle)
    });
  } catch (error) {
    console.error('Error fetching hairstyle details:', error);
    res.status(500).json({ success: false, message: 'Server error fetching hairstyle' });
  }
};

// POST /api/hairstyles (Admin)
export const createHairstyle = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      duration,
      durationMinutes,
      hairLengthRequired,
      hairLength,
      shortDescription,
      description,
      images,
      imageUrl,
      isPopular,
      isTrending,
      maintenanceTips,
      faqs
    } = req.body;

    const imagesArray = Array.isArray(images)
      ? images
      : images
      ? [images]
      : imageUrl
      ? [imageUrl]
      : [];

    const primaryImage = imageUrl || imagesArray[0] || 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=1000';

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const saved = await prisma.hairstyle.create({
      data: {
        name,
        slug,
        category: category || 'Knotless Braids',
        price: Number(price),
        duration: duration || '4 - 5 hours',
        durationMinutes: durationMinutes ? Number(durationMinutes) : 240,
        hairLength: hairLength || hairLengthRequired || 'At least 3-4 inches',
        shortDescription: shortDescription || '',
        description,
        imageUrl: primaryImage,
        images: imagesArray.length > 0 ? imagesArray : [primaryImage],
        isPopular: Boolean(isPopular),
        isTrending: Boolean(isTrending),
        maintenanceTips: Array.isArray(maintenanceTips) ? maintenanceTips : [],
        faqs: faqs || []
      }
    });

    res.status(201).json({
      success: true,
      data: normalizeHairstyle(saved),
      message: 'Hairstyle created successfully'
    });
  } catch (error) {
    console.error('Error creating hairstyle:', error);
    res.status(400).json({ success: false, message: error.message || 'Error creating hairstyle' });
  }
};

// PUT /api/hairstyles/:id (Admin)
export const updateHairstyle = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (data.price !== undefined) data.price = Number(data.price);
    if (data.durationMinutes !== undefined) data.durationMinutes = Number(data.durationMinutes);
    if (data.isPopular !== undefined) data.isPopular = Boolean(data.isPopular);
    if (data.isTrending !== undefined) data.isTrending = Boolean(data.isTrending);
    if (data.hairLengthRequired) {
      data.hairLength = data.hairLengthRequired;
      delete data.hairLengthRequired;
    }
    if (data.images && !data.imageUrl) {
      data.imageUrl = Array.isArray(data.images) ? data.images[0] : data.images;
    }
    delete data._id;

    const updated = await prisma.hairstyle.update({
      where: { id },
      data
    });

    res.json({
      success: true,
      data: normalizeHairstyle(updated),
      message: 'Hairstyle updated successfully'
    });
  } catch (error) {
    console.error('Error updating hairstyle:', error);
    res.status(400).json({ success: false, message: error.message || 'Error updating hairstyle' });
  }
};

// DELETE /api/hairstyles/:id (Admin)
export const deleteHairstyle = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.hairstyle.delete({
      where: { id }
    });
    res.json({ success: true, message: 'Hairstyle deleted successfully' });
  } catch (error) {
    console.error('Error deleting hairstyle:', error);
    res.status(500).json({ success: false, message: 'Error deleting hairstyle' });
  }
};
