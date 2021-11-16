<img src="https://disinfo.quaidorsay.fr/assets/img/logo.png" width="140">

# Open Terms Archive

**Services** have **terms** that can change over time. _Open Terms Archive_ enables users rights advocates, regulatory bodies and any interested citizen to follow the **changes** to these **terms** by being **notified** whenever a new **version** is published, and exploring their entire **history**.

> Les services ont des conditions générales qui évoluent dans le temps. _Open Terms Archive_ permet aux défenseurs des droits des utilisateurs, aux régulateurs et à toute personne intéressée de suivre les évolutions de ces conditions générales en étant notifiée à chaque publication d'une nouvelle version, et en explorant leur historique.

[🇫🇷 Manuel en français](README.fr.md).

## Table of Contents

- [How it works](#how-it-works)
- [Exploring the versions history](#exploring-the-versions-history)
  - [Notes](#notes)
- [Be notified](#be-notified)
  - [By email](#by-email)
  - [By RSS](#by-rss)
    - [Recap of available RSS feeds](#recap-of-available-rss-feeds)
  - [Unsubscribe](#unsubscribe)
- [Analysing the snapshots history](#analysing-the-snapshots-history)
- [Contributing](#contributing)
  - [Adding a new service](#adding-a-new-service)
- [Using locally](#using-locally)
  - [Installing](#installing)
  - [Setting up the database](#setting-up-the-database)
  - [Configuring](#configuring)
    - [Configuration file](#configuration-file)
    - [Environment variables](#environment-variables)
      - [SMTP_HOST and SMTP_USERNAME](#smtp_host-and-smtp_username)
      - [HTTP_PROXY and HTTPS_PROXY](#http_proxy-and-https_proxy)
      - [SENDINBLUE_API_KEY](#sendinblue_api_key)
      - [NODE_ENV](#node_env)
  - [Running](#running)
  - [Deploying](#deploying)
- [License](#license)

## How it works

_Note: Words in bold are [business domain names](https://en.wikipedia.org/wiki/Domain-driven_design)._

**Services** are **declared** within _Open Terms Archive_ with a **declaration file** listing all the **documents** that, together, constitute the **terms** under which this **service** can be used. These **documents** all have a **type**, such as “terms and conditions”, “privacy policy”, “developer agreement”…

In order to **track** their **changes**, **documents** are periodically obtained by **fetching** a web **location** and **selecting content** within the **web page** to remove the **noise** (ads, navigation menu, login fields…). Beyond selecting a subset of a page, some **documents** have additional **noise** (hashes in links, CSRF tokens…) that would be false positives for **changes**. _Open Terms Archive_ thus supports specific **filters** for each **document**.

However, the shape of that **noise** can change over time. In order to recover in case of information loss during the **noise filtering** step, a **snapshot** is **recorded** every time there is a **change**. After the **noise** is **filtered out** from the **snapshot**, if there are **changes** in the resulting **document**, a new **version** of the **document** is **recorded**.

Anyone can run their own **private** instance and track changes on their own. However, we also **publish** each **version** on a [**public** instance](https://github.com/ambanum/OpenTermsArchive-versions) that makes it easy to explore the entire **history** and enables **notifying** over email whenever a new **version** is **recorded**.
Users can [**subscribe** to **notifications**](#be-notified).

_Note: For now, when multiple versions coexist, **terms** are only **tracked** in their English version and for the European jurisdiction._

## Exploring the versions history

We offer a public database of versions recorded each time there is a change in the terms of service and other contractual documents of tracked services: [OpenTermsArchive-versions](https://github.com/ambanum/OpenTermsArchive-versions).

From the **repository homepage** [OpenTermsArchive-versions](https://github.com/ambanum/OpenTermsArchive-versions), open the folder of the **service of your choice** (e.g. [WhatsApp](https://github.com/ambanum/OpenTermsArchive-versions/tree/master/WhatsApp)).

You will see the **set of documents tracked** for that service, now click **on the document of your choice** (e.g. [WhatsApp's Privacy Policy](https://github.com/ambanum/OpenTermsArchive-versions/blob/master/WhatsApp/Privacy%20Policy.md)). The **latest version** (updated hourly) will be displayed.

To view the **history of changes** made to this document, click on **History** at the top right of the document (for our previous [example](https://github.com/ambanum/OpenTermsArchive-versions/commits/master/WhatsApp/Privacy%20Policy.md)). The **changes** are ordered **by date**, with the latest first.

Click on a change to see what it consists of (for example [this one](https://github.com/ambanum/OpenTermsArchive-versions/commit/58a1d2ae4187a3260ac58f3f3c7dcd3aeacaebcd)). There are **two types of display** you can choose from the icons in the gray bar above the document.

- The first one, named _source diff_ (button with chevrons) allows you to **display the old version and the new one side by side** (for our [example](https://github.com/ambanum/OpenTermsArchive-versions/commit/58a1d2ae4187a3260ac58f3f3c7dcd3aeacaebcd#diff-e8bdae8692561f60aeac9d27a55e84fc)). This display has the merit of **explicitly showing** all additions and deletions.
- The second one, named _rich diff_ (button with a document icon) allows you to **unify all the changes in a single document** (for our [example](https://github.com/ambanum/OpenTermsArchive-versions/commit/58a1d2ae4187a3260ac58f3f3c7dcd3aeacaebcd?short_path=e8bdae8#diff-e8bdae8692561f60aeac9d27a55e84fc)). The **red** color shows **deleted** elements, the **yellow** color shows **modified** paragraphs, and the **green** color shows **added** elements. Be careful, this display **does not show some changes** such as hyperlinks and text style's changes.

### Notes

- For long documents, unchanged **paragraphs will not be displayed by default**. You can manually make them appear by clicking on the small arrows just above or just below the displayed paragraphs.
- You can use the **History button anywhere** in the repository OpenTermsArchive-versions, which will then display the **history of changes made to all documents in the folder** where you are (including sub-folders).

## Be notified

### By email

#### Document per document

You can go on the official front website [opentermsarchive.org](https://opentermsarchive.org). From there, you can select a service and then the corresponding document type.
After you enter your email and click on subscribe, we will add your email to the correspondning mailing list in [SendInBlue](https://www.sendinblue.com/) and will not store your email anywhere else.
Then, everytime a modification is found on the correspondning document, we will send you an email.

You can unsubscribe at any moment by clicking on the `unsubscribe` link at the bottom of the received email.

#### For all documents at once

You can [subscribe](https://59692a77.sibforms.com/serve/MUIEAKuTv3y67e27PkjAiw7UkHCn0qVrcD188cQb-ofHVBGpvdUWQ6EraZ5AIb6vJqz3L8LDvYhEzPb2SE6eGWP35zXrpwEFVJCpGuER9DKPBUrifKScpF_ENMqwE_OiOZ3FdCV2ra-TXQNxB2sTEL13Zj8HU7U0vbbeF7TnbFiW8gGbcOa5liqmMvw_rghnEB2htMQRCk6A3eyj) to receive an email whenever a document is updated in the database.

**Beware, you are likely to receive a large amount of notifications!** You can unsubscribe by replying to any email you will receive.

### By RSS

You can receive notification for a specific service or document by subscribing to RSS feeds.

> An RSS feed is a type of web page that contains information about the latest content published by a website, such as the date of publication and the address where you can view it. When this resource is updated, a feed reader app automatically notifies you and you can see the update.

To find out the address of the RSS feed you want to subscribe to:

1. [Navigate](#exploring-the-versions-history) to the page with the history of changes you are interested in. _In the WhatsApp example above, this would be [this page](https://github.com/ambanum/OpenTermsArchive-versions/commits/master/WhatsApp/Privacy%20Policy.md)._
2. Copy the address of that page from your browser’s address bar. _In the WhatsApp example, this would be `https://github.com/ambanum/OpenTermsArchive-versions/commits/master/WhatsApp/Privacy%20Policy.md`._
3. Append `.atom` at the end of this address. _In the WhatsApp example, this would become `https://github.com/ambanum/OpenTermsArchive-versions/commits/master/WhatsApp/Privacy%20Policy.md.atom`._
4. Subscribe your RSS feed reader to the resulting address.

#### Recap of available RSS feeds

| Updated for                         | URL                                                                                                                                                                                            |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| all services and documents          | `https://github.com/ambanum/OpenTermsArchive-versions/commits.atom`                                                                                                                            |
| all the documents of a service      | Replace `$serviceId` with the service ID:<br>`https://github.com/ambanum/OpenTermsArchive-versions/commits/master/$serviceId.atom.`                                                            |
| un document spécifique d'un service | Replace `$serviceId` with the service ID and `$documentType` with the document type:<br>`https://github.com/ambanum/OpenTermsArchive-versions/commits/master/$serviceId/$documentType.md.atom` |

For example:

- To receive all updates of `Facebook` documents, the URL is `https://github.com/ambanum/OpenTermsArchive-versions/commits/master/Facebook.atom`.
- To receive all updates of the `Privacy Policy` from `Google`, the URL is `https://github.com/ambanum/OpenTermsArchive-versions/commits/master/Google/Privacy%20Policy.md.atom`.

### Unsubscribe

In order to not receive emails of updated services anymore, two links are included in every email received:

- one to stop receiving all emails from bot@opentermsarchive.org
- one to stop receiving emails of a particular document

The latter consists in sending an email to contact@opentermsarchive.org to be manually removed from the corresponding list.

## Analysing the snapshots history

We provide a database of snapshots recorded each time there is a change in the terms of service and other contractual documents of tracked services: [OpenTermsArchive-Snapshots](https://github.com/ambanum/OpenTermsArchive-snapshots).

## Contributing

### Adding a new service

See [CONTRIBUTING](CONTRIBUTING.md).

## Using locally

> **Windows Support**: This module can run locally on Windows systems.

### Installing

This module is built with [Node](https://nodejs.org/en/). You will need to [install Node >= v14.x](https://nodejs.org/en/download/) to run it.

Clone the repository and install dependencies:

```sh
git clone https://github.com/ambanum/OpenTermsArchive.git
cd OpenTermsArchive
npm install
```

### Setting up the database

Initialize the database:

```sh
npm run setup
```

### Configuring

#### Configuration file

The default configuration can be read and changed in `config/default.json`.

```json
{
  "serviceDeclarationsPath": "Directory containing services declarations and associated filters.",
  "history": {
    "snapshotsPath": "Snapshots database directory path, relative to the root of this project",
    "versionsPath": "Versions database directory path, relative to the root of this project",
    "publish": "Boolean. Set to true to publish changes to the shared, global database. Should be true only in production.",
    "author": {
      "name": "Name to which changes in tracked documents will be credited",
      "email": "Email to which changes in tracked documents will be credited"
    }
  },
  "fetcher": {
    "waitForElementsTimeout": "Maximum time (in milliseconds) to wait for elements to be present in the page when fetching document in a headless browser"
  },
  "notifier": {
    "sendInBlue": {
      "administratorsListId": "SendInBlue contacts list ID of administrators",
      "updatesListId": "SendInBlue contacts list ID of persons to notify on document updates",
      "updateTemplateId": "SendInBlue email template ID used for updates notifications"
    }
  }
}
```

The default configuration is merged with (and overridden by) environment-specific configuration that can be specified at startup with the [`NODE_ENV` environment variable](#node-env).

An example of a production configuration file can be found in `config/production.json`. It includes the extra configuration for:

- A logging mechanism, to be notified upon error (this requires a valid SMTP configuration, see [environment variables](#environment-variables) below):

```json
{
  "logger": {
    "sendMailOnError": {
      "to": "recipient@example.com",
      "from": "cgu-bot@example.com"
    }
  }
}
```

- Public URLs to the snapshots and versions repositories, used to automate the initial database setup (`publicSnapshotsRepository` and `publicVersionsRepository` which are used by `npm setup`) and for the links in notifications (`snapshotsBaseUrl`):

```json
{
  "history": {
    "publicSnapshotsRepository": "https://github.com/ambanum/OpenTermsArchive-snapshots.git",
    "publicVersionsRepository": "https://github.com/ambanum/OpenTermsArchive-versions.git",
    "snapshotsBaseUrl": "https://github.com/ambanum/OpenTermsArchive-snapshots/commit/"
  }
}
```

#### Environment variables

These environment variables can be provided in a `.env` file at the root of the repository. See `.env.example` for an example of such a file.

##### `SMTP_HOST` and `SMTP_USERNAME`

In order to be notified for errors over email, a valid SMTP configuration should be provided through the following environment variables:

- `SMTP_HOST` for the SMTP server hostname.
- `SMTP_USERNAME` / `SMTP_PASSWORD` for the credentials.

##### `HTTP_PROXY` and `HTTPS_PROXY`

If your infrastructure requires using an outgoing HTTP/HTTPS proxy to access Internet, you can provide it through the `HTTP_PROXY` and `HTTPS_PROXY` environment variable.

##### `SENDINBLUE_API_KEY`

In order to use the default [SendInBlue](https://www.sendinblue.com)-based notification mechanism, a valid API key should be provided through the `SENDINBLUE_API_KEY` environment variable.

##### `NODE_ENV`

The `NODE_ENV` environment variable loads additional [configuration files](#configuration-file).

##### `GITHUB_TOKEN` and `GITHUB_REPO`

In order for the service to automatically create issues in Github when a service is failing, you need to provide:
- `GITHUB_TOKEN`: A token with repository privileges which allow access to the [GitHub API](https://github.com/settings/tokens). 
- `GITHUB_REPO`: A repository which will be used to create the issues. For example `ambanum/OpenTermsArchive`
- `GITHUB_LABEL_UPDATE`: The name of the label used on the repo to categorize issues corresponding to a service that does not work anymore and needs updating (default is `update`)

**Note**: OTA will automatically create issues with a label defined by `GITHUB_LABEL_UPDATE`. **This specific label has to exist in the corresponding repository for the automatic issue creation works.**
### Running

To get the latest versions of all services' terms:

```
npm start
```

The latest version of a document will be available in `/data/versions/$service_provider_name/$document_type.md`.

To hourly update documents:

```
npm run start:scheduler
```

To get the latest version of a specific service's terms:

```
npm start $service_id
```

> The service ID is the case sensitive name of the service declaration file without the extension. For example, for `Twitter.json`, the service ID is `Twitter`.

### Deploying

See [Ops Readme](ops/README.md).

### Exporting a dataset

See [`export` script Readme](scripts/export/README.md).

---

## License

The code for this software is distributed under the European Union Public Licence (EUPL) v1.2.
Contact the author if you have any specific need or question regarding licensing.
