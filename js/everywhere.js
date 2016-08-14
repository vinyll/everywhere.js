class Everywhere {

  constructor(config = {}) {
    const server = config.server || 'http://localhost:5000'
    const params = this.constructor.getUrlParams()
    this.config = Object.assign({}, {
      server: server,
      key: 'key' in params ? params['key'] : '',
      user: config.user || location.hostname,
      readURL: `${server}/content/{user}/{editableName}/`,
      saveURL: `${server}/content/{user}/{editableName}/`,
      editables: document.querySelectorAll('[data-editable]'),
      fetch: {
        headers: new Headers(),
        mode: 'cors',
        cache: 'default',
      }
    }, config)
    if(!config.editables instanceof NodeList) {
      throw new Exception('The `editables` config property should be a NodeList')
    }
    this.loadContents()
    this.listenChanges()
  }

  get editor() {
    if(!this._editor) {
      this._editor = new MediumEditor(this.config.editables)
    }
    return this._editor
  }

  loadContents() {
    ;[].forEach.call(this.config.editables, (editable) => {
      this.loadContent(editable)
    })
  }

  loadContent(editable) {
    fetch(this.prepareFetchURL(this.config.readURL, editable), this.config.fetch)
    .then(response => response.json())
    .then(content => {
      if(content.body) {
        editable.innerHTML = content.body
      }
    })
    .catch(console.error.bind(console))
  }

  listenChanges() {
    this.editor.subscribe('blur', (event, editable) => {
      const body = new FormData()
      body.append('key', this.config.key)
      body.append('body', editable.innerHTML)

      const fetchConf = Object.assign({}, this.config.fetch)
      fetchConf.method = 'post'
      fetchConf.body = body

      fetch(this.prepareFetchURL(this.config.saveURL, editable), fetchConf)
      .then(console.info.bind(console))
      .catch(console.error.bind(console))
    })
  }

  prepareFetchURL(url, editable) {
    return url.replace('{user}', this.config.user)
              .replace('{editableName}', editable.dataset.editable)

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
