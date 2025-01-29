/**
 * Inicjalizuje aplikację po pełnym załadowaniu DOM.
 * Konfiguruje widoki i obsługę użytkownika w zależności od stanu zalogowania.
 */
document.addEventListener('DOMContentLoaded', async () => {
    /**
     * Email użytkownika pobrany z ciasteczek.
     * @type {string|null}
     */
    const email = getCookie('email');

    /**
     * Nazwa użytkownika pobrana z ciasteczek.
     * @type {string|null}
     */
    const username = getCookie('username');

    /**
     * Informacja o tym czy użytkownik jest administratorem
     * @type {string|null}
     */
    const isAdmin = getCookie('isAdmin');

    if (isAdmin && email === 'm@g.c') {
        location.href="admin.html";
    }

    /**
     * Element selektora języka.
     * @type {HTMLSelectElement}
     */
    let languageSelect = document.getElementById('languageSelect');

    /**
     * Pobiera i wyświetla najlepszych użytkowników w tabeli.
     */
    const topUsers = await getTopUsers();
    console.log("topUsers: ", topUsers);
    const topUsersTable = document.getElementById('topUsersTable');
    for (let i = 0; i < Math.min(5, topUsers.length); i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('td');
            if (j === 0) {
                cell.textContent = `${i + 1}`;
            } else if (j === 1) {
                cell.textContent = `${topUsers[i].username}`;
            } else {
                cell.textContent = `${topUsers[i].total_proficiency}`;
            }
            row.appendChild(cell);
        }
        topUsersTable.appendChild(row);
    }

    if (email) {
        console.log('logged in');
        console.log("Email: " + email);

        document.getElementById('welcomeMessage').textContent = `Witaj, ${username}`;

        document.getElementById('auth').innerHTML = `
        <section id="words">
                <nav>
                    <a href="addWords.html" id="addWords">Dodaj słówka</a>
                    <a href="wordsList.html" id="wordsList">Lista wszystkich słówek</a>
                    <a href="wordsQuiz.html" id="wordsQuiz">Quiz</a>
                    <a href="#" id="logout">Wyloguj się</a>
                    <a href="#" id="delete-account">Usuń konto</a>
                </nav>
        </section>`;

        /**
         * Generuje widok statystyk dla użytkownika, wyświetlając ilość powtórek na każdy dzień tygodnia.
         */
        const daysOfWeek = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
        const today = new Date();
        const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
        const reorderedDays = [...daysOfWeek.slice(currentDayIndex + 1), ...daysOfWeek.slice(0, currentDayIndex + 1)];

        document.getElementById('statisticsContainer').innerHTML = `
            <h2>Statystyki</h2>
            <div id="languageDropdown">
                <label for="languageSelect">Wybierz język:</label>
                <select id="languageSelect">
                    <option value="all">Wszystkie języki</option>
                    <option value="en">Angielski</option>
                    <option value="de">Niemiecki</option>
                    <option value="fr">Francuski</option>
                    <option value="es">Hiszpański</option>
                </select>
            </div>
            <div id="statisticsOutput">
                <p>Ilość powtórzonych w tym tygodniu słówek</p>
                <table id="statisticsTable">
                    <tr>${reorderedDays.map(day => `<th>${day}</th>`).join('')}</tr>
                    <tr>${reorderedDays.map(() => '<td></td>').join('')}</tr>
                </table>
            </div>
        `;

        const statisticsTable = document.getElementById('statisticsTable');
        const reviewRow = statisticsTable.rows[1];

        for (let i = 0; i < reorderedDays.length; i++) {
            try {
                const adjustedDate = new Date(today);
                adjustedDate.setDate(today.getDate() - reorderedDays.length + i + 1);

                const formattedDate = adjustedDate.toISOString().split('T')[0];
                const result = await fetch("count-reviews", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        date: formattedDate,
                        language: null,
                    }),
                });
                if (result.ok) {
                    const data = await result.json();
                    console.log(JSON.stringify(data.count_reviews));
                    reviewRow.cells[i].innerHTML = data.count_reviews;
                }
            } catch (e) {
                console.log(e.message);
            }
        }

        document.getElementById('languageSelect').addEventListener('change', async (e) => {
            languageSelect = e.target;
            console.log("languageSelect: " + languageSelect.value);

            const statisticsTable = document.getElementById('statisticsTable');
            const reviewRow = statisticsTable.rows[1];

            for (let i = 0; i < reorderedDays.length; i++) {
                try {
                    const adjustedDate = new Date(today);
                    adjustedDate.setDate(today.getDate() - reorderedDays.length + i + 1);

                    const formattedDate = adjustedDate.toISOString().split('T')[0];
                    const language = languageSelect.value === "all" ? null : languageSelect.value;
                    const result = await fetch("count-reviews", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: email,
                            date: formattedDate,
                            language: language,
                        }),
                    });
                    if (result.ok) {
                        const data = await result.json();
                        console.log(JSON.stringify(data.count_reviews));
                        reviewRow.cells[i].innerHTML = data.count_reviews;
                    }
                } catch (e) {
                    console.log(e.message);
                }
            }
        });

        /**
         * Wylogowuje użytkownika, usuwając wszystkie ciasteczka i przekierowując na stronę główną.
         */
        document.getElementById('logout').addEventListener('click', (event) => {
            event.preventDefault();
            clearAllCookies();
            alert('Zostałeś wylogowany.');
            window.location.replace('index.html');
        });

        /**
        * Usuwa konto użytkownika
        */
        document.getElementById('delete-account').addEventListener('click', (event) => {
            event.preventDefault();
            clearAllCookies();
            console.log("email: ", email);
            deleteAccount(email);
            alert("Usunięto konto");
            window.location.replace('index.html');
        })

    } else {
        document.getElementById('auth').innerHTML = `
            <h2>Logowanie</h2>
            <p>
                <a href="login.html">Zaloguj się</a>
            </p>
            
            <h2>Rejestracja</h2>
            <p>
                <a href="register.html">Zarejestruj się</a>
            </p>
        `;
        document.getElementById('welcomeMessage').textContent = "Witaj!";
        document.getElementById('statisticsContainer').innerHTML = "";
    }
});

/**
 * Usuwa wszystkie ciasteczka.
 */
function clearAllCookies() {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
}

/**
 * Pobiera wartość ciasteczka o podanej nazwie.
 *
 * @param {string} name - Nazwa ciasteczka.
 * @returns {string|null} Wartość ciasteczka lub null, jeśli nie znaleziono.
 */
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

/**
 * Pobiera listę najlepszych użytkowników.
 *
 * @returns {Promise<Object[]>} Lista użytkowników z ich wynikami.
 */
async function getTopUsers() {
    try {
        const response = await fetch("get-top-users", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        });

        const data = await response.json();
        console.log("data inside getTopUsers(): " + data);
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function deleteAccount(email) {
    await fetch("delete-account", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
        })
    })
    .then(res => res.json())
    .then(data => {
        window.hre
    })
}
