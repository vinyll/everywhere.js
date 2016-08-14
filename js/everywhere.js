class Everywhere {
  constructor(editables, config = {domain: 'http://localhost:5000'}) {
    this.editables = editables || document.querySelectorAll('[data-editable]')
    this.config = Object.assign({}, config, {
      readURL: `${config.domain}/content/{editableName}/`,
      saveURL: `${config.domain}/content/`,
      fetch: {
        headers: new Headers(),
        mode: 'cors',
        cache: 'default',
      }
    })
    this.loadContents()
    this.listenChanges()
  }

  get editor() {
    if(!this._editor) {
      this._editor = new MediumEditor(this.editables)
    }
    return this._editor
  }

  loadContents() {
    ;[].forEach.call(this.editables, (editable) => {
      this.loadContent(editable)
    })
  }

  loadContent(editable) {
    fetch(this.prepareFetchURL(this.config.readURL, editable), this.config.fetch)
    .then(response => response.json())
    .then(content => editable.innerHTML = content.body)
    .catch(console.error.bind(console))
  }

  listenChanges() {
    this.editor.subscribe('blur', (event, editable) => {
      const body = new FormData()
      body.append('id', editable.dataset.editable)
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
    return url.replace('{editableName}', editable.dataset.editable)
  }
}
