import {supabase,configured} from './supabase.js';
const form=document.querySelector('#bookingForm'), msg=document.querySelector('#bookingMsg');
form.addEventListener('submit',async e=>{e.preventDefault();
if(!configured){msg.textContent='Supabase configure করলে booking database-এ save হবে।';return}
const code='HF-'+Date.now().toString().slice(-8);
const {error}=await supabase.from('public_booking_requests').insert({booking_number:code,customer_name:customerName.value,customer_phone:customerPhone.value,service_name:serviceName.value,service_date:serviceDate.value,problem_description:problem.value,address:address.value});
msg.textContent=error?error.message:`Booking submitted: ${code}`;
if(!error) form.reset();
});
