import type { Project } from '../data/projects';

export const CMS_DOCUMENT_ID = 'portfolio-projects';
export const CMS_COOKIE = 'cyrene_cms_session';

export type CmsBindings = Env;

export interface CmsDocument {
	projects: Project[];
	updatedAt: string | null;
	publishedAt: string | null;
}

export async function readProjects(env: CmsBindings, seed: Project[], mode: 'draft' | 'published'): Promise<CmsDocument> {
	try {
		const row = await env.CMS_DB.prepare(
			'SELECT draft_json, published_json, updated_at, published_at FROM cms_documents WHERE id = ?',
		).bind(CMS_DOCUMENT_ID).first<{ draft_json: string; published_json: string | null; updated_at: string; published_at: string | null }>();
		const raw = mode === 'draft' ? row?.draft_json : row?.published_json;
		return {
			projects: raw ? JSON.parse(raw) as Project[] : seed,
			updatedAt: row?.updated_at ?? null,
			publishedAt: row?.published_at ?? null,
		};
	} catch {
		return { projects: seed, updatedAt: null, publishedAt: null };
	}
}

export async function saveDraft(env: CmsBindings, seed: Project[], nextProjects: Project[]) {
	const now = new Date().toISOString();
	const draft = JSON.stringify(nextProjects);
	const published = JSON.stringify(seed);
	await env.CMS_DB.prepare('INSERT INTO cms_documents (id, draft_json, published_json, updated_at, published_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET draft_json = excluded.draft_json, updated_at = excluded.updated_at')
		.bind(CMS_DOCUMENT_ID, draft, published, now, now).run();
	return now;
}

export async function publishDraft(env: CmsBindings, seed: Project[]) {
	const now = new Date().toISOString();
	const serialized = JSON.stringify(seed);
	await env.CMS_DB.prepare('INSERT INTO cms_documents (id, draft_json, published_json, updated_at, published_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET published_json = draft_json, published_at = excluded.published_at')
		.bind(CMS_DOCUMENT_ID, serialized, serialized, now, now).run();
	return now;
}

const encoder = new TextEncoder();

function encodeBase64Url(value: Uint8Array | string) {
	const bytes = typeof value === 'string' ? encoder.encode(value) : value;
	let binary = '';
	bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sign(value: string, secret: string) {
	const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
	return encodeBase64Url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))));
}

export async function createSession(env: CmsBindings) {
	if (!env.CMS_SESSION_SECRET) throw new Error('CMS_SESSION_SECRET is not configured');
	const payload = `${Date.now() + 1000 * 60 * 60 * 12}`;
	return `${payload}.${await sign(payload, env.CMS_SESSION_SECRET)}`;
}

export async function isAuthenticated(request: Request, env: CmsBindings) {
	if (!env.CMS_SESSION_SECRET) return false;
	const cookie = request.headers.get('cookie') ?? '';
	const token = cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${CMS_COOKIE}=`))?.slice(CMS_COOKIE.length + 1);
	if (!token) return false;
	const [expires, signature] = token.split('.');
	if (!expires || !signature || Number(expires) < Date.now()) return false;
	return signature === await sign(expires, env.CMS_SESSION_SECRET);
}

export async function verifyPassword(password: string, env: CmsBindings) {
	if (!env.CMS_PASSWORD) return false;
	const [actual, expected] = await Promise.all([
		crypto.subtle.digest('SHA-256', encoder.encode(password)),
		crypto.subtle.digest('SHA-256', encoder.encode(env.CMS_PASSWORD)),
	]);
	const left = new Uint8Array(actual);
	const right = new Uint8Array(expected);
	let difference = left.length ^ right.length;
	for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ (right[index] ?? 0);
	return difference === 0;
}

export function json(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
	});
}
