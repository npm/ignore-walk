# Changelog

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
