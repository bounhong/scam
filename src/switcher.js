/* global Cookies */
const sel = (selector) => document.querySelector(selector);

const saveSession = (username, cookie) => {
  let obj = {};
  if (localStorage.hasOwnProperty('sc-accounts')) {
    obj = JSON.parse(localStorage.getItem('sc-accounts'));
    obj[username] = cookie;
    localStorage.setItem('sc-accounts', JSON.stringify(obj));
  } else {
    obj[username] = cookie;
    localStorage.setItem('sc-accounts', JSON.stringify(obj));
  }
};

const deleteSession = (username) => { // eslint-disable-line no-unused-vars
  if (localStorage.hasOwnProperty('sc-accounts')) {
    const obj = JSON.parse(localStorage.getItem('sc-accounts'));
    delete obj[username];
    localStorage.setItem('sc-accounts', JSON.stringify(obj));
  }
};

const getSession = (username) => JSON.parse(localStorage.getItem('sc-accounts'))[username];

const saveCurrentSession = () => {
  let username = sel('.header__userNavUsernameButton').href;
  const cookie = Cookies.get('oauth_token');
  username = username.replace('https://soundcloud.com/', '');
  saveSession(username, cookie);
};

const switchSession = (user) => {
  if (!user === sel('.header__userNavUsernameButton').href) {
    Cookies.set('oauth_token', getSession(user));
    setTimeout(location.reload, 300);
  }
};

const injectSwitcher = () => {
  if (localStorage.hasOwnProperty('sc-accounts')) {
    const accounts = JSON.parse(localStorage.getItem('sc-accounts'));
    const list = document.createElement('ul');
    list.setAttribute('class', 'profileMenu__list sc-list-nostyle');
    Object.keys(accounts).forEach((account, index) => {
      const li = document.createElement('li');
      li.setAttribute('class', 'profileMenu__item');
      const link = document.createElement('a');
      link.setAttribute('class', 'profileMenu__link profileMenu__profile');
      link.innerText = account;
      link.id = 'switch-account';
      link.dataset.user = account;
      link.href = '#';

      link.onclick = (event) => {
        switchSession(event.target.dataset.user);
      };

      li.appendChild(link);
      list.appendChild(li);

      if (index >= Object.keys(accounts).length - 1) {
        sel('.profileMenu').appendChild(list);
      }
    });
  }
};

const menuObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);
    if (addedNodes.includes(sel('.dropdownMenu')) || addedNodes.includes(sel('.profileMenu__list'))) {
      injectSwitcher();
    }
  }
});

const init = () => {
  saveCurrentSession();
  menuObserver.observe(document.body, {
    childList: true, subtree: true,
  });
};

init();