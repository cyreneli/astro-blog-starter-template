import type { APIRoute } from 'astro';
import { CMS_COOKIE } from '../../../lib/cms';

export const prerender = false;

export const POST: APIRoute = async () => new Response(null, {
	status: 204,
	headers: { 'set-cookie': `${CMS_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0` },
});
