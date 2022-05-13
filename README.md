# utm-synapse

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> This package helps managing and reporting UTM parameters inside a browser session. The main idea is to save immediately those parameters when loading the page, for a later usage.
>
> **How this package can help me? With real examples...**
>
> - With a single-page application (SPA) there is a high probability the frontend will manage on its own the URL format, overriding the initial complete pathname represented by `window.location.pathname + window.location.search`. This can happen directly when the page loads due to framework redirections... making you loosing the UTM parameters before transmitting them to a third-party tool
> - With new privacy compliances you may be required to show a banner to the user asking him for the consent of using cookies and being tracked. In the meantime you are supposed to not transmit UTM parameters to any third-party. In case the user browses another page on your website before accepting the consent, you will loose UTM parameters in the URL
> - Bonus: keeping the UTM parameters in your browser URL bar can be annoying. Let's say you went to your website with `?utm_source=twitter&utm_medium=referral&utm_campaign=summer-2022` and then you want to share the website to a friend, you copy/paste the URL from the browser bar and there is a high chance you won't clean the query parameters before sharing the link. Meaning when your friend will click the link, if you enabled a analytics platform, you will see him as coming from Twitter whereas he is not. _Moreover this example suggests an easy `window.location.search` to remove, but in some cases they can be mixed among a lot of other query parameters, which complicates the cleaning. Ok there are browser extensions out there to prevent this, but it won't affect all your users, just you in your browser._
>
> What are the UTM parameters we consider:
>
> - `utm_source`
> - `utm_medium`
> - `utm_campaign`
> - `utm_content`
> - `utm_name`
> - `utm_term`
> - `initial_utm_source`
> - `initial_utm_medium`
> - `initial_utm_campaign`
> - `initial_utm_content`
> - `initial_utm_name`
> - `initial_utm_term`
> - `gclid`

## Install

With NPM:

```bash
npm install utm-synapse
```

With Yarn:

```bash
yarn add utm-synapse
```

## Usage

```ts
import { utmSynapse } from 'utm-synapse';

const utmParams = utmSynapse.parse(); // Will parse according to the current URL
utmSynapse.save(utmParams);
utmSynapse.hideFromDisplayedUrl();

// ... Your frontend router does its own things
// ...
// ... And once we are ready to report UTM parameters to a third-party...

const utmParams = utmSynapse.load();

if (utmParams) {
  const currentUrlWithOriginalParameters = utmSynapse.setIntoURL(
    window.location.href,
    utmParams
  );

  // ... you can report to your third-party using the `currentUrlWithOriginalParameters` as "page location" parameter (the naming will depend on your analytics platform)

  utmSynapse.clear(); // It's optional but it avoids injecting UTM params on the next page changes since the data has been reported already (the third-party tool should manage a continuity of session between pages)
}
```

## Compatibility with frameworks and analytics librairies

This package is not intented to be depends on other libraries, usually to integrate it with those it's just a question of router middlewares or reporting middlewares.

**Different frameworks/librairies examples will be documented in the future depending on community feedback.**

## API & documentation

You can find all available methods and definitions [by clicking here](docs/TYPINGS.md)

_Note: this technical documentation is auto-generated_

## Advanced usage

### Avoid singleton

`utmSynapse` is used as an imported singleton to simplify usage from different contexts (at the router scope, at the analytics library scope...). If you are able to share the instance across those scopes and want to manage it more properly, you can create your own instance:

```ts
import { UtmSynapse } from 'utm-synapse';

const utmSynapse = new UtmSynapse();
```

### Use of `sessionStorage`, why?

The package is only relying on `sessionStorage` to keep track of UTM parameters because it won't be shared between sessions. The reason to avoid `localStorage` and `cookies`:

- imagine you are dealing with multiple tabs for the same website, you would not mixed the UTM parameters between different flows
- and if you come back 2 days later, you accept the consent, you don't want to use the UTM parameters registered a while in a different context

[build-img]: https://github.com/sneko/utm-synapse/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/sneko/utm-synapse/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/utm-synapse
[downloads-url]: https://www.npmtrends.com/utm-synapse
[npm-img]: https://img.shields.io/npm/v/utm-synapse
[npm-url]: https://www.npmjs.com/package/utm-synapse
[issues-img]: https://img.shields.io/github/issues/sneko/utm-synapse
[issues-url]: https://github.com/sneko/utm-synapse/issues
[codecov-img]: https://codecov.io/gh/sneko/utm-synapse/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/sneko/utm-synapse
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/

### Development & pull requests

If you are willing to contribute to this library, you can easily watch tests while developing:

```bash
yarn run test:watch
```

In you intend while developing on this library to test directly into a parent project (thanks to `yarn link ...`), you can use the following so modifications are reflected with just a page refresh (it can be used in parallel to the previous command):

```
yarn run dev
```

_Note: in case your "parent project" uses CommonJS it's required to use `yarn run dev:cjs`_

**[IMPORTANT] To develop, and in case your package manager is `npm` you should be able to install dependencies to do some testing... but to submit a pull request please use `yarn` because our dependency tree is managed through `yarn.lock` (and not `package-lock.json` from `npm`).**

Thanks in advance! 🚀
