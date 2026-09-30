const SUPABASE_URL = "https://jjqxnsidbnibfnneaqwo.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcXhuc2lkYm5pYmZubmVhcXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MDU5OTYsImV4cCI6MjEwNTk4MTk5Nn0.T9-BN9vKrDGy2efxc7xG0Kgp00UKUCfxhNjb7zZ3n8U";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

const bookingForm = document.getElementById("bookingForm");
const bookingMsg = document.getElementById("bookingMsg");


function generateBookingId() {

    const now = new Date();

    const date =
        now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0");

    const random =
        Math.floor(1000 + Math.random() * 9000);

    return "HF-" + date + "-" + random;
}


function showMessage(message, type = "success") {

    if (!bookingMsg) {
        console.error("bookingMsg element not found.");
        return;
    }

    bookingMsg.textContent = message;
    bookingMsg.style.display = "block";
    bookingMsg.style.color =
        type === "success" ? "green" : "red";
}


if (!bookingForm) {

    console.error("bookingForm element not found.");

} else {

    bookingForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const customerName =
            document.getElementById("customerName")?.value.trim() || "";

        const customerPhone =
            document.getElementById("customerPhone")?.value.trim() || "";

        const category =
            document.getElementById("category")?.value.trim() || "";

        const subCategory =
            document.getElementById("subCategory")?.value.trim() || "";

        const service =
            document.getElementById("service")?.value.trim() || "";

        const price =
            document.getElementById("price")?.value || "";

        const serviceDate =
            document.getElementById("serviceDate")?.value || "";

        const address =
            document.getElementById("address")?.value.trim() || "";

        const problem =
            document.getElementById("problem")?.value.trim() || "";


        if (!customerName) {
            showMessage("Please enter customer name.", "error");
            return;
        }

        if (!customerPhone) {
            showMessage("Please enter phone number.", "error");
            return;
        }

        if (!category) {
            showMessage("Please select or enter a category.", "error");
            return;
        }

        if (!subCategory) {
            showMessage("Please select or enter a sub category.", "error");
            return;
        }

        if (!service) {
            showMessage("Please select or enter a service.", "error");
            return;
        }

        if (!price || Number(price) < 0) {
            showMessage("Please enter a valid service price.", "error");
            return;
        }

        if (!serviceDate) {
            showMessage("Please select service date.", "error");
            return;
        }

        if (!address) {
            showMessage("Please enter service address.", "error");
            return;
        }


        const submitButton =
            bookingForm.querySelector('button[type="submit"]');

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Submitting...";
        }


        try {

            const bookingId = generateBookingId();


            /*
             * IMPORTANT:
             * booking_number is required by the bookings table.
             */

            const bookingData = {

                booking_id: bookingId,

                booking_number: bookingId,

                customer_name: customerName,

                phone: customerPhone,

                category: category,

                sub_category: subCategory,

                service: service,

                price: Number(price),

                service_date: serviceDate,

                address: address,

                problem: problem,

                status: "NEW"

            };


            console.log("Sending booking:", bookingData);


            /*
             * Use Supabase JS client directly.
             * No manual fetch / Authorization header.
             */

            const { data, error } =
                await supabaseClient
                    .from("bookings")
                    .insert([bookingData])
                    .select("booking_id, booking_number");


            console.log("Supabase insert result:", {
                data,
                error
            });


            if (error) {

                console.error("Supabase booking error:", error);

                throw new Error(
                    error.message ||
                    "Booking could not be submitted."
                );
            }


            showMessage(
                "Booking submitted successfully! Booking ID: " + bookingId,
                "success"
            );


            bookingForm.reset();


            const serviceDateInput =
                document.getElementById("serviceDate");

            if (serviceDateInput) {

                const today =
                    new Date()
                        .toISOString()
                        .split("T")[0];

                serviceDateInput.min = today;
            }


            const subCategoryList =
                document.getElementById("subCategoryList");

            const serviceList =
                document.getElementById("serviceList");

            if (subCategoryList) {
                subCategoryList.innerHTML = "";
            }

            if (serviceList) {
                serviceList.innerHTML = "";
            }


        } catch (error) {

            console.error(
                "Booking submission error:",
                error
            );

            showMessage(
                error.message ||
                "Something went wrong. Please try again.",
                "error"
            );

        } finally {

            if (submitButton) {

                submitButton.disabled = false;
                submitButton.textContent = "Submit Booking";

            }

        }

    });

}
