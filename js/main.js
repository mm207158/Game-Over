class GameApp {
  constructor() {
    this.load = document.getElementById('load');
    this.row = document.getElementById('row');
    this.details = document.getElementById('details');
    this.nav = document.querySelector('.navbar-nav');
    this.apiKey = 'f056ea567bmshbb946419d20bef5p1f3a18jsnc833e4f79a58';
    this.apiHost = 'free-to-play-games-database.p.rapidapi.com';

    this.handleNavClick();
    this.getData('MMORPG'); // تحميل أول فئة تلقائياً
  }

  async getData(category) {
    try {
      this.showLoader();

      const response = await fetch(
        `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key': this.apiKey,
            'x-rapidapi-host': this.apiHost,
          },
        }
      );
      const data = await response.json();
      this.hideLoader();
      this.displayGames(data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }

  displayGames(games) {
    let cards = '';
    for (let game of games) {
      cards += `
        <div class="col-md-3 mb-4 d-flex data" data-id="${game.id}">
          <div class="card w-100 h-100" style="background-color: rgb(29, 21, 46);">
            <img src="${game.thumbnail}" class="w-100">
            <div class="card-body">
              <div class="hstack justify-content-between">
                <p class="text-white">${game.title}</p>
                <span class="badge text-bg-primary p-2 px-3 fs-5 fw-bold">Free</span>
              </div>
              <p class="text-center text-white small">${game.short_description}</p>
            </div>
            <footer class="card-footer small hstack justify-content-between">
              <span class="badge bg-info">${game.genre}</span>
              <span class="badge bg-secondary">${game.platform}</span>
            </footer>
          </div>
        </div>`;
    }

    this.row.innerHTML = cards;

    document.querySelectorAll('.data').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        this.getDetails(id);
      });
    });
  }

  async getDetails(id) {
    console.log("تحميل تفاصيل اللعبة:", id);
    try {
      this.showLoader();
      const response = await fetch(
        `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${id}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key': this.apiKey,
            'x-rapidapi-host': this.apiHost,
          },
        }
      );
      const game = await response.json();
      this.hideLoader();
      this.displayDetails(game);
    } catch (err) {
      console.error('Error getting details:', err);
    }
  }

  displayDetails(game) {
    this.details.innerHTML = `
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h1>Game Details</h1>
          <i class="fa-solid fa-xmark fs-2" id="exist" style="cursor: pointer;"></i>
        </div>
        <div class="row">
          <div class="col-md-4">
            <img src="${game.thumbnail}" class="w-100 mb-3">
          </div>
          <div class="col-md-8">
            <h3>Title: ${game.title}</h3>
            <p>Category: <span class="badge bg-info">${game.genre}</span></p>
            <p>Platform: <span class="badge bg-secondary">${game.platform}</span></p>
            <p>Status: <span class="badge bg-success">Live</span></p>
            <p class="small">${game.description}</p>
            <a href="${game.game_url}" target="_blank" class="btn btn-warning">Play Now</a>
          </div>
        </div>
      </div>
    `;
    this.details.classList.replace('d-none', 'd-block');
    document.body.style.overflow = 'hidden';

    document.getElementById('exist').addEventListener('click', () => {
      this.details.classList.replace('d-block', 'd-none');
      document.body.style.overflow = 'auto';
    });
  }

  handleNavClick() {
    this.nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
        });
        e.target.classList.add('active');
        const category = e.target.textContent.trim();
        this.getData(category);
      }
    });
  }

  showLoader() {
    this.load.classList.replace('d-none', 'd-flex');
  }

  hideLoader() {
    this.load.classList.replace('d-flex', 'd-none');
  }
}

const app = new GameApp();
