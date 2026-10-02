/* =========================================================
   HOMEFIX PUBLIC BOOKING SYSTEM
   ========================================================= */


/* ---------------------------------------------------------
   SUPABASE CONFIG
   --------------------------------------------------------- */

const SUPABASE_URL =
  "https://jjqxnsidbnibfnneaqwo.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_xa0AdT0m9SJ1Mrpiou4Nmw_Rby3-614";


/* ---------------------------------------------------------
   CREATE SUPABASE CLIENT
   --------------------------------------------------------- */

let supabaseClient = null;

try {

  if (
    !window.supabase ||
    typeof window.supabase.createClient !== "function"
  ) {

    throw new Error(
      "Supabase library did not load."
    );

  }

  supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );

} catch (error) {

  console.error(
    "Supabase initialization error:",
    error
  );

}


/* ---------------------------------------------------------
   SERVICE DATA
   --------------------------------------------------------- */

const serviceData = {

  "Electrical": {

    "Wiring": [
      "New Wiring",
      "House Wiring Repair",
      "Switch Board Repair",
      "Socket Repair"
    ],

    "Fan": [
      "Ceiling Fan Installation",
      "Ceiling Fan Repair",
      "Exhaust Fan Repair"
    ],

    "Light": [
      "Light Installation",
      "Light Repair",
      "LED Light Installation"
    ]

  },


  "Plumbing": {

    "Water Tap": [
      "Tap Repair",
      "Tap Replacement",
      "New Tap Installation"
    ],

    "Pipe": [
      "Pipe Leakage Repair",
      "Water Pipe Installation",
      "Pipe Replacement"
    ],

    "Bathroom": [
      "Bathroom Plumbing",
      "Commode Repair",
      "Basin Repair"
    ]

  },


  "AC Service": {

    "AC Repair": [
      "AC General Service",
      "AC Repair",
      "AC Installation"
    ],

    "AC Cleaning": [
      "AC Cleaning",
      "AC Deep Cleaning"
    ]

  },


  "Appliance Repair": {

    "Refrigerator": [
      "Refrigerator Repair",
      "Refrigerator Service"
    ],

    "Washing Machine": [
      "Washing Machine Repair",
      "Washing Machine Service"
    ],

    "Microwave": [
      "Microwave Repair",
      "Microwave Service"
    ]

  },


  "Painting": {

    "Interior": [
      "Room Painting",
      "Wall Painting",
      "Ceiling Painting"
    ],

    "Exterior": [
      "House Exterior Painting"
    ]

  }

};


/* ---------------------------------------------------------
   GET HTML ELEMENTS
   --------------------------------------------------------- */

const categorySelect =
  document.getElementById("category");

const subCategorySelect =
  document.getElementById("sub_category");

const serviceSelect =
  document.getElementById("service");


/* ---------------------------------------------------------
   CATEGORY CHANGE
   --------------------------------------------------------- */

if (categorySelect) {

  categorySelect.addEventListener(
    "change",
    function () {

      const category =
        categorySelect.value;


      /* Reset sub-category */

      subCategorySelect.innerHTML =
        '<option value="">Select Sub-category</option>';


      /* Reset service */

      serviceSelect.innerHTML =
        '<option value="">Select Service</option>';


      /* Disable */

      subCategorySelect.disabled = true;

      serviceSelect.disabled = true;


      if (
        !category ||
        !serviceData[category]
      ) {

        return;

      }


      /* Add sub-categories */

      Object.keys(
        serviceData[category]
      ).forEach(
        function (subCategory) {

          const option =
            document.createElement("option");

          option.value =
            subCategory;

          option.textContent =
            subCategory;

          subCategorySelect.appendChild(
            option
          );

        }
      );


      /* Enable */

      subCategorySelect.disabled = false;

    }
  );

}


/* ---------------------------------------------------------
   SUB-CATEGORY CHANGE
   --------------------------------------------------------- */

if (subCategorySelect) {

  subCategorySelect.addEventListener(
    "change",
    function () {

      const category =
        categorySelect.value;

      const subCategory =
        subCategorySelect.value;


      /* Reset service */

      serviceSelect.innerHTML =
        '<option value="">Select Service</option>';


      serviceSelect.disabled = true;


      if (
        !category ||
        !subCategory ||
        !serviceData[category] ||
        !serviceData[category][subCategory]
      ) {

        return;

      }


      /* Add services */

      serviceData[category][subCategory]
        .forEach(
          function (service) {

            const option =
              document.createElement("option");

            option.value =
              service;

            option.textContent =
              service;

            serviceSelect.appendChild(
              option
            );

          }
        );


      /* Enable */

      serviceSelect.disabled = false;

    }
  );

}


/* ---------------------------------------------------------
   BOOKING NUMBER GENERATOR
   --------------------------------------------------------- */

function generateBookingNumber() {

  const now =
    new Date();


  const year =
    now.getFullYear();


  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");


  const day =
    String(
      now.getDate()
    ).padStart(2, "0");


  const randomNumber =
    Math.floor(
      1000 +
      Math.random() * 9000
    );


  return (
    "HF-" +
    year +
    month +
    day +
    "-" +
    randomNumber
  );

}


/* ---------------------------------------------------------
   SHOW MESSAGE
   --------------------------------------------------------- */

function showMessage(
  type,
  text
) {

  const message =
    document.getElementById("message");

  if (!message) {
    return;
  }


  message.className =
    "message " + type;


  message.textContent =
    text;


  message.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

}


