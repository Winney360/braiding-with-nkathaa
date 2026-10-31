import { Hairstyle } from '../models/Hairstyle.js';

export const getHairstyleRecommendations = async (req, res) => {
  try {
    const {
      faceShape = 'Oval',
      hairLength = 'Medium',
      lifestyle = 'Corporate',
      maintenancePreference = 'Low',
      durationWeeks = '4-6',
      scalpSensitivity = 'Normal'
    } = req.body;

    const allStyles = await Hairstyle.find({});

    // Intelligent matching & scoring algorithm
    const scoredStyles = allStyles.map((style) => {
      let score = 70; // baseline match
      let matchReasons = [];
      let stylingTips = [];

      // Scalp sensitivity preference: Knotless and Boho are tension-free
      if (scalpSensitivity === 'Sensitive' && (style.name.includes('Knotless') || style.name.includes('Boho') || style.name.includes('Twist'))) {
        score += 20;
        matchReasons.push('Gentle on sensitive edges with zero scalp tension');
      }

      // Face shape tailoring
      if (faceShape === 'Round') {
        if (style.name.includes('Knotless') || style.name.includes('Goddess') || style.name.includes('Twists')) {
          score += 15;
          matchReasons.push('Long vertical lines elongate round facial features elegantly');
        }
      } else if (faceShape === 'Heart') {
        if (style.name.includes('Boho') || style.name.includes('Natural Twists') || style.category === 'Twists') {
          score += 15;
          matchReasons.push('Curls and volume around the jawline soften heart cheekbones beautifully');
        }
      } else if (faceShape === 'Square') {
        if (style.name.includes('Boho') || style.name.includes('Goddess') || style.name.includes('Twists')) {
          score += 15;
          matchReasons.push('Flowing wavy ends frame and soften angular jawlines');
        }
      } else if (faceShape === 'Oval') {
        score += 12;
        matchReasons.push('Universally flattering match for an oval face shape');
      }

      // Lifestyle tailoring
      if (lifestyle === 'Active' || lifestyle === 'Gym') {
        if (style.category === 'Cornrows' || style.name.includes('Knotless')) {
          score += 15;
          matchReasons.push('High durability for daily workouts, easily tied into high buns');
          stylingTips.push('Wear a sweat-wicking satin headband during cardio sessions');
        }
      } else if (lifestyle === 'Corporate' || lifestyle === 'Office') {
        if (style.name.includes('Knotless') || style.category === 'Cornrows') {
          score += 15;
          matchReasons.push('Sleek, polished silhouette ideal for formal and professional boardrooms');
          stylingTips.push('Style into a sleek low chignon or French roll for meetings');
        }
      } else if (lifestyle === 'Vacation' || lifestyle === 'Events') {
        if (style.name.includes('Boho') || style.name.includes('Goddess') || style.name.includes('Passion')) {
          score += 18;
          matchReasons.push('Stunning luxury aesthetic perfect for photos, dinners, and tropical getaways');
          stylingTips.push('Apply lightweight braid mousse and curl defining foam each morning');
        }
      }

      // Maintenance preference
      if (maintenancePreference === 'Low') {
        if (style.name.includes('Knotless') || style.category === 'Cornrows') {
          score += 10;
          matchReasons.push('Minimal daily maintenance—wake up and go with a satin bonnet');
        }
      } else {
        if (style.name.includes('Boho') || style.name.includes('Passion')) {
          score += 10;
          matchReasons.push('Worth the extra 3 minutes of daily curl refresher');
        }
      }

      if (style.isPopular) score += 5;
      if (style.isTrending) score += 5;

      return {
        hairstyle: style,
        score: Math.min(99, score),
        matchReasons: matchReasons.length > 0 ? matchReasons : ['Harmonious length and texture match for your profile'],
        stylingTips: stylingTips.length > 0 ? stylingTips : ['Sleep on a silk pillowcase to keep edges neat and smooth']
      };
    });

    // Sort by score descending and take top 3
    scoredStyles.sort((a, b) => b.score - a.score);
    const topMatches = scoredStyles.slice(0, 3);

    // AI Consultant Commentary
    const topPick = topMatches[0];
    const aiConsultationNotes = `Based on your ${faceShape} face shape and ${lifestyle} lifestyle, ${topPick.hairstyle.name} is your ultimate match! It provides the ideal balance of elegance, scalp comfort, and effortless styling.`;

    res.json({
      success: true,
      analysis: {
        faceShape,
        lifestyle,
        scalpSensitivity,
        aiConsultationNotes
      },
      recommendations: topMatches
    });
  } catch (error) {
    console.error('Error generating AI recommendation:', error);
    res.status(500).json({ success: false, message: 'Server error generating recommendation' });
  }
};
