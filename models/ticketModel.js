import mongoose from 'mongoose';

const { Schema } = mongoose;

const ticketSchema = new Schema(
  {
    ticketType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'closed'],
      default: 'open',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
