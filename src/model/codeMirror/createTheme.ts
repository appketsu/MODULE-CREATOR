import {EditorView} from '@codemirror/view';
import {Extension} from '@codemirror/state';
import {
	HighlightStyle,
	TagStyle,
	syntaxHighlighting,
} from '@codemirror/language';


interface Options {
	/**
	 * Theme variant. Determines which styles CodeMirror will apply by default.
	 */
	variant: Variant;

	/**
	 * Settings to customize the look of the editor, like background, gutter, selection and others.
	 */
	settings: Settings;

	/**
	 * Syntax highlighting styles.
	 */
	styles: TagStyle[];
}

type Variant = 'light' | 'dark';

interface Settings {
	/**
	 * Editor background.
	 */
	background: string;

	/**
	 * Default text color.
	 */
	foreground: string;

	/**
	 * Caret color.
	 */
	caret: string;

	/**
	 * Selection background.
	 */
	selection: string;

	/**
	 * Background of highlighted lines.
	 */
	lineHighlight: string;

	/**
	 * Gutter background.
	 */
	gutterBackground: string;

	/**
	 * Text color inside gutter.
	 */
	gutterForeground: string;
}

const createTheme = ({variant, settings, styles}: Options): Extension => {
	const theme = EditorView.theme(
		{
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'&': {
				backgroundColor: settings.background,
				color: settings.foreground,
			},
			'.cm-content': {
				caretColor: settings.caret,
			},
			'.cm-cursor, .cm-dropCursor': {
				borderLeftColor: settings.caret,
			},
			'&.cm-focused .cm-selectionBackgroundm .cm-selectionBackground, .cm-content ::selection':
				{
					backgroundColor: settings.selection,
				},
			'.cm-activeLine': {
				backgroundColor: settings.lineHighlight,
			},
			'.cm-gutters': {
				backgroundColor: settings.gutterBackground,
				color: settings.gutterForeground,
			},
			'.cm-activeLineGutter': {
				backgroundColor: settings.lineHighlight,
			},
            ".cm-tooltip-autocomplete" : {
                backgroundColor: "#262626",
                color : "#A7A6A6",
                "line-height": "1",
                "box-sizing" : " border-box",
                "border" : "1px solid rgba(255,255,255,.1)"

            },
            ".cm-completionMatchedText": {
                textDecoration: "none",
                color: "#FFFFFF",
              },
              '.cm-tooltip-autocomplete ul li[aria-selected]': {
                backgroundColor: "#3B3B3B",
              },
		},
		{
			dark: variant === 'dark',
		},
	);

	const highlightStyle = HighlightStyle.define(styles);
	const extension = [theme, syntaxHighlighting(highlightStyle)];

	return extension;
};

export default createTheme;