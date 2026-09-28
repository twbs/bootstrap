---
name: bootstrap-release
description: Cuts a Bootstrap release from version preparation through npm, GitHub, NuGet, and documentation deployment. Use when a maintainer asks to release, publish, or ship Bootstrap, including prereleases such as v6.0.0-alpha1.
disable-model-invocation: true
---

# Release Bootstrap

Use this workflow for maintainer releases from this repository.
The examples target `v6.0.0-alpha1` from `v6-dev`.
Replace the version and branch for later releases.

## Safety rules

- Keep the working tree clean before release work.
- Use `next` for alpha, beta, and release-candidate npm releases.
- Never point npm’s `latest` tag at a prerelease.
- Mark each GitHub prerelease as a prerelease.
- Use a signed git tag.
- Never edit generated SRI hashes.
- Pause before each external write.
- Get explicit approval before you push a tag, publish to npm, publish a GitHub release, or deploy documentation.
- Stop after any failed check.

## Progress

Track these steps:

```text
- [ ] 1. Check release prerequisites
- [ ] 2. Prepare the version
- [ ] 3. Run tests
- [ ] 4. Build release files
- [ ] 5. Commit and merge the release PR
- [ ] 6. Verify and tag the merge commit
- [ ] 7. Publish to npm
- [ ] 8. Publish the GitHub release
- [ ] 9. Deploy documentation
- [ ] 10. Verify the release
```

## 1. Check release prerequisites

1. Confirm the release branch and target version.
2. Confirm all target milestone work is complete.
3. Confirm the working tree is clean.
4. Update the release branch.
5. Use the Node.js version from `.nvmrc`.
6. Install exact dependencies.
7. Confirm npm access.
8. Confirm GitHub access.

```sh
git switch v6-dev
git pull --ff-only origin v6-dev
git status --short
nvm use
npm ci
npm whoami
gh auth status
```

Confirm that the npm account can publish the `bootstrap` package.
Confirm that `.github/workflows/publish-nuget.yml` exists.
Confirm that `.github/workflows/docs-deploy.yml` exists before documentation deployment.

## 2. Prepare the version

Read the current version:

```sh
node -p "require('./package.json').version"
```

Skip the version change when it already equals the release version.
The first Bootstrap 6 alpha already uses `6.0.0-alpha1`.

For a later release, preview the version change first:

```sh
npm run release-version 6.0.0-alpha1 6.0.0-alpha2 -- --dry-run --verbose
```

Then apply it:

```sh
npm run release-version 6.0.0-alpha1 6.0.0-alpha2 -- --verbose
```

The script updates:

- `README.md`
- `config.yml`
- `js/src/base-component.ts`
- `package.js`
- `package.json`
- `package-lock.json`
- `scss/_banner.scss`
- `site/data/docs-versions.yml`

It also updates RubyGem version strings from forms such as `6.0.0.alpha1`.
Review every changed file.
Search for stale version strings outside generated output.

```sh
git grep -n "6\.0\.0-alpha1" -- \
  . \
  ':!dist' \
  ':!js/dist' \
  ':!_site' \
  ':!package-lock.json'
```

## 3. Run tests

Run the full test suite before the final release build:

```sh
npm test
npm run bundlewatch
```

The browser tests need Chromium.
Install it only when the test output reports that it is missing:

```sh
npx playwright install --with-deps chromium
```

Fix all failures before continuing.

## 4. Build release files

Run the release build:

```sh
npm run release
```

This command performs these tasks:

1. It builds CSS, JavaScript, and TypeScript declarations.
2. It writes SRI hashes to `config.yml`.
3. It builds the documentation site.
4. It creates the distribution ZIP file.
5. It creates the examples ZIP file.

For `6.0.0-alpha1`, confirm these files exist:

```text
bootstrap-6.0.0-alpha1-dist.zip
bootstrap-6.0.0-alpha1-examples.zip
```

