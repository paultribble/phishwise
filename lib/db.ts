import { sql } from "@vercel/postgres";

export async function ensureUser(googleSub: string) {
  await sql`
    insert into users (google_sub)
    values (${googleSub})
    on conflict (google_sub) do nothing
  `;
}

export async function getMembership(googleSub: string) {
  const { rows } = await sql`
    select sm.school_id, sm.role, s.name as school_name
    from school_memberships sm
    join schools s on s.id = sm.school_id
    where sm.google_sub = ${googleSub}
    limit 1
  `;
  return rows[0] ?? null;
}

export async function createSchool(googleSub: string, name: string) {
  const created = await sql`
    insert into schools (name, created_by_google_sub)
    values (${name}, ${googleSub})
    returning id
  `;
  const schoolId = created.rows[0].id as number;

  await sql`
    insert into school_memberships (google_sub, school_id, role)
    values (${googleSub}, ${schoolId}, 'MANAGER')
    on conflict (google_sub) do update
      set school_id = excluded.school_id,
          role = 'MANAGER'
  `;

  return schoolId;
}

export async function joinSchoolWithCode(googleSub: string, code: string) {
  const { rows } = await sql`
    select school_id, expires_at
    from invites
    where code = ${code}
    limit 1
  `;
  const invite = rows[0];
  if (!invite) return { ok: false as const, error: "Invalid code." };

  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return { ok: false as const, error: "This code expired." };
  }

  await sql`
    insert into school_memberships (google_sub, school_id, role)
    values (${googleSub}, ${invite.school_id}, 'USER')
    on conflict (google_sub) do update
      set school_id = excluded.school_id,
          role = 'USER'
  `;

  return { ok: true as const };
}

export async function joinSchoolWithToken(googleSub: string, token: string) {
  const { rows } = await sql`
    select school_id, expires_at
    from invites
    where token = ${token}
    limit 1
  `;
  const invite = rows[0];
  if (!invite) return { ok: false as const, error: "Invalid invite link." };

  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return { ok: false as const, error: "This invite link expired." };
  }

  await sql`
    insert into school_memberships (google_sub, school_id, role)
    values (${googleSub}, ${invite.school_id}, 'USER')
    on conflict (google_sub) do update
      set school_id = excluded.school_id,
          role = 'USER'
  `;

  return { ok: true as const };
}
