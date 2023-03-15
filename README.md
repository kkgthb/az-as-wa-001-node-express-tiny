My apologies for the unconventional folder structure -- when I'm trying to figure out tooling _around_ a codebase, I like to be sure I'm giving things ["non-magic" filepaths](https://katiekodes.com/break-rebuild-jamstack/).

Anyway, once I clone this repo into an Azure DevOps repo and click **Pipelines** -> **Pipelines** -> **New Pipeline** -> **Azure Repos Git** -> _(`the name of my ADO repo`)_ -> **Existing Azure Pipelines YAML file** -> **Path** of `/cicd/my-azure-build-pipeline.yml` -> **Continue** and run it...

...I see that it outputs an artifact with the following file structure:

```
MyBuiltWebsite/
├─ node_modules/
│  └─ ...
├─ package.json
└─ server.js
```

Then under **Pipelines** in left-nav, I click **Releases** and in the middle click the **New** picklist and its **New release pipeline** option.

I close the **Select a template** flyout at right, and in the left-hand side of the release pipeline GUI design area, in the **Artifacts** box, I click **Add**.

I leave the **Source type** icon set to **Build** and leave **Project** set to _(`the name of my ADO project`)_.  I change **Source (build pipeline)** to _(`the name of my ADO repo`)_.  I leave **Default version** on `Latest`.  I change **Source alias** from something like _(`_the name of my ADO repo`)_ to `MyBuiltWebsite`.

In the left-hand side of the release pipeline GUI design area, in the **Stages** box, click **Add** and then **New stage**.

In the **Select a template** flyout at right, I choose **Deploy a Node.js app to Azure App Service** and click **Apply**.

I rename **Stage name** to something like `My arbitrary stage name`, then at left click on the **1 job, 1 task** link.

In the `My arbitrary stage name` task up top, I drop down **Azure subscription** and set it to the one showing up under **Available Azure service connections** _(which I'd already set up earlier by choosing the one under **Available Azure Subscriptions**, dropping down the **Authorize** extended picklist, clicking **Advanced options**, leaving it on **Service Principal Authentication**, setting the **Resource Group** to the same one that I'd already created an F1 Linux Azure App Service Plan resource and an Azure Web App resource in, clicking the **Allow all pipelines to use this connection** checkbox, and clicking **OK**)_.  I also change **App type** to **Web App on Linux**, pick the Azure Web App I'd already created out of the **App Service Name** dropdown, and set **Startup command** to `npm start**`.

In the `Run on agent` slightly indented task below that, I change the **Agent pool** to **Azure Pipelines** and the **Agent Specification** to **ubuntu-latest**.

In the `Deploy Azure App Service` slightly indented task at bottom, I change **Package or folder** to `$(System.DefaultWorkingDirectory)/MyBuiltWebsite/MyBuiltWebsite`, which I can see with the `...` button has this file structure:

```
Linked artifacts/
├─ MyBuiltWebsite (Build)/
│  ├─ MyBuiltWebsite/
│  │  ├─ node_modules/
│  │  │  └─ ...
│  │  ├─ package.json
│  │  └─ server.js
```

I also change **Runtime Stack** to **18 LTS (Node|18-lts)** and make sure **Startup command** says `npm start`.

Then I click **Create release** in the upper right and watch the logs.

The `Deploy Azure App Service` log claims to have "Successfully deployed web package to App Service", but when I visit `http://my-app-service-name.azurewebsites.net`, it takes forever and finally 504-errors out.

---

Thanks [Donald](https://www.linkedin.com/in/donald-c-20842944/) for troubleshooting that the `server.js` script needs to be `const port = (process.env.PORT || 3000);` not `const port = 3000;` ~~and that the **Settings** -> **Configuration** for the Azure web app resource needed an extra **application setting** added to it with a **Name** of `PORT` and a **Value** of `3000`~~ _(configurable by appending ` -PORT 3000` to **App settings** under the `Deploy Azure App Service` task of the release pipeline as an alternative, but actually not needed at all -- fine to just let Azure App Service Web App resource pick a random port at its leisure and implicitly set `PORT` now that we have `const port = (process.env.PORT || 3000);` in place.  I deleted the extra **application setting** and tried, and confirmed it to be the case that nothing in all of Azure config needs to think about a number `3000` at all -- that can just be a handy thing for testing on my local machine)_.

[Docs:](https://learn.microsoft.com/en-us/azure/app-service/configure-language-nodejs?pivots=platform-linux#get-port-number)

> Your Node.js app needs to listen to the right port to receive incoming requests.  App Service sets the environment variable PORT in the Node.js container, and forwards the incoming requests to your container at that port number. To receive the requests, your app should listen to that port using `process.env.PORT`.

My site is live on the internet now!
