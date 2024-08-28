import Content from '../models/contentModel.js';
import AppError from '../utils/appError.js';

// View all contents
export const viewAllContents = async (req, res, next) => {
  try {
    const contents = await Content.find({});
    if (!contents.length) {
      return next(AppError(404, 'No contents found'));
    }
    res.status(200).json(contents);
  } catch (error) {
    next(error);
  }
};

// Create a new content
export const createNewContent = async (req, res, next) => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      return next(AppError(400, 'Title, content, and author are required'));
    }

    const newcontent = new Content({
      title,
      content,
      author,
    });

    await newcontent.save();
    res.status(201).json(newcontent);
  } catch (error) {
    next(error);
  }
};

// Update an existing content
export const updateContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, author } = req.body;

    const Content = await Content.findById(id);

    if (!Content) {
      return next(AppError(404, `content with ID ${id} not found`));
    }

    if (title) content.title = title;
    if (content) content.content = content;
    if (author) content.author = author;

    await content.save();

    res.status(200).json(content);
  } catch (error) {
    next(error);
  }
};

// Delete an content
export const deleteContent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const content = await Content.findByIdAndDelete(id);

    if (!content) {
      return next(AppError(404, `content with ID ${id} not found`));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
