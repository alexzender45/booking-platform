const TransactionSchema = require("../models/transactionModel");
const { throwError } = require("../utils/handleErrors");
const TRANSACTION_NOT_FOUND = (message) =>
  throwError(message || "No Bank Found For User", 404);

class Transaction {
  constructor(data) {
    this.data = data;
    this.errors = [];
  }

  static async createTransaction(transactionDetails) {
    return await new TransactionSchema(transactionDetails).save();
  }

  async getUserTransaction() {
    const { userId, id } = this.data;
    return await TransactionSchema.findOne({ userId: userId, _id: id }).orFail(
      () => TRANSACTION_NOT_FOUND("User Transaction Not Found")
    );
  }

  async getAllUserTransactions() {
    return await TransactionSchema.find({ userId: this.data }).orFail(() =>
      TRANSACTION_NOT_FOUND("User Transactions Not Found")
    );
  }

  async getTransaction() {
    return await TransactionSchema.findOne({ _id: this.data }).orFail(() =>
      TRANSACTION_NOT_FOUND("Transaction Not Found")
    );
  }

  async getTransactionByReference() {
    const reference = this.data;
    return await TransactionSchema.findOne({ reference }).orFail(() =>
      TRANSACTION_NOT_FOUND(`No Transaction Found With Reference ${reference}`)
    );
  }
}

module.exports = Transaction;
