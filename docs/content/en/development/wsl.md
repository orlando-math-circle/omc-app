---
title: "Linux on Windows"
description: The alternative approach to installing Node.js on Windows using WSL.
category: Development
position: 3
---

<alert type="warning">

Out of an abundance of caution, it's recommended to [create a system restore point](https://support.microsoft.com/en-us/help/4027538/windows-create-a-system-restore-point) before installing WSL.

</alert>

For Windows users it's worth considering the Windows Subsystem for Linux (WSL) for your development experience. The OMC application will be running in a Linux production environment meaning some procedures may need to be different for Windows machines. The guides will attempt to be thorough, but some Windows-only workarounds may be overlooked. It can be said with complete confidence that Windows will support all of the features discussed, but some occasional weirdness may need to be rectified using a quick Google search.

If you are not familiar with Linux, WSL is also a great way of learning this essential skill.

The Windows Subsystem for Linux comes in two flavors, WSL v1 or WSL v2. Unless some installation issue is encountered, it's recommended to install WSL v2 as it simplifies the Docker installation.

<alert type="warning">

Manipulating files that reside within WSL from Windows, or vice versa, have significant performance drawbacks. Similarly, some of the development tools are setup to detect changes in code and automatically re-compile. If you run code that is in Windows, e.g. on your desktop, from a WSL 2 Linux terminal, it will be unable to detect file changes and lead to confusing issues. It's recommended if you use WSL you also use Git for WSL, the VSCode WSL extension, and keep your files in the WSL home directory.

</alert>

## Installation

Refer to the [Windows Subsystem for Linux Installation Guide for Windows 10](https://docs.microsoft.com/en-us/windows/wsl/install-win10) for the installation. The link also refers to tutorials, FAQs, and some basic troubleshooting tips. Most issues encountered are likely due to Virtualization needing to be enabled (or in some cases, disabled) on your machine.

When you reach the [Install your Linux distribution of choice](https://docs.microsoft.com/en-us/windows/wsl/install-win10#install-your-linux-distribution-of-choice) part of the above guide, it's recommended to install the latest version of Ubuntu. You can install either `Ubuntu 20.04`, which is the latest as of writing this guide, or the generic `Ubuntu` item from the store. The latter will always update to the latest LTS release of Ubuntu for you.

## Basic Usability

This guide is not going to cover Linux, as we'd have no time to actually work on the project. I recommend the [Basic Linux Commands for Beginners](https://maker.pro/linux/tutorial/basic-linux-commands-for-beginners) article by Alok Naushad for a succinct introduction to Linux. However, there are some commands that are unique to WSL.

From a PowerShell or Command Prompt terminal in Windows you can manipulate and list your Linux distros with the `wsl --help` command, if you type only `wsl` it will open your default distro.

### Viewing Linux files in Explorer

It's possible to view the Linux directories from within Explorer. Within your Linux terminal, you can run the following command. The `.` being the current directory; the command works similarly to the `cd` command, only that it opens Explorer.

```
explorer.exe .
```

You can also double click on the address bar of explorer and type in `\\wsl$` and your active distros will be shown as network folders you can interact with. Keep in mind, as was warned above, manipulating files in this manner is not ideal and should only be done occasionally.

## Visual Studio Code

<alert type="danger">

If you wish to keep your code within WSL, this extension is required! As mentioned above, application will not start correctly if you keep the code in one operating system and run it from another.

</alert>

VSCode has an extension called [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) that allows you to run VSCode from within WSL itself. This has benefits of using your Linux terminal, commands, and Git installation. Once you have the extension installed you can use a command similar to the `explorer.exe` command to open up code.

```
code .
```

<img src="https://microsoft.github.io/vscode-remote-release/images/remote-wsl-open-code.gif" />

## Other Terminals

When you aren't in your IDE you may want to use a different terminal than the one provided by your Distro. The two I recommend are the [Windows Terminal](https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701?activetab=pivot:overviewtab), and [Hyper](https://hyper.is/).

The Windows Terminal supports easily switching between PowerShell, Command Prompt, and your Linux Distros in a sleek interface whereas the Hyper terminal is more theme-friendly.

<video controls="controls">
  <source src="./videos/terminal.webm" type="video/webm">
</video>

[^1]: Hyper terminal running a compiler for documentation.
