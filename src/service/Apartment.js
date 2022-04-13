const ApartmentSchema = require("../models/apartmentModel");
const { throwError } = require("../utils/handleErrors");
const { validateParameters } = require("../utils/util");
const util = require("../utils/util");

class Apartment {
  constructor(data) {
    this.data = data;
    this.errors = [];
  }

  async createApartment() {
    const { isValid, messages } = validateParameters(
      [
        "userId",
        "apartmentName",
        "address",
        "apartmentCountry",
        "apartmentState",
        "price",
        "typeOfApartment",
        "facilities",
        "apartmentImages",
        "numberOfRooms",
        "apartmentInfo",
      ],
      this.data
    );
    if (!isValid) {
      throwError(messages);
    }
    this.data["apartmentName"] = this.data["apartmentName"].toLowerCase();
    this.data["apartmentCountry"] = this.data["apartmentCountry"].toLowerCase();
    this.data["apartmentState"] = this.data["apartmentState"].toLowerCase();
    return await new ApartmentSchema(this.data).save();
  }

  async getUserApartment() {
    return await ApartmentSchema.find({ userId: this.data }).orFail(() =>
      throwError("No Apartment Found", 404)
    );
  }

  async getSingleApartmentById() {
    return await ApartmentSchema.findById(this.data).orFail(() =>
      throwError("Apartment Not Found", 404)
    );
  }

  async deleteApartment() {
    const { id, userId } = this.data;
    const apartment = await ApartmentSchema.findById(id).orFail(() =>
      throwError("Apartment Not Found", 404)
    );
    if (apartment.userId.toString() !== userId.toString()) {
      throwError("You are not authorized to delete this apartment");
    }
    return await apartment.remove();
  }

  async updateApartment() {
    const { newDetails, id, userId } = this.data;
    const apartment = await ApartmentSchema.findById(id).orFail(() =>
      throwError("Apartment Not Found", 404)
    );
    if (apartment.userId.toString() !== userId.toString()) {
      throwError("You are not authorized to update this apartment");
    }
    const updates = Object.keys(newDetails);
    const allowedUpdates = [
      "apartmentName",
      "apartmentName",
      "address",
      "apartmentCountry",
      "apartmentState",
      "price",
      "typeOfApartment",
      "facilities",
      "apartmentImages",
      "numberOfRooms",
      "apartmentInfo",
    ];
    newDetails.apartmentName = newDetails.apartmentName.toLowerCase();
    newDetails.apartmentCountry = newDetails.apartmentCountry.toLowerCase();
    newDetails.apartmentState = newDetails.apartmentState.toLowerCase();
    return await util.performUpdate(
      updates,
      newDetails,
      allowedUpdates,
      apartment
    );
  }

  async makeApartmentNotAvailable() {
    return await ApartmentSchema.findByIdAndUpdate(
      this.data.id,
      { isAvailable: this.data.isAvailable },
      { new: true }
    );
  }

  // search apartments
  async searchApartments() {
    let query = { isAvailable: true };
    let apartmentSearch = this.data;
    query.$or = [
      {
        apartmentName: { $regex: apartmentSearch.toLowerCase(), $options: "i" },
      },
      { address: { $regex: apartmentSearch, $options: "i" } },
      {
        apartmentCountry: {
          $regex: apartmentSearch.toLowerCase(),
          $options: "i",
        },
      },
      {
        apartmentState: {
          $regex: apartmentSearch.toLowerCase(),
          $options: "i",
        },
      },
      { typeOfApartment: { $regex: apartmentSearch, $options: "i" } },
      { facilities: { $regex: apartmentSearch, $options: "i" } },
    ];
    return await ApartmentSchema.find(query);
  }

  // get a all apartment near you based on location state and country
  async getApartmentsNearYou() {
    const { apartmentCountry, apartmentState } = this.data;
    return await ApartmentSchema.find({
      apartmentCountry,
      apartmentState,
    }).orFail(() => throwError("No Apartment Found", 404));
  }
}

module.exports = Apartment;
