## Security Audit - 16 / 9 / 2019
-- -

### Scan Summary

| Moderate | High | Critical |
|:---|:---|:---|
| 1 | 1 | 0 |


### Scan Details

| Security Vulnerability | Module Name | Severity | Version | Vulnerable Versions | Patched Versions | Recommendation | Path | Dev | URL |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Code Injection | js-yaml | high | 3.7.0 | <3.13.1 | >=3.13.1 | Upgrade to version 3.13.1. | @theia/cli>@theia/application-manager>css-loader>cssnano>postcss-svgo>svgo>js-yaml | false | [Info](https://npmjs.com/advisories/813) |
| Denial of Service | js-yaml | moderate | 3.7.0 | <3.13.0 | >=3.13.0 | Upgrade to version 3.13.0. | @theia/cli>@theia/application-manager>css-loader>cssnano>postcss-svgo>svgo>js-yaml | false | [Info](https://npmjs.com/advisories/788) |

