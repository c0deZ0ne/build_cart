export const getTokenInfo = async token => {
  const userInfo = await new Promise(resolve => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', `https://www.googleapis.com/oauth2/v3/userinfo`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300)
        resolve(JSON.parse(this.responseText));
      else resolve({ err: '404' });
    };
    xhr.send();
  });

  return userInfo;
};
