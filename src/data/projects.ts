export type Project = {
	slug: string;
	service: string;
	index: string;
	title: string;
	subtitle: string;
	summary: string;
	school: string;
	major: string;
	term: string;
	images?: string[];
	intro: string;
	challenge: string;
	approach: string[];
	result: string;
	color: 'coral' | 'blue' | 'yellow';
};

export const projects: Project[] = [
	{
		slug: 'designing-a-portfolio-story',
		service: '作品集辅导',
		index: '01',
		title: 'Entecavir Odyssey',
		subtitle: 'VR Project',
		summary: '一款以恩替卡韦作用机制为核心的 VR 解谜游戏，用沉浸式互动帮助用户理解乙肝治疗过程。',
		school: '伦敦艺术大学 · 爱丁堡大学 · 拉夫堡大学 · 诺丁汉大学',
		major: '交互设计',
		term: '27FALL',
		images: [
			'/projects/entecavir/01.png',
			'/projects/entecavir/02.png',
			'/projects/entecavir/03.png',
			'/projects/entecavir/04.png',
			'/projects/entecavir/05.png',
		],
		intro: `This project is dedicated to providing an interactive and educational experience for hepatitis B patients and users through virtual reality (VR) technology. The core of the project is a VR-based puzzle game that allows users to gain a deeper understanding of the working principles of Entecavir through the interactive way of the virtual world. In the game, users will gradually reveal how drugs affect the human body by piecing together puzzles of drug action mechanisms, helping patients and the public better understand the treatment process of hepatitis B and enhance their understanding of the disease and treatment.

本项目致力于通过虚拟现实（VR）技术，为乙型肝炎患者及公众用户提供一种兼具互动性与教育意义的体验。项目的核心是一款基于 VR 的解谜游戏，用户将在沉浸式的虚拟环境中，以互动探索的方式深入了解恩替卡韦（Entecavir）的作用机制。

在游戏过程中，用户需要通过拼接展示药物作用机制的谜题，逐步揭示恩替卡韦在人体内发挥作用的过程，从而直观地理解药物如何抑制乙肝病毒复制。通过这种寓教于乐的交互体验，项目旨在帮助乙肝患者及公众更好地理解乙肝的治疗过程，提升其对疾病及治疗方案的认知。`,
		challenge: '已有作品跨度很大，却缺少能让招生官快速理解其个人方法与兴趣的主线。',
		approach: ['筛选出三组最能代表个人视角的项目', '以“日常观察”重组项目顺序与章节', '逐页优化文案、图像节奏与信息层级'],
		result: '该项目获得伦敦艺术大学、爱丁堡大学、拉夫堡大学、诺丁汉大学的交互 Offer。项目属于跨专业设计，交融了医学背景以及交互 VR 技术。',
		color: 'coral',
	},
	{
		slug: 'editorial-system-for-architecture',
		service: '排版辅导',
		index: '02',
		title: '为复杂信息，找到阅读节奏',
		subtitle: '建筑作品集 / 编辑设计与排版',
		summary: '从内容结构到最终 PDF 输出，为建筑申请作品集建立一套克制而灵活的版式系统。',
		school: '代尔夫特理工大学',
		major: 'Architecture',
		term: '27FALL',
		intro: '从内容结构到最终 PDF 输出，为建筑申请作品集建立一套克制而灵活的版式系统。',
		challenge: '图纸、模型照片与研究文本密度极高，页面阅读重点不够明确。',
		approach: ['建立可扩展的 12 栏网格', '定义图纸、标题与注释的三层阅读关系', '通过留白与跨页节奏突出核心项目'],
		result: '信息密度不减，阅读路径却更清楚。整本作品集在电脑与打印状态下都保持一致。',
		color: 'blue',
	},
	{
		slug: 'interactive-archive-prototype',
		service: '交互技术制作',
		index: '03',
		title: '让研究资料，成为可探索的体验',
		subtitle: '交互原型 / 创意编码协作',
		summary: '将关于城市声音的长期研究，转译为一个可在展览现场体验的网页交互原型。',
		school: '皇家艺术学院',
		major: 'Information Experience Design',
		term: '27FALL',
		intro: '将关于城市声音的长期研究，转译为一个可在展览现场体验的网页交互原型。',
		challenge: '素材包含大量音频、地图与访谈记录，需要一种直观但不简化研究深度的呈现方式。',
		approach: ['共同定义用户探索的交互路径', '制作可点击的声音地图原型', '梳理展览演示所需的技术流程'],
		result: '研究不再只是静态文本，而成为观众可以自行进入、停留与发现的数字现场。',
		color: 'yellow',
	},
];
