import { supabase, configured } from './supabase.js';

const form = document.querySelector('#bookingForm');
const msg = document.querySelector('#bookingMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!configured) {
    msg.textContent = 'Supabase configure করা হয়নি।';
    return;
  }

  const customerName = document.querySelector('#customerName').value.trim();
  const customerPhone = document.querySelector('#customerPhone').value.trim();
  const serviceName = document.querySelector('#serviceName').value.trim();
  const serviceDate = document.querySelector('#serviceDate').value || null;
  const problem = document.querySelector('#problem').value.trim();
  const address = document.querySelector('#address').value.trim();

  if (!customerName || !customerPhone || !serviceName || !address) {
    msg.textContent = 'Customer name, phone, service এবং address দিন।';
    return;
  }

  const requestNumber =
    'HF-' + Date.now().toString().slice(-8);

  msg.textContent = 'Booking save হচ্ছে...';

  const { error } = await supabase
    .from('public_booking_requests')
    .insert({
      request_number: requestNumber,
      customer_name: customerName,
      phone: customerPhone,
      address: address,
      note: problem,
      category: 'Electrical Service',
      sub_category: '',
      service_name: serviceName,
      price_text: '',
      quantity: 1,
      preferred_date: serviceDate,
      preferred_time: null,
      status: 'NEW'
    });

  if (error) {
    console.error(error);
    msg.textContent = 'Booking save হয়নি: ' + error.message;
    return;
  }

  msg.textContent =
    'Booking সফল হয়েছে! Booking ID: ' + requestNumber;

  form.reset();
});
