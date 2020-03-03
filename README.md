# GitApp
**Aplikacja NodeJS wyświetlająca informacje o repozytoriach podanego użytkownika Github.** <br/> <br/>
Zbudowana przy pomocy standardu [Webcomponentów](https://developer.mozilla.org/en-US/docs/Web/Web_Components), pozwala na zamianę tagu `<repos-table>` na komponent wyświetlający tabelkę z danymi użytkownika przekazanego w atrybucie `data-user`. Dane będą nowsze od daty podanej w atrybucie `<data-update>`. <br/>

  np.  `<repos-table data-user="troyan37" data-update="2020-01-07"></repos-table>` wyświetli tabelkę z danymi o repozytoriach użytkownika **troyan37**, założonymi po dniu **07.01.2020**. <br/><br/>

Aby uruchomić aplikację, należy pobrać kod (np. `git clone`), a następnie wywołać w folderze z package.json polecenie: <br/>
`npm install`<br/>
Jeśli powyższe polecenie nie działa, należy upewnić się że został zainstalowany [NodeJS](https://nodejs.org/en/)

Następnym krokiem w konfiguracji jest dodanie do pliku .env tokena do API GitHub, bez którego wywołania API mogą zostać ograniczone.

Access token należy wygenerować w Github (Developer settings -> Personal access tokens -> Generate new token), a następnie w pliku .env nadpisać nim wartość YOUR_API_KEY:
<br/>
`API_KEY=YOUR_API_KEY`
<br/><br/>
Po uzupełnieniu tokena można uruchomić aplikację za pomocą: <br/>
`npm start`
<br/>
