import { prisma } from '../config/prisma.js';

const normalizeGalleryItem = (item) => ({
  ...item,
  _id: item.id
});

// GET /api/gallery
export const getGalleryItems = async (req, res) => {
  try {
    const { category } = req.query;
    const where = {};

    if (category && category !== 'All' && category !== '') {
      where.category = category;
    }

    const items = await prisma.galleryItem.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({
      success: true,
      count: items.length,
      data: items.map(normalizeGalleryItem)
    });
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

    const item = await prisma.galleryItem.create({
      data: {
        title: title.trim(),
        category: category || 'Knotless',
        imageUrl: imageUrl.trim(),
        aspectRatio: aspectRatio || 'tall',
        tags: Array.isArray(tags) ? tags : [],
        featured: Boolean(featured)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Image added to gallery',
      data: normalizeGalleryItem(item)
    });
  } catch (error) {
    console.error('Error adding gallery item:', error);
    res.status(400).json({ success: false, message: error.message || 'Error adding gallery item' });
  }
};

// PATCH /api/gallery/:id/like
export const likeGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.galleryItem.update({
      where: { id },
      data: { likes: { increment: 1 } }
    });
    res.json({ success: true, likes: item.likes });
  } catch (error) {
    console.error('Error liking gallery item:', error);
    res.status(500).json({ success: false, message: 'Server error updating likes' });
  }
};

// DELETE /api/gallery/:id (Admin)
export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.galleryItem.delete({ where: { id } });
    res.json({ success: true, message: 'Gallery image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ success: false, message: 'Server error deleting gallery item' });
  }
};
