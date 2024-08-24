// utils/cookie.js

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  console.log(value);
  
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export function setCookie(name, value, options = {}) {
  let expires = '';

  if (options.expires) {
    if (typeof options.expires === 'number') {
      const date = new Date();
      date.setTime(date.getTime() + options.expires);
      expires = `expires=${date.toUTCString()}`;
    } else {
      expires = `expires=${options.expires.toUTCString()}`;
    }
  }

  const cookie = [
    `${name}=${value}`,
    expires,
    options.path ? `path=${options.path}` : '',
    options.domain ? `domain=${options.domain}` : '',
    options.secure ? 'secure' : ''
  ].filter(Boolean).join('; ');

  document.cookie = cookie;
}
