'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Everywhere = function () {
  function Everywhere() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Everywhere);

    var server = config.server || 'http://localhost:5000';
    var params = this.constructor.getUrlParams();
    this.config = Object.assign({}, {
      server: server,
      key: 'key' in params ? params['key'] : '',
      user: config.user || location.hostname,
      readURL: server + '/content/{user}/{editableName}/',
      saveURL: server + '/content/{user}/{editableName}/',
      edit: 'key' in params,
      editables: document.querySelectorAll('[data-editable]'),
      fetch: {
        headers: new Headers(),
        mode: 'cors',
        cache: 'default'
      }
    }, config);
    if (!this.config.editables instanceof NodeList) {
      throw new Exception('The `editables` config property should be a NodeList');
    }
    this.loadContents();
    // Enable editing.
    if (this.config.edit) {
      this.listenChanges();
    }
  }

  _createClass(Everywhere, [{
    key: 'loadContents',
    value: function loadContents() {
      var _this = this;

      ;[].forEach.call(this.config.editables, function (editable) {
        _this.loadContent(editable);
      });
    }
  }, {
    key: 'loadContent',
    value: function loadContent(editable) {
      fetch(this.prepareFetchURL(this.config.readURL, editable), this.config.fetch).then(function (response) {
        return response.json();
      }).then(function (content) {
        if (content.body) {
          editable.innerHTML = content.body;
        }
      }).catch(console.error.bind(console));
    }
  }, {
    key: 'listenChanges',
    value: function listenChanges() {
      var _this2 = this;

      this.editor.subscribe('blur', function (event, editable) {
        var body = new FormData();
        body.append('key', _this2.config.key);
        body.append('body', editable.innerHTML);

        var fetchConf = Object.assign({}, _this2.config.fetch);
        fetchConf.method = 'post';
        fetchConf.body = body;

        fetch(_this2.prepareFetchURL(_this2.config.saveURL, editable), fetchConf).then(console.info.bind(console)).catch(console.error.bind(console));
      });
    }
  }, {
    key: 'prepareFetchURL',
    value: function prepareFetchURL(url, editable) {
      return url.replace('{user}', this.config.user).replace('{editableName}', editable.dataset.editable);
    }
  }, {
    key: 'editor',
    get: function get() {
      if (!this._editor) {
        this._editor = new MediumEditor(this.config.editables);
      }
      return this._editor;
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
