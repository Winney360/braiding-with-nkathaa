import { Hairstyle } from '../models/Hairstyle.js';

// GET /api/hairstyles
export const getHairstyles = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, duration, trending, popular, sort } = req.query;
    const filter = {};

    if (search && search.trim() !== '') {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { shortDescription: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    if (category && category !== 'All' && category !== '') {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (trending === 'true') {
      filter.isTrending = true;
    }

    if (popular === 'true') {
      filter.isPopular = true;
    }

    let query = Hairstyle.find(filter);

    // Sorting
    if (sort === 'price_asc') {
      query = query.sort({ price: 1 });
    } else if (sort === 'price_desc') {
      query = query.sort({ price: -1 });
    } else if (sort === 'duration') {
      query = query.sort({ durationMinutes: 1 });
    } else {
      query = query.sort({ isPopular: -1, createdAt: -1 });
    }

    const hairstyles = await query;
    res.json({ success: true, count: hairstyles.length, data: hairstyles });
  } catch (error) {
    console.error('Error fetching hairstyles:', error);
    res.status(500).json({ success: false, message: 'Server error fetching hairstyles' });
  }
};

// GET /api/hairstyles/:idOrSlug
export const getHairstyleById = async (req, res) => {
  try {
    const { id } = req.params;
    let hairstyle;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      hairstyle = await Hairstyle.findById(id);
    } else {
      hairstyle = await Hairstyle.findOne({ slug: id });
    }

    if (!hairstyle) {
      return res.status(404).json({ success: false, message: 'Hairstyle not found' });
    }

    // Also get related hairstyles in same category
    const related = await Hairstyle.find({
      category: hairstyle.category,
      _id: { $ne: hairstyle._id }
    }).limit(3);

    res.json({ success: true, data: hairstyle, related });
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
      shortDescription,
      description,
      images,
      isPopular,
      isTrending,
      maintenanceTips,
      faqs
    } = req.body;

    const newStyle = new Hairstyle({
      name,
      category,
      price: Number(price),
      duration,
      durationMinutes: durationMinutes ? Number(durationMinutes) : 240,
      hairLengthRequired,
      shortDescription,
      description,
      images: Array.isArray(images) ? images : [images],
      isPopular: Boolean(isPopular),
      isTrending: Boolean(isTrending),
      maintenanceTips: Array.isArray(maintenanceTips) ? maintenanceTips : [],
      faqs: Array.isArray(faqs) ? faqs : []
    });

    const saved = await newStyle.save();
    res.status(201).json({ success: true, data: saved, message: 'Hairstyle created successfully' });
  } catch (error) {
    console.error('Error creating hairstyle:', error);
    res.status(400).json({ success: false, message: error.message || 'Error creating hairstyle' });
  }
};

// PUT /api/hairstyles/:id (Admin)
export const updateHairstyle = async (req, res) => {
  try {
    const updated = await Hairstyle.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Hairstyle not found' });
    }

    res.json({ success: true, data: updated, message: 'Hairstyle updated successfully' });
  } catch (error) {
    console.error('Error updating hairstyle:', error);
    res.status(400).json({ success: false, message: error.message || 'Error updating hairstyle' });
  }
};

// DELETE /api/hairstyles/:id (Admin)
export const deleteHairstyle = async (req, res) => {
  try {
    const deleted = await Hairstyle.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Hairstyle not found' });
    }
    res.json({ success: true, message: 'Hairstyle deleted successfully' });
  } catch (error) {
    console.error('Error deleting hairstyle:', error);
    res.status(500).json({ success: false, message: 'Error deleting hairstyle' });
  }
};
