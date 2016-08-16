# Edit the content of your website everywhere!

Enable edit in place on any content, even static, with no installation!

It even works for **editing content on static websites** like
[Github Pages](https://pages.github.com/)!

See [the basic demo](https://vinyll.github.io/everywhere.js) that is a static webpage that you can
[edit here](https://vinyll.github.io/everywhere.js/?key=vinyll demo key phrase).


## Common usage

For basic usage see [the basic demo](https://vinyll.github.io/everywhere.js/).

### Explanations

The editable version of a webpage is detected when a `?key=` is passed in
the URL. eg: [http://localhost/?key=localhost demo](http://localhost/?key=localhost demo).

You can create your own user and retrieve your personal key.
Go to http://everywhere.webnomad.org/#!/user/create_new_user, insert your domain hostname (like "_example.com_") and click on "try it out!".
Copy the resulting key; you won't be able to retrieve it or regenerate one for the same domain after that!
See [the xkcd article about password security](https://xkcd.com/936/)
to understand why a key phrase.

Insert a `data-editable="name-of-my-content"` attribute in every HTML
element that you want to make editable on your webpage.
Replace _name-of-my-content_ with a unique name of your choice per element. If you reuse the same name elsewhere then the content will
be the same.

> Data are stored on the [demo API server](http://everywhere.webnomad.org) (http://everywhere.webnomad.org).
Storage and availability is not guaranteed on that server, you should
install your own copy of the [Everywhere API](https://github.com/vinyll/everywhere-api)
for advanced or production usage.


## Advanced usage

This source code is written is JavaScript ES2015.
When modifiying `js/everywhere.js` you may need to convert the code to
make it compatible with older browsers.
Prior to do so you will need to install dependencies: `npm install`
Then you can run: npm run build

> `npm run build` will convert to ES5 using Babel and minify the code.
> Files will be generated into the _/dist_ folder.


You can roll you own API server. See the [Everywhere API](https://github.com/vinyll/everywhere-api) documentation.


## MIT license

See the [LICENSE file](LICENSE.txt) for further details.
