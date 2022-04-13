const axios = require("axios");
const { throwError } = require("../utils/handleErrors");
const { logger } = require("../utils/logger");
const {
  AMOUNT,
  PAYSTACK_SECRET_KEY,
  PAYSTACK_BASE_URL,
  CONNECTION_TIMEOUT,
  KOBO_RATE,
} = require("../core/config");

const getHeaders = () => {
  return {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  };
};

const axiosInstance = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  timeout: Number(CONNECTION_TIMEOUT),
  headers: getHeaders(),
});

exports.getBanks = async () => {
  let banks = [];
  try {
    let url = "/bank?use_cursor=true";
    let hasNextPage = false;
    do {
      let response = await axiosInstance.get(url);
      const { data, meta } = response.data;
      banks = [...banks, ...data];
      const nextPage = meta ? meta.next : null;
      if (nextPage) {
        url += "?next=" + nextPage;
        hasNextPage = true;
      } else {
        hasNextPage = false;
      }
    } while (hasNextPage);
    return banks;
  } catch (e) {
    logger.error("Error getting banks from paystack", e);
    return banks;
  }
};

exports.createTransferRecipient = async (payload) => {
  try {
    const response = await axiosInstance.post("/transferrecipient", payload);
    const { recipient_code, details } = response.data.data;
    return {
      recipientCode: recipient_code,
      accountName: details.account_name,
      bankName: details.bank_name,
    };
  } catch (e) {
    const { data, status } = e.response;
    const message =
      data && status === 400
        ? data.message
        : "Error Adding Bank. Kindly Contact The Administrator";
    logger.error(
      "Error initializing payment with paystack",
      e.response ? e.response.data : e
    );
    throwError(message, status || 500);
  }
};

exports.initializePayment = async (email, amount) => {
  try {
    const response = await axiosInstance.post(`/transaction/initialize`, {
      email,
      amount,
    });
    return {
      reference: response.data.data.reference,
      confirmationUrl: response.data.data.authorization_url,
      status: response.data.status,
    };
  } catch (e) {
    logger.error("Error initializing payment with paystack", e);
    throwError(
      "Error initializing payment. Kindly Contact The Administrator",
      500
    );
  }
};

exports.verifyPayment = async (reference) => {
  try {
    const response = await axiosInstance.get(
      `/transaction/verify/${reference}`
    );
    return {
      status: response.data.data.status,
      message: response.data.data.gateway_response,
      paymentDate: response.data.data.paidAt,
    };
  } catch (e) {
    logger.error("Error verifying booking payment", e);
    throwError(e.message, 500);
  }
};

exports.withdrawToBank = async (recipientCode, amount, withdrawalReason) => {
  try {
    const payload = {
      source: "balance",
      reason: withdrawalReason || "Kampe Fund Withdrawal",
      amount: amountInKobo(amount),
      recipient: recipientCode,
    };
    const response = await axiosInstance.post("/transfer", payload);
    logger.info(
      `withdrawal payment initialized successfully for KP${recipientCode}DW`
    );
    const { status, createdAt, reference } = response.data.data;
    return {
      status: status,
      paymentDate: createdAt,
      reference: reference,
    };
  } catch (e) {
    logger.error(
      "Error initializing payment with paystack. Error:",
      e.response ? e.response.data : e
    );
    throwError(
      "Error Withdrawing Funds. Kindly Contact The Administrator",
      500
    );
  }
};

const amountInKobo = (amount) => amount * KOBO_RATE;
