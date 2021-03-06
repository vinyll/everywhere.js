'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Everywhere = function () {
  function Everywhere() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Everywhere);

    this.extensions = [];
    var server = config.server || 'http://localhost:5000';
    var params = this.constructor.getUrlParams();
    this.config = Object.assign({}, {
      server: server,
      key: 'key' in params ? params['key'] : '',
      user: config.user || location.hostname,
      readURL: server + '/content/{user}/{name}/',
      saveURL: server + '/content/{user}/{name}/',
      edit: 'key' in params,
      editables: document.querySelectorAll('[data-editable]'),
      extensions: [EWRawText],
      fetch: {
        headers: new Headers(),
        mode: 'cors',
        cache: 'default'
      }
    }, config);
    if (!this.config.editables instanceof NodeList) {
      throw new Exception('The `editables` config property should be a NodeList');
    }
    this.addExtensions(this.config.extensions);
    this.loadContents();
  }

  _createClass(Everywhere, [{
    key: 'addExtensions',
    value: function addExtensions(extensions) {
      var _this = this;

      this.extensions = this.extensions.concat(extensions.map(function (extension) {
        return new extension(_this);
      }));
    }
  }, {
    key: 'loadContents',
    value: function loadContents() {
      var _this2 = this;

      ;[].forEach.call(this.config.editables, function (editable) {
        _this2.loadContent(editable);
      });
    }
  }, {
    key: 'loadContent',
    value: function loadContent(editable) {
      fetch(this.prepareFetchURL(this.config.readURL, editable.dataset.editable), this.config.fetch).then(function (response) {
        return response.json();
      }).then(function (content) {
        // Check the content body has actual text (not only nodes or spaces).
        var node = document.createElement('span');
        node.innerHTML = content.body;
        if (node.textContent.trim()) {
          editable.dispatchEvent(new CustomEvent('updated', { detail: content }));
        }
      }).catch(console.error.bind(console));
    }
  }, {
    key: 'save',
    value: function save(name, value) {
      var body = new FormData();
      body.append('key', this.config.key);
      body.append('body', value);
      var fetchConf = Object.assign({}, this.config.fetch);
      fetchConf.method = 'post';
      fetchConf.body = body;
      fetch(this.prepareFetchURL(this.config.saveURL, name), fetchConf).then(console.info.bind(console)).catch(console.error.bind(console));
    }
  }, {
    key: 'prepareFetchURL',
    value: function prepareFetchURL(url, name) {
      return url.replace('{user}', this.config.user).replace('{name}', name);
    }
  }], [{
    key: 'getUrlParams',
    value: function getUrlParams() {
      var query = arguments.length <= 0 || arguments[0] === undefined ? location.search : arguments[0];

      var params = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = query.slice(1).split('&')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var kvString = _step.value;

          var kvArray = kvString.split('=');
          params[unescape(kvArray[0])] = unescape(kvArray[1]);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return params;
    }
  }]);

  return Everywhere;
}();

var EWExtension = function () {
  function EWExtension(everywhere) {
    _classCallCheck(this, EWExtension);

    this.everywhere = everywhere;
    this.editMode = this.everywhere.config.edit;
    this.init();
  }

  _createClass(EWExtension, [{
    key: 'init',
    value: function init() {
      this.ready();
    }
  }, {
    key: 'ready',
    value: function ready() {
      var _this3 = this;

      ;[].forEach.call(this.editables, function (editable) {
        _this3.subscribe(editable);
      });
    }
  }, {
    key: 'save',
    value: function save(name, value) {
      this.everywhere.save(name, value);
    }
  }, {
    key: 'subscribe',
    value: function subscribe(editable) {

      this.subscribeUpdated(editable);
      if (this.editMode) {
        this.subscribeEdit(editable);
        this.subscribeSave(editable);
      }
    }
  }, {
    key: 'subscribeEdit',
    value: function subscribeEdit(editable) {}
  }, {
    key: 'subscribeUpdated',
    value: function subscribeUpdated(editable) {}
  }, {
    key: 'subscribeSave',
    value: function subscribeSave(editable) {}
  }, {
    key: 'injectJS',
    value: function injectJS(url) {
      var node = document.createElement('script');
      node.async = false;
      node.src = url;
      document.head.appendChild(node);
      return node;
    }
  }, {
    key: 'injectCSS',
    value: function injectCSS(url) {
      var node = document.createElement('link');
      node.rel = 'stylesheet';
      node.href = url;
      document.head.appendChild(node);
      return node;
    }
  }, {
    key: 'editables',
    get: function get() {
      return this.everywhere.config.editables;
    }
  }]);

  return EWExtension;
}();

var EWRawText = function (_EWExtension) {
  _inherits(EWRawText, _EWExtension);

  function EWRawText() {
    _classCallCheck(this, EWRawText);

    return _possibleConstructorReturn(this, (EWRawText.__proto__ || Object.getPrototypeOf(EWRawText)).apply(this, arguments));
  }

  _createClass(EWRawText, [{
    key: 'subscribeEdit',
    value: function subscribeEdit(editable) {
      editable.addEventListener('click', function (event) {
        event.target.setAttribute('contenteditable', '');
      });
    }
  }, {
    key: 'subscribeUpdated',
    value: function subscribeUpdated(editable) {
      editable.addEventListener('updated', function (event) {
        event.target.innerHTML = event.detail.body;
      });
    }
  }, {
    key: 'subscribeSave',
    value: function subscribeSave(editable) {
      var _this5 = this;

      editable.addEventListener('blur', function (event) {
        event.target.removeAttribute('contenteditable');
        _this5.save(event.target.dataset.editable, event.target.innerHTML);
      });
    }
  }]);

  return EWRawText;
}(EWExtension);

var EWMediumEditor = function (_EWRawText) {
  _inherits(EWMediumEditor, _EWRawText);

  function EWMediumEditor() {
    _classCallCheck(this, EWMediumEditor);

    return _possibleConstructorReturn(this, (EWMediumEditor.__proto__ || Object.getPrototypeOf(EWMediumEditor)).apply(this, arguments));
  }

  _createClass(EWMediumEditor, [{
    key: 'init',
    value: function init() {
      var _this7 = this;

      this.injectCSS('https://cdn.rawgit.com/yabwe/medium-editor/master/dist/css/medium-editor.min.css');
      this.injectCSS('https://cdn.rawgit.com/yabwe/medium-editor/master/dist/css/themes/beagle.min.css');
      this.injectJS('https://cdn.rawgit.com/yabwe/medium-editor/master/dist/js/medium-editor.min.js');[].forEach.call(this.editables, function (editable) {
        _this7.subscribeUpdated(editable);
      });
      setTimeout(function (_) {
        return _get(EWMediumEditor.prototype.__proto__ || Object.getPrototypeOf(EWMediumEditor.prototype), 'init', _this7).call(_this7);
      }, 1000); // wait for js to load
    }
  }, {
    key: 'ready',
    value: function ready() {
      if (this.editMode) {
        this.editor = new MediumEditor(this.editables);
      }
      _get(EWMediumEditor.prototype.__proto__ || Object.getPrototypeOf(EWMediumEditor.prototype), 'ready', this).call(this);
    }
  }, {
    key: 'subscribeSave',
    value: function subscribeSave(editable) {
      var _this8 = this;

      this.editor.subscribe('blur', function (event, editable) {
        _this8.save(editable.dataset.editable, editable.innerHTML);
      });
    }
  }]);

  return EWMediumEditor;
}(EWRawText);
