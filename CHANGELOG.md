# Changelog

## [6.0.4](https://github.com/npm/ignore-walk/compare/v6.0.3...v6.0.4) (2023-11-29)

### Bug Fixes

* [`b587cc3`](https://github.com/npm/ignore-walk/commit/b587cc32f430dc8d3052cb2905416e301f26df0d) handling of nested unignores (#119) (@mohd-akram)
* [`493401a`](https://github.com/npm/ignore-walk/commit/493401a71e71ab3f1137a27c65e1a4412d93ae26) recursive directory ignore rules (#118) (@wraithgar, @LinqLover)
* [`0bb0972`](https://github.com/npm/ignore-walk/commit/0bb0972643eb52cfd828d769ef7602323e427df5) [#116](https://github.com/npm/ignore-walk/pull/116) disallow child unignoring parent directory ignore (#116) (@mohd-akram)

## [6.0.3](https://github.com/npm/ignore-walk/compare/v6.0.2...v6.0.3) (2023-04-26)

### Dependencies

* [`6446cd2`](https://github.com/npm/ignore-walk/commit/6446cd220d6af31f0ba925d665a9bce54c58d3f5) [#83](https://github.com/npm/ignore-walk/pull/83) bump minimatch from 7.4.6 to 9.0.0 (#83)

## [6.0.2](https://github.com/npm/ignore-walk/compare/v6.0.1...v6.0.2) (2023-03-21)

### Dependencies

* [`7a459ad`](https://github.com/npm/ignore-walk/commit/7a459ad3596d488f7fcf48bbbd0fff4af2a6f940) [#78](https://github.com/npm/ignore-walk/pull/78) bump minimatch from 6.2.0 to 7.4.2 (#78)

## [6.0.1](https://github.com/npm/ignore-walk/compare/v6.0.0...v6.0.1) (2023-02-07)

### Dependencies

* [`6482d8e`](https://github.com/npm/ignore-walk/commit/6482d8eacb9cc986908fa85c9896490bba1c50c9) [#66](https://github.com/npm/ignore-walk/pull/66) bump minimatch from 5.1.6 to 6.1.6

## [6.0.0](https://github.com/npm/ignore-walk/compare/v5.0.1...v6.0.0) (2022-10-10)

### ⚠️ BREAKING CHANGES

* `ignore-walk` is now compatible with the following semver range for node: `^14.17.0 || ^16.13.0 || >=18.0.0`

### Features

* [`e723a53`](https://github.com/npm/ignore-walk/commit/e723a53bbd283f86fff819089db81fbe549662a5) [#43](https://github.com/npm/ignore-walk/pull/43) postinstall for dependabot template-oss PR (@lukekarrys)

### [5.0.1](https://github.com/npm/ignore-walk/compare/v5.0.0...v5.0.1) (2022-04-06)


### Bug Fixes

* trim ignore rules before matching ([#28](https://github.com/npm/ignore-walk/issues/28)) ([e6a9acc](https://github.com/npm/ignore-walk/commit/e6a9acceeeab3df0eb13d02f1c0f8dd69f8492c2))

## [5.0.0](https://github.com/npm/ignore-walk/compare/v4.0.1...v5.0.0) (2022-04-05)


### ⚠ BREAKING CHANGES

* this drops support for node 10 and non-LTS versions of node 12 and node 14

### Bug Fixes

* replace deprecated String.prototype.substr() ([#27](https://github.com/npm/ignore-walk/issues/27)) ([a173abe](https://github.com/npm/ignore-walk/commit/a173abe3a15705d30794d5dbaffbb39916858fc8))


### Documentation

* remove travis badge ([ee50957](https://github.com/npm/ignore-walk/commit/ee5095746282dd059cd9a7c3a71e4b8ab975300e))


### Dependencies

* @npmcli/template-oss@3.2.2 ([#20](https://github.com/npm/ignore-walk/issues/20)) ([d3e68c2](https://github.com/npm/ignore-walk/commit/d3e68c2a30c415fa154cf1d95e0f7760cdb4a7d2))
* bump minimatch from 3.1.2 to 5.0.1 ([#23](https://github.com/npm/ignore-walk/issues/23)) ([cd809f4](https://github.com/npm/ignore-walk/commit/cd809f4a76e7366ba5fa5a72572e3b25ac8ec9aa))
