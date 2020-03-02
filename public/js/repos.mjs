/* eslint-disable no-underscore-dangle */

const template = document.createElement('template');

template.innerHTML = `
<br />
<div class='repos-container'>
<label>Username</label>
<table style="width:100%">
  <tr>
    <th>Nazwa Repozytorium</th>
    <th>Opis Repozytorium</th>
    <th>Data ostatniej aktualizacji</th>
    <th>Link do pobrania repozytorium</th>
  </tr>
</table>
</div>
<br />
`;

async function getRepos(name, date) {
  const arr = window.location.href.split('/');
  const host = `${arr[0]}//${arr[2]}`;
  const url = `${host}/repos/${name}` || `http://localhost:3000/repos/${name}`;


  try {
    const response = await fetch(url);
    if (typeof response !== 'undefined') {
      let result = await response.json();
      result.results.sort(((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
      result = result.results.filter((value) => Date.parse(value.updated_at) > Date.parse(date));
      return result;
    }
    return response;
  } catch (err) {
    throw new Error(err);
  }
}


class ReposTable extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const name = this.getAttribute('data-user');
    const date = this.getAttribute('data-update');

    const result = await getRepos(name, date);

    this.render(name, result);
  }

  render(name, result) {
    if (result.length === 0) {
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._shadowRoot.querySelector('label').innerText = `Brak wyników dla ${name}!`;
      this._shadowRoot.querySelector('label').style = 'color: red';
    } else {
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      const table = this._shadowRoot.querySelector('table');
      this._shadowRoot.querySelector('label').innerText = name;
      this._shadowRoot.querySelector('label').style = 'color: blue';

      result.forEach((i) => {
        table.appendChild(document.createElement('tr'));

        const tdName = document.createElement('td');
        const tdDesc = document.createElement('td');
        const tdDate = document.createElement('td');
        const tdLink = document.createElement('td');
        const link = document.createElement('a');

        tdName.textContent = i.name;
        tdDesc.textContent = i.description;
        tdDate.textContent = i.updated_at.replace('T', ' ').replace('Z', ' ');
        link.href = i.git_url;
        link.textContent = i.url;

        table.appendChild(tdName);
        table.appendChild(tdDesc);
        table.appendChild(tdDate);
        table.appendChild(tdLink);
        tdLink.appendChild(link);
      });
    }
  }
}


window.customElements.define('repos-table', ReposTable);
