"use strict";


// =====================================================
// SUPABASE
// =====================================================

const SUPABASE_URL =
"https://jjqxnsidbnibfnneaqwo.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
"sb_publishable_xa0AdT0m9SJ1Mrpiou4Nmw_Rby3-614";


const supabaseClient =
window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// =====================================================
// SERVICE DATA
// =====================================================

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


// =====================================================
// ELEMENTS
// =====================================================

const category =
document.getElementById("category");

const subCategory =
document.getElementById("subCategory");

const service =
document.getElementById("service");

const bookingForm =
document.getElementById("bookingForm");

const message =
document.getElementById("bookingMessage");

const submitButton =
document.getElementById("submitBooking");


// =====================================================
// LOAD CATEGORY OPTIONS
// =====================================================

function loadCategories(){

  category.innerHTML =
  '<option value="">Select Category</option>';

  Object.keys(serviceData).forEach(
    function(cat){

      const option =
      document.createElement("option");

      option.value = cat;
      option.textContent = cat;

      category.appendChild(option);

    }
  );

}


// =====================================================
// CATEGORY CHANGE
// =====================================================

category.addEventListener(
"change",
function(){

  const selected =
  category.value;


  subCategory.innerHTML =
  '<option value="">Select Sub-category</option>';

  service.innerHTML =
  '<option value="">Select Service</option>';


  service.disabled = true;


  if(!selected){

    subCategory.disabled = true;

    return;

  }


  subCategory.disabled = false;


  const subCategories =
  Object.keys(
    serviceData[selected]
  );


  subCategories.forEach(
    function(sub){

      const option =
      document.createElement("option");

      option.value = sub;

      option.textContent = sub;

      subCategory.appendChild(option);

    }
  );

});


// =====================================================
// SUB CATEGORY CHANGE
// =====================================================

subCategory.addEventListener(
"change",
function(){

  const cat =
  category.value;

  const sub =
  subCategory.value;


  service.innerHTML =
  '<option value="">Select Service</option>';


  if(!cat || !sub){

    service.disabled = true;

    return;

  }


  service.disabled = false;


  const services =
  serviceData[cat][sub];


  services.forEach(
    function(item){

      const option =
      document.createElement("option");

      option.value = item;

      option.textContent = item;

      service.appendChild(option);

    }
  );

});


// =====================================================
// DATE
// =====================================================

const serviceDate =
document.getElementById("serviceDate");


const today =
new Date();


const yyyy =
today.getFullYear();


const mm =
String(
today.getMonth() + 1
).padStart(2,"0");


const dd =
String(
today.getDate()
).padStart(2,"0");


serviceDate.min =
`${yyyy}-${mm}-${dd}`;


// =====================================================
// BOOKING NUMBER
// =====================================================

function generateBookingNumber(){

  const now =
  new Date();


  const year =
  now.getFullYear();


  const month =
  String(
    now.getMonth() + 1
  ).padStart(2,"0");


  const day =
  String(
    now.getDate()
  ).padStart(2,"0");


  const random =
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
    random
  );

}


// =====================================================
// MESSAGE
// =====================================================

function showMessage(
  text,
  type
){

  message.textContent =
  text;

  message.className =
  type;

  message.style.display =
  "block";

}


// =====================================================
// BOOKING SUBMIT
// =====================================================

window.submitHomeFixBooking =
async function(event){

  event.preventDefault();


  // ---------------------------------------------------
  // VALUES
  // ---------------------------------------------------

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


  const selectedCategory =
  category.value;


  const selectedSubCategory =
  subCategory.value;


  const selectedService =
  service.value;


  const priceText =
  document
  .getElementById("price")
  .value
  .trim();


  const selectedDate =
  serviceDate.value;


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


  // ---------------------------------------------------
  // VALIDATION
  // ---------------------------------------------------

  if(!customerName){

    showMessage(
      "Please enter customer name.",
      "error"
    );

    return false;

  }


  if(!customerPhone){

    showMessage(
      "Please enter phone number.",
      "error"
    );

    return false;

  }


  if(!selectedCategory){

    showMessage(
      "Please select category.",
      "error"
    );

    return false;

  }


  if(!selectedSubCategory){

    showMessage(
      "Please select sub-category.",
      "error"
    );

    return false;

  }


  if(!selectedService){

    showMessage(
      "Please select service.",
      "error"
    );

    return false;

  }


  if(!priceText){

    showMessage(
      "Please enter service price.",
      "error"
    );

    return false;

  }


  const price =
  Number(priceText);


  if(
    !Number.isFinite(price) ||
    price < 0
  ){

    showMessage(
      "Please enter a valid price.",
      "error"
    );

    return false;

  }


  if(!selectedDate){

    showMessage(
      "Please select service date.",
      "error"
    );

    return false;

  }


  if(!address){

    showMessage(
      "Please enter service address.",
      "error"
    );

    return false;

  }


  // ---------------------------------------------------
  // BOOKING NUMBER
  // ---------------------------------------------------

  const bookingNumber =
  generateBookingNumber();


  // ---------------------------------------------------
  // BOOKING DATA
  // ---------------------------------------------------

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
    selectedCategory,

    sub_category:
    selectedSubCategory,

    service:
    selectedService,

    price:
    price,

    service_date:
    selectedDate,

    address:
    address,

    problem:
    problem,

    status:
    "NEW"

  };


  // ---------------------------------------------------
  // BUTTON
  // ---------------------------------------------------

  submitButton.disabled =
  true;

  submitButton.textContent =
  "Submitting...";


  showMessage(
    "Submitting booking...",
    "info"
  );


  // ---------------------------------------------------
  // SUPABASE INSERT
  // ---------------------------------------------------

  try{

    const {
      error
    } =
    await supabaseClient
    .from("bookings")
    .insert([
      bookingData
    ]);


    // -------------------------------------------------
    // ERROR
    // -------------------------------------------------

    if(error){

      console.error(
        "SUPABASE ERROR:",
        error
      );


      showMessage(
        error.message,
        "error"
      );


      return false;

    }


    // -------------------------------------------------
    // SUCCESS
    // -------------------------------------------------

    showMessage(
      "Booking successful! Booking ID: " +
      bookingNumber,
      "success"
    );


    bookingForm.reset();


    subCategory.innerHTML =
    '<option value="">Select Sub-category</option>';

    service.innerHTML =
    '<option value="">Select Service</option>';

    subCategory.disabled =
    true;

    service.disabled =
    true;


    return false;


  }catch(error){

    console.error(
      "BOOKING ERROR:",
      error
    );


    showMessage(
      "Unable to connect to Supabase.",
      "error"
    );


    return false;


  }finally{

    submitButton.disabled =
    false;

    submitButton.textContent =
    "Submit Booking";

  }

};


// =====================================================
// INITIALIZE
// =====================================================

loadCategories();


console.log(
  "HomeFix booking system loaded."
);

console.log(
  "Supabase URL:",
  SUPABASE_URL
);
