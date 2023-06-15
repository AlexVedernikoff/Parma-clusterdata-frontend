/* global ace */

import debounce from 'lodash/debounce';

const HashHandler = ace.acequire('ace/keyboard/hash_handler').HashHandler;
const AutocompleteUtil = ace.acequire('ace/autocomplete/util');

const tabHandler = new HashHandler();
tabHandler.bindKeys({
  Tab: function(editor) {
    editor.__tabPressed = true;
  },
});

class FormulaAutocompleter {
  constructor({ getAutocomplete, getAutocompleteTimeout = 1000 }) {
    this.getAutocomplete = getAutocomplete;

    this.completer = {
      getCompletions: (editor, session, pos, prefix, callback) => {
        if (!Array.isArray(this.completions)) {
          return callback(null, []);
        }

        const result = this.completions.map((item, index) => {
          const {
            name,
            completion: { formula, pos_column: posColumn, pos_row: posRow } = {},
            type,
          } = item;

          return {
            search: name.toLowerCase(),
            name: name,
            caption: name,
            value: formula || name,
            meta: type,
            score: -index,
            posColumn,
            posRow,
            completer: this.completer,
          };
        });

        callback(null, result);
        editor.completer.activated = false;
      },
      insertMatch: (editor, { completer, ...data }) => {
        // eslint-disable-line no-unused-vars
        const { value, posRow, posColumn } = data;

        editor.setValue(value);
        editor.gotoLine(posRow + 1, posColumn);

        if (this.enabled) {
          setTimeout(() => {
            this.performAutocomplete(editor);
          }, 0);
        }
      },
      identifierRegexps: [/[a-zA-Z_0-9\$\.\-\u00A2-\uFFFF]/], // eslint-disable-line no-useless-escape
    };

    this.debouncedDispatcher = debounce(
      this.autocompleteDispatcher,
      getAutocompleteTimeout,
    );
  }

  autocompleteDispatcher = event => {
    if (
      ['insertstring', 'backspace', 'del', 'removewordleft', 'removewordright'].includes(
        event.command.name,
      ) &&
      this.editor.getValue()
    ) {
      this.performAutocomplete(this.editor);
    }
  };

  async performAutocomplete(editor, isManual) {
    // Don't perform autocomplete when multiple cursors
    if (editor.inMultiSelectMode) {
      return;
    }

    const text = editor.getValue();
    const position = editor
      .getSession()
      .doc.positionToIndex(editor.getSelection().getCursor());

    this.autocompleteText = text;
    const tabHookEnabled = this.tabHookEnabled;

    if (tabHookEnabled) {
      editor.keyBinding.addKeyboardHandler(tabHandler, 0);
    }

    try {
      const { column, row } = editor.getCursorPosition();

      const items =
        (await this.getAutocomplete({
          text,
          row,
          column,
          isManual,
        })) || [];

      if (this.autocompleteText === text) {
        if (items.length === 1 && editor.__tabPressed) {
          const regexp = this.completer.identifierRegexps[0];
          const prefix = AutocompleteUtil.retrievePrecedingIdentifier(
            text,
            position,
            regexp,
          );
          this.insertSingleMatch(editor, prefix.length, items[0]);
          return;
        }

        this.completions = items;
        editor.commands.byName.startAutocomplete.exec(editor);
      }
    } finally {
      if (this.autocompleteText === text) {
        if (tabHookEnabled) {
          editor.keyBinding.removeKeyboardHandler(tabHandler);
        }
        editor.__tabPressed = null;
        this.autocompleteText = null;
        this.completions = null;
      }
    }
  }

  insertSingleMatch(editor, prefixLength, value) {
    if (prefixLength) {
      editor.selection.getAllRanges().forEach(range => {
        range.start.column -= prefixLength;
        editor.session.remove(range);
      });
    }
    editor.execCommand('insertstring', value);
  }

  attachEditor(editor) {
    if (this.editor === editor) {
      return;
    }
    if (this.editor) {
      this.detachEditor(this.editor);
    }
    this.editor = editor;
    if (editor) {
      if (!editor.defaultCompleters) {
        editor.defaultCompleters = editor.completers;
      }
      editor.commands.on('afterExec', this.debouncedDispatcher);
      editor.completers = [this.completer];
    }
  }

  detachEditor() {
    const editor = this.editor;
    this.editor = null;
    if (editor) {
      editor.commands.off('afterExec', this.debouncedDispatcher);
      editor.completers = editor.defaultCompleters;
    }
  }

  setupEditor(editor, enable) {
    if (enable) {
      this.attachEditor(editor);
    } else {
      this.detachEditor();
    }
  }
}

export default FormulaAutocompleter;
