# 🔍 Trello Backend Tests with Playwright

Projekt testów automatycznych API aplikacji Trello przy użyciu [Playwright](https://playwright.dev/).

---

### 📁 Projekt zawiera

-   Testy API dla podstawowych funkcji Trello:
    -   Tworzenie i usuwanie tablic
    -   Tworzenie, edycję i usuwanie list
    -   Tworzenie, edycję i usuwanie kart
    -   Edycja danych
    -   Autoryzacja i uwierzytelnianie
-   Użycie Playwright Test Runnera
-   Konfigurację środowiska testowego
-   Raporty testów

---

### 🚀 Wymagania

-   Node.js (v18+ zalecane)
-   NPM lub Yarn
-   Konto i klucz API Trello

---

### 🛠️ Instalacja

```bash
git clone https://github.com/marcin-palinski/playwright-trello-api.git
cd playwright-trello-api
npm install
```

---

### 🔐 Konfiguracja środowiska

-   Utwórz plik .env i dodaj dane autoryzacyjne Trello

```bash
KEY=your_api_key
TOKEN=your_oauth_token
```

### 🧪 Uruchamianie testów

-   Za pomocą terminala (uruchamia wszystkie testy)

```
npx playwright test
```

-   Za pomocą Playwright Test Runner UI (umożliwia pojedyncze wykonywanie testów)

```
npx playwright test --ui
```

### ✍️ Autor

[Marcin Paliński](https://github.com/marcin-palinski)
