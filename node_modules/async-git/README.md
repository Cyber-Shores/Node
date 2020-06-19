# async-git [![](https://img.shields.io/npm/v/async-git.svg)](https://www.npmjs.com/package/async-git)

## 👾 Retrieve data from current git repository

[![](https://github.com/omrilotan/paraphrase/workflows/Publish/badge.svg)](https://github.com/omrilotan/paraphrase/actions) [![](https://img.shields.io/badge/source--000000.svg?logo=github&style=social)](https://github.com/omrilotan/async-git)

\* Getter properties are async (getters) [more on async properties](https://dev.to/omrilotan/javascript-apis-with-async-properties-5ag7)

```js
const git = require('async-git');

`${await git.author} committed ${await git.message}` // Omri committed Some changes
```

## Getters

| Property | Type | Description | Example
| - | - | - | -
| `author` | string | Author name of the last commit | `await git.author`
| `body` | string | Most recent commit message body | `await git.body`
| `branch` | string | Current branch name | `await git.branch`
| `changed` | string[] | List of files changed in last commit | `await git.changed`
| `comitter` | string | Comitter name of the last commit | `await git.comitter`
| `date` | Date | Date of the last change | `await git.date`
| `email` | string | Author email of the last commit | `await git.email`
| `message` | string | Most recent commit full message (subject and body) | `await git.message`
| `name` | string | Project name | `await git.name`
| `origin` | string | Remote origin URL | `await git.origin`
| `owner` | string | Remote repository owner | `await git.owner`
| `sha` | string | Unique identifier of the last commit | `await git.sha`
| `short` | string | 7 Character Unique identifier of the last commit | `await git.short`
| `staged` | string[] | List of staged files | `await git.staged`
| `subject` | string | Most recent commit subject | `await git.subject`
| `tags` | string[] | List of tags | `await git.tags`
| `unadded` | string[] | List of files that would be added or removed by 'git add' | `await git.unadded`
| `unstaged` | string[] | List of unstaged files | `await git.unstaged`
| `untracked` | string[] | List of untracked files | `await git.untracked`
| `version` | string | Get git version (semver) | `await git.version`

## Functions

### `modified`
Get the last modified date of a file
```js
await modified('./index.js')
```

| Argument | Return value
| - | -
| `{string}` Path to file | `{Date}` Last modified date

### `reset`
Reset current HEAD to the specified destination
```js
await git.reset(1) // reset number of commit back
await git.reset('f5db755') // reset to specific SHA ID
```

| Argument | Return value
| - | -
| `{string\|number}` State ID | `{void}` nothing

### `tag`
Create a tag using the last commit message
```js
await git.tag('1.2.3')
```

| Argument | Return value
| - | -
| `{string}` Version | `{void}` nothing
