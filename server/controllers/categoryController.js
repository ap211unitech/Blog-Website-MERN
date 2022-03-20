const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");
const Profile = require("../models/Profile");

// @Desc    Get all Categories
// @Route   GET /category
// @Access  Private
const getCategory = asyncHandler(async (req, res) => {
    const categories = await Category.find().populate('user').populate('profile');
    res.status(200).json(categories);
})

// @Desc    Add new Category
// @Route   POST /category
// @Access  Private
const addCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    // Chack if category already exists
    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
        res.status(400)
        throw new Error('Category already exists');
    }

    // Profile
    const profile = await Profile.findOne({ user: req.user._id });

    const newCategory = new Category({
        user: req.user._id,
        profile: profile._id,
        name
    })

    await newCategory.save();
    res.status(200).json(newCategory);
})

// @Desc    Update a Category
// @Route   PATCH /category
// @Access  Private
const updateCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    // Chack if category already exists
    const categoryExists = await Category.findById(req.params.id);

    if (!categoryExists) {
        res.status(400)
        throw new Error('No such Category exists');
    }

    if (categoryExists.user.toString() !== req.user._id.toString()) {
        res.status(400)
        throw new Error('Not authorized to process this request');
    }

    categoryExists.name = name;
    await categoryExists.save();

    res.status(200).json(categoryExists);
})

// @Desc    Delete a Category
// @Route   DELETE /category
// @Access  Private
const deleteCategory = asyncHandler(async (req, res) => {

    // Chack if category already exists
    const categoryExists = await Category.findById(req.params.id);

    if (!categoryExists) {
        res.status(400)
        throw new Error('No such Category exists');
    }

    if (categoryExists.user.toString() !== req.user._id.toString()) {
        res.status(400)
        throw new Error('Not authorized to process this request');
    }

    await Category.findByIdAndDelete(req.params.id)
    res.status(200).json({ msg: 'Category Deleted' });
})

module.exports = {
    getCategory,
    addCategory,
    updateCategory,
    deleteCategory
}