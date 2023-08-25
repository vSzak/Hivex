const { get } = require('mongoose')
const coupon = require('../database/models/coupon')

const addCoupon = async (body) => {

    const newCoupon = new coupon({

        expiry: body.expiry,
        totalCreated: body.totalCreated,
        couponCode: body.couponCode,
        value: body.value
    })

    return newCoupon.save()
    
}

const getAllCoupons = async () => {

    return await coupon.find({})
}

const verifyCoupon = async (body) => {

    const Coupon = await coupon.findOne({code: body.coupon})
    if (coupon) {
        if (new Date().getTime() < Coupon.expiry.getTime()) {

            if (body.total >= coupon.totalCreated) {

                let discount;
                if (Coupon.type === 'percentage') {

                    discount = (body.total * Coupon.value)/100
                } else {
                    discount = Coupon.value
                }

                return {
                    inRange: true,
                    discount,
                    finalAmount: body.total - discount
                }
            } else {
                return {
                    inRange: false,
                    message: 'Need to add more items wirth ${Coupon.totalCreated - body.total} to the list for this coupon to be enabled.'
                }
            }
        } else {
            return {
                inRange: false,
                message: 'Coupon expired! Try another coupon.'
            }
        }
    } else {
        return {
            inRange: false,
            message: 'Coupon invalid! Please use a valid Coupon.'
        }
    }
}

module.exports = addCoupon, getAllCoupons, verifyCoupon