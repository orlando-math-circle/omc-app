__NUXT_JSONP__("/tools/environment", (function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,_,$,aa,ab,ac,ad,ae,af,ag,ah,ai,aj,ak,al,am,an,ao,ap,aq,ar,as,at,au,av,aw,ax,ay,az,aA,aB,aC,aD,aE,aF,aG,aH,aI,aJ,aK,aL,aM,aN,aO,aP,aQ,aR,aS,aT,aU){return {data:[{document:{slug:"environment",description:"The guide to setting up a local Node.js environment and the recommended development tools and software. Written to be verbose for inexperienced uusers and opinionated to endorse a consistent development environment. There is no harm in using different tools if you are more experienced with them.",title:"Environment",category:L,version:1,tools:["Node.js",E,M,N,F,"Datagrip"],toc:[{id:O,depth:x,text:L},{id:U,depth:x,text:V},{id:W,depth:x,text:X},{id:Y,depth:p,text:G},{id:Z,depth:p,text:_},{id:$,depth:p,text:aa},{id:B,depth:x,text:E},{id:ab,depth:p,text:G},{id:ac,depth:p,text:ad},{id:ae,depth:p,text:af},{id:ag,depth:x,text:M},{id:ah,depth:p,text:ai},{id:P,depth:p,text:aj},{id:ak,depth:p,text:al},{id:am,depth:x,text:N},{id:an,depth:x,text:F},{id:ao,depth:p,text:ap},{id:aq,depth:p,text:ar},{id:as,depth:p,text:at},{id:au,depth:x,text:av}],body:{type:"root",children:[{type:b,tag:n,props:{className:[s,t]},children:[{type:a,value:c},{type:b,tag:y,props:{id:O},children:[{type:b,tag:e,props:{href:"#tools"},children:[{type:a,value:L}]}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:"list",props:{":items":O},children:[{type:a,value:c}]},{type:a,value:c},{type:b,tag:n,props:{className:[s,t]},children:[{type:a,value:c},{type:b,tag:y,props:{id:U},children:[{type:b,tag:e,props:{href:"#preamble"},children:[{type:a,value:V}]}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"The application consists of dual Node.js server environments that will run on any major operating system. Despite that, Windows users may find it cumbersome to use tools such as Git, Docker, and some aspects of Node compared to UNIX operating systems such as macOS or Linux. Windows is supported by all tools discussed, but the guides will be written from an Ubuntu LTS server perspective, so your mileage may vary."}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"A compromise for Windows 10 is the "},{type:b,tag:e,props:{href:"https:\u002F\u002Fdocs.microsoft.com\u002Fen-us\u002Fwindows\u002Fwsl\u002Finstall-win10",rel:[h,i,j],target:k},children:[{type:a,value:"Windows Subsystem for Linux"}]},{type:a,value:" which runs a Linux VM at the kernel level with near-native performance. Visual Studio Code also has an extension for running within the Linux environment on Windows, tying together the Linux file system, terminal, Docker, and Git. Read more in the "},{type:b,tag:aw,props:{to:"\u002Ftools\u002Fwsl"},children:[{type:a,value:"tools guide for WSL"}]},{type:a,value:o}]},{type:a,value:c},{type:b,tag:y,props:{id:W},children:[{type:b,tag:e,props:{href:"#nodejs-environment"},children:[{type:a,value:X}]}]},{type:a,value:c},{type:b,tag:q,props:{id:Y},children:[{type:b,tag:e,props:{href:"#windows"},children:[{type:a,value:G}]}]},{type:a,value:c},{type:b,tag:C,props:{},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:Q},{type:b,tag:e,props:{href:"https:\u002F\u002Fnodejs.org\u002Fen\u002F",rel:[h,i,j],target:k},children:[{type:a,value:"Node.js website"}]},{type:a,value:" to download and install the latest version starting with "},{type:b,tag:f,props:{},children:[{type:a,value:"14.X"}]},{type:a,value:". Higher major versions are likely incompatible."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Once installed ensure that Node.js is correctly in your path environment variables by trying to run it from a terminal. Both the "},{type:b,tag:f,props:{},children:[{type:a,value:"Command Prompt"}]},{type:a,value:ax},{type:b,tag:f,props:{},children:[{type:a,value:"PowerShell"}]},{type:a,value:" will work."}]},{type:a,value:c},{type:b,tag:n,props:{className:[u]},children:[{type:b,tag:v,props:{className:[w,z]},children:[{type:b,tag:f,props:{},children:[{type:a,value:ay}]}]}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"If you do not see version information after running the above command try restarting your terminal, computer, or "},{type:b,tag:e,props:{href:"https:\u002F\u002Fwww.geeksforgeeks.org\u002Fhow-to-resolve-node-is-not-recognized-as-an-internal-or-external-command-error-after-installing-node-js\u002F",rel:[h,i,j],target:k},children:[{type:a,value:"manually configure the environment variables"}]},{type:a,value:o}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:q,props:{id:Z},children:[{type:b,tag:e,props:{href:"#linux-mac-or-wsl"},children:[{type:a,value:_}]}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Utilizing the "},{type:b,tag:f,props:{},children:[{type:a,value:"Node Version Manager"}]},{type:a,value:" script we can quickly manage node from within the terminal."}]},{type:a,value:c},{type:b,tag:C,props:{},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:Q},{type:b,tag:e,props:{href:"https:\u002F\u002Fgithub.com\u002Fnvm-sh\u002Fnvm#install--update-script",rel:[h,i,j],target:k},children:[{type:a,value:"Install & Update Script"}]},{type:a,value:" section of the NVM documentation and run either of the commands in your terminal to install the script."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Restart your terminal to now have the commands available and then check that it is installed with the help command."}]},{type:a,value:c},{type:b,tag:n,props:{className:[u]},children:[{type:b,tag:v,props:{className:[w,z]},children:[{type:b,tag:f,props:{},children:[{type:a,value:"nvm --help\n"}]}]}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Install the latest version of Node.js version "},{type:b,tag:f,props:{},children:[{type:a,value:az}]},{type:a,value:o}]},{type:a,value:c},{type:b,tag:n,props:{className:[u]},children:[{type:b,tag:v,props:{className:[w,z]},children:[{type:b,tag:f,props:{},children:[{type:a,value:"nvm "},{type:b,tag:l,props:{className:[m,H]},children:[{type:a,value:"install"}]},{type:a,value:aA},{type:b,tag:l,props:{className:[m,"number"]},children:[{type:a,value:az}]},{type:a,value:c}]}]}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:C,props:{start:5},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Test that node is working by trying to find its version."}]},{type:a,value:c},{type:b,tag:n,props:{className:[u]},children:[{type:b,tag:v,props:{className:[w,z]},children:[{type:b,tag:f,props:{},children:[{type:a,value:ay}]}]}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:q,props:{id:$},children:[{type:b,tag:e,props:{href:"#testing-nodejs"},children:[{type:a,value:aa}]}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Node.js is not a compiled language, though it is often "},{type:b,tag:e,props:{href:"https:\u002F\u002Fscotch.io\u002Ftutorials\u002Fjavascript-transpilers-what-they-are-why-we-need-them",rel:[h,i,j],target:k},children:[{type:a,value:"transpiled"}]},{type:a,value:" to bake in modern features and abstractions, thus you can make sure your terminal and Node environment are working by running actual JavaScript."}]},{type:a,value:c},{type:b,tag:C,props:{},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Make a file anywhere with a "},{type:b,tag:f,props:{},children:[{type:a,value:aB}]},{type:a,value:" extension, e.g. "},{type:b,tag:f,props:{},children:[{type:a,value:aC}]},{type:a,value:o}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Fill it with your profound knowledge of JavaScript."}]},{type:a,value:c},{type:b,tag:n,props:{className:[u]},children:[{type:b,tag:l,props:{className:["filename"]},children:[{type:a,value:aC}]},{type:b,tag:v,props:{className:[w,"language-js"]},children:[{type:b,tag:f,props:{},children:[{type:b,tag:l,props:{className:[m,"keyword"]},children:[{type:a,value:"const"}]},{type:a,value:" name "},{type:b,tag:l,props:{className:[m,"operator"]},children:[{type:a,value:"="}]},{type:a,value:aA},{type:b,tag:l,props:{className:[m,I]},children:[{type:a,value:"\"John\""}]},{type:b,tag:l,props:{className:[m,A]},children:[{type:a,value:aD}]},{type:a,value:c},{type:b,tag:l,props:{className:[m,aE,"class-name"]},children:[{type:a,value:aE}]},{type:b,tag:l,props:{className:[m,A]},children:[{type:a,value:o}]},{type:b,tag:l,props:{className:[m,"method",H,"property-access"]},children:[{type:a,value:"log"}]},{type:b,tag:l,props:{className:[m,A]},children:[{type:a,value:"("}]},{type:b,tag:l,props:{className:[m,"template-string"]},children:[{type:b,tag:l,props:{className:[m,aF,I]},children:[{type:a,value:aG}]},{type:b,tag:l,props:{className:[m,I]},children:[{type:a,value:"My name is "}]},{type:b,tag:l,props:{className:[m,"interpolation"]},children:[{type:b,tag:l,props:{className:[m,aH,A]},children:[{type:a,value:"${"}]},{type:a,value:"name"},{type:b,tag:l,props:{className:[m,aH,A]},children:[{type:a,value:"}"}]}]},{type:b,tag:l,props:{className:[m,aF,I]},children:[{type:a,value:aG}]}]},{type:b,tag:l,props:{className:[m,A]},children:[{type:a,value:")"}]},{type:b,tag:l,props:{className:[m,A]},children:[{type:a,value:aD}]},{type:a,value:c}]}]}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Navigate your terminal to the directory where the "},{type:b,tag:f,props:{},children:[{type:a,value:aB}]},{type:a,value:" file you created is located."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Run it!"}]},{type:a,value:c},{type:b,tag:n,props:{className:[u]},children:[{type:b,tag:v,props:{className:[w,z]},children:[{type:b,tag:f,props:{},children:[{type:a,value:"node test.js\n"}]}]}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Profit!"}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"If profits were not made, try to determine if there is an issue with your terminal interacting properly with Node."}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:y,props:{id:B},children:[{type:b,tag:e,props:{href:"#git"},children:[{type:a,value:E}]}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"The version control of choice is Git through GitHub in the spirit of open and extensible software. GitHub can be operated graphically, e.g. using "},{type:b,tag:e,props:{href:"https:\u002F\u002Fdesktop.github.com\u002F",rel:[h,i,j],target:k},children:[{type:a,value:"GitHub Desktop"}]},{type:a,value:", however it's recommended to utilize a standard git installation."}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Visual Studio Code provides integration through your local git installation for creating commits, syncing changes, managing branches, viewing who made code modifications and more through extensions. Once you have Git installed you may visit the "},{type:b,tag:aw,props:{to:aI},children:[{type:a,value:aJ}]},{type:a,value:" tools guide for more resources on learning git, some recommended practices, and some repository-specific GitHub information."}]},{type:a,value:c},{type:b,tag:q,props:{id:ab},children:[{type:b,tag:e,props:{href:"#windows-1"},children:[{type:a,value:G}]}]},{type:a,value:c},{type:b,tag:C,props:{},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:Q},{type:b,tag:e,props:{href:"https:\u002F\u002Fgit-scm.com\u002Fdownload\u002Fwin",rel:[h,i,j],target:k},children:[{type:a,value:E}]},{type:a,value:" website and download the installer."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"The installation will ask you a lot of questions, however you should accept the defaults unless you know what you're doing."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Open PowerShell or a Command Prompt window and try to view the git version."}]},{type:a,value:c},{type:b,tag:n,props:{className:[u]},children:[{type:b,tag:v,props:{className:[w,z]},children:[{type:b,tag:f,props:{},children:[{type:b,tag:l,props:{className:[m,H]},children:[{type:a,value:B}]},{type:a,value:aK}]}]}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"If an error appears saying the command is not found you likely need to restart the computer or try to manually add git to your path environment variable."}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:q,props:{id:ac},children:[{type:b,tag:e,props:{href:"#linux-mac-and-wsl"},children:[{type:a,value:ad}]}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Some operating systems in the UNIX family come with Git already installed. You can test if you already have it by checking if you can find version information."}]},{type:a,value:c},{type:b,tag:n,props:{className:[u]},children:[{type:b,tag:v,props:{className:[w,z]},children:[{type:b,tag:f,props:{},children:[{type:b,tag:l,props:{className:[m,H]},children:[{type:a,value:B}]},{type:a,value:aK}]}]}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"If you do not have Git installed they have a list of installation guides for "},{type:b,tag:e,props:{href:"https:\u002F\u002Fgit-scm.com\u002Fdownload\u002Flinux",rel:[h,i,j],target:k},children:[{type:a,value:"Linux"}]},{type:a,value:ax},{type:b,tag:e,props:{href:"https:\u002F\u002Fgit-scm.com\u002Fdownload\u002Fmac",rel:[h,i,j],target:k},children:[{type:a,value:"Mac"}]},{type:a,value:o}]},{type:a,value:c},{type:b,tag:q,props:{id:ae},children:[{type:b,tag:e,props:{href:"#understanding-git"},children:[{type:a,value:af}]}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"The recommended guide for understanding Git is "},{type:b,tag:e,props:{href:"https:\u002F\u002Frogerdudler.github.io\u002Fgit-guide\u002F",rel:[h,i,j],target:k},children:[{type:a,value:"git - the simple guide"}]},{type:a,value:" by Roger Dudler. I also recommend adopting a commit convention such as "},{type:b,tag:e,props:{href:"https:\u002F\u002Fwww.conventionalcommits.org\u002Fen\u002Fv1.0.0\u002F",rel:[h,i,j],target:k},children:[{type:a,value:"conventional commits"}]},{type:a,value:", especially if you are unsure of how to write good commit messages."}]},{type:a,value:c},{type:b,tag:y,props:{id:ag},children:[{type:b,tag:e,props:{href:"#visual-studio-code"},children:[{type:a,value:M}]}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Visual Studio Code, or VSCode, has strong intellisense, a debugger, Git integration, and extensions for nearly all languages and features you could want. Using VSCode is not a strict requirement, however it is highly recommended because the application is setup for the "},{type:b,tag:e,props:{href:"https:\u002F\u002Fmarketplace.visualstudio.com\u002Fitems?itemName=dbaeumer.vscode-eslint",rel:[h,i,j],target:k},children:[{type:a,value:aL}]},{type:a,value:aM},{type:b,tag:e,props:{href:"https:\u002F\u002Fmarketplace.visualstudio.com\u002Fitems?itemName=esbenp.prettier-vscode",rel:[h,i,j],target:k},children:[{type:a,value:aN}]},{type:a,value:aM},{type:b,tag:e,props:{href:"https:\u002F\u002Feditorconfig.org\u002F",rel:[h,i,j],target:k},children:[{type:a,value:"EditorConfig"}]},{type:a,value:", and "},{type:b,tag:e,props:{href:"https:\u002F\u002Fmarketplace.visualstudio.com\u002Fitems?itemName=octref.vetur",rel:[h,i,j],target:k},children:[{type:a,value:aO}]},{type:a,value:" extensions."}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"These extensions enforce a consistent coding style that the IDE will enforce through "},{type:b,tag:e,props:{href:"https:\u002F\u002Fstackoverflow.com\u002Fquestions\u002F8503559\u002Fwhat-is-linting",rel:[h,i,j],target:k},children:[{type:a,value:"linting"}]},{type:a,value:". Multiple developers working on a codebase greatly benefit from declaring rules for how the code should be written for easier maintainability. Plenty of editors support all of those extensions except for Vetur, which is still under active development and is not available for any other IDE. Without Vetur, the intellisense and linting capabilities of Vue.js files in the frontend will suffer."}]},{type:a,value:c},{type:b,tag:q,props:{id:ah},children:[{type:b,tag:e,props:{href:"#download"},children:[{type:a,value:ai}]}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Visual Studio Code can be downloaded on their "},{type:b,tag:e,props:{href:"https:\u002F\u002Fcode.visualstudio.com\u002F",rel:[h,i,j],target:k},children:[{type:a,value:"website"}]},{type:a,value:" for all platforms."}]},{type:a,value:c},{type:b,tag:q,props:{id:P},children:[{type:b,tag:e,props:{href:"#extensions"},children:[{type:a,value:aj}]}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Click on the "},{type:b,tag:J,props:{},children:[{type:a,value:"Tetris-like"}]},{type:a,value:" boxes on the leftmost sidebar of VSCode or enter "},{type:b,tag:f,props:{},children:[{type:a,value:"Ctrl + Shift + X"}]},{type:a,value:" on your keyboard to search for and install extensions."}]},{type:a,value:c},{type:b,tag:aP,props:{id:"required-extensions"},children:[{type:b,tag:e,props:{href:"#required-extensions"},children:[{type:a,value:"Required Extensions"}]}]},{type:a,value:c},{type:b,tag:D,props:{},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:b,tag:r,props:{},children:[{type:a,value:aL}]},{type:a,value:" is the linter used by the project managed by "},{type:b,tag:f,props:{},children:[{type:a,value:".eslintrc.js"}]},{type:a,value:" files found within the repository. This extension will ensure stylistic consistency and prevent minor programming errors and common mistakes."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:b,tag:r,props:{},children:[{type:a,value:aO}]},{type:a,value:" is required for VSCode to understand Vue files and properly apply intellisense and is managed by the "},{type:b,tag:f,props:{},children:[{type:a,value:"vetur.config.js"}]},{type:a,value:" file."}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"This extension is less mature than the others and I occasionally have issues with it. You can attempt to restart the extension in the command palette ("},{type:b,tag:f,props:{},children:[{type:a,value:R}]},{type:a,value:") and selecting "},{type:b,tag:f,props:{},children:[{type:a,value:"\u003EVetur: Restart VLS (Vue Language Server)"}]},{type:a,value:". If that doesn't help you can reload all extensions in the command palette by finding "},{type:b,tag:f,props:{},children:[{type:a,value:"\u003EReload Window"}]},{type:a,value:o}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:b,tag:r,props:{},children:[{type:a,value:aN}]},{type:a,value:" is an opinionated code formatter that will help keep your code clean and is managed by "},{type:b,tag:f,props:{},children:[{type:a,value:".prettierrc"}]},{type:a,value:" files found in the repository. It can be activated by entering "},{type:b,tag:f,props:{},children:[{type:a,value:"Shift + Alt + F"}]},{type:a,value:" on the keyboard, by right-clicking a file and selecting "},{type:b,tag:f,props:{},children:[{type:a,value:"Format Document"}]},{type:a,value:o}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"For streamlined usage you can configure VSCode to format on save by enabling this setting found by entering "},{type:b,tag:f,props:{},children:[{type:a,value:R}]},{type:a,value:" to open the command palette, search for "},{type:b,tag:f,props:{},children:[{type:a,value:"\u003EPreferences: Open Settings (UI)"}]},{type:a,value:" and enabling "},{type:b,tag:f,props:{},children:[{type:a,value:"Format on Save"}]},{type:a,value:o}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:b,tag:r,props:{},children:[{type:a,value:aQ}]},{type:a,value:" is only required if using WSL as your development environment. It will run the internals of VSCode itself in a Linux environment. This allows you to use run and debug applications inside Linux using VSCode and use a Linux Git installation."}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:aP,props:{id:"optional-extensions"},children:[{type:b,tag:e,props:{href:"#optional-extensions"},children:[{type:a,value:"Optional Extensions"}]}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"These extensions I find useful but are not required."}]},{type:a,value:c},{type:b,tag:D,props:{},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:b,tag:r,props:{},children:[{type:a,value:"DotENV"}]},{type:a,value:" provides syntax highlighting for the "},{type:b,tag:f,props:{},children:[{type:a,value:aR}]},{type:a,value:" files."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:b,tag:r,props:{},children:[{type:a,value:"Project Manager"}]},{type:a,value:" allows you to save different open folders as projects and lets you easily switch between them."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:b,tag:r,props:{},children:[{type:a,value:"Remote - SSH"}]},{type:a,value:" is a similar extension to "},{type:b,tag:J,props:{},children:[{type:a,value:aQ}]},{type:a,value:" but instead of WSL it will run VSCode through SSH. This allows you to open editors on a remote machine and edit files completely remotely. An example would be editing the "},{type:b,tag:f,props:{},children:[{type:a,value:aR}]},{type:a,value:" files on the production machine without having to use a terminal-based IDE."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:b,tag:r,props:{},children:[{type:a,value:aS}]},{type:a,value:" integrates "},{type:b,tag:f,props:{},children:[{type:a,value:aS}]},{type:a,value:" commands and tasks into the command palette so you don't have to type them out all of the time."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:b,tag:r,props:{},children:[{type:a,value:F}]},{type:a,value:" is a utility for quickly enabling and disabling different docker environments."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:b,tag:r,props:{},children:[{type:a,value:"Power Mode"}]},{type:a,value:" makes the insertion cursor shoot out sparkles as you type. This is very nearly a requirement. ✨"}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:q,props:{id:ak},children:[{type:b,tag:e,props:{href:"#useful-commands"},children:[{type:a,value:al}]}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"The VSCode "},{type:b,tag:e,props:{href:"https:\u002F\u002Fcode.visualstudio.com\u002Fdocs\u002Fgetstarted\u002Fuserinterface",rel:[h,i,j],target:k},children:[{type:a,value:"user interface documentation"}]},{type:a,value:" is a great resource for understanding the basics of the editor. If you are more accustomed to editors such as Vim, Sublime Text, Atom, Visual Studio, ...etc there are "},{type:b,tag:e,props:{href:"https:\u002F\u002Fcode.visualstudio.com\u002Fdocs\u002Fgetstarted\u002Fkeybindings",rel:[h,i,j],target:k},children:[{type:a,value:P}]},{type:a,value:" for telling VSCode to use those keybinds."}]},{type:a,value:c},{type:b,tag:D,props:{},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:b,tag:f,props:{},children:[{type:a,value:R}]},{type:a,value:" opens the command palette. The command palette provides access to nearly all actions within the editor."}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:b,tag:f,props:{},children:[{type:a,value:"Ctrl + P"}]},{type:a,value:" lets you switch between open files by name."}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:b,tag:f,props:{},children:[{type:a,value:"Ctrl + B"}]},{type:a,value:" toggles the visibility of the sidebar."}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:b,tag:f,props:{},children:[{type:a,value:"Alt + Click"}]},{type:a,value:" on a file in the explorer or "},{type:b,tag:f,props:{},children:[{type:a,value:"Ctrl + \\"}]},{type:a,value:" splits the editor window."}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:b,tag:f,props:{},children:[{type:a,value:"Ctrl + `"}]},{type:a,value:" opens the integrated terminal."}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:b,tag:f,props:{},children:[{type:a,value:"Ctrl + Shift + `"}]},{type:a,value:" opens a new integrated terminal."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"See all default shortcuts in the "},{type:b,tag:e,props:{href:"https:\u002F\u002Fcode.visualstudio.com\u002Fassets\u002Fdocs\u002Fgetstarted\u002Ftips-and-tricks\u002FKeyboardReferenceSheet.png",rel:[h,i,j],target:k},children:[{type:a,value:"reference shortcut image"}]},{type:a,value:". The "},{type:b,tag:f,props:{},children:[{type:a,value:"Multi-cursor and selection"}]},{type:a,value:" controls are exceptionally powerful."}]},{type:a,value:c},{type:b,tag:y,props:{id:am},children:[{type:b,tag:e,props:{href:"#insomnia"},children:[{type:a,value:N}]}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"When working with an API you need a means of testing the endpoints. If you have worked with APIs before you may have used Postman, a highly popular tool for interacting with APIs. If you are comfortable with Postman or another tool there is no reason to use Insomnia, nonetheless, Postman has become increasingly complex and company-driven and is a lot more bloated by default."}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"To install Insomnia visit the "},{type:b,tag:e,props:{href:"https:\u002F\u002Finsomnia.rest\u002F",rel:[h,i,j],target:k},children:[{type:a,value:"Insomnia website"}]},{type:a,value:" and download "},{type:b,tag:f,props:{},children:[{type:a,value:"Insomnia Core"}]},{type:a,value:". Insomnia Designer is... "},{type:b,tag:J,props:{},children:[{type:a,value:"something else"}]},{type:a,value:o}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:K,props:{type:S},children:[{type:a,value:c},{type:b,tag:n,props:{className:[s,t]},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"An advanced guide on Insomnia is under construction. 🚧"}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:T,props:{src:"\u002Fomc-app\u002Fimages\u002Finstallation\u002Ftooling\u002Finsomnia.png"},children:[]},{type:a,value:c},{type:b,tag:n,props:{className:[s,t]},children:[{type:a,value:c},{type:b,tag:y,props:{id:an},children:[{type:b,tag:e,props:{href:"#docker"},children:[{type:a,value:F}]}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"One of the bigger headaches with managing software is it can conflict and fight for resources and dependencies with other software. Even if this is not the case, manual setup may be a chore that needs to be repeated on other systems."}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Docker is one of the services that solves this problem through containerization — the process of creating packages of the exact requirements to run the software on. This is taken to an extreme case by utilizing bare-bones operating systems that run at an OS simulation level, meaning the containers share the same OS kernel and have near-negligible performance impacts compared to running natively."}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"This provides a lot of room for automating the deployment of the application, however, our team was not versed enough in Docker to reach complete autonomy. However, a "},{type:b,tag:f,props:{},children:[{type:a,value:aT}]},{type:a,value:" file is provided in the root of the project to allow a user with Docker installed to spin up a Postgres instance in seconds and get going."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:K,props:{type:S},children:[{type:a,value:c},{type:b,tag:n,props:{className:[s,t]},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Docker is not required but is faster to work with locally. A development database could be created on Azure with credentials locked to only affect that database for safe remote development with a negligible difference in development experience."}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:T,props:{src:"\u002Fomc-app\u002Fimages\u002Ftools\u002Fdocker.png"},children:[]},{type:a,value:c},{type:b,tag:n,props:{className:[s,t]},children:[{type:a,value:c},{type:b,tag:q,props:{id:ao},children:[{type:b,tag:e,props:{href:"#windows-or-wsl"},children:[{type:a,value:ap}]}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:K,props:{type:"warning"},children:[{type:a,value:c},{type:b,tag:n,props:{className:[s,t]},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"You will need to know what edition of Windows 10 you have: Home, Pro, Enterprise, or Education. You can find out how to determine this "},{type:b,tag:e,props:{href:"https:\u002F\u002Fsupport.microsoft.com\u002Fen-us\u002Fhelp\u002F13443\u002Fwindows-which-version-am-i-running",rel:[h,i,j],target:k},children:[{type:a,value:"here"}]},{type:a,value:o}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"If you are on an older version of Windows, seek information on Docker support for those systems."}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:n,props:{className:[s,t]},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Docker has a few different installation methods on Windows because it utilizes the same low-level virtualization technology that WSL does. The newest versions of Docker exclusively rely on the technology."}]},{type:a,value:c},{type:b,tag:D,props:{},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:"If you are using WSL, install "},{type:b,tag:e,props:{href:"https:\u002F\u002Fdocs.docker.com\u002Fdocker-for-windows\u002Fwsl\u002F",rel:[h,i,j],target:k},children:[{type:a,value:"Docker Desktop with the WSL 2 backend"}]},{type:a,value:o}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:"If you are on Windows 10 Enterprise, Pro, or Education you can install "},{type:b,tag:e,props:{href:"https:\u002F\u002Fdocs.docker.com\u002Fdocker-for-windows\u002Finstall\u002F",rel:[h,i,j],target:k},children:[{type:a,value:"Docker Desktop"}]},{type:a,value:o}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:"If you are on Windows 10 Home and are "},{type:b,tag:J,props:{},children:[{type:a,value:"not"}]},{type:a,value:" using WSL, you can install "},{type:b,tag:e,props:{href:"https:\u002F\u002Fdocs.docker.com\u002Ftoolbox\u002Ftoolbox_install_windows\u002F",rel:[h,i,j],target:k},children:[{type:a,value:"Legacy Docker Toolbox"}]},{type:a,value:o}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Some high schools and most colleges give students a free educational Windows 10 license if you are interested in upgrading your Windows version."}]},{type:a,value:c},{type:b,tag:q,props:{id:aq},children:[{type:b,tag:e,props:{href:"#linux-or-mac"},children:[{type:a,value:ar}]}]},{type:a,value:c},{type:b,tag:D,props:{},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:"If you are a Mac user you can install "},{type:b,tag:e,props:{href:"https:\u002F\u002Fdocs.docker.com\u002Fdocker-for-mac\u002Finstall\u002F",rel:[h,i,j],target:k},children:[{type:a,value:"Docker Desktop on Mac"}]},{type:a,value:o}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:"Linux users can find their own version of Linux and install the "},{type:b,tag:e,props:{href:"https:\u002F\u002Fdocs.docker.com\u002Fengine\u002Finstall\u002F",rel:[h,i,j],target:k},children:[{type:a,value:"Docker Engine"}]},{type:a,value:". Docker Compose, the tool that interacts with the "},{type:b,tag:f,props:{},children:[{type:a,value:aT}]},{type:a,value:" file in the repository root, does not come with Docker Engine, so also "},{type:b,tag:e,props:{href:"https:\u002F\u002Fdocs.docker.com\u002Fcompose\u002Finstall\u002F",rel:[h,i,j],target:k},children:[{type:a,value:"Install Docker Compose"}]},{type:a,value:o}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:"There are unnecessary performance implications if you try to install Docker Engine through WSL, use Docker Desktop instead as it will interface with WSL on its own."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:q,props:{id:as},children:[{type:b,tag:e,props:{href:"#verify-installation"},children:[{type:a,value:at}]}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"You can verify if Docker is properly installed on your system after following an installation guide with the following commands in your terminal and receiving back versioning information."}]},{type:a,value:c},{type:b,tag:n,props:{className:[u]},children:[{type:b,tag:v,props:{className:[w,z]},children:[{type:b,tag:f,props:{},children:[{type:a,value:"docker --version\ndocker-compose --version\n"}]}]}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Windows (+WSL), and Mac users should be aware that Docker is an application that runs in the taskbar. It will need to be running for Docker to function properly. It's also recommended to disable the feature that has it start when your device turns on as that is somewhat of a performance hit."}]},{type:a,value:c},{type:b,tag:y,props:{id:au},children:[{type:b,tag:e,props:{href:"#datagrip"},children:[{type:a,value:av}]}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"While "},{type:b,tag:e,props:{href:"https:\u002F\u002Fmikro-orm.io\u002F",rel:[h,i,j],target:k},children:[{type:a,value:"MikroORM"}]},{type:a,value:" will be used as an ORM (Object Relational Mapping) to translate the database tables into JavaScript objects for easier management, some tasks are still best performed more directly. Even if this is not the case, running queries and seeing what the end result is in the database can be a productive diagnostic tool."}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"The recommended graphical client is "},{type:b,tag:e,props:{href:"https:\u002F\u002Fwww.jetbrains.com\u002Fdatagrip\u002F",rel:[h,i,j],target:k},children:[{type:a,value:"JetBrains DataGrip"}]},{type:a,value:". DataGrip is not normally free software but students can apply to use it for free at the "},{type:b,tag:e,props:{href:"https:\u002F\u002Fwww.jetbrains.com\u002Fshop\u002Feform\u002Fstudents",rel:[h,i,j],target:k},children:[{type:a,value:"JetBrains Products for Learning"}]},{type:a,value:" page."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:K,props:{type:S},children:[{type:a,value:c},{type:b,tag:n,props:{className:[s,t]},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"An advanced guide on DataGrip is not yet available. 😱"}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:T,props:{src:"\u002Fomc-app\u002Fimages\u002Fdevelopment\u002Fquery-console.png"},children:[]}]},dir:"\u002Ftools",path:"\u002Ftools\u002F6.environment",extension:".md",createdAt:aU,updatedAt:aU,position:"999900060000",to:"\u002Ftools\u002Fenvironment",language:"en",draft:false},prev:{slug:"configuration",title:"Configuration",to:"\u002Finstallation\u002Fconfiguration"},next:{slug:B,title:aJ,to:aI}}],fetch:{},mutations:void 0}}("text","element","\n","p","a","code","li","nofollow","noopener","noreferrer","_blank","span","token","div",".",3,"h3","strong","prose","dark:prose-dark","nuxt-content-highlight","pre","line-numbers",2,"h2","language-bash","punctuation","git","ol","ul","Git","Docker","Windows","function","string","em","alert","Tools","Visual Studio Code","Insomnia","tools","extensions","Visit the ","Ctrl + Shift + P","info","img","preamble","Preamble","nodejs-environment","Node.js Environment","windows","linux-mac-or-wsl","Linux, Mac, or WSL","testing-nodejs","Testing Node.js","windows-1","linux-mac-and-wsl","Linux, Mac, and WSL","understanding-git","Understanding Git","visual-studio-code","download","Download","Extensions","useful-commands","Useful Commands","insomnia","docker","windows-or-wsl","Windows or WSL","linux-or-mac","Linux or Mac","verify-installation","Verify Installation","datagrip","DataGrip","nuxt-link"," and ","node -v\n","14"," ",".js","test.js",";","console","template-punctuation","`","interpolation-punctuation","\u002Ftools\u002Fgit","Git & GitHub"," --version\n","ESLint",", ","Prettier","Vetur","h4","Remote - WSL",".env","npm","docker-compose.yml","2021-03-28T22:23:27.374Z")));