/* ---------------------------------------------------------
   SUBMIT BOOKING
   --------------------------------------------------------- */

window.submitHomeFixBooking =
  async function (event) {

    if (event) {
      event.preventDefault();
    }


    /* -----------------------------------------------------
       CHECK SUPABASE
       ----------------------------------------------------- */

    if (!supabaseClient) {

      showMessage(
        "error",
        "Supabase connection failed. Please refresh the page."
      );

      return false;

    }


    /* -----------------------------------------------------
       GET FORM
       ----------------------------------------------------- */

    const form =
      document.getElementById(
        "bookingForm"
      );

    const submitBtn =
      document.getElementById(
        "submitBtn"
      );


    if (!form) {

      showMessage(
        "error",
        "Booking form not found."
      );

      return false;

    }


    /* -----------------------------------------------------
       GET VALUES
       ----------------------------------------------------- */

    const customerName =
      document
        .getElementById("customer_name")
        .value
        .trim();


    const customerPhone =
      document
        .getElementById("phone")
        .value
        .trim();


    const category =
      document
        .getElementById("category")
        .value;


    const subCategory =
      document
        .getElementById("sub_category")
        .value;


    const service =
      document
        .getElementById("service")
        .value;


    const priceValue =
      document
        .getElementById("price")
        .value
        .trim();


    const serviceDate =
      document
        .getElementById("service_date")
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


    /* -----------------------------------------------------
       VALIDATION
       ----------------------------------------------------- */

    if (!customerName) {

      showMessage(
        "error",
        "Please enter customer name."
      );

      return false;

    }


    if (!customerPhone) {

      showMessage(
        "error",
        "Please enter phone number."
      );

      return false;

    }


    if (!category) {

      showMessage(
        "error",
        "Please select a category."
      );

      return false;

    }


    if (!subCategory) {

      showMessage(
        "error",
        "Please select a sub-category."
      );

      return false;

    }


    if (!service) {

      showMessage(
        "error",
        "Please select a service."
      );

      return false;

    }


    if (!priceValue) {

      showMessage(
        "error",
        "Please enter service price."
      );

      return false;

    }


    if (!serviceDate) {

      showMessage(
        "error",
        "Please select service date."
      );

      return false;

    }


    if (!address) {

      showMessage(
        "error",
        "Please enter service address."
      );

      return false;

    }


    /* -----------------------------------------------------
       PRICE
       ----------------------------------------------------- */

    const price =
      Number(priceValue);


    if (
      Number.isNaN(price) ||
      price < 0
    ) {

      showMessage(
        "error",
        "Please enter a valid price."
      );

      return false;

    }


    /* -----------------------------------------------------
       GENERATE BOOKING NUMBER
       ----------------------------------------------------- */

    const bookingNumber =
      generateBookingNumber();


    /* -----------------------------------------------------
       BOOKING DATA
       ----------------------------------------------------- */

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
      "HomeFix booking data:",
      bookingData
    );


    /* -----------------------------------------------------
       DISABLE BUTTON
       ----------------------------------------------------- */

    submitBtn.disabled =
      true;

    submitBtn.textContent =
      "Submitting Booking...";


    /* -----------------------------------------------------
       INSERT INTO SUPABASE
       ----------------------------------------------------- */

    try {

      const result =
        await supabaseClient
          .from("bookings")
          .insert([
            bookingData
          ]);


      /* ---------------------------------------------------
         SUPABASE ERROR
         --------------------------------------------------- */

      if (result.error) {

        console.error(
          "Supabase booking error:",
          result.error
        );


        showMessage(
          "error",
          "Booking failed: " +
          result.error.message
        );


        submitBtn.disabled =
          false;

        submitBtn.textContent =
          "Submit Booking";


        return false;

      }


      /* ---------------------------------------------------
         SUCCESS
         --------------------------------------------------- */

      console.log(
        "Booking successfully created:",
        bookingNumber
      );


      showMessage(
        "success",
        "Booking successfully submitted!"
      );


      /* ---------------------------------------------------
         SHOW BOOKING NUMBER
         --------------------------------------------------- */

      const bookingResult =
        document.getElementById(
          "bookingResult"
        );


      if (bookingResult) {

        bookingResult.style.display =
          "block";


        bookingResult.innerHTML =
          `
          <strong>Booking Successful!</strong>
          <br><br>
          Your Booking Number:
          <br>
          <strong>${bookingNumber}</strong>
          <br><br>
          Please keep this Booking Number for future reference.
          `;

      }


      /* ---------------------------------------------------
         RESET FORM
         --------------------------------------------------- */

      form.reset();


      /* Reset dropdowns */

      subCategorySelect.innerHTML =
        '<option value="">Select Sub-category</option>';

      serviceSelect.innerHTML =
        '<option value="">Select Service</option>';


      subCategorySelect.disabled =
        true;

      serviceSelect.disabled =
        true;


      /* ---------------------------------------------------
         BUTTON
         --------------------------------------------------- */

      submitBtn.disabled =
        false;

      submitBtn.textContent =
        "Submit Booking";


      return false;


    } catch (error) {

      console.error(
        "Unexpected booking error:",
        error
      );


      showMessage(
        "error",
        "Something went wrong: " +
        error.message
      );


      submitBtn.disabled =
        false;

      submitBtn.textContent =
        "Submit Booking";


      return false;

    }

  };


/* ---------------------------------------------------------
   PAGE LOADED
   --------------------------------------------------------- */

console.log(
  "HomeFix public booking system loaded."
);

console.log(
  "Supabase:",
  supabaseClient
);
