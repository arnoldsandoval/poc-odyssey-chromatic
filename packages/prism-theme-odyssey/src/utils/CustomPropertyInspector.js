const Storage = window.localStorage;
const LOCALSTORAGE_ID = "ods-prism-theme";
class CustomPropertyInspector {
  constructor(args) {
    this.args = args
    const properties = this.setCustomProperties(args.propertiesElement);

    this.renderInspector(properties)
  }

  setCustomProperties(element) {
    let prop
    const styles = window.getComputedStyle(element)
    const properties = {}
    const userStoredTheme = JSON.parse(Storage.getItem(LOCALSTORAGE_ID)) || {};

    for (prop in styles) {
      const name = styles[prop];
      const value = userStoredTheme[name] || styles.getPropertyValue(name);

      if (styles.hasOwnProperty(prop) && styles[prop].startsWith('--')) { 
        properties[name] = value
      }

      if (userStoredTheme[name]) {
        document.documentElement.style.setProperty(name, value);
      }
    }
    return properties
  }


  renderInspector(properties) {
    const inspector = document.createElement('form');
    inspector.classList.add('custom-properties-inspector');
    inspector.style = `
      position: sticky;
      top: 0;
      border-right: 5px solid #f5f5f6;
      padding:  3.42857rem 1.71429rem;
      max-height: 100vh;
      overflow: scroll;
      min-width: 16rem;
    `

    const inspectorTitle = document.createElement('h5');
    inspectorTitle.innerHTML = "Custom Properties Inspector";
    inspectorTitle.style="margin-bottom: 2rem;"
    inspector.appendChild(inspectorTitle)

    const inspectorReset = document.createElement('button');
    inspectorReset.classList.add('ods-button', 'is-ods-button-danger', 'is-ods-button-full-width');
    inspectorReset.innerHTML = "Reset Theme";

    document.body.style = "display: flex;"

    for (const [key, value] of Object.entries(properties)) {
      const fieldset = document.createElement('fieldset');
      const fieldsetFlex = document.createElement('div');
      const input = document.createElement('input');
      const label = document.createElement('label');

      // Set Odyssey Fieldset
      fieldset.classList.add('ods-fieldset')

      // Set Odyssey Fieldset Flex
      fieldsetFlex.classList.add('ods-fieldset-flex')

      // Set Odyssey Label
      label.classList.add('ods-label');
      label.innerHTML = key;
      
      // Set Odyssey Text Input
      input.setAttribute('type', 'text');
      input.classList.add('ods-text-input');
      input.name = key
      input.value = value.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");

      // Append all the elements
      fieldset.appendChild(fieldsetFlex)
      fieldsetFlex.appendChild(label);
      fieldsetFlex.appendChild(input);
      inspector.appendChild(fieldset);
      inspector.appendChild(inspectorReset)
    }

    if (Object.keys(properties).length === 0 && properties.constructor === Object) {
      const errorNotice = document.createElement('div');
      errorNotice.innerHTML = `
        <div>
          <div style="font-size: 6rem; text-align: center;" aria-label="No good">⚠️</div>
          <p>The Custom Property Inspector has nothing to show. This is probably because you are <a href="https://github.com/w3c/csswg-drafts/issues/1316">using Google Chrome.</a></p>
          <p>Try this page on Safari or Firefox!</p>
        </div>
      `
      inspector.appendChild(errorNotice)
    }

    // Prepend the inspector
    document.body.prepend(inspector);

    inspectorReset.addEventListener('click', () => {
      Storage.removeItem(LOCALSTORAGE_ID);
      this.setCustomProperties(args.propertiesElement);
    })

    // TODO: Consider listening only input element events 
    // which are explicitly concerned with the value of the
    // custom properties.
    inspector.addEventListener('keyup', (e) => {
      const name = e.target.name
      const value = e.target.value;

      this.properties = {
        ...this.properties,
        [name]: value
      }
      
      Storage.setItem(LOCALSTORAGE_ID, JSON.stringify(this.properties));

      document.documentElement.style.setProperty(name, value);
    })
  }
}

export default CustomPropertyInspector