const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const bankSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        accountNumber: {
            type: Number,
            required: true,
            unique: true
        },
        accountName: {
            type: String,
            required: true,
        },
        bankCode: {
            type: String,
            required: true,
        },
        bankName: {
            type: String,
            required: true,
        },
        recipientCode: {
            type: String,
            required: true,
        },
        isDefaultBank: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ref) {
                delete ref.recipientCode;
            },
        },
        toObject: {
            transform(doc, ref) {
                delete ref.recipientCode;
            },
        },
    },
    {
        strictQuery: 'throw'
    }
);

bankSchema.plugin(uniqueValidator, { message: '{TYPE} must be unique.' });

const BankModel = model('Bank', bankSchema);
module.exports = BankModel;
