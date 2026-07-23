// @ts-nocheck Cloudflare Worker ambient element types conflict with browser DOM types in standalone client modules.
type PickerField = {
	root: HTMLElement;
	select: HTMLSelectElement;
	button: HTMLButtonElement;
	preview: HTMLElement;
	multiple: boolean;
	imagesOnly: boolean;
};

let assetPathsPromise: Promise<string[]> | undefined;

const isVideo = (path: string) => /\.(mp4|webm|mov)$/i.test(path);
const folderName = (path: string) => path.split('/')[2] || '其他';

async function getAssetPaths() {
	assetPathsPromise ??= fetch('/api/cms/assets').then(async (response) => {
		if (!response.ok) throw new Error('无法读取素材库');
		return (await response.json()).assets as string[];
	});
	return assetPathsPromise;
}

function createMedia(path: string, compact = false) {
	const media = document.createElement(isVideo(path) ? 'video' : 'img');
	media.src = path;
	media.className = compact ? 'cms-asset-thumb compact' : 'cms-asset-thumb';
	if (media instanceof HTMLImageElement) {
		media.alt = '';
		media.loading = 'lazy';
	} else {
		media.muted = true;
		media.preload = 'metadata';
	}
	return media;
}

function renderFieldPreview(field: PickerField) {
	const selected = Array.from(field.select.selectedOptions).map((option) => option.value).filter(Boolean);
	field.preview.replaceChildren();
	if (!selected.length) {
		const empty = document.createElement('span');
		empty.className = 'cms-asset-empty';
		empty.textContent = '尚未选择素材';
		field.preview.append(empty);
		return;
	}
	selected.forEach((path) => {
		const item = document.createElement('div');
		item.className = 'cms-asset-selected-item';
		item.append(createMedia(path, true));
		const label = document.createElement('span');
		label.textContent = path.split('/').pop() || path;
		label.title = path;
		item.append(label);
		field.preview.append(item);
	});
}

function syncSelect(field: PickerField, paths: string[]) {
	paths.forEach((path) => {
		if (!Array.from(field.select.options).some((option) => option.value === path)) field.select.add(new Option(path, path));
	});
}

async function openPicker(field: PickerField) {
	const paths = (await getAssetPaths()).filter((path) => !field.imagesOnly || !isVideo(path));
	syncSelect(field, paths);
	const initial = new Set(Array.from(field.select.selectedOptions).map((option) => option.value).filter(Boolean));
	const pending = new Set(initial);
	const dialog = document.createElement('dialog');
	dialog.className = 'cms-asset-dialog';

	const header = document.createElement('header');
	const heading = document.createElement('div');
	heading.innerHTML = `<p>PROJECT ASSETS</p><h2>${field.multiple ? '选择轮播素材' : '选择项目封面'}</h2>`;
	const close = document.createElement('button');
	close.type = 'button'; close.className = 'cms-asset-close'; close.textContent = '×'; close.setAttribute('aria-label', '关闭素材库');
	header.append(heading, close);

	const filters = document.createElement('div');
	filters.className = 'cms-asset-filters';
	const search = document.createElement('input');
	search.type = 'search'; search.placeholder = '搜索文件名…';
	const folder = document.createElement('select');
	folder.append(new Option('全部文件夹', ''));
	[...new Set(paths.map(folderName))].sort().forEach((name) => folder.add(new Option(name, name)));
	filters.append(search, folder);

	const grid = document.createElement('div');
	grid.className = 'cms-asset-grid';
	const count = document.createElement('span');
	count.className = 'cms-asset-count';

	const renderGrid = () => {
		const query = search.value.trim().toLowerCase();
		const visible = paths.filter((path) => (!folder.value || folderName(path) === folder.value) && (!query || path.toLowerCase().includes(query)));
		grid.replaceChildren();
		visible.forEach((path) => {
			const card = document.createElement('button');
			card.type = 'button'; card.className = 'cms-asset-card'; card.classList.toggle('selected', pending.has(path));
			card.append(createMedia(path));
			const name = document.createElement('span'); name.textContent = path.split('/').pop() || path; name.title = path; card.append(name);
			if (isVideo(path)) { const badge = document.createElement('b'); badge.textContent = 'VIDEO'; card.append(badge); }
			card.addEventListener('click', () => {
				if (field.multiple) pending.has(path) ? pending.delete(path) : pending.add(path);
				else { pending.clear(); pending.add(path); }
				renderGrid();
			});
			grid.append(card);
		});
		count.textContent = `显示 ${visible.length} 项 · 已选 ${pending.size} 项`;
	};

	const footer = document.createElement('footer');
	const clear = document.createElement('button'); clear.type = 'button'; clear.textContent = '清除选择';
	const cancel = document.createElement('button'); cancel.type = 'button'; cancel.textContent = '取消';
	const confirm = document.createElement('button'); confirm.type = 'button'; confirm.className = 'primary'; confirm.textContent = '确认选择';
	footer.append(count, clear, cancel, confirm);
	dialog.append(header, filters, grid, footer);
	document.body.append(dialog);
	const dismiss = () => { dialog.close(); dialog.remove(); };
	close.addEventListener('click', dismiss); cancel.addEventListener('click', dismiss);
	clear.addEventListener('click', () => { pending.clear(); renderGrid(); });
	confirm.addEventListener('click', () => {
		Array.from(field.select.options).forEach((option) => { option.selected = pending.has(option.value); });
		field.select.dispatchEvent(new Event('change', { bubbles: true }));
		renderFieldPreview(field);
		dismiss();
	});
	search.addEventListener('input', renderGrid); folder.addEventListener('change', renderGrid);
	renderGrid(); dialog.showModal(); search.focus();
}

export async function initCmsAssetPickers() {
	const paths = await getAssetPaths();
	document.querySelectorAll<HTMLElement>('[data-asset-field]').forEach((root) => {
		if (root.dataset.assetReady) return;
		const select = root.querySelector<HTMLSelectElement>('select')!;
		const button = root.querySelector<HTMLButtonElement>('[data-asset-open]')!;
		const preview = root.querySelector<HTMLElement>('[data-asset-preview]')!;
		const field = { root, select, button, preview, multiple: select.multiple, imagesOnly: root.dataset.assetKind === 'image' };
		syncSelect(field, field.imagesOnly ? paths.filter((path) => !isVideo(path)) : paths);
		renderFieldPreview(field);
		button.addEventListener('click', () => void openPicker(field));
		select.addEventListener('change', () => renderFieldPreview(field));
		root.dataset.assetReady = 'true';
	});
}
