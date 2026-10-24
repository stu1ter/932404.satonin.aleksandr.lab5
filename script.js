document.addEventListener('DOMContentLoaded', () => {

    // Поиск элементов
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const togglePlaylistBtn = document.getElementById('toggle-playlist-btn');
    const addTrackBtn = document.getElementById('add-track-btn');
    const clearPlaylistBtn = document.getElementById('clear-playlist-btn');

    const playlistSection = document.querySelector('#playlist-section');
    const tracksList = document.querySelector('#tracks-list');
    const body = document.body;

    if (!themeToggleBtn || !togglePlaylistBtn || !addTrackBtn || !clearPlaylistBtn || !playlistSection || !tracksList) {
        console.error('Критическая ошибка: Элементы интерфейса не найдены в DOM дереве!');
        return; // Полная остановка скрипта во избежание поломок
    }

    // Инициализация данных из localStorage
    let tracksData = JSON.parse(localStorage.getItem('tracksData')) || [];
    const savedTheme = localStorage.getItem('musicTheme') || 'light-theme';
    const isPlaylistHidden = localStorage.getItem('playlistHidden') === 'true';

    body.className = savedTheme;
    if (isPlaylistHidden) {
        playlistSection.classList.add('hidden');
        togglePlaylistBtn.textContent = '👁️ Показать плейлист';
    }

    renderTracks();

    function renderTracks() {
        tracksList.innerHTML = '';

        if (tracksData.length === 0) {
            tracksList.innerHTML = '<li class="empty-msg">Плейлист пуст. Добавьте первый трек!</li>';
            return;
        }

        tracksData.forEach((track, index) => {
            const li = document.createElement('li');
            li.classList.add('track-item');
            li.setAttribute('data-id', index);

            li.innerHTML = `
                <div class="track-info">
                    <div class="track-meta">
                        <h3>${escapeHtml(track.name)}</h3>
                        <span>⏱️ Длительность: ${escapeHtml(track.duration)}</span>
                    </div>
                </div>
                <div class="track-actions">
                    <label class="fav-label">
                        <input type="checkbox" class="fav-checkbox" ${track.isFavorite ? 'checked' : ''}>
                        ❤️ Избранное
                    </label>
                    <button class="btn-delete-track">Удалить</button>
                </div>
            `;

            const checkbox = li.querySelector('.fav-checkbox');
            checkbox.addEventListener('change', (e) => {
                tracksData[index].isFavorite = e.target.checked;
                saveToLocalStorage();
            });

            const deleteBtn = li.querySelector('.btn-delete-track');
            deleteBtn.addEventListener('click', () => {
                tracksData.splice(index, 1);
                saveAndRefresh();
            });

            tracksList.appendChild(li);
        });
    }

    // Добавление трека
    addTrackBtn.addEventListener('click', () => {
        const name = prompt('Введите название музыкального трека:');
        if (name === null) return;

        const duration = prompt('Введите длительность трека (например, 3:45 или 02:15):');
        if (duration === null) return;

        if (!name.trim()) {
            alert('Ошибка ввода: Название трека не может быть пустым!');
            return;
        }
        if (!duration.trim()) {
            alert('Ошибка ввода: Длительность должна быть указана!');
            return;
        }

        tracksData.push({
            name: name.trim(),
            duration: duration.trim(),
            isFavorite: false
        });

        saveAndRefresh();
    });

    // Отчистка плейлиста
    clearPlaylistBtn.addEventListener('click', () => {
        if (tracksData.length === 0) {
            alert('Плейлист уже пуст!');
            return;
        }

        if (confirm('Вы уверены, что хотите полностью очистить плейлист?')) {
            tracksData = [];
            saveAndRefresh();
        }
    });

    // Переключение темы
    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('musicTheme', 'dark-theme');
        } else {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('musicTheme', 'light-theme');
        }
    });

    // Скрытие плейлиста
    togglePlaylistBtn.addEventListener('click', () => {
        const isHidden = playlistSection.classList.toggle('hidden');

        if (isHidden) {
            togglePlaylistBtn.textContent = '👁️ Показать плейлист';
        } else {
            togglePlaylistBtn.textContent = '👁️ Скрыть плейлист';
        }

        localStorage.setItem('playlistHidden', isHidden);
    });

    function saveToLocalStorage() {
        localStorage.setItem('tracksData', JSON.stringify(tracksData));
    }

    function saveAndRefresh() {
        saveToLocalStorage();
        renderTracks();
    }

    const topButtons = document.querySelectorAll('.controls-top button');
    console.log(`Найдено кнопок в шапке сайта: ${topButtons.length}`);
});
