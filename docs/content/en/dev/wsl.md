---
title: "Linux on Windows"
description: The alternative approach to installing Node.js on Windows using WSL.
category: Development
position: 3
---

<alert type="warning">
WSL 2 uses Hyper-V, a Microsoft virtualization feature only available on Windows 10 Pro, Enterprise, or Education. Hyper-V may also conflict with other types of virtualization, e.g. VirtualBox.
</alert>

If you are running Windows, it's worth considering the Windows Subsystem for Linux (WSL) for your development experience. The OMC application will be running in a linux production environment meaning some procedures may need to be different for Windows machines. This is not required by any means, but if you are not familiar with Linux it is the least painful way of learning an essential tool.

WSL 1 is slower than WSL 2, but WSL 2 will require Hyper-V enabled and that you keep files in your Linux directories. Manipulating files that reside within WSL in Windows, or vice versa, have a significant performance drawback. Similarly, some of the development tools are setup to detect changes in code and automatically re-compile. If you run code that is in Windows, e.g. on your desktop, from a WSL 2 Linux terminal, it will be unable to detect file changes and lead to confusing issues.

## Installation

Refer to the [Windows Subsystem for Linux Installation Guide for Windows 10](https://docs.microsoft.com/en-us/windows/wsl/install-win10) as the most up-to-date installation guide. The link also refers to tutorials, FAQs, and some basic troubleshooting tips. Most errors that are possible are likely due to computer-specific issues of V

When you reach the [Install your Linux distribution of choice](https://docs.microsoft.com/en-us/windows/wsl/install-win10#install-your-linux-distribution-of-choice) part of the above guide, it's recommended to install the latest version of Ubuntu.

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
