// ======================================================
// HOMEFIX - PUBLIC BOOKING
// Supabase Connected Version
// ======================================================

// ---------- SUPABASE CONFIG ----------
const SUPABASE_URL =
  "https://jjqxnsidbnibfnneaqwo.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_xa0AdT0m9SJ1Mrpiou4Nmw_Rby3-614";

// Create Supabase client
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// ======================================================
// GENERATE BOOKING ID
// ======================================================

function generateBookingId() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  return `HF-${year}${month}${day}-${randomNumber}`;
}


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("bookingForm");
  const message = document.getElementById("bookingMessage");

  if (!form) {
    console.error("Booking form not found: #bookingForm");
    return;
  }

  // ----------------------------------------------------
  // SUBMIT BOOKING
  // ----------------------------------------------------

  form.addEventListener("submit", async function (event) {

    event.preventDefault();

    // --------------------------------------------------
    // GET FORM VALUES
    // --------------------------------------------------

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

    const priceValue =
      document.getElementById("price")?.value.trim() || "";

    const serviceDate =
      document.getElementById("serviceDate")?.value || "";

    const address =
      document.getElementById("address")?.value.trim() || "";

    const problem =
      document.getElementById("problem")?.value.trim() || "";


    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!customerName) {
      showMessage("Please enter customer name.", "error");
      return;
    }

    if (!customerPhone) {
      showMessage("Please enter phone number.", "error");
      return;
    }

    if (!category) {
      showMessage("Please select/enter category.", "error");
      return;
    }

    if (!subCategory) {
      showMessage("Please select/enter sub-category.", "error");
      return;
    }

    if (!service) {
      showMessage("Please select/enter service.", "error");
      return;
    }

    if (!priceValue) {
      showMessage("Please enter service price.", "error");
      return;
    }

    const price = Number(priceValue);

    if (Number.isNaN(price) || price < 0) {
      showMessage("Please enter a valid price.", "error");
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


    // --------------------------------------------------
    // CREATE BOOKING ID
    // --------------------------------------------------

    const bookingId = generateBookingId();


    // --------------------------------------------------
    // BOOKING DATA
    // --------------------------------------------------

    const bookingData = {

      booking_id: bookingId,

      booking_number: bookingId,

      customer_name: customerName,

      phone: customerPhone,

      category: category,

      sub_category: subCategory,

      service: service,

      price: price,

      service_date: serviceDate,

      address: address,

      problem: problem,

      status: "NEW"

    };


    // --------------------------------------------------
    // BUTTON
    // --------------------------------------------------

    const submitButton =
      form.querySelector('button[type="submit"]');

    const oldButtonText =
      submitButton ? submitButton.innerText : "";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerText = "Submitting...";
    }

    showMessage("Submitting booking...", "info");


    // --------------------------------------------------
    // INSERT INTO SUPABASE
    // IMPORTANT:
    // NO .select() AFTER INSERT
    // --------------------------------------------------

    try {

      const { error } = await supabaseClient
        .from("bookings")
        .insert([bookingData]);


      // ------------------------------------------------
      // ERROR
      // ------------------------------------------------

      if (error) {

        console.error("SUPABASE BOOKING ERROR:", error);

        showMessage(
          "Booking failed: " + error.message,
          "error"
        );

        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerText = oldButtonText;
        }

        return;
      }


      // ------------------------------------------------
      // SUCCESS
      // ------------------------------------------------

      console.log(
        "Booking successfully created:",
        bookingId
      );

      showMessage(
        `Booking successful! Your Booking ID is ${bookingId}`,
        "success"
      );


      // ------------------------------------------------
      // RESET FORM
      // ------------------------------------------------

      form.reset();


    } catch (err) {

      console.error("Unexpected booking error:", err);

      showMessage(
        "Something went wrong. Please try again.",
        "error"
      );

    } finally {

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerText =
          oldButtonText || "Submit Booking";
      }

    }

  });


  // ====================================================
  // MESSAGE FUNCTION
  // ====================================================

  function showMessage(text, type) {

    if (!message) {
      alert(text);
      return;
    }

    message.innerText = text;

    message.style.display = "block";

    // Remove old classes
    message.classList.remove(
      "success",
      "error",
      "info"
    );

    message.classList.add(type);
  }

});
