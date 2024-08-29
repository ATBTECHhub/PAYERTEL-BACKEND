// models/article.js
import mongoose from 'mongoose';

const contentschema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    contentManagerId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Content = mongoose.model('Content', contentschema);

export default Content;
