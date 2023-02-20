declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof typeof entryMap> =
		(typeof entryMap)[C][keyof (typeof entryMap)[C]] & Render;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	type BaseCollectionConfig<S extends BaseSchema> = {
		schema?: S;
		slug?: (entry: {
			id: CollectionEntry<keyof typeof entryMap>['id'];
			defaultSlug: string;
			collection: string;
			body: string;
			data: import('astro/zod').infer<S>;
		}) => string | Promise<string>;
	};
	export function defineCollection<S extends BaseSchema>(
		input: BaseCollectionConfig<S>
	): BaseCollectionConfig<S>;

	type EntryMapKeys = keyof typeof entryMap;
	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidEntrySlug<C extends EntryMapKeys> = AllValuesOf<(typeof entryMap)[C]>['slug'];

	export function getEntryBySlug<
		C extends keyof typeof entryMap,
		E extends ValidEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getCollection<C extends keyof typeof entryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof typeof entryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	type InferEntrySchema<C extends keyof typeof entryMap> = import('astro/zod').infer<
		Required<ContentConfig['collections'][C]>['schema']
	>;

	type Render = {
		render(): Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	};

	const entryMap: {
		"docs": {
"about/brand.mdx": {
  id: "about/brand.mdx",
  slug: "about/brand",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"about/license.mdx": {
  id: "about/license.mdx",
  slug: "about/license",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"about/overview.mdx": {
  id: "about/overview.mdx",
  slug: "about/overview",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"about/team.mdx": {
  id: "about/team.mdx",
  slug: "about/team",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"about/translations.mdx": {
  id: "about/translations.mdx",
  slug: "about/translations",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/accordion.mdx": {
  id: "components/accordion.mdx",
  slug: "components/accordion",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/alerts.mdx": {
  id: "components/alerts.mdx",
  slug: "components/alerts",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/badge.mdx": {
  id: "components/badge.mdx",
  slug: "components/badge",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/breadcrumb.mdx": {
  id: "components/breadcrumb.mdx",
  slug: "components/breadcrumb",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/button-group.mdx": {
  id: "components/button-group.mdx",
  slug: "components/button-group",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/buttons.mdx": {
  id: "components/buttons.mdx",
  slug: "components/buttons",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/card.mdx": {
  id: "components/card.mdx",
  slug: "components/card",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/carousel.mdx": {
  id: "components/carousel.mdx",
  slug: "components/carousel",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/close-button.mdx": {
  id: "components/close-button.mdx",
  slug: "components/close-button",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/collapse.mdx": {
  id: "components/collapse.mdx",
  slug: "components/collapse",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/dropdowns.mdx": {
  id: "components/dropdowns.mdx",
  slug: "components/dropdowns",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/list-group.mdx": {
  id: "components/list-group.mdx",
  slug: "components/list-group",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/modal.mdx": {
  id: "components/modal.mdx",
  slug: "components/modal",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/navbar.mdx": {
  id: "components/navbar.mdx",
  slug: "components/navbar",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/navs-tabs.mdx": {
  id: "components/navs-tabs.mdx",
  slug: "components/navs-tabs",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/offcanvas.mdx": {
  id: "components/offcanvas.mdx",
  slug: "components/offcanvas",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/pagination.mdx": {
  id: "components/pagination.mdx",
  slug: "components/pagination",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/placeholders.mdx": {
  id: "components/placeholders.mdx",
  slug: "components/placeholders",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/popovers.mdx": {
  id: "components/popovers.mdx",
  slug: "components/popovers",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/progress.mdx": {
  id: "components/progress.mdx",
  slug: "components/progress",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/scrollspy.mdx": {
  id: "components/scrollspy.mdx",
  slug: "components/scrollspy",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/spinners.mdx": {
  id: "components/spinners.mdx",
  slug: "components/spinners",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/toasts.mdx": {
  id: "components/toasts.mdx",
  slug: "components/toasts",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"components/tooltips.mdx": {
  id: "components/tooltips.mdx",
  slug: "components/tooltips",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"content/figures.mdx": {
  id: "content/figures.mdx",
  slug: "content/figures",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"content/images.mdx": {
  id: "content/images.mdx",
  slug: "content/images",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"content/reboot.mdx": {
  id: "content/reboot.mdx",
  slug: "content/reboot",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"content/tables.mdx": {
  id: "content/tables.mdx",
  slug: "content/tables",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"content/typography.mdx": {
  id: "content/typography.mdx",
  slug: "content/typography",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"customize/color-modes.mdx": {
  id: "customize/color-modes.mdx",
  slug: "customize/color-modes",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"customize/color.mdx": {
  id: "customize/color.mdx",
  slug: "customize/color",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"customize/components.mdx": {
  id: "customize/components.mdx",
  slug: "customize/components",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"customize/css-variables.mdx": {
  id: "customize/css-variables.mdx",
  slug: "customize/css-variables",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"customize/optimize.mdx": {
  id: "customize/optimize.mdx",
  slug: "customize/optimize",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"customize/options.mdx": {
  id: "customize/options.mdx",
  slug: "customize/options",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"customize/overview.mdx": {
  id: "customize/overview.mdx",
  slug: "customize/overview",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"customize/sass.mdx": {
  id: "customize/sass.mdx",
  slug: "customize/sass",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"extend/approach.mdx": {
  id: "extend/approach.mdx",
  slug: "extend/approach",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"extend/icons.mdx": {
  id: "extend/icons.mdx",
  slug: "extend/icons",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"forms/checks-radios.mdx": {
  id: "forms/checks-radios.mdx",
  slug: "forms/checks-radios",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"forms/floating-labels.mdx": {
  id: "forms/floating-labels.mdx",
  slug: "forms/floating-labels",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"forms/form-control.mdx": {
  id: "forms/form-control.mdx",
  slug: "forms/form-control",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"forms/input-group.mdx": {
  id: "forms/input-group.mdx",
  slug: "forms/input-group",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"forms/layout.mdx": {
  id: "forms/layout.mdx",
  slug: "forms/layout",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"forms/overview.mdx": {
  id: "forms/overview.mdx",
  slug: "forms/overview",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"forms/range.mdx": {
  id: "forms/range.mdx",
  slug: "forms/range",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"forms/select.mdx": {
  id: "forms/select.mdx",
  slug: "forms/select",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"forms/validation.mdx": {
  id: "forms/validation.mdx",
  slug: "forms/validation",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"getting-started/accessibility.mdx": {
  id: "getting-started/accessibility.mdx",
  slug: "getting-started/accessibility",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"getting-started/best-practices.mdx": {
  id: "getting-started/best-practices.mdx",
  slug: "getting-started/best-practices",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"getting-started/browsers-devices.mdx": {
  id: "getting-started/browsers-devices.mdx",
  slug: "getting-started/browsers-devices",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"getting-started/contents.mdx": {
  id: "getting-started/contents.mdx",
  slug: "getting-started/contents",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"getting-started/contribute.mdx": {
  id: "getting-started/contribute.mdx",
  slug: "getting-started/contribute",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"getting-started/download.mdx": {
  id: "getting-started/download.mdx",
  slug: "getting-started/download",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"getting-started/introduction.mdx": {
  id: "getting-started/introduction.mdx",
  slug: "getting-started/introduction",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"getting-started/javascript.mdx": {
  id: "getting-started/javascript.mdx",
  slug: "getting-started/javascript",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"getting-started/parcel.mdx": {
  id: "getting-started/parcel.mdx",
  slug: "getting-started/parcel",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"getting-started/rfs.mdx": {
  id: "getting-started/rfs.mdx",
  slug: "getting-started/rfs",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"getting-started/rtl.mdx": {
  id: "getting-started/rtl.mdx",
  slug: "getting-started/rtl",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"getting-started/vite.mdx": {
  id: "getting-started/vite.mdx",
  slug: "getting-started/vite",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"getting-started/webpack.mdx": {
  id: "getting-started/webpack.mdx",
  slug: "getting-started/webpack",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"helpers/clearfix.mdx": {
  id: "helpers/clearfix.mdx",
  slug: "helpers/clearfix",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"helpers/color-background.mdx": {
  id: "helpers/color-background.mdx",
  slug: "helpers/color-background",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"helpers/colored-links.mdx": {
  id: "helpers/colored-links.mdx",
  slug: "helpers/colored-links",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"helpers/focus-ring.mdx": {
  id: "helpers/focus-ring.mdx",
  slug: "helpers/focus-ring",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"helpers/icon-link.mdx": {
  id: "helpers/icon-link.mdx",
  slug: "helpers/icon-link",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"helpers/position.mdx": {
  id: "helpers/position.mdx",
  slug: "helpers/position",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"helpers/ratio.mdx": {
  id: "helpers/ratio.mdx",
  slug: "helpers/ratio",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"helpers/stacks.mdx": {
  id: "helpers/stacks.mdx",
  slug: "helpers/stacks",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"helpers/stretched-link.mdx": {
  id: "helpers/stretched-link.mdx",
  slug: "helpers/stretched-link",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"helpers/text-truncation.mdx": {
  id: "helpers/text-truncation.mdx",
  slug: "helpers/text-truncation",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"helpers/vertical-rule.mdx": {
  id: "helpers/vertical-rule.mdx",
  slug: "helpers/vertical-rule",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"helpers/visually-hidden.mdx": {
  id: "helpers/visually-hidden.mdx",
  slug: "helpers/visually-hidden",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"layout/breakpoints.mdx": {
  id: "layout/breakpoints.mdx",
  slug: "layout/breakpoints",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"layout/columns.mdx": {
  id: "layout/columns.mdx",
  slug: "layout/columns",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"layout/containers.mdx": {
  id: "layout/containers.mdx",
  slug: "layout/containers",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"layout/css-grid.mdx": {
  id: "layout/css-grid.mdx",
  slug: "layout/css-grid",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"layout/grid.mdx": {
  id: "layout/grid.mdx",
  slug: "layout/grid",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"layout/gutters.mdx": {
  id: "layout/gutters.mdx",
  slug: "layout/gutters",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"layout/utilities.mdx": {
  id: "layout/utilities.mdx",
  slug: "layout/utilities",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"layout/z-index.mdx": {
  id: "layout/z-index.mdx",
  slug: "layout/z-index",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"migration.mdx": {
  id: "migration.mdx",
  slug: "migration",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"utilities/api.mdx": {
  id: "utilities/api.mdx",
  slug: "utilities/api",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"utilities/background.mdx": {
  id: "utilities/background.mdx",
  slug: "utilities/background",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"utilities/borders.mdx": {
  id: "utilities/borders.mdx",
  slug: "utilities/borders",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"utilities/colors.mdx": {
  id: "utilities/colors.mdx",
  slug: "utilities/colors",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"utilities/display.mdx": {
  id: "utilities/display.mdx",
  slug: "utilities/display",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"utilities/flex.mdx": {
  id: "utilities/flex.mdx",
  slug: "utilities/flex",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"utilities/float.mdx": {
  id: "utilities/float.mdx",
  slug: "utilities/float",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"utilities/interactions.mdx": {
  id: "utilities/interactions.mdx",
  slug: "utilities/interactions",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"utilities/link.mdx": {
  id: "utilities/link.mdx",
  slug: "utilities/link",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"utilities/object-fit.mdx": {
  id: "utilities/object-fit.mdx",
  slug: "utilities/object-fit",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"utilities/opacity.mdx": {
  id: "utilities/opacity.mdx",
  slug: "utilities/opacity",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"utilities/overflow.mdx": {
  id: "utilities/overflow.mdx",
  slug: "utilities/overflow",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"utilities/position.mdx": {
  id: "utilities/position.mdx",
  slug: "utilities/position",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"utilities/shadows.mdx": {
  id: "utilities/shadows.mdx",
  slug: "utilities/shadows",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"utilities/sizing.mdx": {
  id: "utilities/sizing.mdx",
  slug: "utilities/sizing",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"utilities/spacing.mdx": {
  id: "utilities/spacing.mdx",
  slug: "utilities/spacing",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"utilities/text.mdx": {
  id: "utilities/text.mdx",
  slug: "utilities/text",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"utilities/vertical-align.mdx": {
  id: "utilities/vertical-align.mdx",
  slug: "utilities/vertical-align",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"utilities/visibility.mdx": {
  id: "utilities/visibility.mdx",
  slug: "utilities/visibility",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"utilities/z-index.mdx": {
  id: "utilities/z-index.mdx",
  slug: "utilities/z-index",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
},

	};

	type ContentConfig = typeof import("../src/content/config");
}
