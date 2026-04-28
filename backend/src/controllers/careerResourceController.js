const { CareerResource, UserEngagement, User } = require('../models');
const { Op } = require('sequelize');

// Get all career resources
exports.getAllResources = async (req, res) => {
  try {
    const { category, search } = req.query;
    let whereClause = {};

    if (category) whereClause.category = category;
    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const resources = await CareerResource.findAll({
      where: whereClause,
      include: [{ model: User, as: 'creator', attributes: ['name', 'email'] }]
    });
    
    // Track engagement
    if (req.user) {
      await UserEngagement.create({
        userId: req.user.id,
        actionType: 'view_careerpath',
        details: { searchQuery: search, category: category }
      });
    }

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get resource by ID
exports.getResourceById = async (req, res) => {
  try {
    const resource = await CareerResource.findByPk(req.params.id, {
      include: [{ model: User, as: 'creator', attributes: ['name', 'email'] }]
    });

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Track engagement
    if (req.user) {
      await UserEngagement.create({
        userId: req.user.id,
        actionType: 'view_resource',
        resourceId: resource.id
      });
    }

    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new career resource (Admin only)
exports.createResource = async (req, res) => {
  try {
    const { title, description, category, skills, salary, jobOutlook, educationRequired, resourceLinks } = req.body;

    const resource = await CareerResource.create({
      title,
      description,
      category,
      skills,
      salary,
      jobOutlook,
      educationRequired,
      resourceLinks,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: 'Career resource created successfully',
      resource
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update career resource (Admin only)
exports.updateResource = async (req, res) => {
  try {
    const { title, description, category, skills, salary, jobOutlook, educationRequired, resourceLinks } = req.body;

    let resource = await CareerResource.findByPk(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if user is the creator or admin
    if (resource.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this resource' });
    }

    if (title) resource.title = title;
    if (description) resource.description = description;
    if (category) resource.category = category;
    if (skills) resource.skills = skills;
    if (salary) resource.salary = salary;
    if (jobOutlook) resource.jobOutlook = jobOutlook;
    if (educationRequired) resource.educationRequired = educationRequired;
    if (resourceLinks) resource.resourceLinks = resourceLinks;

    await resource.save();

    res.json({
      message: 'Career resource updated successfully',
      resource
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete career resource (Admin only)
exports.deleteResource = async (req, res) => {
  try {
    const resource = await CareerResource.findByPk(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if user is the creator or admin
    if (resource.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }

    await resource.destroy();

    res.json({ message: 'Career resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get career resources by category
exports.getResourcesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const resources = await CareerResource.findAll({ 
      where: { category },
      include: [{ model: User, as: 'creator', attributes: ['name', 'email'] }]
    });
    
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
