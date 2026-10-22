# Plan review round 1 dispositions

- F1 accepted: the sync workflow validates before creating its GITHUB_TOKEN PR, because that PR does not trigger normal PR CI.
- F2 accepted: require equal light and dark semantic color paths and a missing-path fixture.
- F3 accepted: define px, em, unitless line-height conversions, font fallback, and invalid units.
- F4 accepted: exclude gradient and other unmapped categories with tests.
- F5 accepted: source sets resolve aliases only; disabled sets are ignored.
- F6 accepted: pin one main SHA and copy its generated artifacts and source JSON without running npm in the iOS repo.
- F7 accepted: use a fixed branch, update the existing PR, compare source SHA, and serialize runs.
- F8 accepted: clear generated output before build and detect tracked or untracked drift.
- F9 accepted: treat fetched files as inert data, check paths, and scope workflow permissions.
- F10 accepted: pin Node and deterministic numeric/output ordering.
- F11 accepted: close the issue after first sync verification.
- F12 accepted: exclude state opacity from current iOS output.
