__NUXT_JSONP__("/installation/services", (function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,_,$,aa,ab,ac,ad,ae,af,ag,ah,ai,aj,ak,al,am,an,ao,ap,aq,ar,as,at,au,av,aw,ax,ay,az,aA,aB,aC,aD,aE,aF){return {data:[{document:{slug:"services",description:"Setup procedures for the external application services.",title:"Services Setup",category:"Installation",version:1,toc:[{id:ad,depth:Y,text:s},{id:ae,depth:v,text:E},{id:Z,depth:v,text:w},{id:af,depth:Y,text:ag},{id:ah,depth:v,text:ai},{id:aj,depth:Y,text:_},{id:ak,depth:v,text:E},{id:al,depth:v,text:w}],body:{type:"root",children:[{type:b,tag:p,props:{className:[F,G]},children:[{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"The application incorporates PayPal, SendGrid, and Twitter through their respective APIs. In order to utilize these services developer credentials need to be generated through a developer account or approval procedure unique to the service. Any credentials generated from these services "},{type:b,tag:am,props:{},children:[{type:a,value:an}]},{type:a,value:" be kept secure."}]},{type:a,value:d},{type:b,tag:$,props:{id:ad},children:[{type:b,tag:j,props:{href:"#paypal"},children:[{type:a,value:s}]}]},{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"There are important features related to the three account types PayPal provides: Developer, Personal, and Business."}]},{type:a,value:d},{type:b,tag:aa,props:{},children:[{type:a,value:d},{type:b,tag:i,props:{},children:[{type:a,value:"If you are running the application in development mode and using the PayPal sandbox, there is no difference between using your personal PayPal account and creating a new developer account."}]},{type:a,value:d},{type:b,tag:i,props:{},children:[{type:a,value:"Business accounts are the only kind of accounts that can process real transactions."}]},{type:a,value:d},{type:b,tag:i,props:{},children:[{type:a,value:"The owner of the account is the payment recipient."}]},{type:a,value:d}]},{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"In effect, a developer can use any account to make sandboxed payments to test the application. However, the production PayPal account "},{type:b,tag:am,props:{},children:[{type:a,value:an}]},{type:a,value:" be the Orlando Math Circle paypal account upgraded to a business account (if it isn't already)."}]},{type:a,value:d}]},{type:a,value:d},{type:b,tag:x,props:{src:"\u002Fomc-app\u002Fimages\u002Finstallation\u002Fservices\u002Fpaypal-1.png",alt:s},children:[]},{type:a,value:d},{type:b,tag:p,props:{className:[F,G]},children:[{type:a,value:d},{type:b,tag:"blockquote",props:{},children:[{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"This image was taken logged in on my personal PayPal account."}]},{type:a,value:d}]},{type:a,value:d},{type:b,tag:y,props:{id:ae},children:[{type:b,tag:j,props:{href:"#credential-acquisition"},children:[{type:a,value:E}]}]},{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"You can begin the process for obtaining API credentials on the "},{type:b,tag:j,props:{href:"https:\u002F\u002Fdeveloper.paypal.com\u002Fhome\u002F",rel:[H,I,J],target:K},children:[{type:a,value:"PayPal Developer"}]},{type:a,value:" website."}]},{type:a,value:d},{type:b,tag:aa,props:{},children:[{type:a,value:d},{type:b,tag:i,props:{},children:[{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"At the top of the page click on "},{type:b,tag:g,props:{},children:[{type:a,value:"Log in to Dashboard"}]},{type:a,value:n}]},{type:a,value:d}]},{type:a,value:d},{type:b,tag:i,props:{},children:[{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"If you are using a personal or business PayPal account, enter those credentials to continue. Otherwise, you may click on "},{type:b,tag:g,props:{},children:[{type:a,value:"Sign Up"}]},{type:a,value:" to create a developer account."}]},{type:a,value:d}]},{type:a,value:d},{type:b,tag:i,props:{},children:[{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"Ensure at the top of the page you are in the correct mode for your purpose. If you are looking to create credentials for testing ensure "},{type:b,tag:g,props:{},children:[{type:a,value:"Sandbox"}]},{type:a,value:" is selected, and "},{type:b,tag:g,props:{},children:[{type:a,value:"Live"}]},{type:a,value:" for real transactions."}]},{type:a,value:d},{type:b,tag:x,props:{src:"\u002Fomc-app\u002Fimages\u002Finstallation\u002Fservices\u002Fpaypal-2.png",alt:s},children:[]},{type:a,value:d}]},{type:a,value:d},{type:b,tag:i,props:{},children:[{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"Click on "},{type:b,tag:g,props:{},children:[{type:a,value:"Create App"}]},{type:a,value:" and enter an appropriate name for the application. When registering an application in sandbox mode they will create a fake PayPal business account for you. In a live environment, the Orlando Math Circle business account will need to be picked."}]},{type:a,value:d},{type:b,tag:x,props:{src:"\u002Fomc-app\u002Fimages\u002Finstallation\u002Fservices\u002Fpaypal-3.png",alt:s},children:[]},{type:a,value:d}]},{type:a,value:d},{type:b,tag:i,props:{},children:[{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"Once the application is registered you will be provided API credentials. The two pieces of information necessary to operate the application are the "},{type:b,tag:g,props:{},children:[{type:a,value:"Client ID"}]},{type:a,value:" and the "},{type:b,tag:g,props:{},children:[{type:a,value:"Secret"}]},{type:a,value:n}]},{type:a,value:d},{type:b,tag:ao,props:{type:"warning"},children:[{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"The client id is not sensitive information and more of an identifier. The secret is sensitive and should never be shared in a live environment."}]},{type:a,value:d}]},{type:a,value:d},{type:b,tag:x,props:{src:"\u002Fomc-app\u002Fimages\u002Finstallation\u002Fservices\u002Fpaypal-4.png",alt:s},children:[]},{type:a,value:d}]},{type:a,value:d},{type:b,tag:i,props:{},children:[{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"For the client id, it needs to be stored in the "},{type:b,tag:g,props:{},children:[{type:a,value:L}]},{type:a,value:" files for both the frontend and the backend. The secret key only needs to be installed for the backend. See the respective "},{type:b,tag:ab,props:{to:"\u002Finstallation\u002Fdevelopment"},children:[{type:a,value:"development"}]},{type:a,value:" or "},{type:b,tag:ab,props:{to:ap},children:[{type:a,value:aq}]},{type:a,value:" installation guide for adding the client id and secret key."}]},{type:a,value:d}]},{type:a,value:d}]},{type:a,value:d},{type:b,tag:y,props:{id:Z},children:[{type:b,tag:j,props:{href:"#configuration"},children:[{type:a,value:w}]}]},{type:a,value:d},{type:b,tag:"ul",props:{},children:[{type:a,value:d},{type:b,tag:i,props:{},children:[{type:a,value:"The frontend has a environment variable called "},{type:b,tag:g,props:{},children:[{type:a,value:ar}]},{type:a,value:" that should be added to the "},{type:b,tag:g,props:{},children:[{type:a,value:L}]},{type:a,value:" file in the frontend directory."}]},{type:a,value:d},{type:b,tag:i,props:{},children:[{type:a,value:"The backend has three environment variables to configure in the "},{type:b,tag:g,props:{},children:[{type:a,value:L}]},{type:a,value:" file in the backend directory."}]},{type:a,value:d}]},{type:a,value:d},{type:b,tag:p,props:{className:[M]},children:[{type:b,tag:c,props:{className:[N]},children:[{type:a,value:O}]},{type:b,tag:P,props:{className:[Q,as]},children:[{type:b,tag:g,props:{},children:[{type:b,tag:c,props:{className:[e,R,S]},children:[{type:a,value:ar}]},{type:b,tag:c,props:{className:[e,m]},children:[{type:a,value:z}]},{type:a,value:d},{type:b,tag:c,props:{className:[e,R,S]},children:[{type:a,value:"PAYPAL_SECRET_KEY"}]},{type:b,tag:c,props:{className:[e,m]},children:[{type:a,value:z}]},{type:a,value:d}]}]}]},{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"Note that the backend has an optional environment variable called "},{type:b,tag:g,props:{},children:[{type:a,value:"PAYPAL_SANDBOXED"}]},{type:a,value:" that is set to true by default. While true the application will not use live currency. "},{type:b,tag:g,props:{},children:[{type:a,value:"PAYPAL_SANDBOXED=false"}]},{type:a,value:" must be set in the backend "},{type:b,tag:g,props:{},children:[{type:a,value:L}]},{type:a,value:" file in order to use live currency along with the appropriate credentials."}]},{type:a,value:d},{type:b,tag:$,props:{id:af},children:[{type:b,tag:j,props:{href:"#sendgrid"},children:[{type:a,value:ag}]}]},{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"Unlike PayPal, SendGrid has a larger breadth of configuration options and more setup requirements. The "},{type:b,tag:ab,props:{to:"\u002Finstallation\u002Fproduction#postgresql-procurement"},children:[{type:a,value:"SendGrid Account Creation"}]},{type:a,value:" section of the production guide covers how to use Azure to create a SendGrid account, connect it to a domain, and generate authentication credentials necessary for the application."}]},{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"There are some issues with this approach for development. Azure provides a free SendGrid account that would work well during development. However, SendGrid in production is configured for domain authentication. Essentially, this means that SendGrid would be authorized to send an email claiming it came from any address so long as it was part of the domain, e.g. "},{type:b,tag:g,props:{},children:[{type:a,value:"help@orlandomathcircle.org"}]},{type:a,value:" and "},{type:b,tag:g,props:{},children:[{type:a,value:"no-reply@orlandomathcircle.org"}]},{type:a,value:" would both be viewed in Gmail as valid, authenticated senders. This setup procedure requires both a domain and some intricate domain record configuration. Domains aren't expensive, largely $12 or less for a year if the development team wishes to buy a temporary domain for testing the application, but this is not required. There are two approaches I would recommend:"}]},{type:a,value:d},{type:b,tag:aa,props:{},children:[{type:a,value:d},{type:b,tag:i,props:{},children:[{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"Create a SendGrid account through Azure but follow the setup guide in SendGrid for authenticating a single email. This would allow you to send emails saying they came from your personal email for testing purposes. The only downsides to this approach is adding a configurable way of changing the email sender in the application and emailing templates, covered in the next section."}]},{type:a,value:d}]},{type:a,value:d},{type:b,tag:i,props:{},children:[{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"Enable the Sandbox mode for emailing provided in the application. When "},{type:b,tag:g,props:{},children:[{type:a,value:"SENDGRID_IN_DEV"}]},{type:a,value:" is set to true in the "},{type:b,tag:g,props:{},children:[{type:a,value:O}]},{type:a,value:" file emails are printed to the console instead of actually being sent. The emailing experience is not something that needs to be constantly tested, so the production SendGrid API credentials could be used when doing tests to ensure emails are being sent correctly."}]},{type:a,value:d}]},{type:a,value:d}]},{type:a,value:d},{type:b,tag:y,props:{id:ah},children:[{type:b,tag:j,props:{href:"#emailing-templates"},children:[{type:a,value:ai}]}]},{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"SendGrid provides an optional feature called "},{type:b,tag:j,props:{href:"https:\u002F\u002Fsendgrid.com\u002Fsolutions\u002Femail-api\u002Fdynamic-email-templates\u002F",rel:[H,I,J],target:K},children:[{type:a,value:"Dynamic Emailing Templates"}]},{type:a,value:". Essentially, this allows you to store pre-defined HTML templates and use handlebar variable replacement, e.g. "},{type:b,tag:g,props:{},children:[{type:a,value:"Hello {{ user.name }},"}]},{type:a,value:" from SendGrid."}]},{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"It then provides a template id, e.g. "},{type:b,tag:g,props:{},children:[{type:a,value:"d-f182620740c14eaf9f20e9203a77568a"}]},{type:a,value:" that can be used in the backend. in the following screenshot the "},{type:b,tag:g,props:{},children:[{type:a,value:"AccountService"}]},{type:a,value:" is sending an email to the user, with a subject of "},{type:b,tag:g,props:{},children:[{type:a,value:"OMC: Email Verification"}]},{type:a,value:", undefined for custom HTML (poorly designed, I know!), the template id, and then any information that is used in the handlebar replacements in the template. The screenshot is sending the user a verification email with a link to confirm their account."}]},{type:a,value:d},{type:b,tag:p,props:{className:[M]},children:[{type:b,tag:c,props:{className:[N]},children:[{type:a,value:"account.service.ts"}]},{type:b,tag:P,props:{className:[Q,at]},children:[{type:b,tag:g,props:{},children:[{type:b,tag:c,props:{className:[e,t]},children:[{type:a,value:au}]},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:n}]},{type:b,tag:c,props:{className:[e,q]},children:[{type:a,value:"emailService"}]},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:n}]},{type:b,tag:c,props:{className:[e,av,T,q]},children:[{type:a,value:aw}]},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:U}]},{type:a,value:u},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:ax}]},{type:a,value:" to"},{type:b,tag:c,props:{className:[e,m]},children:[{type:a,value:A}]},{type:a,value:ay},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:n}]},{type:b,tag:c,props:{className:[e,q]},children:[{type:a,value:aw}]},{type:a,value:k},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:r}]},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:B}]},{type:a,value:u},{type:b,tag:c,props:{className:[e,l]},children:[{type:a,value:"\"OMC: Email Verification\""}]},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:B}]},{type:a,value:u},{type:b,tag:c,props:{className:[e,t,"nil"]},children:[{type:a,value:"undefined"}]},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:B}]},{type:a,value:u},{type:b,tag:c,props:{className:[e,l]},children:[{type:a,value:"\"d-f182620740c14eaf9f20e9203a77568a\""}]},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:B}]},{type:a,value:u},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:ax}]},{type:a,value:"\n    name"},{type:b,tag:c,props:{className:[e,m]},children:[{type:a,value:A}]},{type:a,value:ay},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:n}]},{type:b,tag:c,props:{className:[e,q]},children:[{type:a,value:az}]},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:B}]},{type:a,value:"\n    url"},{type:b,tag:c,props:{className:[e,m]},children:[{type:a,value:A}]},{type:a,value:k},{type:b,tag:c,props:{className:[e,aA]},children:[{type:b,tag:c,props:{className:[e,V,l]},children:[{type:a,value:W}]},{type:b,tag:c,props:{className:[e,C]},children:[{type:b,tag:c,props:{className:[e,o,f]},children:[{type:a,value:D}]},{type:b,tag:c,props:{className:[e,t]},children:[{type:a,value:au}]},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:n}]},{type:b,tag:c,props:{className:[e,q]},children:[{type:a,value:"config"}]},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:n}]},{type:b,tag:c,props:{className:[e,av,T,q]},children:[{type:a,value:"get"}]},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:U}]},{type:b,tag:c,props:{className:[e,"constant"]},children:[{type:a,value:"FRONTEND_URL"}]},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:X}]},{type:b,tag:c,props:{className:[e,o,f]},children:[{type:a,value:r}]}]},{type:b,tag:c,props:{className:[e,l]},children:[{type:a,value:"\u002Fverify?token="}]},{type:b,tag:c,props:{className:[e,C]},children:[{type:b,tag:c,props:{className:[e,o,f]},children:[{type:a,value:D}]},{type:a,value:e},{type:b,tag:c,props:{className:[e,o,f]},children:[{type:a,value:r}]}]},{type:b,tag:c,props:{className:[e,V,l]},children:[{type:a,value:W}]}]},{type:a,value:u},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:r}]},{type:a,value:d},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:X}]},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:aB}]},{type:a,value:d}]}]}]},{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"Emailing was not completely fleshed out before the team had to leave the application. The screenshot above is an exact exerpt, meaning it is using a template id that no longer exists and will not work. The templates are useful because emails are difficult to design due to extreme compatibility limitations with using emails, e.g. they're usually exceptionally narrow and don't support modern browser features (notably in Outlook)."}]},{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"It's recommended to ask for the credentials from the webmaster to create templates and probably configure the application to supply them as environment variables instead of hardcoded magic strings. Alternatively, you can use an email templating platform such as "},{type:b,tag:j,props:{href:"https:\u002F\u002Fmjml.io\u002F",rel:[H,I,J],target:K},children:[{type:a,value:"Mjml"}]},{type:a,value:" then then you could do something seen below. The advantage of this being that all email providers support raw HTML input and the backend would be able to hold more control over the emails without needing to pass SendGrid login information around."}]},{type:a,value:d},{type:b,tag:p,props:{className:[M]},children:[{type:b,tag:c,props:{className:[N]},children:[{type:a,value:"mjml.example.ts"}]},{type:b,tag:P,props:{className:[Q,at]},children:[{type:b,tag:g,props:{},children:[{type:b,tag:c,props:{className:[e,t,aC]},children:[{type:a,value:"import"}]},{type:a,value:k},{type:b,tag:c,props:{className:[e,"imports"]},children:[{type:a,value:aD}]},{type:a,value:k},{type:b,tag:c,props:{className:[e,t,aC]},children:[{type:a,value:"from"}]},{type:a,value:k},{type:b,tag:c,props:{className:[e,l]},children:[{type:a,value:"'mjml'"}]},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:aB}]},{type:a,value:"\n\n"},{type:b,tag:c,props:{className:[e,"doc-comment","comment"]},children:[{type:a,value:"\u002F**\n* Converts a mjml template to a string representing of HTML for\n* verifying a user\n*\u002F"}]},{type:a,value:d},{type:b,tag:c,props:{className:[e,t]},children:[{type:a,value:"const"}]},{type:a,value:k},{type:b,tag:c,props:{className:[e,"function-variable",T]},children:[{type:a,value:"verifyTemplate"}]},{type:a,value:k},{type:b,tag:c,props:{className:[e,m]},children:[{type:a,value:z}]},{type:a,value:k},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:U}]},{type:b,tag:c,props:{className:[e,"parameter"]},children:[{type:a,value:aE},{type:b,tag:c,props:{className:[e,m]},children:[{type:a,value:A}]},{type:a,value:k},{type:b,tag:c,props:{className:[e,"maybe-class-name"]},children:[{type:a,value:"User"}]},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:n}]},{type:a,value:k},{type:b,tag:c,props:{className:[e,q]},children:[{type:a,value:ac}]},{type:b,tag:c,props:{className:[e,m]},children:[{type:a,value:A}]},{type:a,value:" string"}]},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:X}]},{type:a,value:k},{type:b,tag:c,props:{className:[e,"arrow",m]},children:[{type:a,value:"=\u003E"}]},{type:a,value:k},{type:b,tag:c,props:{className:[e,T]},children:[{type:a,value:aD}]},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:U}]},{type:b,tag:c,props:{className:[e,aA]},children:[{type:b,tag:c,props:{className:[e,V,l]},children:[{type:a,value:W}]},{type:b,tag:c,props:{className:[e,l]},children:[{type:a,value:"\n  \u003Cmjml\u003E\n    \u003Cmj-body\u003E\n      \u003Cmj-section\u003E\n        \u003Cmj-column\u003E\n          \u003Cmj-text\u003E\n            Hello "}]},{type:b,tag:c,props:{className:[e,C]},children:[{type:b,tag:c,props:{className:[e,o,f]},children:[{type:a,value:D}]},{type:a,value:aE},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:n}]},{type:b,tag:c,props:{className:[e,q]},children:[{type:a,value:az}]},{type:b,tag:c,props:{className:[e,o,f]},children:[{type:a,value:r}]}]},{type:b,tag:c,props:{className:[e,l]},children:[{type:a,value:"!\n\n            Please visit \u003Ca href=\""}]},{type:b,tag:c,props:{className:[e,C]},children:[{type:b,tag:c,props:{className:[e,o,f]},children:[{type:a,value:D}]},{type:a,value:ac},{type:b,tag:c,props:{className:[e,o,f]},children:[{type:a,value:r}]}]},{type:b,tag:c,props:{className:[e,l]},children:[{type:a,value:"\"\u003E"}]},{type:b,tag:c,props:{className:[e,C]},children:[{type:b,tag:c,props:{className:[e,o,f]},children:[{type:a,value:D}]},{type:a,value:ac},{type:b,tag:c,props:{className:[e,o,f]},children:[{type:a,value:r}]}]},{type:b,tag:c,props:{className:[e,l]},children:[{type:a,value:"\u003C\u002Fa\u003E to verify your email.\n          \u003C\u002Fmj-text\u003E\n        \u003C\u002Fmj-column\u003E\n      \u003C\u002Fmj-section\u003E\n    \u003C\u002Fmj-body\u003E\n  \u003C\u002Fmjml\u003E\n"}]},{type:b,tag:c,props:{className:[e,V,l]},children:[{type:a,value:W}]}]},{type:b,tag:c,props:{className:[e,f]},children:[{type:a,value:X}]},{type:a,value:d}]}]}]},{type:a,value:d},{type:b,tag:$,props:{id:aj},children:[{type:b,tag:j,props:{href:"#twitter"},children:[{type:a,value:_}]}]},{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"Registering an application with Twitter has the biggest administrative hurdle. Twitter requires that you "},{type:b,tag:j,props:{href:"https:\u002F\u002Fdeveloper.twitter.com\u002Fen\u002Fapply-for-access",rel:[H,I,J],target:K},children:[{type:a,value:"apply for access"}]},{type:a,value:" and describing your "},{type:b,tag:"em",props:{},children:[{type:a,value:"exact"}]},{type:a,value:" use-case. While we were developing the application I had described that I am a developer creating an application for the Orlando Math Circle non-profit only requesting to lookup tweets from the Orlando Math Circle account."}]},{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"This request was marked insufficient and required more clarification. I then described exactly that the homepage of the mobile application would utilize tweets from the organization formatted as news posts and when clicked, took you directly to Twitter. I was clear to describe that no tweets would be made using the API, and tweets would not be stored or archived anywhere."}]},{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"This had seemed sufficient and I was approved to pull 500,000 tweets monthly. Assuming the homepage only pulled the last 20 tweets from OMC, that would require 25,000 visits. However, this is further reduced because caching was applied to that route that lasts 60 seconds. This means if multiple people request the "},{type:b,tag:g,props:{},children:[{type:a,value:"\u002Ftwitter"}]},{type:a,value:" route within a minute, it will send the cached tweets instead of constantly asking Twitter for the same tweets in rapid succession."}]},{type:a,value:d},{type:b,tag:y,props:{id:ak},children:[{type:b,tag:j,props:{href:"#credential-acquisition-1"},children:[{type:a,value:E}]}]},{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"Once approved for the Twitter API, an application is generated for your described use-case. I am not able to show the process, but in the projects area of the developer portal there will be an area to create an API key and secret."}]},{type:a,value:d}]},{type:a,value:d},{type:b,tag:ao,props:{type:"info"},children:[{type:a,value:d},{type:b,tag:p,props:{className:[F,G]},children:[{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"Save the credentials somewhere as Twitter will not show them to you again. You may regenerate the credentials, but any applications using those old credentials will no longer connect."}]},{type:a,value:d}]},{type:a,value:d}]},{type:a,value:d},{type:b,tag:x,props:{src:"\u002Fomc-app\u002Fimages\u002Finstallation\u002Fservices\u002Ftwitter-1.png",alt:_},children:[]},{type:a,value:d},{type:b,tag:p,props:{className:[F,G]},children:[{type:a,value:d},{type:b,tag:y,props:{id:al},children:[{type:b,tag:j,props:{href:"#configuration-1"},children:[{type:a,value:w}]}]},{type:a,value:d},{type:b,tag:h,props:{},children:[{type:a,value:"The backend configuration file "},{type:b,tag:g,props:{},children:[{type:a,value:O}]},{type:a,value:" should be configured with the key and secret gotten from the last step."}]},{type:a,value:d},{type:b,tag:p,props:{className:[M]},children:[{type:b,tag:c,props:{className:[N]},children:[{type:a,value:O}]},{type:b,tag:P,props:{className:[Q,as]},children:[{type:b,tag:g,props:{},children:[{type:b,tag:c,props:{className:[e,R,S]},children:[{type:a,value:"TWITTER_KEY"}]},{type:b,tag:c,props:{className:[e,m]},children:[{type:a,value:z}]},{type:a,value:d},{type:b,tag:c,props:{className:[e,R,S]},children:[{type:a,value:"TWITTER_SECRET"}]},{type:b,tag:c,props:{className:[e,m]},children:[{type:a,value:z}]},{type:a,value:d}]}]}]},{type:a,value:d}]}]},dir:"\u002Finstallation",path:"\u002Finstallation\u002F4.services",extension:".md",createdAt:aF,updatedAt:aF,position:"999900040000",to:"\u002Finstallation\u002Fservices",language:"en",draft:false},prev:{slug:aq,title:"Production",to:ap},next:{slug:Z,title:w,to:"\u002Finstallation\u002Fconfiguration"}}],fetch:{},mutations:void 0}}("text","element","span","\n","token","punctuation","code","p","li","a"," ","string","operator",".","interpolation-punctuation","div","property-access","}","PayPal","keyword","\n  ",3,"Configuration","img","h3","=",":",",","interpolation","${","Credential Acquisition","prose","dark:prose-dark","nofollow","noopener","noreferrer","_blank",".env","nuxt-content-highlight","filename","backend\u002F.env","pre","line-numbers","assign-left","variable","function","(","template-punctuation","`",")",2,"configuration","Twitter","h2","ol","nuxt-link","link","paypal","credential-acquisition","sendgrid","SendGrid","emailing-templates","Emailing Templates","twitter","credential-acquisition-1","configuration-1","strong","must","alert","\u002Finstallation\u002Fproduction","production","PAYPAL_CLIENT_ID","language-bash","language-js","this","method","email","{"," user","name","template-string",";","module","mjml2html","user","2021-03-28T22:23:27.374Z")));