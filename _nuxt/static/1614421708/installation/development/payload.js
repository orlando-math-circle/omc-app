__NUXT_JSONP__("/installation/development", (function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,_,$,aa,ab,ac,ad,ae,af,ag,ah,ai,aj,ak,al,am,an,ao,ap,aq,ar,as,at,au,av,aw,ax,ay,az,aA,aB,aC,aD,aE,aF,aG,aH,aI,aJ,aK,aL,aM,aN){return {data:[{document:{slug:"development",description:"Contributions to the application should begin with making sure your system has the proper runtime environment, obtaining service credentials, and installing tools you may require.",title:"Development",category:"Installation",version:1,toc:[{id:aa,depth:r,text:ab},{id:ac,depth:r,text:ad},{id:ae,depth:r,text:af},{id:ag,depth:r,text:ah},{id:F,depth:r,text:ai},{id:aj,depth:r,text:ak},{id:al,depth:r,text:am}],body:{type:"root",children:[{type:b,tag:i,props:{className:[B,C]},children:[{type:a,value:c},{type:b,tag:x,props:{id:aa},children:[{type:b,tag:o,props:{href:"#requirements"},children:[{type:a,value:ab}]}]},{type:a,value:c},{type:b,tag:y,props:{},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:D,props:{style:E},children:[{type:a,value:Q}]},{type:a,value:"\n Construct a development environment through the installation of Node.js.\n"}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:D,props:{style:E},children:[{type:a,value:Q}]},{type:a,value:"\n Setup Visual Studio Code with the necessary extensions.\n"}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:D,props:{style:E},children:[{type:a,value:Q}]},{type:a,value:"\n Ensure tools are installed to interact with GitHub, test endpoints, and manage PostgreSQL.\n"}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:D,props:{style:E},children:[{type:a,value:"\nServices\n"}]},{type:a,value:"\n Acquire and record the credentials to PayPal, Twitter, and SendGrid development accounts.\n"}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:D,props:{style:E},children:[{type:a,value:an}]},{type:a,value:"\n Download the codebase and install the npm dependencies.\n"}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:D,props:{style:E},children:[{type:a,value:an}]},{type:a,value:"\n Bootstrap the database.\n"}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:x,props:{id:ac},children:[{type:b,tag:o,props:{href:"#environment--tooling"},children:[{type:a,value:ad}]}]},{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"Complete steps "},{type:b,tag:d,props:{},children:[{type:a,value:"1"}]},{type:a,value:" through "},{type:b,tag:d,props:{},children:[{type:a,value:"3"}]},{type:a,value:" in the "},{type:b,tag:q,props:{to:"\u002Finstallation\u002Fdevelopment#requirements"},children:[{type:a,value:"development requirements"}]},{type:a,value:" by visiting the "},{type:b,tag:q,props:{to:"\u002Ftools\u002Fenvironment"},children:[{type:a,value:"environment guide"}]},{type:a,value:" to obtain the following:"}]},{type:a,value:c},{type:b,tag:J,props:{},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:"Node.js "},{type:b,tag:d,props:{},children:[{type:a,value:"14.X.X"}]},{type:a,value:" installation."}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:"Git or GitHub compatible Git client."}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:"Visual Studio Code with the "},{type:b,tag:q,props:{to:"\u002Ftools\u002Fenvironment#extensions"},children:[{type:a,value:"recommended extensions"}]},{type:a,value:K}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:"Insomnia or similar endpoint testing client."}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:"Docker and Docker Compose or other PostgreSQL credentials."}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:"DataGrip or other database management tool."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:x,props:{id:ae},children:[{type:b,tag:o,props:{href:"#downloading--install"},children:[{type:a,value:af}]}]},{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"In this step the application will be downloaded and the "},{type:b,tag:d,props:{},children:[{type:a,value:L}]},{type:a,value:" dependencies installed."}]},{type:a,value:c},{type:b,tag:y,props:{},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"Download the repository using Git. This will make a folder called "},{type:b,tag:d,props:{},children:[{type:a,value:R}]},{type:a,value:", though you may change it."}]},{type:a,value:c},{type:b,tag:ao,props:{},children:[{type:a,value:s},{type:b,tag:M,props:{label:"SSH",active:S},children:[{type:a,value:c},{type:b,tag:i,props:{className:[j]},children:[{type:b,tag:k,props:{className:[l,p]},children:[{type:b,tag:d,props:{},children:[{type:b,tag:e,props:{className:[f,z]},children:[{type:a,value:ap}]},{type:a,value:" clone git@github.com:duckies\u002Fomc-app.git omc\n"}]}]}]},{type:a,value:s}]},{type:a,value:s},{type:b,tag:M,props:{label:"HTTPS"},children:[{type:a,value:c},{type:b,tag:i,props:{className:[j]},children:[{type:b,tag:k,props:{className:[l,p]},children:[{type:b,tag:d,props:{},children:[{type:b,tag:e,props:{className:[f,z]},children:[{type:a,value:ap}]},{type:a,value:" clone https:\u002F\u002Fgithub.com\u002Fduckies\u002Fomc-app.git omc\n"}]}]}]},{type:a,value:s}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:G,props:{type:T},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"If you plan on publishing changes made to the application a fork will need to be made. The fork button can be found at the top of the "},{type:b,tag:o,props:{href:"https:\u002F\u002Fgithub.com\u002Fduckies\u002Fomc-app",rel:[U,V,W],target:X},children:[{type:a,value:"repo"}]},{type:a,value:". If a fork is already made for a team of yours, use that instead."}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:aq},{type:b,tag:d,props:{},children:[{type:a,value:ar}]},{type:a,value:as}]},{type:a,value:c},{type:b,tag:i,props:{className:[j]},children:[{type:b,tag:k,props:{className:[l,p]},children:[{type:b,tag:d,props:{},children:[{type:b,tag:e,props:{className:[f,at,au]},children:[{type:a,value:av}]},{type:a,value:" .\u002Fomc\u002Ffrontend "},{type:b,tag:e,props:{className:[f,m]},children:[{type:a,value:aw}]},{type:a,value:H},{type:b,tag:e,props:{className:[f,z]},children:[{type:a,value:L}]},{type:a,value:H},{type:b,tag:e,props:{className:[f,z]},children:[{type:a,value:ax}]},{type:a,value:c}]}]}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:aq},{type:b,tag:d,props:{},children:[{type:a,value:N}]},{type:a,value:as}]},{type:a,value:c},{type:b,tag:i,props:{className:[j]},children:[{type:b,tag:k,props:{className:[l,p]},children:[{type:b,tag:d,props:{},children:[{type:b,tag:e,props:{className:[f,at,au]},children:[{type:a,value:av}]},{type:a,value:H},{type:b,tag:e,props:{className:[f,O]},children:[{type:a,value:P}]},{type:a,value:"\u002Fbackend "},{type:b,tag:e,props:{className:[f,m]},children:[{type:a,value:aw}]},{type:a,value:H},{type:b,tag:e,props:{className:[f,z]},children:[{type:a,value:L}]},{type:a,value:H},{type:b,tag:e,props:{className:[f,z]},children:[{type:a,value:ax}]},{type:a,value:c}]}]}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"Copy the default avatars and event picture to the static directory."}]},{type:a,value:c},{type:b,tag:i,props:{className:[j]},children:[{type:b,tag:k,props:{className:[l,p]},children:[{type:b,tag:d,props:{},children:[{type:b,tag:e,props:{className:[f,t]},children:[{type:a,value:"# This is assuming you're in the \u002Fomc\u002Fbackend directory!"}]},{type:a,value:c},{type:b,tag:e,props:{className:[f,z]},children:[{type:a,value:"cp"}]},{type:a,value:" -R "},{type:b,tag:e,props:{className:[f,O]},children:[{type:a,value:P}]},{type:a,value:"\u002Fresources\u002Fimages "},{type:b,tag:e,props:{className:[f,O]},children:[{type:a,value:P}]},{type:a,value:ay},{type:b,tag:e,props:{className:[f,O]},children:[{type:a,value:P}]},{type:a,value:"\u002Fuploads\n"}]}]}]},{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"You should end up with an "},{type:b,tag:d,props:{},children:[{type:a,value:"uploads"}]},{type:a,value:" folder at the same level as the "},{type:b,tag:d,props:{},children:[{type:a,value:R}]},{type:a,value:" folder."}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"While there is a "},{type:b,tag:d,props:{},children:[{type:a,value:"package.json"}]},{type:a,value:" file in the root of the repository it references no dependencies. Avoid accidentally trying to manage "},{type:b,tag:d,props:{},children:[{type:a,value:L}]},{type:a,value:" dependencies in the root of the project."}]},{type:a,value:c},{type:b,tag:x,props:{id:ag},children:[{type:b,tag:o,props:{href:"#services"},children:[{type:a,value:ah}]}]},{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"The three external services — "},{type:b,tag:d,props:{},children:[{type:a,value:az}]},{type:a,value:", "},{type:b,tag:d,props:{},children:[{type:a,value:aA}]},{type:a,value:", and "},{type:b,tag:d,props:{},children:[{type:a,value:aB}]},{type:a,value:" need to be configured to initialize the application in a development mode. Acquire access to the credentials for each and save them as described in the following "},{type:b,tag:q,props:{to:aC},children:[{type:a,value:F}]},{type:a,value:" section."}]},{type:a,value:c},{type:b,tag:J,props:{},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:b,tag:Y,props:{},children:[{type:a,value:az}]},{type:a,value:" credentials need to be configured or the application will not start. Visit the "},{type:b,tag:q,props:{to:"\u002Finstallation\u002Fservices#paypal"},children:[{type:a,value:"PayPal services setup"}]},{type:a,value:" guide for obtaining credentials."}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:b,tag:Y,props:{},children:[{type:a,value:aB}]},{type:a,value:" has a lengthy application process for obtaining credentials described in the "},{type:b,tag:q,props:{to:"\u002Finstallation\u002Fservices#twitter"},children:[{type:a,value:"Twitter service setup"}]},{type:a,value:" guide. The previous team has a Twitter account approved for the application already and can provide the credentials to you."}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:b,tag:Y,props:{},children:[{type:a,value:aA}]},{type:a,value:" has multiple development options described in the "},{type:b,tag:q,props:{to:"\u002Finstallation\u002Fservices#sendgrid"},children:[{type:a,value:"SendGrid service setup"}]},{type:a,value:". In sandbox mode, emails are printed to the console. Eventually, a free-tier personal account should be used to test the email formatting."}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:G,props:{type:aD},children:[{type:a,value:c},{type:b,tag:i,props:{className:[B,C]},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"The configuration system has bugs and unintended behaviors as of writing this."}]},{type:a,value:c},{type:b,tag:J,props:{},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"You may enter anything to bypass the "},{type:b,tag:d,props:{},children:[{type:a,value:aE}]},{type:a,value:Z},{type:b,tag:d,props:{},children:[{type:a,value:aF}]},{type:a,value:" requirement and the rest of the application will work, just not load any tweets."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:b,tag:d,props:{},children:[{type:a,value:aG}]},{type:a,value:" is still incorrectly required when using "},{type:b,tag:d,props:{},children:[{type:a,value:"SENDGRID_IN_DEV"}]},{type:a,value:" mode to print emails to the console."}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:i,props:{className:[B,C]},children:[{type:a,value:c},{type:b,tag:x,props:{id:F},children:[{type:b,tag:o,props:{href:"#configuration"},children:[{type:a,value:ai}]}]},{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"The dual "},{type:b,tag:d,props:{},children:[{type:a,value:ar}]},{type:a,value:Z},{type:b,tag:d,props:{},children:[{type:a,value:N}]},{type:a,value:" servers found in their respective folders require "},{type:b,tag:d,props:{},children:[{type:a,value:I}]},{type:a,value:" files to be created within them and supplied with environment variables. For a list of all of the available environment variables you can visit the "},{type:b,tag:q,props:{to:"\u002Finstallation\u002Fconfiguration"},children:[{type:a,value:F}]},{type:a,value:" page or view the "},{type:b,tag:d,props:{},children:[{type:a,value:".\u002Ffrontend\u002Fnuxt.config.ts"}]},{type:a,value:Z},{type:b,tag:d,props:{},children:[{type:a,value:".\u002Fbackend\u002Fsrc\u002Fapp.config.ts"}]},{type:a,value:" files. For development not many will need to be provided as there are defaults that can be used locally."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:G,props:{type:T},children:[{type:a,value:c},{type:b,tag:i,props:{className:[B,C]},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"Some operating systems do not show file extensions by default. This can make working with a "},{type:b,tag:d,props:{},children:[{type:a,value:I}]},{type:a,value:" file annoying."}]},{type:a,value:c},{type:b,tag:J,props:{},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:b,tag:o,props:{href:"https:\u002F\u002Fwww.npmjs.com\u002Fpackage\u002Fdotenv#rules",rel:[U,V,W],target:X},children:[{type:a,value:"Show filename extensions on Mac"}]}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:b,tag:o,props:{href:"https:\u002F\u002Fwww.thewindowsclub.com\u002Fshow-file-extensions-in-windows",rel:[U,V,W],target:X},children:[{type:a,value:"Show filename extensions on Windows"}]}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:i,props:{className:[B,C]},children:[{type:a,value:c},{type:b,tag:y,props:{},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"While still in the backend directory, create a "},{type:b,tag:d,props:{},children:[{type:a,value:I}]},{type:a,value:" file and fill it with, at minimum, these options."}]},{type:a,value:c},{type:b,tag:i,props:{className:[j]},children:[{type:b,tag:k,props:{className:[l,p]},children:[{type:b,tag:d,props:{},children:[{type:b,tag:e,props:{className:[f,t]},children:[{type:a,value:"# Random string of alphanumerics and special characters."}]},{type:a,value:c},{type:b,tag:e,props:{className:[f,u,v]},children:[{type:a,value:aH}]},{type:b,tag:e,props:{className:[f,m]},children:[{type:a,value:w}]},{type:a,value:"dev-example\n"},{type:b,tag:e,props:{className:[f,t]},children:[{type:a,value:"# Have the backend serve images and file uploads"}]},{type:a,value:c},{type:b,tag:e,props:{className:[f,u,v]},children:[{type:a,value:"SERVE_STATIC"}]},{type:b,tag:e,props:{className:[f,m]},children:[{type:a,value:w}]},{type:a,value:"true\n"},{type:b,tag:e,props:{className:[f,t]},children:[{type:a,value:"# From the PayPal Developer Portal"}]},{type:a,value:c},{type:b,tag:e,props:{className:[f,u,v]},children:[{type:a,value:"PAYPAL_CLIENT_ID"}]},{type:b,tag:e,props:{className:[f,m]},children:[{type:a,value:w}]},{type:a,value:c},{type:b,tag:e,props:{className:[f,u,v]},children:[{type:a,value:"PAYPAL_CLIENT_SECRET"}]},{type:b,tag:e,props:{className:[f,m]},children:[{type:a,value:w}]},{type:a,value:c},{type:b,tag:e,props:{className:[f,t]},children:[{type:a,value:"# Twitter Developer Portal"}]},{type:a,value:c},{type:b,tag:e,props:{className:[f,u,v]},children:[{type:a,value:aE}]},{type:b,tag:e,props:{className:[f,m]},children:[{type:a,value:w}]},{type:a,value:c},{type:b,tag:e,props:{className:[f,u,v]},children:[{type:a,value:aF}]},{type:b,tag:e,props:{className:[f,m]},children:[{type:a,value:w}]},{type:a,value:c},{type:b,tag:e,props:{className:[f,t]},children:[{type:a,value:"# SendGrid Dashboard"}]},{type:a,value:c},{type:b,tag:e,props:{className:[f,u,v]},children:[{type:a,value:aG}]},{type:b,tag:e,props:{className:[f,m]},children:[{type:a,value:w}]},{type:a,value:c}]}]}]},{type:a,value:c},{type:b,tag:G,props:{type:T},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"All variables within a "},{type:b,tag:d,props:{},children:[{type:a,value:I}]},{type:a,value:" file are strings. There is no need to add quotations."}]},{type:a,value:c},{type:b,tag:i,props:{className:[j]},children:[{type:b,tag:k,props:{className:[l,p]},children:[{type:b,tag:d,props:{},children:[{type:b,tag:e,props:{className:[f,t]},children:[{type:a,value:"# For example"}]},{type:a,value:c},{type:b,tag:e,props:{className:[f,u,v]},children:[{type:a,value:aH}]},{type:b,tag:e,props:{className:[f,m]},children:[{type:a,value:w}]},{type:a,value:"OMC19456"},{type:b,tag:e,props:{className:[f,m]},children:[{type:a,value:"!"}]},{type:a,value:"@^"},{type:b,tag:e,props:{className:[f,m]},children:[{type:a,value:"&"}]},{type:a,value:c}]}]}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"Navigate into the frontend directory and create a "},{type:b,tag:d,props:{},children:[{type:a,value:I}]},{type:a,value:" file once again. However, the frontend will operate in a development mode using the defaults and thus can be left empty."}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:x,props:{id:aj},children:[{type:b,tag:o,props:{href:"#database-setup"},children:[{type:a,value:ak}]}]},{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"The application requires a single PostgreSQL database to operate. If you are using Docker continue along with this section, otherwise fill in "},{type:b,tag:d,props:{},children:[{type:a,value:"DATABASE_*"}]},{type:a,value:" options found on the "},{type:b,tag:q,props:{to:aC},children:[{type:a,value:F}]},{type:a,value:" page in the "},{type:b,tag:d,props:{},children:[{type:a,value:".\u002Fomc\u002Fbackend\u002F.env"}]},{type:a,value:" file as appropriate."}]},{type:a,value:c},{type:b,tag:y,props:{},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"Open your terminal and point it to the root directory of the project containing the "},{type:b,tag:d,props:{},children:[{type:a,value:"docker-compose.yml"}]},{type:a,value:" file."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"Run the following command and wait for Docker to finish initializing the PostgreSQL database."}]},{type:a,value:c},{type:b,tag:i,props:{className:[j]},children:[{type:b,tag:k,props:{className:[l,p]},children:[{type:b,tag:d,props:{},children:[{type:a,value:"docker-compose up -d\n"}]}]}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"Open DataGrip and click on the "},{type:b,tag:d,props:{},children:[{type:a,value:"+"}]},{type:a,value:" sign then go to "},{type:b,tag:d,props:{},children:[{type:a,value:"Data Source"}]},{type:a,value:" and select "},{type:b,tag:d,props:{},children:[{type:a,value:"PostgreSQL"}]},{type:a,value:" and enter the following connection information."}]},{type:a,value:"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"},{type:b,tag:"table",props:{},children:[{type:b,tag:"thead",props:{},children:[{type:b,tag:A,props:{},children:[{type:b,tag:aI,props:{},children:[{type:a,value:"Option"}]},{type:b,tag:aI,props:{},children:[{type:a,value:"Value"}]}]}]},{type:b,tag:"tbody",props:{},children:[{type:b,tag:A,props:{},children:[{type:b,tag:n,props:{},children:[{type:b,tag:d,props:{},children:[{type:a,value:aJ}]}]},{type:b,tag:n,props:{},children:[{type:b,tag:d,props:{},children:[{type:a,value:"localhost"}]}]}]},{type:b,tag:A,props:{},children:[{type:b,tag:n,props:{},children:[{type:b,tag:d,props:{},children:[{type:a,value:"Port"}]}]},{type:b,tag:n,props:{},children:[{type:b,tag:d,props:{},children:[{type:a,value:"5432"}]}]}]},{type:b,tag:A,props:{},children:[{type:b,tag:n,props:{},children:[{type:b,tag:d,props:{},children:[{type:a,value:"Authentication"}]}]},{type:b,tag:n,props:{},children:[{type:b,tag:d,props:{},children:[{type:a,value:"User & Password"}]}]}]},{type:b,tag:A,props:{},children:[{type:b,tag:n,props:{},children:[{type:b,tag:d,props:{},children:[{type:a,value:"User"}]}]},{type:b,tag:n,props:{},children:[{type:b,tag:d,props:{},children:[{type:a,value:_}]}]}]},{type:b,tag:A,props:{},children:[{type:b,tag:n,props:{},children:[{type:b,tag:d,props:{},children:[{type:a,value:"Password"}]}]},{type:b,tag:n,props:{},children:[{type:b,tag:d,props:{},children:[{type:a,value:_}]}]}]},{type:b,tag:A,props:{},children:[{type:b,tag:n,props:{},children:[{type:b,tag:d,props:{},children:[{type:a,value:"Database"}]}]},{type:b,tag:n,props:{},children:[{type:b,tag:d,props:{},children:[{type:a,value:_}]}]}]}]}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"Click on "},{type:b,tag:d,props:{},children:[{type:a,value:"Test Connection"}]},{type:a,value:" and a green checkmark should indicate the connection was successful."}]},{type:a,value:c},{type:b,tag:$,props:{src:"\u002Fomc-app\u002Fimages\u002Finstallation\u002Fconnection.png"},children:[]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:aK},{type:b,tag:d,props:{},children:[{type:a,value:"Schemas"}]},{type:a,value:" tab on the toolbar above "},{type:b,tag:d,props:{},children:[{type:a,value:aJ}]},{type:a,value:" and click on "},{type:b,tag:d,props:{},children:[{type:a,value:"All databases"}]},{type:a,value:K}]},{type:a,value:c},{type:b,tag:$,props:{src:"\u002Fomc-app\u002Fimages\u002Finstallation\u002Fschemas.png"},children:[]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"Name the connection anything you would like, then hit "},{type:b,tag:d,props:{},children:[{type:a,value:aL}]},{type:a,value:" to save and close it."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"On the left sidebar expand the connection you created and right click on "},{type:b,tag:d,props:{},children:[{type:a,value:"databases"}]},{type:a,value:" and in the "},{type:b,tag:d,props:{},children:[{type:a,value:"New"}]},{type:a,value:" submenu select "},{type:b,tag:d,props:{},children:[{type:a,value:"New Database"}]},{type:a,value:K}]},{type:a,value:c},{type:b,tag:$,props:{src:"\u002Fomc-app\u002Fimages\u002Finstallation\u002Fcreate-db.png"},children:[]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"Name the database "},{type:b,tag:d,props:{},children:[{type:a,value:R}]},{type:a,value:" then lick "},{type:b,tag:d,props:{},children:[{type:a,value:aL}]},{type:a,value:" and exit DataGrip once the new database is created."}]},{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"You can rename the database, say for other testing environments, but the "},{type:b,tag:d,props:{},children:[{type:a,value:"DATABASE_NAME"}]},{type:a,value:" environment variable will need to be configured."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:aK},{type:b,tag:d,props:{},children:[{type:a,value:N}]},{type:a,value:" folder and run the following command to test the connection and create the database schema."}]},{type:a,value:c},{type:b,tag:ao,props:{},children:[{type:a,value:s},{type:b,tag:M,props:{label:"Docker",active:S},children:[{type:a,value:c},{type:b,tag:i,props:{className:[j]},children:[{type:b,tag:k,props:{className:[l,p]},children:[{type:b,tag:d,props:{},children:[{type:a,value:"npx mikro-orm schema:create -r\n"}]}]}]},{type:a,value:s}]},{type:a,value:s},{type:b,tag:M,props:{label:"Remote"},children:[{type:a,value:c},{type:b,tag:i,props:{className:[j]},children:[{type:b,tag:k,props:{className:[l,p]},children:[{type:b,tag:d,props:{},children:[{type:b,tag:e,props:{className:[f,t]},children:[{type:a,value:"# Use if you are connecting to an external database, e.g. Azure"}]},{type:a,value:"\nnpx mikro-orm schema:create -r --fk-checks\n"}]}]}]},{type:a,value:s}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:x,props:{id:al},children:[{type:b,tag:o,props:{href:"#initialization"},children:[{type:a,value:am}]}]},{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"Now that we have the application, its dependencies, and the database it can be started."}]},{type:a,value:c},{type:b,tag:y,props:{},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:"While still in the "},{type:b,tag:d,props:{},children:[{type:a,value:N}]},{type:a,value:" directory run the following command."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:i,props:{className:[j]},children:[{type:b,tag:k,props:{className:[l,aM]},children:[{type:b,tag:d,props:{},children:[{type:a,value:"npm run start:dev\n"}]}]}]},{type:a,value:c},{type:b,tag:y,props:{start:r},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:"Open a second terminal and navigate to "},{type:b,tag:d,props:{},children:[{type:a,value:".\u002Fomc\u002Ffrontend"}]},{type:a,value:" and run the following command."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:i,props:{className:[j]},children:[{type:b,tag:k,props:{className:[l,aM]},children:[{type:b,tag:d,props:{},children:[{type:a,value:"npm run dev\n"}]}]}]},{type:a,value:c},{type:b,tag:y,props:{start:3},children:[{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:"The backend will now be available at "},{type:b,tag:d,props:{},children:[{type:a,value:"http:\u002F\u002Flocalhost:3000"}]},{type:a,value:" and the frontend at "},{type:b,tag:d,props:{},children:[{type:a,value:"http:\u002F\u002Flocalhost:8080"}]},{type:a,value:K}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:G,props:{type:aD},children:[{type:a,value:c},{type:b,tag:i,props:{className:[B,C]},children:[{type:a,value:c},{type:b,tag:h,props:{},children:[{type:a,value:"The development build of the frontend can take a considerable amount of time as it initially turns on. It may appear to hang but it is still working."}]},{type:a,value:c}]},{type:a,value:c}]}]},dir:"\u002Finstallation",path:"\u002Finstallation\u002F2.development",extension:".md",createdAt:aN,updatedAt:aN,position:"999900020000",to:"\u002Finstallation\u002Fdevelopment",language:"en",draft:false},prev:{slug:S,title:"Introduction",to:ay},next:{slug:"production",title:"Production",to:"\u002Finstallation\u002Fproduction"}}],fetch:{},mutations:void 0}}("text","element","\n","code","span","token","li","p","div","nuxt-content-highlight","pre","line-numbers","operator","td","a","language-bash","nuxt-link",2,"\n  ","comment","assign-left","variable","=","h2","ol","function","tr","prose","dark:prose-dark","badge","margin: 0","configuration","alert"," ",".env","ul",".","npm","code-block","backend","punctuation","..","\nTooling\n","omc","","info","nofollow","noopener","noreferrer","_blank","strong"," and ","postgres","img","requirements","Requirements","environment--tooling","Environment & Tooling","downloading--install","Downloading & Install","services","Services","Configuration","database-setup","Database Setup","initialization","Initialization","\nInstall\n","code-group","git","Install the ","frontend"," dependencies.","builtin","class-name","cd","&&","install","\u002F","PayPal","SendGrid","Twitter","\u002Finstallation\u002Fdevelopment#configuration","warning","TWITTER_KEY","TWITTER_SECRET","SENDGRID_API_KEY","SECRET","th","Host","Navigate to the ","OK","language-text","2021-02-27T10:28:12.148Z")));