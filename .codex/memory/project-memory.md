## 2026-09-14 - GitHub Pages release path
Type: Convention
Scope: workflow
Note: GitHub Pages serves this repository from /phaser-4-platformer-demo/; Vite must set that base path so built assets do not resolve from the account root. Pages must be enabled once through a user-authorized GitHub API call because the workflow token cannot create a missing Pages site. After the site exists, Deploy live demo can publish it.
Source: verified release and mobile browser QA
