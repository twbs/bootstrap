# Incident response plan

This document describes how the Bootstrap maintainers respond to and manage security or operational incidents affecting the project, its website, or its distributed releases. This plan is public to promote transparency and community trust. Operational details (e.g., private contacts, credentials, or internal coordination tools) are maintained separately in the maintainers’ private documentation.

---

## 1. Purpose & Scope

This plan defines how Bootstrap maintainers will:

- Identify, triage, and manage security or integrity incidents affecting project code, releases, or infrastructure.
- Communicate with the community and downstream consumers during and after an incident.
- Record lessons learned and update processes to reduce future risk.

It applies to:

- The Bootstrap source code, documentation, and build pipelines.
- Release artifacts (npm, CDN, GitHub releases).
- The main website ([https://getbootstrap.com](https://getbootstrap.com)).
- Any official Bootstrap GitHub organization infrastructure.

It does **not** cover unrelated third-party forks or integrations.

---

## 2. Definitions

- **Incident**: Any event that could compromise the confidentiality, integrity, or availability of Bootstrap code, releases, or users. Examples include:
  - A discovered security vulnerability.
  - A compromised GitHub account or CI/CD token.
  - A malicious dependency or injected code in a release.
  - Website defacement or unauthorized modification of documentation.
  - Leaked secrets related to the project infrastructure.

- **Incident Commander (IC)**: The maintainer responsible for coordinating the overall response.

---

## 3. Roles & Responsibilities

| Role | Responsibilities |
|------|-------------------|
| **Incident Commander (IC)** | Coordinate the response, assign tasks, ensure timely communication. |
| **Security Maintainers** | Triage reported vulnerabilities, assess impact, create fixes, handle embargoes. |
| **Infrastructure Lead** | Manage CI/CD, website, and release infrastructure. |
| **Communications Lead** | Manage public announcements, blog posts, and social updates. |
| **Contributors & Community** | Promptly report suspected security issues and follow responsible disclosure guidelines. |

In practice, Bootstrap’s core team fulfills these roles collectively, assigning an IC on a per-incident basis.

---

## 4. Incident workflow

### 4.1 Detection & Reporting

- All security issues should be **privately reported** via the contact method in [`SECURITY.md`](../SECURITY.md) or through GitHub’s Security Advisory mechanism.
- Maintainers also monitor:
  - Automated dependency scanners (e.g., Dependabot, npm audit).
  - GitHub notifications and vulnerability alerts.
  - Community channels for suspicious activity.

### 4.2 Initial triage

Upon receiving a report:

1. A maintainer acknowledges receipt within 3 business days (or sooner, when possible).  
   Bootstrap is maintained by a small volunteer team; response times may vary slightly outside normal working hours.
2. The IC assesses severity and impact:
   - **Critical:** immediate compromise of release infrastructure or code integrity.
   - **High:** exploitable vulnerability in distributed assets.
   - **Medium:** minor vulnerability or low-likelihood attack vector.
   - **Low:** informational, no direct risk.
3. If confirmed as an incident, the IC opens a private coordination channel for maintainers and begins containment.

### 4.3 Containment & Eradication

- Revoke or rotate any affected credentials.
- Disable compromised infrastructure or build pipelines if necessary.
- Patch affected branches or dependencies.
- Verify integrity of artifacts and releases.

### 4.4 Communication

- Keep the reporting party informed (when applicable).
- For major incidents, the Communications Lead drafts a public advisory describing:
  - What happened
  - What was impacted
  - How users can verify or mitigate
  - What actions were taken
- Communications occur after containment to avoid amplifying risk.

Public disclosures are posted via:

- GitHub Security Advisory if appropriate
- [blog.getbootstrap.com/](https://blog.getbootstrap.com/)
- [Bootstrap GitHub discussions](https://github.com/orgs/twbs/discussions)
- [@getbootstrap](https://x.com/getbootstrap) on X (formerly Twitter) for critical security notices.

### 4.5 Recovery

- Validate all systems and releases are secure.
- Resume normal operations.
- Tag patched releases and notify affected users.

### 4.6 Post-incident review

Within two weeks after resolution:

- Conduct an internal debrief.
- Record:
  - Root cause
  - What worked / what didn’t
  - Remediation steps
  - Documentation or automation updates needed
- Summarize lessons learned in the private maintainers’ wiki (with optional public summary if appropriate).

---

## 5. Severity levels & Response targets

| Severity | Example | Target response (volunteer team) |
|-----------|----------|----------------------------------|
| **Critical** | Compromised release, stolen signing keys | Acknowledge ≤ 24h (best effort), containment ≤ 48h, fix ideally ≤ 14d |
| **High** | Vulnerability enabling arbitrary code execution | Acknowledge ≤ 3 business days, fix ideally ≤ 14–21d |
| **Medium** | XSS or content injection on docs site | Acknowledge ≤ 5 business days, fix in next release cycle |
| **Low** | Minor issue with limited risk | Acknowledge ≤ 7 business days, fix as scheduled |

**Note:** Timelines represent good-faith targets for a small volunteer core team, not hard SLAs. The maintainers will always prioritize public safety and transparency, even if timing varies.

---

## 6. Public disclosure principles

Bootstrap follows a responsible disclosure approach:

- Work privately with reporters and affected parties before publishing details.
- Never name reporters without consent.
- Coordinate embargo periods with downstream consumers when needed.
- Publish advisories only after patches or mitigations are available.

---

## 7. Communication Channels

| Purpose | Channel |
|----------|----------|
| Private reporting | Email address in [`SECURITY.md`](./SECURITY.md) or GitHub advisory form |
| General updates | [blog.getbootstrap.com/](https://blog.getbootstrap.com/) blog |
| Security advisories | GitHub Security Advisory dashboard |
| Social alerts | [@getbootstrap](https://x.com/getbootstrap) |
| GitHub discussion alerts | [github.com/orgs/twbs/discussions](https://github.com/orgs/twbs/discussions) |

---

## 8. Plan Maintenance

This plan is reviewed at least annually or after any major incident. Changes are approved by the Core Team and recorded in Git history.

---

_The Bootstrap maintainers are committed to transparency, user trust, and continuous improvement in our security and response practices._
