#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import git from "simple-git";
import path from "path";
import fs from "fs";

const questions = [
  {
    name: "directoryName",
    message: "Enter directory name for your project:",
    type: "input",
    default: function (answers) {
      return answers.template;
    },
    validate: function (input) {
      if (input.trim() === "") {
        return "Directory name cannot be empty";
      }
      if (fs.existsSync(input)) {
        return `Directory '${input}' already exists. Please choose another name.`;
      }
      return true;
    },
  },
  {
    name: "template",
    message: "Select a template:",
    type: "list",
    choices: ["vite-react", "vite-svelte", "nextjs", "svelte-kit"],
  },
];

inquirer.prompt(questions).then(async (answers) => {
  switch (answers.template) {
    case "svelte-kit":
      console.log("Option not implemented yet");
      break;
    default:
      cloneRepo(`${answers.template}-template`, answers.directoryName);
  }
});

async function cloneRepo(tmp, targetDir) {
  const REPO_URL = `https://github.com/McSoud/${tmp}.git`;
  try {
    if (fs.existsSync(targetDir)) {
      console.log(chalk.red(`Error: Directory '${targetDir}' already exists!`));
      return;
    }

    console.log(chalk.yellow(`Cloning repository into ${targetDir}...`));

    await git().clone(REPO_URL, targetDir);

    const gitDir = path.join(targetDir, ".git");
    if (fs.existsSync(gitDir)) {
      fs.rmSync(gitDir, { recursive: true, force: true });
    }

    console.log(
      chalk.green(`✓ Repository successfully cloned into '${targetDir}'!`)
    );
  } catch (error) {
    console.log(chalk.red("Error cloning repository:"), error.message);
  }
}
