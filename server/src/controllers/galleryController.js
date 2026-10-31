import { GalleryItem } from '../models/GalleryItem.js';

// GET /api/gallery
export const getGalleryItems = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};

    if (category && category !== 'All' && category !== '') {
      filter.category = category;
    }

    const items = await GalleryItem.find(filter).sort({ featured: -1, createdAt: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ success: false, message: 'Server error fetching gallery items' });
  }
};

// POST /api/gallery (Admin)
export const addGalleryItem = async (req, res) => {
  try {
    const { title, category, imageUrl, aspectRatio, tags, featured } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Title and image URL are required' });
    }

    const item = new GalleryItem({
      title,
      category: category || 'Knotless',
      imageUrl,
      aspectRatio: aspectRatio || 'tall',
      tags: Array.isArray(tags) ? tags : [],
      featured: Boolean(featured)
    });

    const saved = await item.save();
    res.status(201).json({ success: true, message: 'Image added to gallery', data: saved });
  } catch (error) {
    console.error('Error adding gallery item:', error);
    res.status(400).json({ success: false, message: error.message || 'Error adding gallery item' });
  }
};

// PATCH /api/gallery/:id/like
export const likeGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    res.json({ success: true, likes: item.likes });
  } catch (error) {
    console.error('Error liking gallery item:', error);
    res.status(500).json({ success: false, message: 'Server error updating likes' });
  }
};

// DELETE /api/gallery/:id (Admin)
export const deleteGalleryItem = async (req, res) => {
  try {
    const deleted = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    res.json({ success: true, message: 'Gallery image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ success: false, message: 'Server error deleting gallery item' });
  }
};
