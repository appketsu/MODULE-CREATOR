import {tags as t} from '@lezer/highlight';
import createTheme from './createTheme';

// Author: Zeno Rocha
export const dracula = createTheme({
	variant: 'dark',
	settings: {
		background: '#212221',
		foreground: '#E6E6E6',
		caret: '#fff',
		selection: '#727377',
		gutterBackground: '#212221',
		gutterForeground: '#E6E6E6',
		lineHighlight: 'transparent',
    },
	styles: [
        { tag: [t.comment, t.quote], color: '#A7A6A6' },
        { tag: [t.keyword], color: '#FF7AB2', fontWeight: 'bold' },
        { tag: [t.string, t.meta], color: '#FF8170' },
        { tag: [t.typeName], color: '#DABAFF' },
        { tag: [t.definition(t.variableName)], color: '#6BDFFF', fontWeight: '600' },
        { tag: [t.name], color: '#6BAA9F' },
        { tag: [t.variableName], color: '#ACF2E4', },
        { tag: [t.regexp, t.link], color: '#FF8170' },
	],
});

export const draculaMarkdown = createTheme({
	variant: 'dark',
	settings: {
		background: '#212221',
		foreground: '#E6E6E6',
		caret: '#fff',
		selection: '#727377',
		gutterBackground: '#212221',
		gutterForeground: '#E6E6E6',
		lineHighlight: 'transparent'
    },
	styles: [
        { tag: [t.comment, t.quote], color: '#A7A6A6' },
        { tag: [t.keyword], color: '#FF7AB2', fontWeight: 'bold' },
        { tag: [t.string, t.meta], color: 'rgb(78, 128, 238)'},
        { tag: [t.typeName], color: '#DABAFF' },
        { tag: [t.definition(t.variableName)], color: '#6BDFFF', fontWeight: '600' },
        { tag: [t.name], color: '#6BAA9F' },
        { tag: [t.variableName], color: '#ACF2E4' },
        { tag: [t.regexp, t.link], color: 'rgb(78, 128, 238)' },
	],
});

