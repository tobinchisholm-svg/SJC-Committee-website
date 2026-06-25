// =============================================
// BULLETINS — load latest from repo
// =============================================
async function loadLatestBulletin() {
    const container = document.getElementById('bulletin-container');

    try {
        const res = await fetch('https://api.github.com/repos/SJC-Website-Database-Development/SJC-Committee-website/contents/bulletins');
        if (!res.ok) {
            container.innerHTML = '<p class="media-placeholder-text">No bulletins available yet. Check back soon.</p>';
            return;
        }
        const files = await res.json();

        const mdFiles = files
            .filter(f => f.name.endsWith('.md'))
            .sort((a, b) => b.name.localeCompare(a.name));

        if (mdFiles.length === 0) {
            container.innerHTML = '<p class="media-placeholder-text">No bulletins available yet. Check back soon.</p>';
            return;
        }

        const bulletinRes = await fetch(mdFiles[0].download_url);
        const text        = await bulletinRes.text();

        const titleMatch = text.match(/title:\s*(.+)/);
        const fileMatch  = text.match(/^file:\s*(.+)/m);
        const file2Match = text.match(/^file2:\s*(.+)/m);

        const title = titleMatch ? titleMatch[1].trim() : 'Latest Bulletin';
        const file1 = fileMatch  ? fileMatch[1].trim()  : null;
        const file2 = file2Match ? file2Match[1].trim() : null;

        const baseUrl = 'https://raw.githubusercontent.com/SJC-Website-Database-Development/SJC-Committee-website/main';

        let html = `<h3 class="bulletin-title">${title}</h3>`;

        if (file1) {
            const ext = file1.split('.').pop().toLowerCase();
            if (ext === 'pdf') {
                html += `<iframe src="${baseUrl}${file1}" class="bulletin-pdf" title="${title}"></iframe>`;
            } else {
                html += `<img src="${baseUrl}${file1}" class="bulletin-img" alt="${title} - Page 1">`;
            }
        }

        if (file2) {
            const ext = file2.split('.').pop().toLowerCase();
            if (ext === 'pdf') {
                html += `<iframe src="${baseUrl}${file2}" class="bulletin-pdf" title="${title} - Page 2"></iframe>`;
            } else {
                html += `<img src="${baseUrl}${file2}" class="bulletin-img" alt="${title} - Page 2">`;
            }
        }

        if (!file1 && !file2) {
            html += '<p>Bulletin file not available.</p>';
        }

        container.innerHTML = html;

    } catch (err) {
        container.innerHTML = '<p class="media-placeholder-text">Could not load bulletin. Please check back later.</p>';
    }
}

// =============================================
// CALENDAR
// =============================================
let calendarEvents = [];
let currentYear;
let currentMonth;

async function loadCalendarEvents() {
    try {
        const res = await fetch('https://api.github.com/repos/SJC-Website-Database-Development/SJC-Committee-website/contents/events');

        if (res.ok) {
            const files = await res.json();
            const mdFiles = files.filter(f => f.name.endsWith('.md'));

            const eventPromises = mdFiles.map(async f => {
                const r    = await fetch(f.download_url);
                const text = await r.text();

                const titleMatch  = text.match(/title:\s*"?(.+?)"?\s*$/m);
                const dateMatch   = text.match(/date:\s*(.+)/);
                const bodyMatch   = text.match(/---[\s\S]*?---\s*([\s\S]*)/);

                if (!titleMatch || !dateMatch) return null;

                return {
                    title: titleMatch[1].trim(),
                    date:  new Date(dateMatch[1].trim()),
                    body:  bodyMatch ? bodyMatch[1].trim() : ''
                };
            });

            const results = await Promise.all(eventPromises);
            calendarEvents = results.filter(Boolean);
        }

    } catch (err) {
        console.error('Calendar load error:', err);
    }

    renderCalendar();
}

function renderCalendar() {
    const title    = document.getElementById('cal-month-title');
    const grid     = document.getElementById('calendar-grid');

    const monthNames = ['January','February','March','April','May','June',
                        'July','August','September','October','November','December'];

    title.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const firstDay    = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const dayHeaders = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    let html = dayHeaders.map(d => `<div class="cal-header">${d}</div>`).join('');

    for (let i = 0; i < firstDay; i++) {
        html += `<div class="cal-cell cal-empty"></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dayEvents = calendarEvents.filter(e =>
            e.date.getFullYear() === currentYear &&
            e.date.getMonth()    === currentMonth &&
            e.date.getDate()     === d
        );

        const hasEvents = dayEvents.length > 0;
        const today     = new Date();
        const isToday   = today.getFullYear() === currentYear &&
                          today.getMonth()    === currentMonth &&
                          today.getDate()     === d;

        const eventDots = hasEvents
            ? `<div class="cal-dots">${dayEvents.map(() => '<span class="cal-dot"></span>').join('')}</div>`
            : '';

        const dataAttr = hasEvents
            ? `data-events='${JSON.stringify(dayEvents.map(e => ({ title: e.title, body: e.body, date: e.date.toISOString() })))}'`
            : '';

        html += `<div class="cal-cell ${hasEvents ? 'cal-has-events' : ''} ${isToday ? 'cal-today' : ''}" ${dataAttr}>
            <span class="cal-day-num">${d}</span>
            ${eventDots}
        </div>`;
    }

    grid.innerHTML = html;

    grid.querySelectorAll('.cal-has-events').forEach(cell => {
        cell.addEventListener('click', () => {
            const events  = JSON.parse(cell.dataset.events);
            const detail  = document.getElementById('calendar-event-detail');
            const content = document.getElementById('calendar-event-content');

            content.innerHTML = events.map(e => {
                const dateObj = new Date(e.date);
                const timeStr = dateObj.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' });
                return `
                    <div class="cal-event-item">
                        <p class="cal-event-time">${timeStr}</p>
                        <h4 class="cal-event-title">${e.title}</h4>
                        ${e.body ? `<p class="cal-event-body">${e.body}</p>` : ''}
                    </div>
                `;
            }).join('');

            detail.style.display = 'block';
        });
    });
}

document.getElementById('cal-prev').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
    document.getElementById('calendar-event-detail').style.display = 'none';
});

document.getElementById('cal-next').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
    document.getElementById('calendar-event-detail').style.display = 'none';
});

document.getElementById('calendar-detail-close').addEventListener('click', () => {
    document.getElementById('calendar-event-detail').style.display = 'none';
});

// =============================================
// INIT
// =============================================
const now    = new Date();
currentYear  = now.getFullYear();
currentMonth = now.getMonth();

loadLatestBulletin();
loadCalendarEvents();

// =============================================
// HAMBURGER + SIDEBAR
// =============================================
const hamburger      = document.getElementById('hamburger');
const sidebar        = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const sidebarClose   = document.getElementById('sidebar-close');

function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('open');
    hamburger.classList.add('active');
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('open');
    hamburger.classList.remove('active');
}

hamburger.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

document.querySelectorAll('.sidebar-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const parent = toggle.parentElement;
        parent.classList.toggle('open');
    });
});