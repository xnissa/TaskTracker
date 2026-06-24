# Task Tracker - Angular Project

**Autor:** Trotuș Denisa-Andreea

## 1. Introducere
**Task Tracker** este o aplicație web de tip Single Page Application (SPA), dezvoltată pentru a facilita managementul eficient al sarcinilor zilnice. Scopul principal al aplicației este de a oferi utilizatorilor un mediu organizat și izolat în care își pot crea, vizualiza, modifica și șterge propriile task-uri (operațiuni CRUD). Aplicația suportă lucrul multi-utilizator, asigurând intimitatea datelor prin asocierea fiecărui task cu un anumit cont de utilizator.

## 2. Tehnologii și Librării Utilizate
Proiectul a fost dezvoltat utilizând cele mai noi standarde și tehnologii web:
* **Frontend (Framework):** Angular 17+, folosind exclusiv *Standalone Components* și noul *Control Flow* (`@if`, `@for`) pentru o sintaxă mai curată și o performanță sporită.
* **Librărie UI:** **NG-ZORRO** (Ant Design pentru Angular) a fost integrat pentru a furniza componente complexe (formulare reactive, tabele sortabile, ferestre modale, carduri).
* **State Management:** S-a utilizat noul sistem de reactivitate din Angular, bazat pe **Signals** (`signal`, `computed`), pentru a menține interfața sincronizată automat cu datele din fundal.
* **Backend / Bază de date locală:** **JSON Server** este folosit pentru a simula un API RESTful, permițând stocarea permanentă a utilizatorilor și a proiectelor în fișierul `db.json`.
* **Librării adiționale:** `jsPDF` și `jspdf-autotable` pentru funcționalitatea bonus de generare și export a tabelelor sub formă de documente PDF.

## 3. Arhitectura Aplicației
Structura aplicației respectă bunele practici de modularizare, fiind împărțită logic în trei directoare principale:
* `core/`: Conține serviciile globale care comunică cu backend-ul (`ProjectService`) folosind `HttpClient` și interfețele care definesc modelele de date (`Project`).
* `features/`: Conține funcționalitățile principale ale aplicației: modulul de autentificare (`login`, `register`) și interfața principală (`dashboard`).
* `shared/`: Include componente reutilizabile (ex. `StatusBadge`) care comunică prin proprietăți de tip `@Input()` și `@Output()`.

Pentru a optimiza timpul de încărcare inițial al aplicației, rutarea a fost configurată să fie complet **Lazy Loaded**. Componentele sunt descărcate în browser doar atunci când utilizatorul navighează efectiv pe pagina respectivă.

## 4. Funcționalități Principale

### 4.1 Autentificare și Gestiunea Conturilor
Sistemul de autentificare blochează accesul utilizatorilor neînregistrați la Dashboard prin intermediul unui Auth Guard. 
* **Înregistrare (Register):** Formular reactiv care colectează datele și aplică validări avansate: verificarea puterii parolei, un validator custom pentru potrivirea parolelor și un validator asincron care interoghează API-ul în timp real pentru a preveni crearea a două conturi cu aceeași adresă de email.
* **Conectare (Login):** Formular de acces cu funcționalitate de „Remember me”. Permite utilizatorilor să își păstreze sesiunea activă prin stocarea unui token unic.

### 4.2 Gestiunea Task-urilor (Dashboard)
Pagina principală reprezintă centrul de comandă al aplicației, oferind funcționalități complexe de manipulare și vizualizare a datelor:
* **Vizualizare tabelară:** Task-urile sunt afișate într-un tabel NgZorro cu 5 coloane principale. Tabelul permite sortarea dinamică a fiecărei coloane direct din capul de tabel.
* **Operațiuni CRUD prin Modal:** Adăugarea de noi task-uri și modificarea celor existente se realizează printr-o fereastră de dialog (Modal). La salvare, task-ul primește automat `userId`-ul contului conectat.
* **Căutare și Filtrare Multicriterială:** Utilizatorul poate căuta text în numele sau descrierea task-ului, aplicând simultan filtre pentru Status și Prioritate. 
* **Ștergere sigură:** Acțiunea de ștergere este securizată printr-o confirmare suplimentară (`nz-popconfirm`).

### 4.3 Statistici și Funcționalități Bonus
În partea superioară a Dashboard-ului se regăsesc trei carduri statistice (Active Tasks, Completed Tasks, Total Tasks), populate dinamic pe baza stării globale a aplicației.
Ca funcționalitate extinsă, aplicația integrează un sistem de generare a rapoartelor. Printr-o simplă apăsare de buton, utilizatorul poate exporta lista filtrată curentă de task-uri într-un document PDF complet customizat.

## 5. Instrucțiuni de Rulare Locală
Pentru a rula proiectul pe mașina locală, urmează acești pași:

**Pasul 1: Instalarea dependențelor** Deschide un terminal în folderul proiectului și rulează:  
`npm install`

**Pasul 2: Pornirea serverului de backend (JSON Server)** Într-un terminal separat, rulează comanda pentru a porni baza de date locală:  
`npx json-server --watch db.json --port 3000`

**Pasul 3: Pornirea aplicației Angular** În terminalul inițial, pornește serverul de dezvoltare:  
`ng serve`

**Pasul 4: Accesarea aplicației** Deschide browserul preferat și accesează adresa:  
`http://localhost:4200`

## 6. Concluzii
Proiectul integrează cu succes cerințele unei aplicații web moderne, oferind o arhitectură curată, scalabilă și un mediu vizual practic. Utilizarea noilor funcționalități Angular (Signals, Standalone Components, Control Flow) demonstrează o adaptare eficientă la practicile de dezvoltare actuale, garantând o performanță optimă și o experiență de utilizare fluidă.
