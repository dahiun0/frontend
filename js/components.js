class AppHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        app-header {
          display: block;
          position: sticky;
          top: 0;
          z-index: 50;
        }
      </style>
      <header class="w-full bg-white border-b border-gray-100">
        <div class="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
          <div class="flex items-center gap-3 w-40">
            <a href="/" class="text-xl font-bold tracking-tight font-display">BINARY</a>
          </div>
          <nav class="hidden md:flex items-center gap-10">
            <a class="nav-link text-sm font-semibold text-gray-500 hover:text-black transition-colors uppercase tracking-wide" href="/">Home</a>
            <a class="nav-link text-sm font-semibold text-gray-500 hover:text-black transition-colors uppercase tracking-wide" href="/about">About</a>
            <a class="nav-link text-sm font-semibold text-gray-500 hover:text-black transition-colors uppercase tracking-wide" href="/activity">Activity</a>
            <a class="nav-link text-sm font-semibold text-gray-500 hover:text-black transition-colors uppercase tracking-wide" href="/board">Board</a>
            <a class="nav-link text-sm font-semibold text-gray-500 hover:text-black transition-colors uppercase tracking-wide" href="/ranking">Ranking</a>
          </nav>
          <div class="flex items-center justify-end gap-2 md:gap-4 w-40" id="auth-container">
            <!-- Buttons are injected via checkLoginStatus() -->
          </div>
          <button class="md:hidden text-2xl">
            <span class="material-symbols-outlined">menu</span>
          </button>
        </div>
      </header>
    `;

    this.setActiveLink();
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const authContainer = this.querySelector('#auth-container');
    if (!authContainer) return;

    // 로컬 스토리지에 'token'이 있는지 확인하여 로그인 여부 판단
    const token = localStorage.getItem('token');

    if (token) {
      // 로그인 상태일 때 (마이페이지 및 로그아웃 버튼)
      authContainer.innerHTML = `
        <a href="/mypage" class="flex items-center justify-center px-6 py-2 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-all shadow-md hover:shadow-lg font-body">
          <span>MYPAGE</span>
        </a>
        <button onclick="localStorage.removeItem('token'); localStorage.removeItem('user'); location.reload();"
          class="flex items-center justify-center px-3 py-2 rounded-lg text-gray-500 hover:text-black text-sm font-bold transition-all font-body md:flex hidden">
          Logout
        </button>
      `;
    } else {
      // 비로그인 상태일 때 (로그인 버튼)
      authContainer.innerHTML = `
        <button onclick="location.href='/login'"
          class="flex items-center justify-center px-6 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-all shadow-md hover:shadow-lg font-body">
          Login
        </button>
      `;
    }
  }

  setActiveLink() {
    const links = this.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;

    links.forEach(link => {
      const linkPath = new URL(link.href).pathname;

      // Check if current path starts with link path (to handle /board/post... etc)
      // Special case for Home (/index.html or /)
      let isActive = false;
      if (linkPath === '/' || linkPath === '/index.html') {
        isActive = currentPath === '/' || currentPath === '/index.html';
      } else {
        isActive = currentPath.startsWith(linkPath.replace('/index.html', ''));
      }

      if (isActive) {
        link.classList.remove('font-semibold', 'text-gray-500');
        link.classList.add('font-bold', 'text-black', 'border-b-2', 'border-primary', 'pb-0.5');
      }
    });
  }
}

class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="w-full bg-white border-t border-gray-100 py-12 mt-12">
        <div class="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center gap-2 mb-4">
              <a href="/" class="font-bold tracking-tight font-display text-text-main hover:text-primary transition-colors">BINARY</a>
            </div>
            <p class="text-gray-500 text-sm max-w-sm mb-6">
              Empowering the next generation of technology leaders through code, community, and collaboration.
            </p>
            <div class="text-gray-400 text-xs">
              © 2023 BINARY School Computer Club. All rights reserved.
            </div>
          </div>
          <div>
            <h4 class="font-bold mb-4 text-sm uppercase tracking-wide">Links</h4>
            <ul class="space-y-2 text-sm text-gray-500">
              <li><a class="hover:text-primary transition-colors" href="/">Home</a></li>
              <li><a class="hover:text-primary transition-colors" href="/about">About</a></li>
              <li><a class="hover:text-primary transition-colors" href="/activity">Activity</a></li>
              <li><a class="hover:text-primary transition-colors" href="/board">Board</a></li>
              <li><a class="hover:text-primary transition-colors" href="/ranking">Ranking</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4 text-sm uppercase tracking-wide">Connect</h4>
            <div class="flex gap-4">
              <a class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group hover:bg-black transition-colors duration-200" href="https://open.kakao.com/o/s5eNFOne" target="_blank">
                <img src="https://cdn.simpleicons.org/kakaotalk/6B7280" alt="KakaoTalk" class="w-5 h-5 transition-all duration-200 group-hover:brightness-0 group-hover:invert">
              </a>
              <a class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group hover:bg-black transition-colors duration-200" href="https://instagram.com/sejong_binary" target="_blank">
                <img src="https://cdn.simpleicons.org/instagram/6B7280" alt="Instagram" class="w-5 h-5 transition-all duration-200 group-hover:brightness-0 group-hover:invert">
              </a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('app-header', AppHeader);
customElements.define('app-footer', AppFooter);
