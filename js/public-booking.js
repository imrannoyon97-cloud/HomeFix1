"use strict";


// ============================================================
// HOMEFIX.LIVE - SUPABASE CONFIG
// ============================================================

const SUPABASE_URL =
  "https://jjqxnsidbnibfnneaqwo.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_xa0AdT0m9SJ1Mrpiou4Nmw_Rby3-614";


// ============================================================
// CHECK SUPABASE LIBRARY
// ============================================================

if (!window.supabase) {

  console.error(
    "Supabase JavaScript library was not loaded."
  );

  throw new Error(
    "Supabase library not loaded."
  );
}


// ============================================================
// CREATE SUPABASE CLIENT
// ============================================================

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );


// ============================================================
// ELEMENTS
// ============================================================

const bookingForm =
  document.getElementById("bookingForm");

const bookingMessage =
  document.getElementById("bookingMessage");

const submitButton =
  document.getElementById("submitBooking");


// ============================================================
// SERVICE DATE
// ============================================================

const serviceDateInput =
  document.getElementById("serviceDate");


if (serviceDateInput) {

  const today = new Date();

  const yyyy =
    today.getFullYear();

  const mm =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");

  const dd =
    String(
      today.getDate()
    ).padStart(2, "0");

  serviceDateInput.min =
    `${yyyy}-${mm}-${dd}`;
}


// ============================================================
// GENERATE BOOKING NUMBER
// ============================================================

function generateBookingNumber() {

  const now = new Date();

  const yyyy =
    now.getFullYear();

  const mm =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");

  const dd =
    String(
      now.getDate()
    ).padStart(2, "0");

  const random =
    Math.floor(
      1000 + Math.random() * 9000
    );

  return `HF-${yyyy}${mm}${dd}-${random}`;
}


// ============================================================
// SHOW MESSAGE
// ============================================================

function showMessage(
  text,
  type
) {

  if (!bookingMessage) {

    alert(text);

    return;
  }

  bookingMessage.textContent =
    text;

  bookingMessage.className = "";

  bookingMessage.classList.add(
    type
  );

  bookingMessage.style.display =
    "block";
}


// ============================================================
// HIDE MESSAGE
// ============================================================

function hideMessage() {

  if (!bookingMessage) {
    return;
  }

  bookingMessage.textContent =
    "";

  bookingMessage.className =
    "";

  bookingMessage.style.display =
    "none";
}


// ============================================================
// CHECK FORM
// ============================================================

if (!bookingForm) {

  console.error(
    "HomeFix: bookingForm not found."
  );

} else {


  // ==========================================================
  // SUBMIT BOOKING
  // ==========================================================

  bookingForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      hideMessage();


      // ------------------------------------------------------
      // GET FORM VALUES
      // ------------------------------------------------------

      const customerName =
        document
          .getElementById("customerName")
          .value
          .trim();


      const customerPhone =
        document
          .getElementById("customerPhone")
          .value
          .trim();


      const category =
        document
          .getElementById("category")
          .value
          .trim();


      const subCategory =
        document
          .getElementById("subCategory")
          .value
          .trim();


      const service =
        document
          .getElementById("service")
          .value
          .trim();


      const priceText =
        document
          .getElementById("price")
          .value
          .trim();


      const serviceDate =
        document
          .getElementById("serviceDate")
          .value;


      const address =
        document
          .getElementById("address")
          .value
          .trim();


      const problem =
        document
          .getElementById("problem")
          .value
          .trim();


      // ------------------------------------------------------
      // VALIDATION
      // ------------------------------------------------------

      if (!customerName) {

        showMessage(
          "Please enter customer name.",
          "error"
        );

        return;
      }


      if (!customerPhone) {

        showMessage(
          "Please enter phone number.",
          "error"
        );

        return;
      }


      if (!category) {

        showMessage(
          "Please enter problem category.",
          "error"
        );

        return;
      }


      if (!subCategory) {

        showMessage(
          "Please enter problem sub-category.",
          "error"
        );

        return;
      }


      if (!service) {

        showMessage(
          "Please enter service item.",
          "error"
        );

        return;
      }


      if (!priceText) {

        showMessage(
          "Please enter service price.",
          "error"
        );

        return;
      }


      const price =
        Number(priceText);


      if (
        !Number.isFinite(price) ||
        price < 0
      ) {

        showMessage(
          "Please enter a valid service price.",
          "error"
        );

        return;
      }


      if (!serviceDate) {

        showMessage(
          "Please select preferred service date.",
          "error"
        );

        return;
      }


      if (!address) {

        showMessage(
          "Please enter service address.",
          "error"
        );

        return;
      }


      // ------------------------------------------------------
      // GENERATE BOOKING ID
      // ------------------------------------------------------

      const bookingNumber =
        generateBookingNumber();


      // ------------------------------------------------------
      // BOOKING DATA
      // ------------------------------------------------------

      const bookingData = {

        booking_id:
          bookingNumber,

        booking_number:
          bookingNumber,

        customer_name:
          customerName,

        phone:
          customerPhone,

        category:
          category,

        sub_category:
          subCategory,

        service:
          service,

        price:
          price,

        service_date:
          serviceDate,

        address:
          address,

        problem:
          problem,

        status:
          "NEW"

      };


      console.log(
        "Booking data:",
        bookingData
      );


      // ------------------------------------------------------
      // DISABLE BUTTON
      // ------------------------------------------------------

      if (submitButton) {

        submitButton.disabled =
          true;

        submitButton.textContent =
          "Submitting...";
      }


      showMessage(
        "Submitting booking...",
        "info"
      );


      // ------------------------------------------------------
      // SEND TO SUPABASE
      // IMPORTANT:
      // NO .select()
      // ------------------------------------------------------

      try {

        const {
          error
        } =
          await supabaseClient
            .from("bookings")
            .insert(
              [bookingData]
            );


        // ----------------------------------------------------
        // ERROR
        // ----------------------------------------------------

        if (error) {

          console.error(
            "HOMEFIX SUPABASE ERROR:",
            error
          );


          showMessage(
            "Booking failed: " +
            error.message,
            "error"
          );


          return;
        }


        // ----------------------------------------------------
        // SUCCESS
        // ----------------------------------------------------

        console.log(
          "BOOKING CREATED:",
          bookingData
        );


        showMessage(
          "Booking successful! Your Booking ID is: " +
          bookingNumber,
          "success"
        );


        // Clear form
        bookingForm.reset();


        // Reset date minimum
        if (serviceDateInput) {

          const today =
            new Date();

          const yyyy =
            today.getFullYear();

          const mm =
            String(
              today.getMonth() + 1
            ).padStart(2, "0");

          const dd =
            String(
              today.getDate()
            ).padStart(2, "0");

          serviceDateInput.min =
            `${yyyy}-${mm}-${dd}`;
        }


      } catch (error) {

        console.error(
          "UNEXPECTED ERROR:",
          error
        );


        showMessage(
          "Could not connect to Supabase. Please try again.",
          "error"
        );


      } finally {

        if (submitButton) {

          submitButton.disabled =
            false;

          submitButton.textContent =
            "Submit Booking";
        }

      }

    }
  );

}


// ============================================================
// DEBUG
// ============================================================

console.log(
  "HomeFix public booking loaded."
);

console.log(
  "Supabase URL:",
  SUPABASE_URL
);

console.log(
  "Supabase client:",
  supabaseClient
);
