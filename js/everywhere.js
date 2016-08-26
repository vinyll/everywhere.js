class Everywhere {

  constructor(config = {}) {
    this.extensions = []
    const server = config.server || 'http://localhost:5000'
    const params = this.constructor.getUrlParams()
    this.config = Object.assign({}, {
      server: server,
      key: 'key' in params ? params['key'] : '',
      user: config.user || location.hostname,
      readURL: `${server}/content/{user}/{name}/`,
      saveURL: `${server}/content/{user}/{name}/`,
      edit: 'key' in params,
      editables: document.querySelectorAll('[data-editable]'),
      extensions: [EWRawText],
      fetch: {
        headers: new Headers(),
        mode: 'cors',
        cache: 'default',
      }
    }, config)
    if(!this.config.editables instanceof NodeList) {
      throw new Exception('The `editables` config property should be a NodeList')
    }
    this.addExtensions(this.config.extensions)
    this.loadContents()
  }

  addExtensions(extensions) {
    this.extensions = this.extensions.concat(extensions.map(extension => {
      return new extension(this)
    }))
  }

  loadContents() {
    ;[].forEach.call(this.config.editables, (editable) => {
      this.loadContent(editable)
    })
  }

  loadContent(editable) {
    fetch(this.prepareFetchURL(this.config.readURL, editable.dataset.editable),
          this.config.fetch)
    .then(response => response.json())
    .then(content => {
      // Check the content body has actual text (not only nodes or spaces).
      const node = document.createElement('span')
      node.innerHTML = content.body
      if(node.textContent.trim()) {
        editable.dispatchEvent(new CustomEvent('updated', {detail: content}))
      }
    })
    .catch(console.error.bind(console))
  }

  save(name, value) {
    const body = new FormData()
    body.append('key', this.config.key)
    body.append('body', value)
    const fetchConf = Object.assign({}, this.config.fetch)
    fetchConf.method = 'post'
    fetchConf.body = body
    fetch(this.prepareFetchURL(this.config.saveURL, name), fetchConf)
    .then(console.info.bind(console))
    .catch(console.error.bind(console))
  }

  prepareFetchURL(url, name) {
    return url.replace('{user}', this.config.user)
              .replace('{name}', name)

  }

  static getUrlParams(query = location.search) {
    let params = {}
    for(let kvString of query.slice(1).split('&')) {
      let kvArray = kvString.split('=')
      params[unescape(kvArray[0])] = unescape(kvArray[1])
    }
    return params
  }
}

class EWExtension {
  constructor(everywhere) {
    this.everywhere = everywhere
    this.editMode = this.everywhere.config.edit
    this.init()
  }

  init() {
    this.ready()
  }

  ready() {
    ;[].forEach.call(this.editables, editable => {
      this.subscribe(editable)
    })
  }

  get editables() {
    return this.everywhere.config.editables
  }

  save(name, value) {
    this.everywhere.save(name, value)
  }

  subscribe(editable) {

    this.subscribeUpdated(editable)
    if(this.editMode) {
      this.subscribeEdit(editable)
      this.subscribeSave(editable)
    }
  }

  subscribeEdit(editable) {}

  subscribeUpdated(editable) {}

  subscribeSave(editable) {}

  injectJS(url) {
    const node = document.createElement('script')
    node.async = false
    node.src = url
    document.head.appendChild(node)
    return node
  }

  injectCSS(url) {
    const node = document.createElement('link')
    node.rel = 'stylesheet'
    node.href = url
    document.head.appendChild(node)
    return node
  }
}


class EWRawText extends EWExtension {
  subscribeEdit(editable) {
    editable.addEventListener('click', event => {
      event.target.setAttribute('contenteditable', '')
    })
  }

  subscribeUpdated(editable) {
    editable.addEventListener('updated', event => {
      event.target.innerHTML = event.detail.body
    })
  }

  subscribeSave(editable) {
    editable.addEventListener('blur', event => {
      event.target.removeAttribute('contenteditable')
      this.save(event.target.dataset.editable, event.target.innerHTML)
    })
  }
}


class EWMediumEditor extends EWRawText {
  init() {
    this.injectCSS('https://cdn.rawgit.com/yabwe/medium-editor/master/dist/css/medium-editor.min.css')
    this.injectCSS('https://cdn.rawgit.com/yabwe/medium-editor/master/dist/css/themes/beagle.min.css')
    this.injectJS('https://cdn.rawgit.com/yabwe/medium-editor/master/dist/js/medium-editor.min.js')
    ;[].forEach.call(this.editables, editable => {
      this.subscribeUpdated(editable)
    })
    setTimeout(_ => super.init(), 1000)  // wait for js to load
  }
  ready() {
    if(this.editMode) {
      this.editor = new MediumEditor(this.editables)
    }
    super.ready()
  }

  subscribeSave(editable) {
    this.editor.subscribe('blur', (event, editable) => {
      this.save(editable.dataset.editable, editable.innerHTML)
    })
  }
}
