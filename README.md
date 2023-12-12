An easy way to manage tag using Commits name for Releases in a project.

## How to use

In your `yml` file, add the following step:

```yml
- name: Tag Creation
  uses: matthieuEv/Github-Action-Tag@v1
  id: tag-creation
```

### Outputs

| Name | Description | --- |
| --- | --- | --- |
| `steps.tag-creation.outputs.makeRelease` | A Bool if the commit ask for a release | Needed for the `if` |
| `steps.tag-creation.outputs.commitName` | The name of the commit |  |
| `steps.tag-creation.outputs.newVersion` | The name of the new version |  |

#### Example

```yml
- name: Checkout
  uses: actions/checkout@v2

- name: Tag Creation
  uses: matthieuEv/Github-Action-Tag@v1
  id: tag-creation

- name: Set up JDK 17
  if: steps.tag-creation.outputs.makeRelease
  uses: actions/setup-java@v2
  with:
    java-version: '17'
    distribution: 'adopt'
```
Here, the step `Set up JDK 17` will be executed only if the commit ask for a release.

## How it works

The action will check the commit name and if it contains a certain patern, it will create a new tag with the new version.

### Commit name patern

| Patern | Description | Increase |
| --- | --- | --- |
| `patch: <your commit>` | Increase the patch version | `v0.0.1` |
| `minor: <your commit>` | Increase the minor version | `v0.1.0` |
| `major: <your commit>` | Increase the major version | `v1.0.0` |

#### Example

If the last tag is `v1.0.0` and the commit name is `patch: Fixing a bug`, the new tag will be `v1.0.1`.

If there was no tag before, the new tag will be `v0.0.0` and by making a commit with the name `major: New feature`, the new tag will be `v1.0.0`.

## License

[MIT](./LICENSE)
