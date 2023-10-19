const core = require("@actions/core");
const github = require("@actions/github");
const exec = require("@actions/exec");
const io = require("@actions/io");
const git = require("simple-git");

async function run() {
  try {
    let commitName;
    await exec.exec("git log -1 --pretty=format:%s", [], {
      listeners: {
        stdout: (data) => {
          commitName = data.toString().trim();
        },
      },
    });

    console.log(`\n\n📝 Commit name ➜ ${commitName}`);

    // Get the previous tag
    const gitRepo = git();
    await exec.exec("git fetch --tags");

    const tags = await gitRepo.tags();
    console.log('Tags: ', tags);
    console.log('Latest: ', tags.latest);

    previousTag = tags.latest || "0.0.0";
    console.log(`\n🏷️ Latest tag found ➜ ${tags.latest}`);

    // Get the previous version and split it into major, minor, and patch
    const previousVersion = previousTag.replace('v', '').split(".").map(Number);
    let [major, minor, patch] = previousVersion;

    // Determine the increment based on the commit name
    let incrementType = "";
    if (commitName.startsWith("fix:")) {
      patch += 1; // Increment patch
      incrementType = "patch";
    } else if (commitName.startsWith("feat:")) {
      minor += 1; // Increment minor and reset patch to 0
      patch = 0;
      incrementType = "minor";
    } else if (commitName.startsWith("BREAKING CHANGE:")) {
      major += 1; // Increment major and reset minor and patch to 0
      minor = 0;
      patch = 0;
      incrementType = "major";
    }

    const newVersion = `v${major}.${minor}.${patch}`;


    if (incrementType !== "") {
      console.log(`\n🚀 New version ➜ ${newVersion}`);
      core.setOutput("newVersion", newVersion);
      core.setOutput("makeRelease", true);
      core.setOutput("commitName", commitName);
    } else {
      console.log(
        `\n🛑 No New Version needed`
      );
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
