<div align='center'><br /><img src="https://raw.githubusercontent.com/vince-fugnitto/security-audit/master/assets/security-header.png" width="400px"/></div>

### Security Audit - 18/10/2019 at 18:48 UTC
-- -

#### Scan Summary

| Moderate | High | Critical |
|:---|:---|:---|
| 1 | 2 | 0 |


#### Scan Details

| Security Vulnerability | Module Name | Severity | Version | Vulnerable Versions | Patched Versions | Recommendation | Path |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [Code Injection](https://npmjs.com/advisories/813) | js-yaml (devDependency) | high | 3.7.0 | <3.13.1 | >=3.13.1 | Upgrade to version 3.13.1. | @theia/cli>@theia/application-manager>css-loader>cssnano>postcss-svgo>svgo>js-yaml |
| [Machine-In-The-Middle](https://npmjs.com/advisories/1184) | https-proxy-agent (devDependency) | high | 2.2.2 | <3.0.0 | >=3.0.0 | Upgrade to version 3.0.0 or later. | @theia/cpp>@theia/preferences>@theia/json>vscode-json-languageserver>request-light>https-proxy-agent |
| [Denial of Service](https://npmjs.com/advisories/788) | js-yaml (devDependency) | moderate | 3.7.0 | <3.13.0 | >=3.13.0 | Upgrade to version 3.13.0. | @theia/cli>@theia/application-manager>css-loader>cssnano>postcss-svgo>svgo>js-yaml |

