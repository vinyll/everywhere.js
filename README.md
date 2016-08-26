# Edit the content of your website everywhere!

Enable edit in place on any content, even static, with no installation.  
Plus, it's easy to extend!

It even works for **editing content on static websites** like
[Github Pages](https://pages.github.com/)!

See [the basic demo](https://vinyll.github.io/everywhere.js) that is a static webpage that you can
[edit here](https://vinyll.github.io/everywhere.js/?key=vinyll demo key phrase).

A rich-text extension ([medium-editor](https://yabwe.github.io/medium-editor))
 is available as an extension.
 To activate it, simply set `{extensions: [EWMediumEditor]}` in your constructor. (check the configuration section to know more).

## Common usage

For basic usage see [the basic demo](https://vinyll.github.io/everywhere.js/).

### How it works

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

> Data are stored on the [demo API server](https://everywhere.webnomad.org) (http://everywhere.webnomad.org).
Storage and availability is not guaranteed on that server, you should
install your own copy of the [Everywhere API](https://github.com/vinyll/everywhere-api)
for advanced or production usage.


## Configuration

The configurations below will allow you to fine-tune your Everywhere.
Just pass them in the constructor as so:

    new Everywhere({
      server: 'http://my.server.net',
      extensions: [EWMediumEditor],
      …
    })

**server**: (String) the URL of your [Everywhere API server](https://github.com/vinyll/everywhere-api).
Default: 'http://localhost:5000/',
you may also test with https://everywhere.webnomad.org.

**key**: (String) your personal authentication key.
Default: the URL `?key=` if exists.

**user**: (String) the username registered on your [Everywhere API server](https://github.com/vinyll/everywhere-api).
Default: the current hostname.

**readURL**: (String URL) the URL where to GET the content. _{user}_ is
replaced by the user in the configuration and _{name}_ by the editable content
name.
Default: _/content/{user}/{name}/_ called on the _server_ configuration
specified.

**saveURL**: (String URL) similar as above for POSTing content.
Default: _/content/{user}/{name}/_
**edit**: (Boolean) specifies if the editor is in editable mode.
Default: `true` if `?key=` is detected in the URL, `false` otherwise.

**editables**: (NodeList) list of the HTML nodes that should be editable.
Default: all the nodes that contain the attribute `data-editable=…`.

**extensions**: (Array) list of extensions to activate. `EWRawText` and `EWMediumEditor` are available natively.
Default: `[EWRawText]`.

**fetch**: (Object) options to pass the the `fetch()` method.
 Default: `{headers: new Headers(), mode: 'cors', cache: 'default'}`


## Advanced usage

### Hosting your data

You are very encouraged to roll you own API server to ensure availability and
prevent data loss. Using the demo server is permitted but not guaranteed and
you are fully responsible of data (I don't do any backup of that)!
Also i don't recover or reset lost keys.
See the [Everywhere API](https://github.com/vinyll/everywhere-api)
documentation for installing your own data host.

Note that for authentication purpose your key will be passed when saving data.
You should therefore consider using _https_.


### Writing a custom extension

Extensions are pretty easy to write.
Just check out the source in _js/everywhere.js_ to have example of basic extensions.
A convention is to prefix their name with _EW_ (like in "EveryWhere") and to
extend `EWExtension` or a sub-object (such as `EWRawText`).

The "_updated_" events is emitted by _Everywhere_ when a content is fetched from the server and available for listeners. `event.detail` is the response
object where the `body` property is the fetched content.


### Compiling the sources

This source code is written is JavaScript ES2015.
When modifiying `js/everywhere.js` you may need to convert the code to
make it compatible with older browsers.
Prior to do so you will need to install dependencies: `npm install`
Then you can run: npm run build

> `npm run build` will convert to ES5 using Babel and minify the code.
> Files will be generated into the _/dist_ folder.


## MIT license

See the [LICENSE file](LICENSE.txt) for further details.
