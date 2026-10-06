/**
 * The Shopify storefront as capture and Lighthouse see it: past the password page, on the demo's
 * preview theme, with Shopify's preview bar out of frame (video guideline §4 "Clean").
 *
 * The password step follows Shopify's own lighthouse-ci-action: put the password into the password
 * form's input in the page and submit the form, so the store sets whatever cookie it currently uses
 * (since 2025 an opaque one — the old `storefront_digest` cookie is gone) and every later request from
 * that browser profile is let in. No cookie is ever copied by name.
 */

const FORM = 'form[action*="password"]';

/**
 * The query that keeps a page on a preview theme. Same three parameters as Shopify's
 * lighthouse-ci-action: the theme, no redirect, no preview bar.
 *
 * @param {number|null} themeId Preview theme ID, or null for the published theme.
 * @param {string}      url     URL to add it to.
 * @return {string} URL.
 */
export function withPreview( url, themeId ) {
	if ( ! themeId ) {
		return url;
	}
	const u = new URL( url );
	u.searchParams.set( 'preview_theme_id', String( themeId ) );
	u.searchParams.set( '_fd', '0' );
	u.searchParams.set( 'pb', '0' );
	return u.toString();
}

/**
 * Whether a URL is the store's password page.
 *
 * @param {string} url URL.
 * @return {boolean} True on /password.
 */
export function isPasswordPage( url ) {
	try {
		return new URL( url ).pathname.replace( /\/+$/, '' ) === '/password';
	} catch {
		return false;
	}
}

/**
 * Get past the storefront password page in this page's browser profile.
 *
 * @param {import('playwright').Page} page     Page.
 * @param {string}                    base     Store origin.
 * @param {string}                    password Storefront password.
 * @param {number|null}               themeId  Preview theme ID, kept on the way in.
 * @return {Promise<boolean>} True when a password page was passed, false when there was none.
 */
export async function enterPassword( page, base, password, themeId ) {
	await page.goto( withPreview( `${ base }/password`, themeId ) );
	if ( ! isPasswordPage( page.url() ) ) {
		return false;
	}
	const field = `${ FORM } input[type="password"]`;
	try {
		// "attached", not visible: themes put the input in a closed modal (Dawn's "Enter using password").
		await page.waitForSelector( field, { state: 'attached', timeout: 15000 } );
	} catch {
		throw new Error( `The password page at ${ base }/password has no password form this toolkit recognises (${ field }).` );
	}
	await page.$eval( field, ( input, value ) => {
		input.value = value;
	}, password );
	await Promise.all( [
		page.waitForNavigation( { timeout: 30000 } ),
		page.$eval( FORM, ( form ) => form.submit() ),
	] );
	if ( isPasswordPage( page.url() ) ) {
		throw new Error( 'The storefront password was rejected: check SHOPIFY_STOREFRONT_PASSWORD in tools/shopify/.env.local.' );
	}
	return true;
}

/**
 * Check the page is the storefront the capture expects: not the password page, and — on any page
 * that declares its theme (`window.Shopify.theme`, which every storefront page carries) — the
 * demo's preview theme, or the published one when no preview is set. Pages without a theme
 * (checkout, other hosts) pass.
 *
 * @param {import('playwright').Page} page     Page.
 * @param {object|null}               expected { id, label, name } or null for the published theme.
 * @param {string}                    where    What is being checked, for the message.
 * @return {Promise<object|null>} The page's theme { id, name, role }, or null when it declares none.
 */
export async function assertStorefront( page, expected, where ) {
	if ( isPasswordPage( page.url() ) ) {
		throw new Error( `${ where }: the store's password page is showing. Set SHOPIFY_STOREFRONT_PASSWORD in tools/shopify/.env.local.` );
	}
	const theme = await page.evaluate( () => {
		const t = window.Shopify && window.Shopify.theme;
		return t ? { id: Number( t.id ), name: t.name ?? null, role: t.role ?? null } : null;
	} ).catch( () => null );
	if ( ! theme ) {
		return null;
	}
	if ( expected && theme.id !== expected.id ) {
		throw new Error( `${ where }: the page shows theme "${ theme.name }" (#${ theme.id }, ${ theme.role }), not ${ expected.name ? `"${ expected.name }"` : expected.label } (#${ expected.id }). The preview was lost — open pages with cap.url(), which keeps the preview on.` );
	}
	if ( ! expected && theme.role && theme.role !== 'main' ) {
		throw new Error( `${ where }: the page shows the ${ theme.role } theme "${ theme.name }" (#${ theme.id }), not the published one.` );
	}
	return theme;
}

/**
 * Init script: hides Shopify's preview bar, in case `pb=0` ever stops doing it. Runs in the page.
 */
export function hidePreviewBar() {
	const add = () => {
		const style = document.createElement( 'style' );
		style.setAttribute( 'data-pervej-capture', '' );
		style.textContent = '#PBarNextFrameWrapper,#PBarNextFrame,#preview-bar-iframe{display:none!important}';
		( document.head || document.documentElement ).append( style );
	};
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', add );
	} else {
		add();
	}
}
