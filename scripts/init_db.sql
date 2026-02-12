-- scripts/init_db.sql

create table if not exists users (
  id bigserial primary key,
  google_sub text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists schools (
  id bigserial primary key,
  name text not null,
  created_by_google_sub text not null,
  created_at timestamptz not null default now()
);

-- A user can belong to at most one school at a time
create table if not exists school_memberships (
  id bigserial primary key,
  google_sub text unique not null,
  school_id bigint not null references schools(id) on delete cascade,
  role text not null check (role in ('USER','MANAGER')),
  joined_at timestamptz not null default now()
);

-- Join codes (short code) + invite links (token)
create table if not exists invites (
  id bigserial primary key,
  school_id bigint not null references schools(id) on delete cascade,
  code text unique,
  token text unique,
  created_by_google_sub text not null,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
