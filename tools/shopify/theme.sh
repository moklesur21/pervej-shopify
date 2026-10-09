#!/usr/bin/env bash
# tools/shopify/theme.sh — the demo theme loop on your own dev store (docs/demo-procedure.md).
#
# The store and every secret come from the environment or tools/shopify/.env.local (git-ignored),
# never from a script. It works only on your own dev store (SHOPIFY_STORE): pushes go to unpublished
# themes, always --strict (Theme Check must pass) and --nodelete, and never to the live theme. A demo
# that needs a published theme publishes its own with `publish`, which records the theme that was live
# so `restore` can put it back (house rules §14: dev stores only, never a live store).

set -euo pipefail

usage() {
	cat <<'EOF'
Usage: tools/shopify/theme.sh <command> [args]

  doctor                           Check Node, the Shopify CLI, tools/shopify/.env.local and the store.
  new   <id> [horizon|dawn] [ref]  Copy an untouched base theme into shopify-dev/<id>/theme/.
                                   Horizon (the default, for new builds) at its current main commit;
                                   Dawn v16.0.0 when the brief's store is Dawn-based.
  dev   <id> [cli flags...]        shopify theme dev for that theme on your store (a private dev theme).
  check <id> [cli flags...]        shopify theme check on that theme.
  push  <id> <label>               Push to the unpublished theme "<id> · <label>" (created the first
                                   time), always --strict --nodelete. Its ID and preview link go to
                                   demos/<id>/media/themes.json (git-ignored). Labels: before, after...
  publish <id> <label>             Make "<id> · <label>" the live theme of your dev store, for a demo
                                   that needs a published theme. Records the theme that was live first.
  restore <id>                     Republish the theme that was live before publish.
  preview <id> [label]             Print the preview link(s) recorded by push.
  list  [<id>]                     Themes on your store (only this demo's when an ID is given).
  clean <id> [--yes]               Delete this demo's unpublished themes from your store (asks first).
  diff  <id> [setup|baseline] [git diff flags...]
                                   The review diff: from the demo's setup commit (default) or its
                                   baseline commit to HEAD, so the untouched base theme stays out of it.
EOF
}

die() {
	printf 'theme.sh: %s\n' "$*" >&2
	exit 1
}

ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || die "run it inside the pervej-shopify checkout"
ENV_REL=tools/shopify/.env.local
SHOPIFY_CLI=${SHOPIFY_CLI:-shopify}

# KEY=VALUE lines from .env.local (this checkout's, or the main checkout's when in a git worktree).
# Parsed, never sourced; the process environment wins.
load_env() {
	local file="$ROOT/$ENV_REL" common line key val
	if [[ ! -f $file ]]; then
		common=$(git -C "$ROOT" rev-parse --path-format=absolute --git-common-dir 2>/dev/null || true)
		if [[ -n $common && -f "$(dirname "$common")/$ENV_REL" ]]; then
			file="$(dirname "$common")/$ENV_REL"
		fi
	fi
	[[ -f $file ]] || return 0
	ENV_FILE=$file
	while IFS= read -r line || [[ -n $line ]]; do
		line=${line%$'\r'}
		[[ $line =~ ^[[:space:]]*(#|$) ]] && continue
		[[ $line == *=* ]] || continue
		key=${line%%=*}
		key=${key//[[:space:]]/}
		val=${line#*=}
		val="${val#"${val%%[![:space:]]*}"}"
		val="${val%"${val##*[![:space:]]}"}"
		if [[ $val =~ ^\"(.*)\"$ || $val =~ ^\'(.*)\'$ ]]; then
			val=${BASH_REMATCH[1]}
		fi
		[[ $key =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]] || continue
		if [[ -z ${!key:-} ]]; then
			export "$key=$val"
		fi
	done <"$file"
}

ENV_FILE=
load_env
SHOPIFY_CLI=${SHOPIFY_CLI:-shopify}

store() {
	local s=${SHOPIFY_STORE:-}
	[[ -n $s ]] || die "SHOPIFY_STORE is not set: cp tools/shopify/.env.example tools/shopify/.env.local and fill it in"
	s=${s#https://}
	s=${s#http://}
	printf '%s' "${s%%/*}"
}

valid_id() {
	[[ ${1:-} =~ ^[a-z][0-9]{2,}(-[a-z0-9]+)+$ ]] || die "\"${1:-}\" is not a demo ID (letter + number + slug, e.g. s01-cart-drawer-lag)"
}

theme_dir() {
	local dir="$ROOT/shopify-dev/$1/theme"
	[[ -d $dir ]] || die "no theme at shopify-dev/$1/theme — start one with: tools/shopify/theme.sh new $1"
	printf '%s' "$dir"
}

# The first JSON value in stdin (the CLI may print notices around it), then a node expression on it.
json() {
	node -e '
		const text = require("fs").readFileSync(0, "utf8");
		const start = text.search(/[[{]/);
		let data = null;
		try { data = start < 0 ? null : JSON.parse(text.slice(start)); } catch (e) { data = null; }
		const out = (new Function("data", "env", "require", process.argv[1]))(data, process.env, require);
		if (out !== undefined && out !== null && out !== "") process.stdout.write(String(out));
	' "$1"
}

cmd_doctor() {
	local fail=0 v major minor
	line() { printf '[%s] %s\n' "$1" "$2"; [[ $1 != fail ]] || fail=1; }

	if v=$(node -v 2>/dev/null); then
		v=${v#v}; major=${v%%.*}; minor=${v#*.}; minor=${minor%%.*}
		if (( major > 22 || (major == 22 && minor >= 12) )); then line ok "Node $v"; else line fail "Node $v — the Shopify CLI needs 22.12+ (the video toolkit 22.19+)"; fi
	else
		line fail "Node not found — brew install node"
	fi

	if v=$("$SHOPIFY_CLI" version 2>/dev/null | grep -Eo '[0-9]+\.[0-9]+\.[0-9]+' | head -1) && [[ -n $v ]]; then
		# Not grep -q: it quits at the first match, the CLI dies on the broken pipe, and pipefail fails the check.
		if "$SHOPIFY_CLI" theme push --help 2>/dev/null | grep -- '--strict' >/dev/null; then
			line ok "Shopify CLI $v"
		else
			line fail "Shopify CLI $v has no push --strict — update it: npm install -g @shopify/cli@latest"
		fi
	else
		line fail "Shopify CLI not found — npm install -g @shopify/cli@latest"
	fi

	if [[ -n $ENV_FILE ]]; then line ok "Settings: ${ENV_FILE#"$ROOT"/}"; else line fail "No tools/shopify/.env.local — copy tools/shopify/.env.example"; fi

	if [[ -n ${SHOPIFY_STORE:-} ]]; then
		local s code
		s=$(store)
		code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "https://$s/" || true)
		if [[ $code == 000 || -z $code ]]; then line warn "Store $s — not reachable"; else line ok "Store $s — HTTP $code"; fi
	else
		line fail "SHOPIFY_STORE not set"
	fi
	if [[ -n ${SHOPIFY_STOREFRONT_PASSWORD:-} ]]; then line ok "Storefront password set"; else line warn "SHOPIFY_STOREFRONT_PASSWORD not set (capture needs it)"; fi

	if [[ -n $(git -C "$ROOT" config user.name || true) && -n $(git -C "$ROOT" config user.email || true) ]]; then
		line ok "git identity: $(git -C "$ROOT" config user.name)"
	else
		line fail "git identity not set — git config --global user.name / user.email"
	fi
	return $fail
}

cmd_new() {
	local id=${1:-} base=${2:-horizon} ref repo name dest sha shown
	valid_id "$id"
	case $base in
		dawn) repo=${DAWN_REPO:-https://github.com/Shopify/dawn.git}; ref=${3:-${DAWN_REF:-v16.0.0}}; name=Dawn ;;
		horizon) repo=${HORIZON_REPO:-https://github.com/Shopify/horizon.git}; ref=${3:-${HORIZON_REF:-HEAD}}; name=Horizon ;;
		*) die "base theme must be horizon or dawn" ;;
	esac
	dest="$ROOT/shopify-dev/$id/theme"
	[[ ! -e $dest ]] || die "shopify-dev/$id/theme already exists"
	NEW_TMP=$(mktemp -d)
	trap 'rm -rf "$NEW_TMP"' EXIT
	git -C "$NEW_TMP" init -q
	git -C "$NEW_TMP" fetch -q --depth 1 "$repo" "$ref" || die "could not fetch $ref from $repo"
	git -C "$NEW_TMP" -c advice.detachedHead=false checkout -q FETCH_HEAD
	sha=$(git -C "$NEW_TMP" rev-parse --short=7 HEAD)
	rm -rf "$NEW_TMP/.git"
	mkdir -p "$dest"
	cp -R "$NEW_TMP/." "$dest/"
	shown=$ref
	[[ $ref != HEAD ]] || shown=main
	printf 'Copied %s %s (%s) into shopify-dev/%s/theme/, untouched.\n' "$name" "$shown" "$sha" "$id"
	printf 'Commit it before changing anything, so every later diff shows only our work:\n\n'
	printf '  git add shopify-dev/%s/theme && git commit -m "%s: baseline — %s %s (%s), untouched"\n' "$id" "${id%%-*}" "$name" "$shown" "$sha"
}

cmd_push() {
	local id=${1:-} label=${2:-} dir s name found out file
	valid_id "$id"
	[[ $label =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || die "push needs a label: before, after, qa..."
	dir=$(theme_dir "$id")
	s=$(store)
	name="$id · $label"
	found=$("$SHOPIFY_CLI" theme list --store "$s" --name "$id" --json | NAME="$name" json '
		const hit = (data || []).filter((t) => t.name === env.NAME);
		if (hit.some((t) => t.role === "live")) return "LIVE";
		return hit.length ? hit[0].id : "";
	')
	[[ $found != LIVE ]] || die "\"$name\" is live on $s — run: tools/shopify/theme.sh restore $id, push, then publish again"
	if [[ -n $found ]]; then
		out=$("$SHOPIFY_CLI" theme push --store "$s" --path "$dir" --theme "$found" --strict --nodelete --json)
	else
		out=$("$SHOPIFY_CLI" theme push --store "$s" --path "$dir" --unpublished --theme "$name" --strict --nodelete --json)
	fi
	file="$ROOT/demos/$id/media/themes.json"
	mkdir -p "$(dirname "$file")"
	printf '%s' "$out" | FILE="$file" LABEL="$label" STORE="$s" NAME="$name" json '
		const fs = require("fs");
		const t = (data && (data.theme || data)) || {};
		if (!t.id) throw new Error("push printed no theme ID — check the CLI output above");
		let all = {};
		try { all = JSON.parse(fs.readFileSync(env.FILE, "utf8")); } catch (e) { all = {}; }
		all[env.LABEL] = {
			id: t.id,
			name: t.name || env.NAME,
			store: env.STORE,
			preview: t.preview_url || `https://${env.STORE}/?preview_theme_id=${t.id}`,
			editor: t.editor_url || null,
			pushedAt: new Date().toISOString(),
		};
		fs.writeFileSync(env.FILE, JSON.stringify(all, null, 2) + "\n");
		return `Pushed to "${all[env.LABEL].name}" (#${t.id})\nPreview: ${all[env.LABEL].preview}\n`;
	'
}

cmd_preview() {
	local id=${1:-} label=${2:-} file
	valid_id "$id"
	file="$ROOT/demos/$id/media/themes.json"
	[[ -f $file ]] || die "nothing pushed for $id yet — tools/shopify/theme.sh push $id before"
	LABEL="$label" json '
		const rows = Object.entries(data || {}).filter(([k]) => !k.startsWith("_") && (!env.LABEL || k === env.LABEL));
		if (!rows.length) throw new Error("no theme with that label");
		return rows.map(([k, v]) => `${k}\t${v.preview}`).join("\n") + "\n";
	' <"$file"
}

cmd_publish() {
	local id=${1:-} label=${2:-} s file target live
	valid_id "$id"
	[[ $label =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || die "publish needs a label: after, before..."
	s=$(store)
	file="$ROOT/demos/$id/media/themes.json"
	[[ -f $file ]] || die "nothing pushed for $id yet — tools/shopify/theme.sh push $id $label"
	target=$(LABEL="$label" STORE="$s" json '
		const t = (data || {})[env.LABEL];
		if (t && t.store !== env.STORE) throw new Error(`"${t.name}" was pushed to ${t.store}, not ${env.STORE}`);
		return t ? t.id : "";
	' <"$file")
	[[ -n $target ]] || die "no \"$label\" theme recorded for $id — tools/shopify/theme.sh push $id $label"
	live=$("$SHOPIFY_CLI" theme list --store "$s" --json | json '
		const t = (data || []).find((x) => x.role === "live");
		return t ? `${t.id}\t${t.name}` : "";
	')
	[[ -n $live ]] || die "could not read the live theme on $s"
	if [[ ${live%%$'\t'*} == "$target" ]]; then
		printf '"%s · %s" is already live on %s.\n' "$id" "$label" "$s"
		return 0
	fi
	# The theme that was live before the demo's first publish, kept until restore.
	FILE="$file" LIVE="$live" STORE="$s" json '
		const fs = require("fs");
		if (!data._restore) {
			const [id, name] = env.LIVE.split("\t");
			data._restore = { id: Number(id), name, store: env.STORE, at: new Date().toISOString() };
			fs.writeFileSync(env.FILE, JSON.stringify(data, null, 2) + "\n");
		}
	' <"$file"
	"$SHOPIFY_CLI" theme publish --store "$s" --theme "$target" --force
	printf 'Published "%s · %s" (#%s) on %s. Put the store back with: tools/shopify/theme.sh restore %s\n' "$id" "$label" "$target" "$s" "$id"
}

cmd_restore() {
	local id=${1:-} s file prev
	valid_id "$id"
	s=$(store)
	file="$ROOT/demos/$id/media/themes.json"
	[[ -f $file ]] || die "nothing recorded for $id"
	prev=$(STORE="$s" json '
		const r = (data || {})._restore;
		if (r && r.store !== env.STORE) throw new Error(`the theme to restore is on ${r.store}, not ${env.STORE}`);
		return r ? r.id : "";
	' <"$file")
	if [[ -z $prev ]]; then
		printf 'Nothing to restore: no theme of %s was published on %s.\n' "$id" "$s"
		return 0
	fi
	"$SHOPIFY_CLI" theme publish --store "$s" --theme "$prev" --force
	FILE="$file" json '
		const fs = require("fs");
		delete data._restore;
		fs.writeFileSync(env.FILE, JSON.stringify(data, null, 2) + "\n");
	' <"$file"
	printf 'Republished #%s on %s; the demo'"'"'s themes are unpublished again.\n' "$prev" "$s"
}

cmd_list() {
	local s
	s=$(store)
	if [[ -n ${1:-} ]]; then
		valid_id "$1"
		"$SHOPIFY_CLI" theme list --store "$s" --name "$1"
	else
		"$SHOPIFY_CLI" theme list --store "$s"
	fi
}

cmd_clean() {
	local id=${1:-} yes=${2:-} s rows answer tid tname
	valid_id "$id"
	s=$(store)
	rows=$("$SHOPIFY_CLI" theme list --store "$s" --name "$id" --json | PREFIX="$id · " json '
		const mine = (data || []).filter((t) => t.name.startsWith(env.PREFIX));
		const live = mine.find((t) => t.role === "live");
		if (live) return `LIVE\t${live.name}`;
		return mine.filter((t) => t.role === "unpublished").map((t) => `${t.id}\t${t.name}`).join("\n");
	')
	[[ $rows != LIVE$'\t'* ]] || die "\"${rows#*$'\t'}\" is live on $s — run tools/shopify/theme.sh restore $id first"
	if [[ -z $rows ]]; then
		printf 'No unpublished themes named "%s · ..." on %s.\n' "$id" "$s"
		return 0
	fi
	printf 'On %s:\n%s\n' "$s" "$rows"
	if [[ $yes != --yes ]]; then
		read -r -p "Delete these unpublished themes? [y/N] " answer
		[[ $answer == [yY] ]] || die "nothing deleted"
	fi
	while IFS=$'\t' read -r tid tname; do
		"$SHOPIFY_CLI" theme delete --store "$s" --theme "$tid" --force
		printf 'Deleted "%s" (#%s)\n' "$tname" "$tid"
	done <<<"$rows"
	rm -f "$ROOT/demos/$id/media/themes.json"
}

# The demo's "<sNN>: <which>" commit — or "<id>: <which>" when the number is shared with another demo.
# The branch's own commits first, so an older demo with the same number is never picked up.
demo_commit() {
	local id=$1 which=$2 short=${1%%-*} range sha
	for range in "main..HEAD" "HEAD"; do
		sha=$(git -C "$ROOT" log -1 --format=%H -E --grep="^($short|$id): $which" "$range" 2>/dev/null || true)
		if [[ -n $sha ]]; then
			printf '%s' "$sha"
			return 0
		fi
	done
}

cmd_diff() {
	local id=${1:-} which=setup short sha
	valid_id "$id"
	shift
	if [[ ${1:-} == setup || ${1:-} == baseline ]]; then
		which=$1
		shift
	fi
	short=${id%%-*}
	sha=$(demo_commit "$id" "$which")
	if [[ -z $sha && $which == setup ]]; then
		sha=$(demo_commit "$id" baseline)
		[[ -z $sha ]] || printf 'No "%s: setup" commit (nothing planted); diffing from the baseline.\n' "$short" >&2
	fi
	[[ -n $sha ]] || die "no commit on this branch whose message starts \"$short: $which\" (or \"$id: $which\")"
	exec git -C "$ROOT" diff "$sha"..HEAD "$@"
}

command=${1:-}
[[ $# -eq 0 ]] || shift
case $command in
	doctor) cmd_doctor ;;
	new) cmd_new "$@" ;;
	dev)
		valid_id "${1:-}"
		dir=$(theme_dir "$1")
		shift
		exec "$SHOPIFY_CLI" theme dev --store "$(store)" --path "$dir" "$@"
		;;
	check)
		valid_id "${1:-}"
		dir=$(theme_dir "$1")
		shift
		exec "$SHOPIFY_CLI" theme check --path "$dir" "$@"
		;;
	push) cmd_push "$@" ;;
	publish) cmd_publish "$@" ;;
	restore) cmd_restore "$@" ;;
	preview) cmd_preview "$@" ;;
	list) cmd_list "$@" ;;
	clean) cmd_clean "$@" ;;
	diff) cmd_diff "$@" ;;
	'' | -h | --help | help) usage ;;
	*)
		usage >&2
		exit 1
		;;
esac
