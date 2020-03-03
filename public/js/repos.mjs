/* eslint-disable no-underscore-dangle */

const template = document.createElement('template');

template.innerHTML = `
<style>
table {
	margin: 0 0 2rem 0;
	width: 100%;
}

	table tbody tr {
		border: solid 1px;
		border-left: 0;
		border-right: 0;
	}

	table td {
		padding: 0.75rem 0.75rem;
	}

	table th {
		font-size: 0.9rem;
		font-weight: 700;
		padding: 0 0.75rem 0.75rem 0.75rem;
		text-align: center;
	}

	table thead {
		border-bottom: solid 2px;
	}

	table tfoot {
		border-top: solid 2px;
	}

table tbody tr {
	border-color: rgba(144, 144, 144, 0.25);
}

	table tbody tr:nth-child(2n + 1) {
		background-color: rgba(144, 144, 144, 0.075);
	}

table th {
	color: #1e1f23;
}

table thead {
	border-bottom-color: rgba(144, 144, 144, 0.25);
}

table tfoot {
	border-top-color: rgba(144, 144, 144, 0.25);
}
</style>

<br />
<div class='repos-container'>
<label>Username</label>
<table>
  <tr>
    <th>Nazwa Repozytorium</th>
    <th>Opis Repozytorium</th>
    <th>Data aktualizacji</th>
    <th>Link do repozytorium</th>
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
    console.log(err);
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
    let result;

    try {
      result = await getRepos(name, date);
      this.render(name, result);
    } catch (err) {
      console.log(err);
    }
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
        link.href = i.html_url;
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
