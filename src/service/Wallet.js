const WalletSchema = require("../models/walletModel");
const UserSchema = require("../models/userModel");
const { throwError } = require("../utils/handleErrors");
const util = require("../utils/util");
const { getCachedData } = require("../service/Redis");
const Bank = require("./Bank");
const Transaction = require("./Transaction");
const {
  withdrawToBank,
  initializePayment,
  verifyPayment,
} = require("../integration/paystackClient");
const { TRANSACTION_STATUS, TRANSACTION_TYPE } = require("../utils/constants");

class Wallet {
  constructor(data) {
    this.data = data;
    this.errors = [];
  }

  async createWallet() {
    return await new WalletSchema(this.data).save();
  }

  async getUserWallet() {
    return await WalletSchema.findOne({ userId: this.data }).orFail(() =>
      throwError("Wallet Not Found", 404)
    );
  }

  async creditWallet(amount, userId) {
    const userWallet = await WalletSchema.findOne({ userId });
    userWallet.availableBalance += Number(amount);
    return await userWallet.save();
  }

  async debitWallet() {
    const { amount, userId } = this.data;
    const userWallet = await WalletSchema.findOne({ userId });
    userWallet.availableBalance -= Number(amount);
    return await userWallet.save();
  }

  async getUtilityWallet() {
    let utilityWallet = await WalletSchema.findOne({ label: "Collections" });
    if (!utilityWallet) {
      utilityWallet = await new WalletSchema({
        userId: `booking-collection`,
        label: "Collections",
      }).save();
    }
    return utilityWallet;
  }

  async debitUtilityWallet(amount) {
    const utilityWallet = await this.getUtilityWallet();
    utilityWallet.availableBalance -= Number(amount);
    return await utilityWallet.save();
  }

  async withdrawFund() {
    const { userId, bankId, amount, withdrawalReason } = this.data;
    this.data = userId;

    const userWallet = await this.getUserWallet();
    let walletBalance = userWallet.availableBalance;

    if (walletBalance < amount) {
      throwError("Insufficient Balance! Withdrawal Exceeds Available Balance!");
    }
    walletBalance -= Number(amount);

    const userBankDetails = await new Bank(bankId).getBank();
    const { status, reference, paymentDate } = await withdrawToBank(
      userBankDetails.recipientCode,
      amount,
      withdrawalReason
    );
    if (TRANSACTION_STATUS.SUCCESS === status.toUpperCase()) {
      userWallet.availableBalance = walletBalance;
      await userWallet.save();

      const transactionDetails = {
        userId: userId,
        amount: amount,
        reason: withdrawalReason || "Withdraw From Wallet",
        type: TRANSACTION_TYPE.WITHDRAWAL,
        reference: "WD" + Date.now().valueOf() + "REF" + reference,
        paymentDate: paymentDate,
      };
      await Transaction.createTransaction(transactionDetails);
    }
    return "Withdrawal Successful";
  }

  async fundWallet() {
    const { amount, userId } = this.data;
    const user = await UserSchema.findById(userId);
    const { reference, confirmationUrl } = await initializePayment(
      user.email,
      amount * 100
    );
    const transactionDetails = {
      userId: userId,
      amount: amount,
      reason: "Fund Wallet",
      type: TRANSACTION_TYPE.CREDIT,
      reference,
      paymentDate: Date.now(),
      status: TRANSACTION_STATUS.PENDING,
    };
    await Transaction.createTransaction(transactionDetails);
    return confirmationUrl;
  }

  // verify fund transfer
  async verifyFundTransfer() {
    const { status } = await verifyPayment(this.data);
    const transactionDetails = await new Transaction(
      this.data
    ).getTransactionByReference();
    if (status.toUpperCase() === TRANSACTION_STATUS.SUCCESS) {
      await this.creditWallet(
        transactionDetails.amount,
        transactionDetails.userId
      );
      await this.debitUtilityWallet(transactionDetails.amount);
      transactionDetails.status = status.toUpperCase();
      await transactionDetails.save();
    }
    return transactionDetails;
  }

  static async creditUtilityWallet(amount) {
    const utilityWallet = await this.getUtilityWallet();
    utilityWallet.availableBalance += Number(amount);
    return await utilityWallet.save();
  }
}

module.exports = Wallet;
