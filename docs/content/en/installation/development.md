---
title: Development
description: Setup procedures for downloading and installing the application and associated tools in a development environment.
category: Installation
position: 2
tools:
  - Node.js
  - Git
  - Visual Studio Code
  - Insomnia
  - Docker
  - Datagrip
---

These are the recommended procedures for setting up a development environment for working on the application. This documentation is written to be verbose and opinionated to maintain a consistent experience and for inexperienced users. Some may find it more comfortable to utilize tools they are more comfortable or familiar and still be appropriate.

This guide will go over the following tools:

<list :items="tools"></list>

If you are on Windows, take a look at the [Linux on Windows](/development/wsl) section if you are interested in utilizing a Linux terminal within Windows.

<alert>

It's recommended to tell your computer to show `File name extensions`. Windows does not show them by default, and can be toggled by clicking on the `View` menu in Explorer and look for the checkboxes near the right.

</alert>

## Node.js

The frontend and backend both utilize Node.js version `14` at the time of writing this. If you are reading this guide in the future, the website may have transitioned to a higher major version of Node, so check with the current developers. A different first number in the version of Node means breaking changes, so be sure not to use an incompatible version.

### Windows

For Windows users, simply visit the [Node.js](https://nodejs.org/en/) website and download the latest `14.X` version of node and click through the installer.

### Linux, Mac, or WSL

If you are not using a Windows machine, or are using the [Windows Subsystem for Linux](/development/wsl) there is a highly recommended tool for managing your Node version called the [Node Version Manager](https://github.com/nvm-sh/nvm).

Visit the [Install & Update Script](https://github.com/nvm-sh/nvm#install--update-script) section of the NVM documentation and run either of the commands in your terminal. If you don't know if you have `curl` or `wget` you can test either in your terminal, though you likely have both. Once the installation is complete, restart your terminal and you should then be able to run `nvm --help` to view all of the commands.

To install Node you can use the following command.

```sh
nvm install 14
```

Once it finishes you should be able to see your default Node version set to 14 with the `list` command.

```
nvm list
```

You can use `nvm install 14` again to update the minor versions of Node, as well as view the other commands in the help menu for changing your default and removing old versions.

### Testing Node

To test that the installation was successful you should be able to open a terminal and receive a version for **both** of the following commands. If these commands don't work, restarting your computer will likely fix it.

```sh
node -v
```

The version of NPM displayed is unimportant.

```sh
npm -v
```

In order to test out Node, you can create any file with a `.js` extension, for example `index.js` and type some code like the example below into it. Once the file is saved, open a terminal and navigate to the same folder containing the `.js` file and run `node <file-name>.js`, e.g. `node index.js`. You should see your output.

```js[index.js]
const name = "John";
console.log(`My name is ${name}`);
```

## Git

This application is stored on GitHub in the spirit of open and extensible software. GitHub can be operated graphically, e.g. using [GitHub Desktop](https://desktop.github.com/), however it's recommended to utilize a standard git installation.

Visual Studio Code will read information from Git and make available to you who recently changed the code you're looking at, let you create and manage commits and branches, and easily sync changes.

### Windows

Visit the [Git](https://git-scm.com/download/win) website and download the appropriate version of Git for your system. If your hardware is old enough to be 32-bit then a lot of the software here may be incompatible or too resource intensive.

The installation will ask you a lot of questions, however you may accept the defaults. If you don't know what an option means, it's better to reinstall git knowing why you need to change the option than to be confused why something isn't working in the first place.

Opening PowerShell or a Command Prompt window and typing the following should show a version.

```ps
git --version
```

If an error appears saying the command is not found, you likely need to restart your computer.

### Linux, Mac, or WSL

The Unix family of operating systems often come with Git installed. To test this, use the following command.

```sh
git --version
```

If git is not found, the installation may differ slightly based on your operating system. It's recommended to research the most appropriate installation guide for your OS version. Once you have it installed, ensure it is working with the above command.

### Basic Git Commands

This section goes over basic Git commands and are not specific to the project. A better guide may be [git - the simple guide](https://rogerdudler.github.io/git-guide/) by Roger Dudler. It's also not required by any means, but I recommend the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) convention for writing commit messages. Our team did not follow it all that well, but it is simple to follow if you are unsure what to write and is a popular standard.

#### Cloning a Repository

Obtaining a repository is the first major command for git. Visit a GitHub page and find the obvious green **Code** button. Then, click on the symbol to the right of the text field containing the repository url to copy it, and then run the following command.

<img src="./images/checkout.png" />

```sh
git clone https://github.com/duckies/omc-app.git <folder>
```

You can optionally specify the name of a folder after the url if you don't want the folder to be the name of the repository.

Note that Git will ask you for your password every time you commit changes using the `HTTPS` method. At the time of writing this, entering your GitHub password is considered deprecated. It is recommended to use the `SSH` method and [adding an SSH key to GitHub](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/working-with-ssh-key-passphrases) which has the benefit of never asking you for a password. Also see [Which remote URL should I use?](https://docs.github.com/en/free-pro-team@latest/github/using-git/which-remote-url-should-i-use#cloning-with-ssh-urls) that describes these methods and more.

#### Managing Branches

Often the best way to have multiple people work on a project is to create a branch for each feature. It is named in a way that succinctly describes what it does; it allows you to branch off of the main path to make changes in an isolated environment. You can at a later point merge the changes into the main branch or rebase them.

- Merging is like merging on the highway, all of the changes are put where the merge takes place all at once.
- Rebasing is like slamming both roads together and pretending they were never apart. You lose history doing this and it's possible to muck up the main branch history if you do this improperly.
- Squashing, compatible with both, is the idea of merging all commits (changes) of a branch into a single commit before doing a merge or rebase. This is a great feature as there may be many commits to a branch and merging or rebasing them can make the history confusing or bloated.

This allows for work to be done on that individual feature without muddying up the main branch until the feature is complete. This is especially true if the new feature requires major changes. At all times the master branch should reflect the current production system, unless you have a separate production branch or utilize some versioning scheme.

- Check for the current list of branches with `git branch` (and hit q to get out of this oppressive window).
- Switch to a branch with `git switch <branch>`.
- Create a non-existant branch with `git switch -c <branch>`.
- Delete a branch locally with `git branch -d <branch>` and remotely (on GitHub) with `git push origin --delete <branch>`. It will ask for your GitHub credentials whenever you try to modify a repository online.

#### Making a Commit

Before talking about committing files, it's worth mentioning not all files are tracked. The most obvious exclusion being the `node_modules` folder. You can view the `.gitignore` file at the root of any repository to review any files that are not meant to be committed. Another major file is any `.env` file, as those files contain secret tokens that should never be exposed online.

Whenever a change is made, git will track these changes and allow you to specify which files you want to commit with the `git add <file>` command. If you want to commit all changes you can use `git add .`, or add the `-a` argument before a commit, e.g. `git commit -a -m "my message"`.

As shown in the last command example a commit is done with a `git commit` command. If you use the `-m` argument it will let you enter a summary in quotes as the following argument, otherwise it will open an editor to allow you to put in a message. As a golden rule, it's not recommended to make a summary longer than 50 characters using the `-m` argument or in the first line of the commit message editor (they're both the same line). The purpose of the full-fledged editor is so you can make a space after the summary message and enter more information, with the recommended max length of that line being 72 characters. These recommendations are largely because longer messages wrap or become obscured when viewed.

#### Synchronizing Changes

- The `git status` command is used to check the current status of any modifications.
- You can use `git fetch` to check if there are any remote changes. It doesn't actually modify any code, so you can do this often.
- However, `git pull` will fetch changes and integrate it into the code, this may lead to conflicts you have to manually resolve on files with modifications.
- Once you have made your changes and your repository is up-to-date, you can push new changes with `git push`.

There are many more aspects to git, but largely these are manged through the GitHub interface, e.g. merging, squashing, or rebasing.

## Visual Studio Code

For the most part, picking an IDE is a personal experience, and there are pros and cons to some. For example, some developers prefer a more minimalistic approach to coding through the use of editors like **Vim**, **Sublime Text**, or **Notepad++**. While these editors have extensions, they largely only support code highlighting. When learning a language it may be beneficial, if not required by teachers, to use these kinds of editors since it's easier to learn when the IDE isn't making suggestions for you.

The most popular editor for Node.js development is **Visual Studio Code**. We consider it a requirement to use VSCode due to an extension that provides support for **Vue** language files that make up all of the frontend components. There are experimental tools for other editors like Atom, but we cannot affirm how well they work. Similarly, this recommendation is made for consistency: certain extensions provide support for linting, or essentially automated code checking for stylistic errors and poor coding practices, and code formatting. Both features together enforce a style that all code will adhere to regardless of who is editing it, so long as their IDE supports the proper extensions.

### Installation

Installing VSCode can be done by downloading the installer from [their website](https://code.visualstudio.com/).

### Extensions

The following are the required extensions you should download. If you are in WSL, ensure you are in a Linux version of VSCode before installing extensions as you will have to reinstall them if you are not.

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

<img src="images/development/insomnia.png" />

## Docker

Docker is a developmental tool that containerizes software. You may have installed some software in the past that required some dependency you had to run around to find. Then maybe the version you installed was wrong, or some other software you wanted needs a different version of the same dependency. Software has to fight with the other software on your operating system and is often a huge hassle to transport to other systems. Containers solve this problem.

Containers are packages with the exact dependencies and libraries that software needs and nothing else. Since these containers are isolated from your operating system and each other, they will never cause conflicts. You may also be familiar with virtual machines and wondering if they're similarly slow. As shown in the below image from the [What is a container?](https://www.docker.com/resources/what-container) part of Docker's website, VMs have to simulate all of the hardware whereas a container only needs to simulate operating system functions. In terms of overall performance, since they share the OS kernel the performance cost of using Docker is negligable outside of services which require bleeding-edge performance.

<img src="images/development/docker.png" />

Docker allows us to deploy Postgres, NGINX, and Redis in seconds. It is not a requirement to use docker to work on smaller sections of the website, but the website will not start unless it has access to Postgres and Redis. You are welcome to source these elsewhere and manually configure the website locally to use these connections.

## Windows

<alert>

You will need to know what edition of Windows you have: Home, Pro, Enterprise, or Education. You can find out how to determine this [here](https://support.microsoft.com/en-us/help/13443/windows-which-version-am-i-running).

</alert>

Docker has a few different installation methods on Windows. Docker utilizes the same low-level virtualization that WSL does, with the newest versions of Docker exclusively relying on the technology.

1. If you are using WSL, install [Docker Desktop with the WSL 2 backend](https://docs.docker.com/docker-for-windows/wsl/).
2. If you are on Windows 10 Enterprise, Pro, or Education you can install [Docker Desktop](https://docs.docker.com/docker-for-windows/install/).
3. If you are on Windows 10 Home and are _not_ using WSL, you will need to install the [Legacy Docker Toolbox](https://docs.docker.com/toolbox/toolbox_install_windows/). Some high schools and most colleges give students a free educational Windows 10 license if you are interested in upgrading your Windows version.

### Linux, Mac, or WSL

Mac users can install [Docker Desktop on Mac](https://docs.docker.com/docker-for-mac/install/).

Linux users can find their version of linux and install the [Docker Engine](https://docs.docker.com/engine/install/). Docker Compose notably does not come with Docker Engine, learn to [Install Docker Compose](https://docs.docker.com/compose/install/).

It's worth noting if you are using WSL, I would recommend using Docker Desktop with the WSL interface and not utilize the engine.

### Verifying Installation

You can quickly verify of Docker is installed on your computer with the following commands.

```
docker --version
```

Docker compose is not necessary but is useful. If it was not found you may need to install it separately.

```
docker-compose --version
```

Windows, WSL, and Mac users should be aware that Docker is an application that runs in the taskbar. It will need to be running for Docker to function properly. It's also recommended to disable the feature that has it start with Windows, as that is a bit annoying!

## Datagrip

One issue with understanding databases is that the way they work can often be obscured by other things like ORMs (Object Relational Mapping) which converts the table structures of databases into the native structures of the language you're using. For example, this website will be using [MikroORM](https://mikro-orm.io/). It lets you query the database and you get back JavaScript objects instead of tables making them easier to work with.

If you want to view the database, manually input data, tweak things, or learn SQL, it's recommended to install [JetBrains DataGrip](https://www.jetbrains.com/datagrip/). This is not normally free software, howwever students can apply to use it for free at the [JetBrains Products for Learning](https://www.jetbrains.com/shop/eform/students). As a sidenote, if you do not already have the [GitHub Student Developer Pack](https://education.github.com/pack), it's highly recommended! Probably thousands of dollars in free services, discounts, software, tutorials, and more. If you wish to learn how to store data in applications without having to learn the boring complexities of SQL, I recommend looking into a NoSQL database such as [MongoDB](https://www.mongodb.com/) for your projects.

<alert type="warning">

If you are under the age of 18 please have a parent or guardian assist you in applying for a student license. You should not upload school documents containing your personal information without parental approval.

</alert>

<img src="images/development/query-console.png"></img>
