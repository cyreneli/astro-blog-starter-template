import type { APIRoute } from 'astro';
import { projects as seedProjects, type Project } from '../../../data/projects';
import { isAuthenticated, json, publishDraft, readProjects, saveDraft, type CmsBindings } from '../../../lib/cms';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals, url }) => {
	const env = locals.runtime.env as CmsBindings;
	const wantsDraft = url.searchParams.get('mode') === 'draft';
	if (wantsDraft && !await isAuthenticated(request, env)) return json({ error: '未登录' }, 401);
	return json(await readProjects(env, seedProjects, wantsDraft ? 'draft' : 'published'));
};

export const PUT: APIRoute = async ({ request, locals }) => {
	const env = locals.runtime.env as CmsBindings;
	if (!await isAuthenticated(request, env)) return json({ error: '未登录' }, 401);
	const body = await request.json().catch(() => null) as { projects?: Project[] } | null;
	if (!body || !Array.isArray(body.projects)) return json({ error: '项目数据格式错误' }, 400);
	const updatedAt = await saveDraft(env, seedProjects, body.projects);
	return json({ ok: true, updatedAt });
};

export const POST: APIRoute = async ({ request, locals }) => {
	const env = locals.runtime.env as CmsBindings;
	if (!await isAuthenticated(request, env)) return json({ error: '未登录' }, 401);
	const publishedAt = await publishDraft(env, seedProjects);
	return json({ ok: true, publishedAt });
};
