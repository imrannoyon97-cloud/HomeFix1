-- HOMEFIX.LIVE - SUPABASE DATABASE
create extension if not exists pgcrypto;

create table if not exists profiles(
 id uuid primary key default gen_random_uuid(), auth_user_id uuid unique not null,
 full_name text not null, phone text, email text,
 role text not null check(role in('admin','technician','customer')),
 avatar_url text, active boolean default true, created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists customers(
 id uuid primary key default gen_random_uuid(), profile_id uuid references profiles(id) on delete cascade,
 customer_code text unique not null, name text not null, phone text not null, email text,
 address text, area text, city text, postal_code text, alternate_phone text, notes text,
 created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists technicians(
 id uuid primary key default gen_random_uuid(), profile_id uuid references profiles(id) on delete cascade,
 technician_code text unique not null, name text not null, phone text not null, email text,
 specialization text, experience text, service_area text, joining_date date,
 status text default 'active' check(status in('active','inactive','busy')),
 created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists services(
 id uuid primary key default gen_random_uuid(), service_code text unique not null, name text not null,
 category text, description text, base_price numeric(12,2) default 0, unit text default 'service',
 active boolean default true, created_at timestamptz default now()
);
create table if not exists bookings(
 id uuid primary key default gen_random_uuid(), booking_number text unique not null,
 customer_id uuid references customers(id), service_date date, preferred_time text, address text,
 problem_description text, status text default 'NEW' check(status in('NEW','CONFIRMED','ASSIGNED','ACCEPTED','ON_THE_WAY','WORKING','WAITING_FOR_PARTS','COMPLETED','CANCELLED')),
 priority text default 'normal', subtotal numeric(12,2) default 0, discount numeric(12,2) default 0,
 tax numeric(12,2) default 0, total numeric(12,2) default 0, paid_amount numeric(12,2) default 0,
 due_amount numeric(12,2) default 0, payment_status text default 'UNPAID', created_by uuid references profiles(id),
 created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists booking_items(
 id uuid primary key default gen_random_uuid(), booking_id uuid references bookings(id) on delete cascade,
 service_id uuid references services(id), description text, quantity numeric(12,2) default 1,
 unit_price numeric(12,2) default 0, discount numeric(12,2) default 0, total numeric(12,2) default 0
);
create table if not exists technician_assignments(
 id uuid primary key default gen_random_uuid(), booking_id uuid references bookings(id) on delete cascade,
 technician_id uuid references technicians(id), assigned_by uuid references profiles(id),
 assigned_at timestamptz default now(), accepted_at timestamptz, completed_at timestamptz,
 status text default 'ASSIGNED', notes text
);
create table if not exists job_updates(
 id uuid primary key default gen_random_uuid(), booking_id uuid references bookings(id) on delete cascade,
 technician_id uuid references technicians(id), status text, note text, latitude numeric, longitude numeric,
 created_at timestamptz default now()
);
create table if not exists materials(
 id uuid primary key default gen_random_uuid(), material_code text unique not null, name text not null,
 category text, unit text, purchase_price numeric(12,2) default 0, selling_price numeric(12,2) default 0,
 stock_quantity numeric(12,2) default 0, minimum_stock numeric(12,2) default 0, active boolean default true,
 created_at timestamptz default now()
);
create table if not exists booking_materials(
 id uuid primary key default gen_random_uuid(), booking_id uuid references bookings(id) on delete cascade,
 material_id uuid references materials(id), technician_id uuid references technicians(id),
 quantity numeric(12,2) default 1, unit_price numeric(12,2) default 0, total numeric(12,2) default 0,
 notes text, created_at timestamptz default now()
);
create table if not exists invoices(
 id uuid primary key default gen_random_uuid(), invoice_number text unique not null, booking_id uuid unique references bookings(id),
 customer_id uuid references customers(id), technician_id uuid references technicians(id), invoice_date date default current_date,
 subtotal numeric(12,2) default 0, material_total numeric(12,2) default 0, labour_total numeric(12,2) default 0,
 discount numeric(12,2) default 0, tax numeric(12,2) default 0, grand_total numeric(12,2) default 0,
 paid_amount numeric(12,2) default 0, due_amount numeric(12,2) default 0, payment_status text default 'UNPAID',
 pdf_url text, created_at timestamptz default now()
);
create table if not exists invoice_items(
 id uuid primary key default gen_random_uuid(), invoice_id uuid references invoices(id) on delete cascade,
 item_type text check(item_type in('SERVICE','MATERIAL','LABOUR','OTHER')), description text,
 quantity numeric(12,2) default 1, unit_price numeric(12,2) default 0, discount numeric(12,2) default 0, total numeric(12,2) default 0
);
create table if not exists payments(
 id uuid primary key default gen_random_uuid(), booking_id uuid references bookings(id), invoice_id uuid references invoices(id),
 customer_id uuid references customers(id), amount numeric(12,2) not null,
 payment_method text check(payment_method in('CASH','BKASH','NAGAD','BANK','CARD','OTHER')),
 transaction_id text, payment_date timestamptz default now(), received_by uuid references profiles(id), notes text
);
create table if not exists notifications(
 id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade,
 title text not null, message text not null, type text, booking_id uuid references bookings(id),
 is_read boolean default false, created_at timestamptz default now()
);
create table if not exists attachments(
 id uuid primary key default gen_random_uuid(), booking_id uuid references bookings(id) on delete cascade,
 uploaded_by uuid references profiles(id), file_name text, file_type text, file_url text, created_at timestamptz default now()
);
create table if not exists audit_logs(
 id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id), action text,
 table_name text, record_id uuid, old_data jsonb, new_data jsonb, created_at timestamptz default now()
);
create table if not exists settings(
 id uuid primary key default gen_random_uuid(), company_name text default 'HOMEFIX', phone text, email text,
 address text, logo_url text, invoice_prefix text default 'INV', currency text default 'BDT',
 tax_rate numeric(5,2) default 0, invoice_footer text
);

-- Public booking staging table
create table if not exists public_booking_requests(
 id uuid primary key default gen_random_uuid(), booking_number text unique not null,
 customer_name text not null, customer_phone text not null, service_name text not null,
 service_date date, problem_description text, address text, created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_bookings_customer on bookings(customer_id);
create index if not exists idx_bookings_status on bookings(status);
create index if not exists idx_assignments_technician on technician_assignments(technician_id);
create index if not exists idx_assignments_booking on technician_assignments(booking_id);
create index if not exists idx_payments_booking on payments(booking_id);

-- IMPORTANT:
-- Enable RLS and add production policies before going live.
-- Never put a Supabase service-role/secret key in frontend code.
alter table profiles enable row level security;
alter table customers enable row level security;
alter table technicians enable row level security;
alter table bookings enable row level security;
alter table booking_items enable row level security;
alter table technician_assignments enable row level security;
alter table job_updates enable row level security;
alter table invoices enable row level security;
alter table invoice_items enable row level security;
alter table payments enable row level security;
alter table notifications enable row level security;
alter table attachments enable row level security;
alter table audit_logs enable row level security;
