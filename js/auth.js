import {supabase,configured} from './supabase.js';
const form=document.querySelector('#loginForm'), msg=document.querySelector('#loginMsg');
form.addEventListener('submit',async e=>{e.preventDefault();
if(!configured){msg.textContent='First configure Supabase in js/supabase.js';return}
msg.textContent='Signing in...';
const {data,error}=await supabase.auth.signInWithPassword({email:email.value,password:password.value});
if(error){msg.textContent=error.message;return}
const {data:p,error:pe}=await supabase.from('profiles').select('role').eq('auth_user_id',data.user.id).single();
if(pe){msg.textContent=pe.message;return}
location.href=p.role==='admin'?'admin.html':p.role==='technician'?'technician.html':'customer.html';
});
