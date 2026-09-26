import { supabase } from './supabase.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({
  '&':'&amp;',
  '<':'&lt;',
  '>':'&gt;',
  '"':'&quot;',
  "'":'&#39;'
}[m]));

async function guard() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    location.href = 'login.html';
    return false;
  }

  const { data: p, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('auth_user_id', user.id)
    .single();

  if (error || p?.role !== 'admin') {
    location.href = 'login.html';
    return false;
  }

  return true;
}

async function load() {
  if (!(await guard())) return;

  const { data: requests, error } = await supabase
    .from('public_booking_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    document.querySelector('#bookings').innerHTML =
      `<tr><td colspan="6">Error: ${esc(error.message)}</td></tr>`;
    return;
  }

  const rows = requests || [];

  document.querySelector('#stats').innerHTML = `
    <div class="stat">
      New
      <b>${rows.filter(x => x.status === 'NEW').length}</b>
    </div>

    <div class="stat">
      Reviewing
      <b>${rows.filter(x => x.status === 'REVIEWING').length}</b>
    </div>

    <div class="stat">
      Approved
      <b>${rows.filter(x => x.status === 'APPROVED').length}</b>
    </div>

    <div class="stat">
      Completed
      <b>${rows.filter(x => x.status === 'CONVERTED').length}</b>
    </div>
  `;

  document.querySelector('#bookings').innerHTML = rows.length
    ? rows.map(b => `
      <tr>
        <td>${esc(b.request_number)}</td>
        <td>${esc(b.customer_name)}<br>${esc(b.phone)}</td>
        <td>${esc(b.service_name)}</td>
        <td>${esc(b.preferred_date || '')}</td>
        <td>
          <span class="tag">${esc(b.status)}</span>
        </td>
        <td>
          <button class="btn" onclick="alert('Technician assignment will be added next.')">
            Assign
          </button>
        </td>
      </tr>
    `).join('')
    : `<tr><td colspan="6">No bookings found.</td></tr>`;

  document.querySelector('#technicians').innerHTML =
    `<p>Technician management will be added next.</p>`;
}

document.querySelector('#refresh').onclick = load;

document.querySelector('#logout').onclick = async () => {
  await supabase.auth.signOut();
  location.href = 'login.html';
};

load();
