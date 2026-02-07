
// import { APIClient } from "../../helpers/api_helper";   // your file path

// const api = new APIClient();

// const PayButton = () => {

//     const handlePayment = async () => {

//         // STEP 1: Create order from Laravel
//         const orderRes: any = await api.post("api/create-order");

//         const order_id = orderRes.order_id;

//         const options = {
//             key: "rzp_test_S5id1SbCLP8Tfu", // your razorpay key
//             amount: 500 * 100,
//             currency: "INR",
//             name: "Demo Payment",
//             order_id: order_id,

//             handler: async function (response: any) {

//                 // STEP 2: Submit form + payment to backend
//                 await api.post("/submit-form", {
//                     mobile: "9876543210",
//                     surname: "Patel",
//                     name: "Rahul",
//                     dob: "1998-05-10",
//                     gender: "Male",
//                     email: "rahul@test.com",
//                     password: "Password@123",
//                     address: "Street 21",
//                     state: "Gujarat",
//                     city: "Vadodara",
//                     pincode: "390007",

//                     payment_id: response.razorpay_payment_id,
//                     order_id: response.razorpay_order_id,
//                     signature: response.razorpay_signature
//                 });

//                 alert("Payment Success");
//             }
//         };

//         const rzp = new (window as any).Razorpay(options);
//         rzp.open();
//     };

//     return (
//         <button onClick={handlePayment}>
//             Pay Now
//         </button>
//     );
// };

// export default PayButton;
import React from "react";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

const PayButton: React.FC = () => {

    const handlePayment = async () => {

        try {
            // STEP 1: Create order from Laravel
            const orderRes: any = await api.post("api/create-order");

            const order_id = orderRes.order_id;

            const options = {
                key: "rzp_test_S5id1SbCLP8Tfu",
                amount: 500 * 100,
                currency: "INR",
                name: "Demo Payment",
                order_id: order_id,

                handler: async function (response: any) {

                    // SHOW IN CONSOLE (important)
                    console.log("Razorpay Full Response:", response);

                    const paymentJson = {
                        payment_id: response.razorpay_payment_id,
                        order_id: response.razorpay_order_id,
                        signature: response.razorpay_signature,
                    };

                    console.log("Payment JSON:", paymentJson);

                    // STEP 2: Submit form + payment to backend
                    await api.post("api/submit-form", {
                        mobile: "9876543210",
                        surname: "Patel",
                        name: "Rahul",
                        dob: "1998-05-10",
                        gender: "Male",
                        email: "rahul@test.com",
                        password: "Password@123",
                        address: "Street 21",
                        state: "Gujarat",
                        city: "Vadodara",
                        pincode: "390007",
                        ...paymentJson
                    });

                    alert("Payment Success");
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error(error);
            alert("Payment failed");
        }
    };

    return (
        <button onClick={handlePayment}>
            Pay Now
        </button>
    );
};

export default PayButton;
