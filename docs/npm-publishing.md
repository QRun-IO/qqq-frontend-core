# npm publishing

CircleCI publishes `@qrunio/qqq-frontend-core` with npm Trusted Publishing through the shared `frontend-core` profile in `.qqq-ci.yml`. The canonical caller tracks `kingsrook/qqq-orb@0.8` and uses `cimg/node:24.21`. Publishing logic lives in the orb, not in a repository-specific workflow. In the package Settings on npmjs.com, add a **CircleCI** trusted publisher with the values below and explicitly allow **npm publish** (the staged-only default does not run this pipeline).

Develop snapshots use build-specific versions such as `0.40.28-SNAPSHOT.1234`
and the npm `snapshot` dist-tag. The version is calculated in the publishing
workspace; the job does not push a version-only `[skip ci]` commit back to
`develop`. Required checks therefore stay attached to the source head being
published. See [version management](version-management.md) and the
[shared orb policy](https://github.com/QRun-IO/qqq-orb/blob/main/docs/GENERATED-PIPELINES.md#node-snapshot-versions).

| npm field | Value |
| --- | --- |
| Organization ID | `bb329fea-03cd-4fb5-b530-15e85703598d` |
| Project ID | `5bd1e544-282a-4080-afc1-36ffdebf5487` |
| Pipeline definition ID | `3bd87740-26e6-5f18-8600-10685a13a81e` |
| VCS origin | `github.com/QRun-IO/qqq-frontend-core` |

These are public identifiers, not credentials. The job obtains a short-lived npm-audience OIDC identity only for publication, so no new `NPM_TOKEN` is needed. Do not use `npm whoami` or a publish dry run as proof: verify the real immutable version at npm and install it in a clean consumer. Once that succeeds, remove obsolete token access only after checking its other consumers. CircleCI Trusted Publishing currently does not attach npm provenance attestations. See [npm documentation](https://docs.npmjs.com/trusted-publishers/).
