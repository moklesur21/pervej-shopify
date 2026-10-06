/**
 * A local stand-in for a password-protected Shopify dev store, for the toolkit's own tests. It copies
 * only what the capture side depends on, as the real store behaves:
 *
 * - every page redirects to /password until the storefront password is posted; the password input
 *   sits inside a closed modal, as in Dawn, and the session cookie is opaque (no storefront_digest);
 * - `?preview_theme_id=` switches the theme and sticks for the session; `pb=0` hides the preview bar;
 * - every storefront page declares its theme in `window.Shopify.theme`; checkout pages declare none;
 * - classic customer accounts: a form posting to /account/login, and /account behind it.
 *
 * The real store stays the final proof: run a capture against it before trusting a change here.
 */

import http from 'node:http';
import crypto from 'node:crypto';

/**
 * Start the mock store on a free local port.
 *
 * @param {object} o           Options.
 * @param {string} o.password  Storefront password.
 * @param {object} o.live      The published theme { id, name }.
 * @param {object[]} o.previews Unpublished themes [{ id, name }].
 * @param {object} o.customer  Classic-accounts customer { email, password }.
 * @return {Promise<{url: string, close: Function}>} Its origin and a stop function.
 */
export async function startMockStore( { password, live, previews, customer } ) {
	const sessions = new Map();
	const themes = new Map( previews.map( ( t ) => [ String( t.id ), t ] ) );

	const page = ( title, body, theme, bar ) => `<!doctype html><html><head><meta charset="utf-8"><title>${ title }</title>
<style>body{font:16px/1.5 sans-serif;margin:0}main{padding:40px;width:600px}h1{font-size:32px}</style>
${ theme ? `<script>window.Shopify = { shop: "mock.myshopify.com", theme: ${ JSON.stringify( theme ) } };</script>` : '' }
</head><body><main>${ body }</main>
${ bar ? '<div id="PBarNextFrameWrapper" style="position:fixed;left:0;right:0;bottom:0;height:60px;background:#c00;color:#fff">You are previewing a theme<iframe id="preview-bar-iframe"></iframe></div>' : '' }
</body></html>`;

	const server = http.createServer( async ( req, res ) => {
		const url = new URL( req.url, 'http://mock' );
		const cookies = Object.fromEntries( ( req.headers.cookie || '' ).split( /;\s*/ ).filter( Boolean ).map( ( c ) => c.split( '=' ) ) );
		let sid = cookies._shopify_essential;
		if ( ! sid || ! sessions.has( sid ) ) {
			sid = crypto.randomBytes( 12 ).toString( 'base64url' );
			sessions.set( sid, { authed: false, preview: null, bar: true, customer: null } );
		}
		const s = sessions.get( sid );
		const headers = { 'set-cookie': `_shopify_essential=${ sid }; Path=/; HttpOnly; SameSite=Lax` };
		const send = ( status, html, extra = {} ) => {
			res.writeHead( status, { ...headers, 'content-type': 'text/html; charset=utf-8', ...extra } );
			res.end( html );
		};
		const redirect = ( to ) => {
			res.writeHead( 302, { ...headers, location: to } );
			res.end();
		};
		const body = await new Promise( ( resolve ) => {
			let data = '';
			req.on( 'data', ( chunk ) => ( data += chunk ) );
			req.on( 'end', () => resolve( new URLSearchParams( data ) ) );
		} );

		if ( url.searchParams.has( 'preview_theme_id' ) && themes.has( url.searchParams.get( 'preview_theme_id' ) ) ) {
			s.preview = url.searchParams.get( 'preview_theme_id' );
		}
		if ( url.searchParams.get( 'pb' ) === '0' ) {
			s.bar = false;
		}

		if ( url.pathname === '/password' ) {
			if ( req.method === 'POST' && body.get( 'form_type' ) === 'storefront_password' && body.get( 'password' ) === password ) {
				s.authed = true;
				return redirect( '/' );
			}
			if ( s.authed ) {
				return redirect( '/' );
			}
			const wrong = req.method === 'POST' ? '<p class="error">Wrong password</p>' : '';
			return send( 200, page( 'Opening soon', `<h1>Opening soon</h1>
<form method="post" action="/contact#newsletter"><input type="email" name="contact[email]"></form>
<details><summary>Enter using password</summary>
<form method="post" action="/password" class="storefront-password-form"><input type="hidden" name="form_type" value="storefront_password"><input type="hidden" name="utf8" value="✓">${ wrong }<input type="password" name="password"><button>Enter</button></form>
</details>`, null, false ) );
		}
		if ( ! s.authed ) {
			return redirect( '/password' );
		}

		const preview = s.preview ? { ...themes.get( s.preview ), role: 'unpublished' } : null;
		const theme = preview || { ...live, role: 'main' };
		const bar = Boolean( preview ) && ( s.bar || url.searchParams.get( 'bar' ) === '1' );

		if ( url.pathname.startsWith( '/checkouts/' ) ) {
			return send( 200, page( 'Checkout', '<h1>Checkout</h1><p>Contact information</p>', null, false ) );
		}
		if ( url.pathname === '/account/login' ) {
			if ( req.method === 'POST' && body.get( 'form_type' ) === 'customer_login' &&
				body.get( 'customer[email]' ) === customer.email && body.get( 'customer[password]' ) === customer.password ) {
				s.customer = customer.email;
				return redirect( '/account' );
			}
			return send( 200, page( 'Login', `<h1>Login</h1>
<form method="post" action="/account/login" id="customer_login"><input type="hidden" name="form_type" value="customer_login"><input type="hidden" name="utf8" value="✓">
<input type="email" name="customer[email]"><input type="password" name="customer[password]"><button>Sign in</button></form>`, theme, bar ) );
		}
		if ( url.pathname === '/account' ) {
			return s.customer ? send( 200, page( 'Account', `<h1>Account</h1><p class="who">${ s.customer }</p>`, theme, bar ) ) : redirect( '/account/login' );
		}
		return send( 200, page( theme.name, `<h1 class="title">${ theme.name }</h1>
<p class="lead">Small-batch stoneware, glazed by hand and fired twice for a calm, even finish.</p>
<button id="add" type="button" onclick="this.textContent='Added'">Add to cart</button>
<a id="next" href="/products/b">Next product</a>`, theme, bar ) );
	} );

	await new Promise( ( resolve ) => server.listen( 0, '127.0.0.1', resolve ) );
	const { port } = server.address();
	return {
		url: `http://127.0.0.1:${ port }`,
		close: () => new Promise( ( resolve ) => server.close( resolve ) ),
	};
}
