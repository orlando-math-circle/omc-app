---
title: "Install & Setup"
description: Tools and setting them up for developing the application.
category: Development
position: 1
items:
  - Node.js
  - Git
  - Visual Studio Code
  - Insomnia
  - Docker
  - Datagrip
---

These are the recommended setup procedures for setting up your computer with the tools used for developing the website. This documentation is written to be opinionated to maintain a consistent experience. Experienced users may find it more comfortable to utilize tools they are more comfortable or familiar with.

This guide will go over the following tools:

<list :items="items"></list>

If you are on Windows, take a look at the [Linux on Windows](/dev/wsl) section if you are interested in an alternative installation method using Linux.

<alert>

It's recommended to tell your computer to show `File name extensions`. Windows does not show them by default, and can be toggled by clicking on the `View` menu in Explorer and look for the checkboxes near the right.

</alert>

## Node.js

The frontend and backend both utilize Node.js version 14 at the time of writing this. If you are reading this guide in the future, the website may have transitioned to a higher major version of Node, so check with the current developers. A different first number in the version of Node means breaking changes, so be sure not to use an incompatible version.

### Installing Node.js on Windows

For Windows users, simply visit the [Node.js](https://nodejs.org/en/) website and download the latest `14.X` version of node and click through the installer.

### Installing Node.js on Linux, Mac, or WSL

If you are not using a Windows machine, or are using the [Windows Subsystem for Linux](/dev/wsl) there is a highly recommended tool for managing your Node version called the [Node Version Manager](https://github.com/nvm-sh/nvm).

Visit the [Install & Update Script](https://github.com/nvm-sh/nvm#install--update-script) section of the NVM documentation and run either of the commands in your terminal. If you don't know if you have `curl` or `wget` you can test either in your terminal, though you likely have both. Once the installation finishes you can run `nvm --help` to view all of the commands.

To install Node you can use the following command.

```sh
nvm install 14
```

Once it finishes you should be able to see your default Node version set to 14 with the `list` command.

```
nvm list
```

You can use `nvm install 14` again to update the minor versions of Node, as well as view the other commands in the help menu for changing your default and removing old versions.

### Ensuring Node is Working

To test that the installation was successful you should be able to open PowerShell or Command Prompt and receive a version for **both** of the following commands. If these commands don't work, restarting your computer will likely fix it.

```sh
node -v
```

The version of NPM displayed is unimportant.

```sh
npm -v
```

You can now use Node.js on your computer. You can test the functionality through the Node [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) by running the command `node` with no arguments and then testing out commands like console printing.

```js
const name = "John";
console.log(`My name is ${name}`);
```

You can alternatively put these commands in a file with the `.js` extension and run it.
For example an `index.js` file with `node index.js` assuming you first navigate your terminal to the appropriate folder.

Running this commands in the REPL will print the return value of the every statement you input, so the first line of the above example should print `undefined`, and the second should print `My name is John` followed by `undefined`. However, if you just enter `name`, it should print only `John`.

## Git

This application is stored on GitHub in the spirit of open, extensible software, and as an educational tool for OMC. GitHub can be operated using GUIs, or graphical clients that allow you to manage project changes, however it's recommended to learn the command-line version of Git. Git is not as intuitive as other pieces of software, but Visual Studio Code provides some GUI-based functionality making pulling and pushing changes easy.

<alert>

A more in-depth tutorial on GitHub, GitHub Actions, and GitHub related aspects of the project will be added at a later time.

</alert>

### Installing Git on Windows

Visit the [Git](https://git-scm.com/download/win) website and download the appropriate version of Git for your system. They don't make 32bit processors anymore, but if you're running on exceptionally old hardware you may need to double check.

The installation will ask you a lot of questions, however you can hit next to accept all of the defaults. If you don't know what an option means, it's better to reinstall git knowing why you need to change the option than to be confused why something isn't working in the first place.

Opening PowerShell or a Command Prompt window and typing the following should show a version.

```ps
git --version
```

If an error appears saying the command is not found, you likely need to restart your computer.

### Installing Git on Linux, Max, or WSL

The Unix family of operating systems often come with Git installed. To test this, use the following command.

```sh
git --version
```

If git is not found, the installation may differ slightly based on your operating system. It's recommended to research the most appropriate installation guide for your OS version. Once you have it installed, ensure it is working with the above command.

### Basic Git Commands

#### Cloning a Repository

Obtaining a repository is the first major command for git. Visit a GitHub page and find the obvious green **Code** button. Then, click on the symbol to the right of the text field containing the repository url to copy it, and then run the following command.

<img src="./images/checkout.png" />

```sh
git clone https://github.com/duckies/omc-app.git <folder>
```

You can optionally specify the name of a folder after the url if you don't want the folder to be the name of the repository.

#### Managing Branches

Often the best way to have multiple people work on a project is to create a branch for each feature. It is named adequately for its functionality, it allows you to branch off of the main path to make changes in an isolated environment. You can at a later point merge the changes into the main branch or rebase them.

- Merging is like merging on the highway, all of the changes are put where the merge takes place all at once.
- Rebasing is like slamming both roads together and pretending they were never apart. You lose history doing this and it's possible to muck up the main branch history if you do this improperly.
- Squashing, compatible with both, is the idea of merging all commits (changes) of a branch into a single commit before doing a merge or rebase. It's also aesthetically pleasing.

This allows for work to be done on that individual feature without muddying up the main branch until the feature is complete. This is especially true if the new feature requires major changes. At all times the master branch should reflect the current production system, unless you have a separate production branch or utilize some versioning scheme.

- Check for the current list of branches with `git branch` (and hit q to get out of this oppressive window).
- Switch to a branch with `git switch <branch>`.
- Create a non-existant branch with `git switch -c <branch>`.
- Delete a branch locally with `git branch -d <branch>` and remotely (on GitHub) with `git push origin --delete <branch>`.

#### Making a Commit

Before talking about committing files, it's worth mentioning not all files are tracked. The most obvious exclusion being the `node_modules` folder. You can view the `.gitignore` file at the root of any repository to review any files that are not meant to be committed. Another major file is any `.env` file, as those files contain secret tokens that should never be exposed online.

Whenever a change is made, git will track these changes and allow you to specify which files you want to commit with the `git add <file>` command. If you want to commit all changes you can use `git add .`, or add the `-a` argument before a commit, e.g. `git commit -a -m "my message"`.

As shown in the last command example a commit is done with a `git commit` command. If you use the `-m` argument it will let you enter a summary in quotes as the following argument, otherwise it will open an editor to allow you to put in a message. As a golden rule, it's not recommended to make a summary longer than 50 characters using the `-m` argument or in the first line of the commit message editor (they're both the same line). The use of the full-fledged editor is that you can make a space after the summary message and enter more information, with the recommended max length of that line being 72 characters. These recommendations are largely because longer messages wrap or become obscured when viewed.

#### Synchronizing Changes

- The `git status` command is used to check the current status of any modifications.
- You can use `git fetch` to check if there are any remote changes. It doesn't actually modify any code, so you can do this often.
- However, `git pull` will fetch changes and integrate it into the code, this may lead to conflicts you have to manually resolve on files with modifications.
- Once you have made your changes and your repository is up-to-date, you can push new changes with `git push`.

There are many more aspects to git, but largely these are manged through the GitHub interface, e.g. merging, squashing, or rebasing.

## Visual Studio Code

For the most part, picking an IDE is a personal experience, and there are pros and cons to some. For example, some developers prefer a more minimalistic approach to coding through the use of editors like **Vim**, **Sublime Text**, or **Notepad++**. While these editors have extensions, they largely only support code highlighting. When learning a language it may be beneficial, if not required by teachers, to use these kinds of editors since it's easier to learn when the IDE isn't making suggestions for you.

In the age of hyper-extensible IDEs, the two most popular are **Atom** and **Visual Studio Code**, at least for Node.js development. We consider it a requirement to use VSCode due to an extension that provides support for **Vue** language files that make up all of the frontend components. There are experimental tools for other editors like Atom, but we cannot affirm how well they work. Similarly, this recommendation is made for consistency: certain extensions provide support for linting, or essentially automated code checking for stylistic errors and poor coding practices, and code formatting. Both features together enforce a style that all code will adhere to regardless of who is editing it, so long as their IDE supports the proper extensions.

### Installation

Installing VSCode can be done by downloading the installer from [their website](https://code.visualstudio.com/).

### Extensions

The following are recommended, borderline required, extensions you should download. If you are in WSL, ensure you are in a Linux version of VSCode before installing extensions as you will have to reinstall them if you are not.

To find the extension list, click on the tetris-esque squares on the left of the editor.

#### ESLint

ESLint is the linter used by our project and should be installed and enabled at all times. It will ensure stylistic consistency and prevent minor programming errors.

#### Prettier

Prettier is an opinionated code formatter that will assist in cleaning up code. Manual formatting can be done using `Shift + Alt + F` or by right clicking an open file and finding `Format Document`.

For streamlined usage, you can also tell Prettier to format every time you save a file. You can enable this in the settings UI by opening the command prompt using `CTRL + Shift + P` and typing in _settings_ until you see `Preferences: Open Settings (UI)`. Then in the search bar type in `format on save` and enable the option.

#### Vetur

This extension is required for VSCode to understand Vue files. There are special requirements for getting this extension to work, so further information on it will be covered in the frontend sections.

#### Optional Extensions

These are a few useful extensions but are not required.

- DotENV: Env files are secret-holding files that are not normally formatted in VSCode, this extension gives them syntax highlighting.
- Project Manager: This extension allows you to save and open different projects from within VSCode instead of having to open VSCode externally.
- Remote - SSH: This extension is included in the Remote Development pack if you followed the WSL guide, but this extension allows you to SSH into another machine and edit code remotely.
- npm: A simple extension that gives you some easier tools for working with NPM in the command prompt.
- Docker: Useful if you end up utilizing the below Docker system.
- Power Mode: Makes your coding experience a lot more sparkly.

## Insomnia

When working with an API, you need a means of testing the endpoints. If you have worked with APIs before you may have used **Postman**, a highly popular API tool. If you are comfortable with Postman, there is no need to use Insomnia, however Postman has become increasingly complex and company-driven and is a lot more bloated by default.

To install Insomnia, simply visit the [Insomnia](https://insomnia.rest/) website and download **Insomnia Core**. Insomnia Designer is... _something else_. Explanation on Insomnia is covered in another section.

## Docker

<alert type="warning">Incomplete</alert>

## Datagrip

<alert type="warning">Incomplete</alert>
