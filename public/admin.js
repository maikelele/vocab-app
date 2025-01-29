window.onload = () => {
    const username = getCookie('username');
    document.getElementById('welcomeMessageAdmin').textContent = `Witaj, ${username}!`;


    const today = new Date();

    document.getElementById('summaryRegistrations').addEventListener('click', () => {
        clear();
        fetch('summary-registrations', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.rows[0].registration_count);
                const summaryRegistrations = document.getElementById('summary-registration');
                summaryRegistrations.innerHTML = `
            <h2>Podsumowanie rejestracji - ${today.toLocaleString('pl-PL', { month: 'long', year: 'numeric' })}</h2>
            ${makeGraph(today, data.rows, 'registrations')}
        `;
                const exportToPDFDiv = document.getElementById('exportToPDF');
                exportToPDFDiv.innerHTML = '';
                const exportButton = document.createElement('button');
                exportButton.id = 'exportRegistrations';
                exportButton.textContent = 'Export do PDF';
                exportToPDFDiv.appendChild(exportButton)
                document.getElementById('exportRegistrations').addEventListener('click', () => {
                    exportGraphToPDF('summary-registration', 'registrations.pdf');
                });
            });
    });

    document.getElementById('summaryLogins').addEventListener('click', () => {
        clear();
        fetch('summary-logins', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.rows[0].logins_count);
                const summaryLogins = document.getElementById('summary-logins');
                summaryLogins.innerHTML = `
            <h2>Podsumowanie logowań - ${today.toLocaleString('pl-PL', { month: 'long', year: 'numeric' })}</h2>
            ${makeGraph(today, data.rows, 'logins')}
        `;
                const exportToPDFDiv = document.getElementById('exportToPDF');
                exportToPDFDiv.innerHTML = '';
                const exportButton = document.createElement('button');
                exportButton.id = 'exportLogins';
                exportButton.textContent = 'Export do PDF';
                exportToPDFDiv.appendChild(exportButton)
                document.getElementById('exportLogins').addEventListener('click', () => {
                    exportGraphToPDF('summary-logins', 'logins.pdf');
                });
            });
    });

    document.getElementById('summaryRepetitions').addEventListener('click', () => {
        clear();
        fetch('summary-revisions', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.rows);
                const summaryRevisions = document.getElementById('summary-repetitions');
                summaryRevisions.innerHTML = `
            <h2>Podsumowanie aktywności - ${today.toLocaleString('pl-PL', { month: 'long', year: 'numeric' })}</h2>
            ${makeGraph(today, data.rows, 'revisions')}
        `;
                const exportToPDFDiv = document.getElementById('exportToPDF');
                exportToPDFDiv.innerHTML = '';
                const exportButton = document.createElement('button');
                exportButton.id = 'exportRepetitions';
                exportButton.textContent = 'Export do PDF';
                exportToPDFDiv.appendChild(exportButton)
                document.getElementById('exportRepetitions').addEventListener('click', () => {
                    exportGraphToPDF('summary-repetitions', 'repetitions.pdf');
                });
            });
    });

    document.getElementById('userCount').addEventListener('click', () => {
        clear();
        fetch('user-count', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                const user_ids = [data.rows[0].user_id];
                const usernames = [data.rows[0].username];
                const user_emails = [data.rows[0].user_email];
                const registration_dates = [data.rows[0].registration_date];
                const wordCounts = [data.rows[0].total_word_count];

                for (let i = 1; i < data.rows.length; i++) {
                    user_ids.push(data.rows[i].user_id);
                    usernames.push(data.rows[i].username);
                    user_emails.push(data.rows[i].user_email);
                    registration_dates.push(data.rows[i].registration_date);
                    wordCounts.push(data.rows[i].total_word_count);
                }

                document.getElementById('user-count').innerHTML = ''; // Clear existing content
                let tableContent = `
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px;">ID uzytkownika</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Nazwa uzytkownika</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Email</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Data rejestracji</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Ilosc slowek</th>
                    </tr>
                </thead>
            <tbody>
        `;

                for (let i = 0; i < usernames.length; i++) {
                    tableContent += `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${user_ids[i]}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${usernames[i]}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${user_emails[i]}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${registration_dates[i]}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${wordCounts[i]}</td>
                </tr>
            `;
                }

                tableContent += `
            </tbody>
        </table>
        `;

                const exportToPDFDiv = document.getElementById('exportToPDF');
                exportToPDFDiv.innerHTML = '';
                const exportButton = document.createElement('button');
                exportButton.id = 'exportUsers';
                exportButton.textContent = 'Export do PDF';
                exportToPDFDiv.appendChild(exportButton)

                document.getElementById('user-count').innerHTML = tableContent;
                document.getElementById('exportUsers').addEventListener('click', () => {
                    exportTableToPDF('user-count', 'users.pdf');
                });
            });
    });

    document.getElementById('logout').addEventListener('click', (event) => {
        event.preventDefault();

        clearAllCookies();

        console.log('Session destroyed');

        alert('Zostałeś wylogowany.');
        window.location.replace('index.html');
    });
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

