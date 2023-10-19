const core = require("@actions/core");
const github = require("@actions/github");
const exec = require("@actions/exec");
const io = require("@actions/io");
const git = require("simple-git");

async function run() {
  try {
    // Get the commit name
    let commitName;
    await exec.exec("git log -1 --pretty=format:%s", [], {
      listeners: {
        stdout: (data) => {
          commitName = data.toString().trim();
        },
      },
    });

    console.log(`📝 Commit name: **${commitName}**`);

    // Get the previous tag
    const gitRepo = git();
    const tags = await gitRepo.tags();
    const previousTag = tags.latest || "0.0.0";

    // Get the previous version and split it into major, minor, and patch
    const previousVersion = previousTag.split(".").map(Number);
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
      console.log(`🚀 New version: **${newVersion}**`);
      core.setOutput("newVersion", newVersion);
      core.setOutput("makeRelease", true);
    } else {
      console.log(
        `🛑 No release needed because the commit name is: **${commitName}**`
      );
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
