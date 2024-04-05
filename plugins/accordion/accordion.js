(function (CKEditor5) {

  "use strict";

  /**
   * Backdrop-specific plugin to alter the CKEditor 5 basic tags.
   */
  class Accordion extends CKEditor5.core.Plugin {
    /**
     * @inheritdoc
     */
    static get pluginName() {
      return 'Accordion';
    }

    init() {
      const editor = this.editor;
      const schema = editor.model.schema;
      const conversion = editor.conversion;

      // Add the editor button to the main toolbar.
      editor.ui.componentFactory.add('accordion', () => {
        const buttonView = new CKEditor5.ui.ButtonView();
        const command = editor.commands.get('accordion');

        buttonView.set({
          label: Backdrop.t('Insert accordion'),
          tooltip: true,
          icon: '<svg width="20" height="20" viewBox="0 0 5.292 5.292" xmlns="http://www.w3.org/2000/svg"><path style="fill:none;stroke:#000;stroke-opacity:1" d="M2.783 2.447a.222.222 0 0 0-.199.221v3.264c0 .122.098.22.22.22h14.391a.22.22 0 0 0 .221-.22V2.668a.22.22 0 0 0-.22-.22H2.782zm.022 3.897c-.123 0-.221.1-.221.222V9.83c0 .123.098.22.22.22h14.391a.22.22 0 0 0 .221-.22V6.566a.222.222 0 0 0-.22-.222H2.804zm1.5 3.724a.174.174 0 0 0-.174.176v3.703c0 .097.077.176.174.176h11.39a.174.174 0 0 0 .174-.176v-3.703a.174.174 0 0 0-.174-.176H4.305zm-1.5 4.073a.22.22 0 0 0-.221.22v3.266c0 .122.098.22.22.22h14.391a.22.22 0 0 0 .221-.22v-3.266a.22.22 0 0 0-.22-.22H2.804z" transform="scale(.26458)"/></svg>',
          isToggleable: false
        });

        // Disable the button when the command is disabled by source mode.
        buttonView.bind('isEnabled').to(command, 'isEnabled');

        // When clicking the toolbar button, execute the accordion command.
        buttonView.on('execute', () => {
          // Remove focus from the toolbar button when opening the dialog.
          // Otherwise, the button may receive focus again after closing the
          // dialog.
          buttonView.element.blur();
          // See accordion::execute().
          command.execute();
        });

        return buttonView;
      });

      // Create the data model for upcast and downcast of accordions.
      schema.register('accordion', {
        allowIn: '$root',
        isLimit: true,
        inheritAllFrom: '$blockObject'
      });

      conversion.for('downcast').elementToStructure({
        model: 'accordion',
        view: (modelElement, { writer }) => {
          const viewWrapper = writer.createContainerElement('dl', { class: 'ckeditor-accordion'}, [
            writer.createContainerElement('dt', null, writer.createSlot()),
            writer.createContainerElement('dd', null, writer.createSlot()),
            writer.createContainerElement('dt', null, writer.createSlot()),
            writer.createContainerElement('dd', null, writer.createSlot()),
          ]);

          return viewWrapper;
        }
      });

      conversion.for('upcast').elementToElement({
        view: {
          name: 'dl',
          classes: 'ckeditor-accordion'
        },
        model: 'accordion'
      });

      // Add the accordion command.
      editor.commands.add('accordion', new AccordionCommand(editor));
    }
  }

  /**
   * CKEditor command that opens the Backdrop image editing dialog.
   */
  class AccordionCommand extends CKEditor5.core.Command {
    /**
     * @inheritdoc
     */
    refresh() {
      const editor = this.editor;
      const element = this.getClosestSelectedAccordion(editor.model.document.selection);
      this.isEnabled = true;
      this.value = !!element;
    }

    getClosestSelectedAccordion(selection) {
      const selectedElement = selection.getSelectedElement();
      if (selectedElement) {
        return selectedElement.is('element', 'dl') ? selectedElement : selection.getFirstPosition().findAncestor('dl');
      }
    }

    /**
     * Executes the command.
     */
    execute() {
      const editor = this.editor;
      const model = editor.model;
      const accordionElement = this.getClosestSelectedAccordion(model.document.selection);
      // Insert a new element.
      if (!accordionElement) {
        model.change(writer => {
          const accordionElement = writer.createElement('accordion');
          model.insertObject(accordionElement, null, null, { setSelection: 'after' });
        });
      }
    }
  }

  // Expose the plugin to the CKEditor5 namespace.
  CKEditor5.accordion = {
    'Accordion': Accordion
  };

})(CKEditor5);