Review the complete diff.
Confirm that `config.yml` contains updated `css_hash`, `js_hash`, and `js_bundle_hash` values.
Do not rebuild `dist/` after this check.
If another build changes `dist/`, run `npm run release-sri` again.

## 5. Commit and merge the release PR

Create a release branch from the release branch.
Commit all intended version and generated release changes.

```sh
git switch -c release-v6.0.0-alpha1
git add -A
git commit -m "Release v6.0.0-alpha1"
git push -u origin release-v6.0.0-alpha1
gh pr create --base v6-dev
```

Review the staged file list before the commit.
Do not include unrelated changes.
Wait for all required checks.
Merge the PR before tagging.

## 6. Verify and tag the merge commit

Return to the release branch and update it:

```sh
git switch v6-dev
git pull --ff-only origin v6-dev
npm ci
npm run release
git status --short
```

The tracked working tree must stay clean after the repeat build.
The two ZIP files must exist.

After explicit approval, create and push a signed tag:

```sh
git tag -s v6.0.0-alpha1 -m "v6.0.0-alpha1"
git push origin v6.0.0-alpha1
```

Use the version without `v` in package files.
Use the version with `v` for the git tag and GitHub release.

## 7. Publish to npm

Inspect the package contents:

```sh
npm pack --dry-run
```

After explicit approval, publish the prerelease:

```sh
npm publish --tag next
```

Complete npm’s authentication prompt.
Then verify the distribution tags:

```sh
npm dist-tag ls bootstrap
```

`next` must point to `6.0.0-alpha1`.
`latest` must remain on the newest stable release.

Use the default `latest` tag only for a stable release.

## 8. Publish the GitHub release

Use GitHub’s generated release notes.
Attach both ZIP files.
Mark the release as a prerelease.

After explicit approval, run:

```sh
gh release create v6.0.0-alpha1 \
  --title "v6.0.0-alpha1" \
  --generate-notes \
  --prerelease \
  bootstrap-6.0.0-alpha1-dist.zip \
  bootstrap-6.0.0-alpha1-examples.zip
```

Publishing the GitHub release starts `.github/workflows/publish-nuget.yml`.
Watch the workflow and confirm that both NuGet packages publish.

## 9. Deploy documentation

The manual documentation workflow builds `_site/`.
It copies the current site over `gh-pages` without deleting older version directories.

After explicit approval, dispatch it from the released branch:

```sh
gh workflow run docs-deploy.yml --ref v6-dev
```

Find and watch the new run:

```sh
gh run list --workflow docs-deploy.yml --limit 1
gh run watch
```

Confirm that the repository Pages source remains the `gh-pages` branch:

```sh
gh api repos/twbs/bootstrap/pages --jq '.build_type, .source'
```

## 10. Verify the release

Verify all release surfaces:

1. Confirm the npm version and distribution tags.
2. Confirm the GitHub release has both ZIP files.
3. Confirm the NuGet workflow passed.
4. Confirm the Bootstrap homepage shows the new version.
5. Confirm the new documentation version loads.
6. Confirm an older documentation version still loads.
7. Confirm the jsDelivr CSS and JavaScript files load.
8. Confirm their SRI hashes match `config.yml`.

jsDelivr can take a few minutes to load a new npm version.

Calculate a published file hash with:

```sh
curl -sL \
  https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha1/dist/css/bootstrap.min.css \
  | openssl dgst -sha384 -binary \
  | openssl base64 -A
```

Repeat the check for:

- `dist/js/bootstrap.min.js`
- `dist/js/bootstrap.bundle.min.js`

Compare each result with the base64 part of the related `sha384-` value in `config.yml`.

## Recovery

Do not unpublish a bad npm release.
Publish a corrected version.

To move the prerelease distribution tag:

```sh
npm dist-tag add bootstrap@<good-version> next
```

To remove a bad GitHub release and tag:

```sh
gh release delete v6.0.0-alpha1 --cleanup-tag
```

Get explicit approval before either recovery action.
