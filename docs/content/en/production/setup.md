---
title: Setup
description: Setup procedures for the production environment.
category: Production
position: 4
---

This page describes the resources and general setup processes for setting up the app in a production environment.

<alert type="warning">

This is not meant to be followed along by high school users. The technologies used require paid Azure resources.

</alert>

## Requirements

The following items will be required before setting up the application.

1. Azure Portal with configured subscription. The subscription is merely the payment grouping that has the credits available for use.
2. Domain Management. The application is designed to operate with the frontend on a primary domain and the api on an entirely separate domain, e.g. `app.orlandomathcircle.org` and `api.orlandomathcircle.org`, and need to be configured using A records to the virtual machine. SendGrid emailing will use a few records to ensure email authentication.
2. PayPal API credentials. The OMC personnel who owns the Orlando Math Circle PayPal account needs to follow the steps to [Obtain PayPal Credentials](https://developer.paypal.com/docs/api/overview/#get-credentials) through registering the application on the developer dashboard. This yields a `Client ID` and `Client Key`. Both identifiers are necessary to make PayPal payments. For safety during testing, developers can use their own PayPal developer credentials in a Sandbox mode to not risk accidentially using real money.
2. Twitter API Credentials. Someone within the OMC organization needs to apply to utilize the Twitter API. They utilize an [approval process](https://developer.twitter.com/en/apply-for-access) and provide a `Client Key` and `Client Secret` similar to PayPal.
3. SendGrid API Credentials. This tutorial will go through setting up SendGrid as it is part of Azure.

## Azure

### Virtual Machine Procurement

The virtual machine that should host the application is a called a `Standard_B2s`, which consists of 2 vCPU cores and 4GB of memory. To manage virtual machines you can visit the `Virtual machines` resource in the Azure portal.
<img src="images/production/azure_vms.png" alt="Azure Virtual Machines Sidebar" />

Find the add button at the top of the virtual machines directory and select the first option in the dropdown.

<img src="images/production/azure_add.png" alt="Azure Add Virtual Machine" />

The page should show various configurations for allocating a new virtual machine. The first option of which are the subscription and resource group. Subscriptions are services that are billed together and having a singular default subscription is sufficient. The resource group is like a "folder to organize and manage your resources", but creating a new resource group of any name will suffice. This guide does not cover resource group permissions.

<img src="images/production/azure_setup_1.png" alt="Azure Groups" />

The next options are the `instance details` which consist of the desired amount of power, its location, and the operating system.

<img src="images/production/azure_setup_2.png" alt="Azure Instance Details" />

- The virtual machine name is an identifier, I have chosen `omc-app`.
- The `region` affects which datacenter to allocate the machine on, the closer to the users the better the latency. For Florida, `(US) East US` is ideal.
- Ignore the `Availability options` and `Availability zone` settings.
- For the `image` select `see all images` and search for Ubuntu to find `Ubuntu Server 20.04 LTS`. If this guide is being utilized in the future, the latest **LTS** version of Ubuntu is desired.
- Do not tick the `Azure Spot instance` setting.
- For `Size` the option desired is `Standard_B2s - 2 vcpus, 4 GiB memory ($30.37/month)`. It can be found by selecting `See all sizes` and typing `B2s` into the search bar.

Next, some sort of credentials need to be given to allow for accessing the default administrator account. As a personal preference I have used an RSA public key so the virtual machine simply recognizes my computer without having to enter a password all the time. This can be changed later and will not affect secondary users added to the VM.

<img src="images/production/azure_setup_3.png" alt="Azure Account Details" />

The last set of configurations on this page are the `Inbound port rules` which describes which ports are open to the internet by default. `SSH (22)` is selected by default for remote access, but be sure to also enable `HTTPS (443)` and `HTTP (80)` as those are the ports responsible for website traffic. Note that this is not exhaustive and does not include the PostgreSQL port (if remote database management is desired).

<img src="images/production/azure_setup_4.png" alt="Azure Port Details" />

The rest of the pages consist of more advanced features that aren't required to be changed or can be changed at a later date when necessary. Of note, the `Standard B2s` instance comes with 8 GiB of temporary storage by default. While not an immediate concern, eventually the uploads will consume that free space and require the instance to be affixed with a managed storage drive.

Click on `Review + create` and it may ask for additional contact information such as the preferred email address and phone number for support issues. Once the information is entered, click on `Create` where the review button was at the bottom of the page and allow for the instance to be generated. It should take only a couple of minutes for deployment to complete.

<img src="images/production/azure_setup_5.png" alt="Azure Instance Details" />

Once the instance is deployed it can be found by visiting the "Virtual machines" section of the Azure portal. Copy the `Public IP address` and using the login information input in the credentials section of the instance configuration, connect to the instance using your preferred terminal.

<alert type="info">

Identifying information is not hidden from the following screenshots, though this virtual machine instance was destroyed before this tutorial went live, do not share screenshots showing connection information.

</alert>

<img src="images/production/azure_terminal_1.png" alt="Azure Instance Details" />

### PostgreSQL Procurement

PostgreSQL can be obtained in a number of different ways. The virtual machine is more than strong enough to host PostgreSQL alongside the server, within Docker, or connect through a managed instance. The database is what contains the most sensitive information and to ensure it isn't lost due to the volatility of the temporary virtual machine instance storage, using a managed PostgreSQL instance from Azure is preferred. This incurs a similar cost to the virtual machine itself but works best given the amount of credits OMC can utilize.

- To get sarted, in the search box of the Azure portal type in `Postgres` and select the option `Azure Database for PostgreSQL servers`.

<img src="images/production/azure_pg_1.png" />

Once at the directory listing, click on `Add` at the top and click create underneath `Single Server`.

For the `Project details` section, fill it out similarly to the virtual machine.

Under `Server details` start fill out the sections as appropriate:
- Give the server a name, though it does not matter. I chose `omc-db`.
- Do not change `Data source`.
- Ensure the `Location` is set to `(US) East US`.
- Under `Version` change it to `11`. This changes the PostgreSQL version to 11.

<img src="images/production/azure_pg_2.png" />

Click on `Configure server` under `Compute + storage` and the end of the `Server details` section. Here, click on the tab at the top to change the server type to `Basic`. Modify the settings to match, with a picture as a reference.

<alert type="info">

If the image is too small to see, open it in a new tab to view it in full size.

</alert>

<img src="images/production/azure_pg_3.png" />

1. Slide the `vCore` setting until it says `1 vCore`. This is the number of CPU cores the database server will utilize. One is sufficient for a small application.
2. Slide the `Storage` setting to the far left until it says `5 GB`. 5 Gigabytes of database storage is a lot for the app and will likely not be reached. This will scale if necessary due to the following setting, but setting this as low as possible cuts back on unnecessary costs.
3. Ensure the `Storage Auto-growth` setting remains on **Yes**. In the event the database is nearly reaching the 5 GB size limit, it will grow automatically. 
4. Leave the `Backup Retention Period` set to **7 Days**. Backups and retention policies can be modified by OMC if it is determined necessary.

Click on `OK` at the bottom to return to the PostgreSQL creation page. Fill out the `Administrator account` section as desired with the desired login credentials for the web administrator.

<img src="images/production/azure_pg_4.png" />

Click on `Review + create` at the bottom and wait for provisioning.

<img src="images/production/azure_pg_5.png" />

Once provisioning is finished, return to the PostgreSQL directory listing and find the server instance. The database needs to be configured to accept certain authorized incoming connections.

While still on the management page for the database, on the left hand side under `Settings`, click on `Connection security`. From there, click on `Add current client IP address ( <your ip> )`. This will need to be done to each computer that wants remote access, or for testing purposes you can click on the `+ Add 0.0.0.0 - 255.255.255.255` to allow all IP addresses to connect. Go ahead and also add the IP address of the virtual machine. Once done, click on `Save` in the above toolbar.

<img src="images/production/azure_pg_6.png" />

Using the `Admin username`, the `Server name` and the password I set during the setup procedure, I am able to connect to the database using my preferred client, DataGrip. By default, PostgreSQL uses a port of 5432. Azure provides a guide on [configuring a firewall rule](https://docs.microsoft.com/en-us/azure/postgresql/quickstart-create-server-database-portal#configure-a-firewall-rule) and [connecting to the server with psql](https://docs.microsoft.com/en-us/azure/postgresql/quickstart-create-server-database-portal#connect-to-the-server-with-psql) CLI and making a new database manually if you do not have a database management tool.

<img src="images/production/azure_pg_7.png" />

While connected, create a new database for the application to use. I created one named `omc`, though the application can be configured for any database name.

### SendGrid Account Creation

The SendGrid service provided by Azure will handle emailing. In the Azure portal search box type in SendGrid and click on `SendGrid Accounts`. In the directory, click on `New`.

Setting up a new SendGrid account is largely administrative. The only configurable setting is the pricing tier which can be left on the lowest pricing tier. The contact information should be for the webmaster. Click on `Review + create` and await the deployment provisioning.

<img src="images/production/sendgrid_1.png" />

Once completed, visit the SendGrid account resource that was just created and click on the blue `Manage` button. A welcome page will greet you, but do not click on the blue button, instead click on `Authenticate a domain instead`.

<img src="images/production/sendgrid_2.png" />

The next page will ask you where the DNS servers for the website are. Unless you have knowingly changed them they default to the provider in which the domain was purchased from. In my case that would be Google, so I selected `Google Cloud` from the dropdown. For Bluehost, the domain provider of OMC, it will need to be input manually in the "Other" option at the bottom. Also select `Yes` for the second option.

<img src="images/production/sendgrid_3.png" />

On the next page it will simply ask for the domain you are sending from. This is the root domain of the website, e.g. `orlandomathcircle.org` or `johng.dev` in my case. On the following page it will provide a list of `CNAME` records to add to the domain in order to verify ownership and provide other security features. I will be doing this on Google Domains, though the process is usually ubiquitous.

<img src="images/production/sendgrid_4.png" />
<img src="images/production/sendgrid_5.png" />

Once they are added you can click on the checkbox at the bottom verifying that they were added and click on `Verify` to check. If any are not working it will let you know which records are not found. It rarely takes more than a minute for DNS changes to propagate, though it rarely can take much longer. Once this is complete and SendGrid gives you a success message, click on `Settings` on the left toolbar and then `API Keys` beneath it.

Create a new API Key, name it `App Credentials` or similar, and make sure it has full access.

<img src="images/production/sendgrid_6.png" />

Once created it will show you a key. Click to copy it and paste it into a file to save it temporarily until it's used later. The key will not be shown again, though it can be regenerated.

<alert type="info">

The application uses emailing templates to send emails in a structured way, however they were not completed by the first team. The second team will either need to create emailing templates or the app can send text-based emails as a fallback.

</alert>

## Virtual Machine Setup
Once the virtual machine is operational, some software needs to be installed in order to run the application.

### Installing Node.js

Node.js, the JavaScript server runtime, is installed using a small tool and a couple of commands.

- Visit the [NVM Installation Script](https://github.com/nvm-sh/nvm#installing-and-updating) page and copy the first link and run it in the terminal on the virtual machine. This installs the `Node Version Manager`, making it easy to install Node.js.
- Once that is finished, reopen the terminal and connect to the virtual machine once again.
- Run the following command.
  ```
  nvm install 14
  ```

- Double check that Node.js is now installed and set to the correct version.
  ```
  node -v
  ```

<img src="images/production/azure_terminal_2.png" alt="Azure Instance Details" />

### Downloading the Application

Now the actual application needs to be downloaded and the dependencies installed. Where the code is downloaded is not important, so I will be putting it in the `/home` directory of the primary admin user. For enhanced security, an `app` user could be created that only has the necessary permissions to run the application and nothing else, but this is not covered here.

In the preferred directory to house the code, run the following command.

```
git clone https://github.com/duckies/omc-app.git app
```

Then navigate into the newly created folder.

```
cd app
```

Run the sequence of commands to install the dependencies in the `frontend` and `backend` folders.

```
cd backend
```

```
npm install
```

```
cd ../frontend
```

```
npm install
```

### Configuring the Application

The application requires 2 configuration files to be created in order to know how to operate. While we are in the frontend folder create a file called `.env`.

```
touch .env
```

Then using your preferred editor, edit the file. I will be utilizing the terminal so I will quickly do this using nano, though utilizing a FTP program such as [WinSCP](https://winscp.net/eng/download.php) and editing it with a text editor is also possible.

```
nano .env
```

Unless you are changing other defaults, which are discussed in the ***(TBA Configuration Explanation Page)***, the frontend needs to know how to connect to the backend API and what the domain is for the frontend.

<alert type="warning">

It is expected that the Orlando Math Circle application will be available at `app.orlandomathcircle.org` and the backend API at `api.orlandomathcircle.org`. However, for the tutorial I will be using a personal domain, `johng.dev` and the respective `app.johng.dev` and `api.johng.dev`. So replace the domain where appropriate.

</alert>

Fill the contents of the `.env` file using your editor with the following:

```env
STATIC_BASE=https://api.johng.dev
AXIOS_BROWSER_BASE_URL=https://api.johng.dev
PAYPAL_CLIENT_ID=<provided by PayPal>
```

Now navigate to the backend folder and start a new `.env` there as well.

```
cd ../backend
```

```
touch .env
```

```
nano .env
```

Fill the contents of tthe `.env` file using your editor with the following then save and close the file.

```env
SECRET=<random string with no spaces>
FRONTEND_URL=https://app.johng.dev
ADMIN_EMAIL=<your email>
SENDGRID_IN_DEV=true
SENDGRID_API_KEY=<provided by SendGrid>
SERVE_STATIC=true
DATABASE_NAME=<as configured previously>
DATABASE_HOST=<as given by Azure>
DATABASE_USER=<as configured previously>
DATABASE_PASS=<as configured previously>
DATABASE_SSL=true
PAYPAL_CLIENT_ID=<provided by PayPal>
PAYPAL_SECRET_KEY=<provided by PayPal>
TWITTER_KEY=<provided by Twitter>
TWITTER_SECRET=<provided by Twitter>
```

<alert type="warning">

The application will not accept real PayPal payments by default and requires `PAYPAL_SANDBOXED` to be set to `false` in the backend `.env` file. Ensure the app is tested thoroughly and working properly in a new deployment before turning this on.

SendGrid will also not send emails unless `SENDGRID_IN_DEV` is set to `false`. When set to true, emails are printed to the console.

</alert>

Run the following command while in the `/backend` subdirectory to attempt to connect to the database and create all of the necessary tables.

```
npx mikro-orm schema:create -r --fk-checks
```

If an error appears, it will describe the nature of the connection problem, otherwise the database and tables are all setup.

Now it should be possible to test that everything is working correctly by building and starting the backend. Run these commands in the `/backend` subdirectory and `Nest application successfully started` should appear.

```
npm run build && npm run start
```

<img src="images/production/setup_2.png" />

### Installing Nginx

The backend and frontend run by default on the local ports of 3000 and 8080 respectively. In order to expose those ports to the internet and map them to their respective domains NGINX acts as a proxy. Run the following commands to update the Ubuntu repositories and then install Nginx.

```
sudo apt update && sudo apt install nginx
```

Test that Nginx is running by looking for `active (running)` after the following command. You can also visit the IP address of the virtual machine and you should see a `Welcome to nginx!` message.

```
systemctl status nginx
```

Next we need to connect the virtual machine to the domains for the frontend and backend. In your domain registrar, add a new `A` record for the `app` and `api` subdomain both pointing to the IP of the virtual machine. Before continuing the DNS needs to propagate these changes, to ensure they are already propagated you may use the `dig api.<domain>` command to ensure the `A` record and IP address are listed correctly.

Once that is done, we need to tell Nginx about these two domains.

```
sudo touch /etc/nginx/sites-available/api.johng.dev
sudo touch /etc/nginx/sites-available/app.johng.dev
```

Then we need to link these files from the available sites to the enabled sites.

```
sudo ln -s /etc/nginx/sites-available/api.johng.dev /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/app.johng.dev /etc/nginx/sites-enabled/
```

We now need to configure each server block.

```
sudo nano /etc/nginx/sites-available/api.johng.dev
```

Copy the following information into the server block. Be sure to set the correct `server_name`.

```
server {
  listen 80;
  listen [::]:80;
  
  server_name api.johng.dev;
  
  gzip            on;
  gzip_types      text/plain application/xml text/css application/javascript;
  gzip_min_length 1000;

  location / {
    expires $expires;

    proxy_redirect                      off;
    proxy_set_header Host               $host;
    proxy_set_header X-Real-IP          $remote_addr;
    proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto  $scheme;
    proxy_read_timeout                  1m;
    proxy_connect_timeout               1m;
    proxy_pass                          http://127.0.0.1:3000;
  }

  # Certbot renewal
  location ^~ /.well-known/acme-challenge/ {
    alias /var/www/acme-challenge/;
  }
}
```

Then do the same for the other file.

```
sudo nano /etc/nginx/sites-available/app.johng.dev
```

```
map $sent_http_content_type $expires {
  "text/html" epoch;
  "text/html; charset=utf-8" epoch;
  default off;
}

server {
  listen 80;
  listen [::]:80;
  
  server_name app.johng.dev;

  gzip on;
  gzip_types text/plain application/xml text/css application/javascript;
  gzip_min_length 1000;

  location / {
    expires $expires;

    proxy_redirect off;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 1m;
    proxy_connect_timeout 1m;
    proxy_pass http://127.0.0.1:8080;
  }

  location ^~ /.well-known/acme-challenge/ {
    alias /var/www/acme-challenge/;
  }
}
```

Then we want to make sure that Nginx will accept the configuration. Run `sudo nginx -t` and make sure there are no errors. Nginx is particular about the format of the server block files.

If the configuration is valid we can reload Nginx. 

```
sudo systemctl reload nginx
```

From here we want to setup LetsEncrypt to enable SSL.

```
sudo apt install certbot python3-certbot-nginx
```

Once that is installed we can run Certbot for both domains.

```
sudo certbot --nginx -d api.johng.dev -d app.johng.dev
```

It will ask for some basic information and terms of service agreeances. However, if everything is successful it will complete the registraion for both domains. It will ask if you want to redirect HTTP traffic to HTTPS traffic, and we do, but we'll modify this ourselves so select option 1.

<img src="images/production/setup_3.png" />

Here we will open both block files again and make some minor changes.

```
sudo nano /etc/nginx/sites-available/api.johng.dev
...
sudo nano /etc/nginx/sites-available/app.johng.dev
```

Remove the following lines from *both* files.

```
  listen 80;
  listen [::]:80;
```

Ensure that the configuration is valid.

```
sudo nginx -t
```

Restart Nginx

```
sudo systemctl reload nginx
```

LetsEncrypt certificates only last 90 days or so, so we want to make sure the Certbot installed the services to auto-renew the certificate for us. Verify that the following service reports `active (waiting)`.

```
sudo systemctl status certbot.timer
```

Also make sure the following dry-run of a Certbot renewal works correctly. This ensures our Nginx sites are configured properly.

```
sudo certbot renew --dry-run
```

We can quickly test that everything is setup by starting the backend server and going to `https://api.johng.dev/`.

```
cd ~/app/backend # Or wherever it was installed
```

```
npm run start
```

The following text should be displayed when visiting `https://api.johng.dev/` (or similar for your domain).

```
{"statusCode":404,"message":"Cannot GET /","error":"Not Found"}
```

This is a JSON API response, meaning the backend is successfully operational. Also ensure that the little lock icon by the address bar indicates a secure SSL connection. You should be able to now open a second terminal while the backend code is running and test that `https://app.johng.dev/` is working by starting the frontend.

<alert type="warning">

The frontend may take a considerable amount of time to build. So while it may appear to hang at times, it is still running.

</alert>

```
cd ~/app/frontend
```

```
npm run build && npm run start
```

<img src="images/production/setup_4.png" />

Now visit `https://app.johng.dev` (`https://app.orlandomathcircle.org`) in the browser and it should show the app landing page. Also verify that the browser indicates the connection is secure.

### Configuring PM2

The virtual machine can manage starting and restarting the frontend and backend on its own through the use of the PM2 Node.js library. From anywhere, we can install PM2 globally.

```
npm install -g pm2
```

We can now add the frontend and backend to be managed by PM2. Stop the currently running frontend and backend before running the next commands.

```
cd ~/app/backend && pm2 start npm --name "backend" -- start
cd ~/app/frontend && pm2 start npm --name "frontend" -- start
```

PM2 will now ensure that the frontend and backend stay running and restart if they close for whatever reason. Logs for each can be viewed with `pm2 logs <name|id|all>`. However, PM2 will need to configure a startup script to handle the case when the virtual machine itself restarts or crashes and reboots.

```
pm2 startup
```

It will print out the command you need to copy and paste to enable the startup script. Run that command and you're done.

### Final Steps

There are a couple remaining steps to setting up the application. By default the backend is expecting to host static files itself. Ideally this may be best handled by Nginx for caching reasons if the new team wishes to undertake this change. Uploads are not stored within the directory containing the application code as it's meant to be a volatile directory where changes to the code can mess with directories. Thus, by default the backend will create an `uploads` directory at the same level as the folder where the code is stored and we need to copy the default avatar images into there.

```
cp -R ~/app/images/defaults ~/uploads
```

Lastly, in order to create an administrator account either a regular account can be made and the database modified to change a users roles to `{admin}`, or the `ADMIN_EMAIL` setting in the backend `.env` file is set so that a user registering with that exact email will be promoted to admin during registration.

Once an admin account exists, other admins can be promoted from the admin panel.
