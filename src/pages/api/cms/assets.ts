import type { APIRoute } from 'astro';
import { projectAssets } from '../../../data/project-assets';
import { isAuthenticated, json, type CmsBindings } from '../../../lib/cms';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
	if (!await isAuthenticated(request, locals.runtime.env as CmsBindings)) return json({ error: '未登录' }, 401);
	return json({ assets: projectAssets });
};
