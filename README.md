## Security Audit - 17/10/2019 at 15:33 UTC
-- -

### Scan Summary

| Moderate | High | Critical |
|:---|:---|:---|
| 0 | 0 | 0 |


### Scan Details

| Security Vulnerability | Module Name | Severity | Version | Vulnerable Versions | Patched Versions | Recommendation | Path |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [Regular Expression Denial of Service](https://npmjs.com/advisories/534) | debug (devDependency) | low | 0.8.1 | <= 2.6.8 \|\| >= 3.0.0 <= 3.0.1 | >= 2.6.9 < 3.0.0 \|\| >= 3.1.0 | Version 2.x.x: Update to version 2.6.9 or later.
Version 3.x.x: Update to version 3.1.0 or later.
 | @theia/callhierarchy>@theia/core>@theia/application-package>changes-stream>debug |

