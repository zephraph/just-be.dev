import { error } from '@sveltejs/kit';
import { marked } from 'marked';

type MarkedExtension = Parameters<typeof marked['use']>['0'];
type ExtensionDef = NonNullable<MarkedExtension['extensions']>[number];
type Token = marked.Token | WikiLinkToken | WikiMediaLinkToken;

// extension/token names
const WikiLink = 'wiki-link';
const WikiMediaLink = 'wiki-media-link';

interface WikiLinkToken {
	type: typeof WikiLink;
	raw: string;
	rawLink: string;
	link: string;
	alias?: string;
}

const WikiLinkExtension: ExtensionDef = {
	name: WikiLink,
	level: 'inline',
	start(src) {
		return src.indexOf('[[');
	},
	tokenizer(src) {
		const rule = /^(\[\[([^\]|]+)\|?(.*)?\]\])/;
		const match = rule.exec(src);
		if (match) {
			return {
				type: WikiLink,
				raw: match[0],
				rawLink: match[1],
				link: '', // Will be replaced later
				alias: match[2]
			} satisfies WikiLinkToken;
		}
	},
	renderer(token) {
		const { link, alias } = token;
		return `<a href="${link}">${alias || link}</a>`;
	}
};

interface WikiMediaLinkToken {
	type: typeof WikiMediaLink;
	fileType: string;
	raw: string;
	rawLink: string;
	link: string;
	width?: number;
	height?: number;
}

const WikiMediaLinkExtension: ExtensionDef = {
	name: WikiMediaLink,
	level: 'inline',
	start(src) {
		return src.indexOf('![[');
	},
	tokenizer(src) {
		const rule = /^(\!\[\[(.*\.([\w]+))\|?(\d+)?x?(\d+)?\]\])/;
		const match = rule.exec(src);
		if (match) {
			return {
				type: WikiMediaLink,
				raw: match[1],
				rawLink: match[2],
				link: '', // Will be replaced later
				fileType: match[3],
				width: match[4] ? parseInt(match[4]) : undefined,
				height: match[5] ? parseInt(match[5]) : undefined
			} satisfies WikiMediaLinkToken;
		}
	},
	renderer(token) {
		const { link, fileType, width, height, rawLink } = token;
		const name = rawLink.replace(`.${fileType}`, '');
		switch (fileType) {
			case 'pdf':
				return `<a href="${link}">${name}</a>`;
			default:
				return `<img src="${link}" alt="${name}" width="${width}" height="${height}" />`;
		}
	}
};

const extensions = (platform: App.Platform): marked.MarkedExtension => ({
	async: true,
	extensions: [WikiLinkExtension, WikiMediaLinkExtension],
	async walkTokens(token: Token) {
		if (token.type === WikiLink || token.type === WikiMediaLink) {
			token.link = (await platform.env.KV_URLs.get(token.rawLink)) || token.rawLink;
		}
	}
});

export const renderMarkdown = (platform: App.Platform, content: string) => {
	marked.use(extensions(platform));
	return marked(content, { async: true });
};

// == Markdown verification ==

const walkTokens = async (tokens: Token[], fn: (token: Token) => Promise<void>) => {
	for (const token of tokens) {
		if ('tokens' in token && Array.isArray(token.tokens)) {
			await walkTokens(token.tokens, fn);
		}
		await fn(token);
	}
};

export const verifyMarkdown = (platform: App.Platform, content: string): Promise<void> => {
	marked.use(extensions(platform));
	const tokens = marked.lexer(content);
	return walkTokens(tokens, verifyLinks(platform));
};

const verifyLinks = (platform: App.Platform) => async (token: Token) => {
	const isLink = token.type === WikiLink;
	const isAttachment = token.type === WikiMediaLink;
	if (isLink || isAttachment) {
		const kvLink = await platform.env.KV_URLs.get(token.rawLink);
		if (!kvLink) {
			throw error(400, `Link not found: ${token.rawLink}`);
		}
	}
};
