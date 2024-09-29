# Examinationsuppgift - Trullo

## Mål

Målet är att skapa ett API för en projekthanterings-applikation vid namn Trullo. APIet ska möjliggöra att användare (User) kan skapa uppgifter (Task) och planera projekt. Databasen ska vara antingen SQL eller NoSQL.

### Teoretiska resonemang

- Motivera ditt val av databas
- Redogör vad de olika teknikerna (ex. verktyg, npm-paket, etc.) gör i applikationen
- Redogör översiktligt hur applikationen fungerar

### Krav för Godkänt

- APIet använder NodeJS, ExpressJS och TypeScript
- SQL- eller NoSQL-databas
- Datamodellen har objektet `Task` med följande fält
  - id
  - title
  - description
  - status (ex. "to-do", "in progress", "blocked", "done")
  - assignedTo
  - createdAt
  - finishedBy
- Datamodellen har objektet `User` med följande fält
  - id
  - name
  - email
  - password
- Möjlighet att skapa, läsa, uppdatera och ta bort en `User`
- Möjlighet att skapa, läsa, uppdatera och ta bort en `Task`
- En `User` kan tilldelas en `Task` med fältet `assignedTo`
- Grundläggande validering och felhantering

### Vidareutveckling för Väl Godkänt

Följande urval är exempel på vidareutveckling. Egna förslag på vidareutveckling välkommnas.

- Applikationen är robust med genomtänkt felhantering och validering (viktigast för VG)
- Utveckla datamodellen med fler fält och objekt
  - Ex. fältet `tags` på `Task`
  - Ex. objektet `Project` så flera projekt kan hanteras samtidigt där varje `Task` tillhör ett projekt. Tänk er Trello där varje **Board** är ett projekt.
- Authentication & Authorization
  - Implementera autentisering med JWT
  - Endast användare autentiserade med JWT kan ändra sina uppgifter
  - Implementera rollhantering (ex. fältet `role: admin` på `User`) som kan ändra allas användare och uppgifter
- Kryptera lösenord i databasen med hashing och salting
- Implementera möjlighet för användaren att nollställa och välja nytt lösenord

### Inlämning

- Kodinlämning i Canvas med länk till repository (t.ex. GitHub)
- Inlämning senast **söndagen den 29e september kl. 23:59**



## Notes
- Development (npm run dev): Runs your src/index.ts file using tsx in watch mode. It automatically recompiles your code on changes and restarts the server.

- Build (npm run build): Runs npx tsc, which compiles your TypeScript files into JavaScript. By default, the compiled files go into the dist folder (or whichever folder is specified in tsconfig.json).

- Start (npm run start): After running the build command, the compiled code in dist/index.js can be executed using Node.js. s