function makeGraph(today, rows, option) {
    const currentYear = today.getFullYear();
    const currentMonth = today.toLocaleString('default', { month: 'long' });
    const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();

    // Determine the label and count key based on the option
    let countKey;
    if (option === 'registrations') {
        countKey = 'registration_count';
    } else if (option === 'logins') {
        countKey = 'login_count';
    } else if (option === 'revisions') {
        countKey = 'revision_count';
    } else {
        return '<p>Invalid option provided</p>';
    }

    let graphHTML = `
        <div style="display: flex; align-items: flex-end; gap: 5px; height: 300px; border-left: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 10px;">
    `;

    const maxCount = Math.max(...rows.map(row => row[countKey]));
    for (let day = 1; day <= daysInMonth; day++) {
        console.log(day + ": " +  rows[day-1][countKey]);
        const count = rows[day - 1] ? rows[day - 1][countKey] : 0;
        const barHeight = maxCount > 0 ? (count / maxCount) * 10 : 0;
        graphHTML += `
        <small style="margin-top: 5px;">${day}</small>
        <div style="height: ${barHeight}%; background-color: #007bff; width: 70%; border-radius: 4px;"></div>
        `;
    }

    graphHTML += '</div>';
    return graphHTML;
}

function clear() {
    const summaryRegistrations = document.getElementById('summary-registration');
    const summaryLogins = document.getElementById('summary-logins');
    const summaryRepetitions = document.getElementById('summary-repetitions');
    const userCount = document.getElementById('user-count');

    summaryRegistrations.innerHTML = '';
    summaryLogins.innerHTML = '';
    summaryRepetitions.innerHTML = '';
    userCount.innerHTML = '';
}

/**
 * Usuwa wszystkie ciasteczka.
 */
function clearAllCookies() {
    // Get all cookies
    const cookies = document.cookie.split(';');

    // Loop through cookies and delete each one
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

        // Delete the cookie by setting its expiration date to the past
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
}

/**
 * Exportuje zawartość elementu o podanym id do pliku PDF.
 *
 * @param {string} sectionId - Identyfikator elementu do wyeksportowania.
 * @param {string} filename - Nazwa pliku PDF.
 */
function exportTableToPDF(sectionId, filename) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const section = document.getElementById(sectionId);
    const rows = section.querySelectorAll('table tr');
    let y = 10;

    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        cols.forEach((col, index) => {
            doc.setFontSize(7);
            doc.text(col.textContent, 10 + (index * 40), y, { fontSize: 10 });
        });
        y += 10;
    });

    doc.save(filename);
}

function exportGraphToPDF(sectionId, filename) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const section = document.getElementById(sectionId);

    html2canvas(section).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 190; // Width of the image in the PDF
        const pageHeight = 295; // Height of the PDF page
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;

        // Add the image to the PDF
        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add new pages if the image height exceeds the page height
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Save the PDF
        doc.save(filename);
    });
}
