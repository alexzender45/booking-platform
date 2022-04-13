const userSchema = require("../src/models/userModel")
const request = require("supertest")
const app = require("../server")
const crypto = require("crypto")
const keys = require("../src/core/config")
const mongoose = require('mongoose')

const body = {
    firstName: "tester",
    lastName: "jelhill",
    email: "email@email.com",
    phoneNumber: "08025995245",
    userName: "jelsbaby",
    address: "6, Ikorodu ROad",
    state: "Lagos",
    country: "Nigeria",
    password: "11111111",
    hash: "",
    otp: 123455
}

const duration = 1000 * 60 * 20
const expires = Date.now() + duration;
const { email, otp } = body
const data = `${email}.${otp}.${expires}`
const hashData = crypto.createHmac("sha256", keys.OTP_SECRET).update(data).digest("hex")
const fullHash = `${hashData}.${expires}`
body.hash = fullHash;

beforeEach(async (done) => {
    await userSchema.deleteMany({})
    done();
})

beforeAll(done => {
    done()
})

afterAll(done => {
    mongoose.connection.close()
    done()
})

test("A case of where empty object is received", async (done) => {
    const sendOtp = await request(app).post('/sendOTP').send({})
    const { status, message} = sendOtp.body
    expect(400)
    expect(status).toBe("error")
    expect(message).toBe("Email is required")
    done()
})

test("Successfully post a user", async (done) => { 
    const user = await request(app).post('/signup').send(body)
    const { data } = user.body.data
    expect(data.firstName).toBeTruthy()
    expect(data.lastName).toBeTruthy()  
    expect(data.userName).toBeTruthy();
    expect(data.email).toBeTruthy();
    expect(data.address).toBeTruthy();
    expect(200)
    done()
})
