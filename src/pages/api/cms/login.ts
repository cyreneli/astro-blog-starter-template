import type { APIRoute } from 'astro';
import { CMS_COOKIE, createSession, json, verifyPassword, type CmsBindings } from '../../../lib/cms';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
	const env = locals.runtime.env as CmsBindings;
	const body = await request.json().catch(() => ({})) as { password?: string };
	if (!await verifyPassword(body.password ?? '', env)) return json({ error: '密码错误或 CMS 密钥尚未配置' }, 401);
	const token = await createSession(env);
	return new Response(JSON.stringify({ ok: true }), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'set-cookie': `${CMS_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=43200${import.meta.env.PROD ? '; Secure' : ''}`,
			'cache-control': 'no-store',
		},
	});
};
