window.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById('myModal');
  // Get the button that opens the modal
  const btn = document.getElementById("myBtn");
    // Get the <span> element that closes the modal
  const span = document.getElementsByClassName("close")[0];
  // When the user clicks the button, open the modal
  if (btn) {
    btn.onclick = () => {
      modal.style.display = "block";
    }
  }
  // When the user clicks on <span> (x), close the modal
  if (span) {
    span.onclick = () => {
      modal.style.display = "none";
    }
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }

    if(event.target.matches('nav>li>a') || event.target.matches('a')) {
      if (event.target.href.includes("#")) {
        event.preventDefault();
        let scrollHeigth = document.querySelector(`#${event.target.href.split('#')[1]}`).offsetTop;
        window.scrollTo({
            top: scrollHeigth,
            behavior: 'smooth'
        });
      }
    }
  }

  document.body.addEventListener("input", e => {
    const target = e.target;
    if (target.classList.contains('email')) {
      target.value = target.value.replace(/[^a-z0-9@-_\.\!\~\*\']/ig, '');
      target.value = target.value.replace(/@.*@/g, match => match = match.substring(0, match.length - 1));
      target.value = target.value.replace(/@(.+)/g, (match, val) => {
        let correctStr = '',
          dot = 0,
          afterDot = 3;
        for (let i = 0; i < val.length; i++) {
          if (/[a-z]/.test(val[i]) && !dot) {
            correctStr += val[i];
          }
          if (/\./.test(val[i]) && !dot) {
            if (correctStr === '') return '';
            correctStr += val[i];
            dot++;
          }
          if (/[a-z]/.test(val[i]) && dot && afterDot) {
            correctStr += val[i];
            afterDot--;
          }
        }
        return '@' + correctStr;
      });
    }
  });

  document.body.addEventListener("submit", e => {
    e.preventDefault();
    const form = e.target; 
    const basePostURL = 'https://get-proper-api.herokuapp.com';
    const postUrlEndpoint = '/prelaunch';
    const postURL = `${basePostURL}${postUrlEndpoint}`;
    const successBtn = form.querySelector('.send-btn-span');
    const successBtnText = "GET ACCESS";
    const thankText = "Thanks! We'll be in touch with you shortly";
    const errText = "Oops! There was a problem.";
    const textSpan = form.querySelector("span");
    const formInput = form.querySelector("input");
    const formInputValue = {email: formInput.value};

    successBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="35px" height="35px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <g>
              <path d="M50 15A35 35 0 1 0 74.74873734152916 25.251262658470843" fill="none" stroke="#ffffff" stroke-width="15"></path>
              <path d="M49 3L49 27L61 15L49 3" fill="#ffffff"></path>
              <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.2987012987012987s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
            </g>
            </svg>`;

    const successHandler = (response) => {
      textSpan.textContent = thankText;
      textSpan.style.color = "#15193a";
      formInput.value = "";
    };

    const errorHandler = (err) => {
      textSpan.textContent = errText;
      textSpan.style.color = "#CB5858";
      formInput.value = "";
    };

    const postData = async (url = '', data = {}) => {
      return await fetch(url, {
        method: 'POST', 
        mode: 'no-cors', 
        cache: 'no-cache', 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', 
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) 
      });
    };
  
    if (formInput.value) {
      formInput.style.border = '';
      postData(postURL, formInputValue)
        .then((response) => { successBtn.innerHTML = successBtnText; successHandler(response); })
        .catch((err) => { successBtn.innerHTML = successBtnText; errorHandler(err)});

    } else {
      formInput.style.border = '0.5px solid #CB5858';
      successBtn.innerHTML = successBtnText;
    }
  });

  !function() {
    var t = window.driftt = window.drift = window.driftt || [];
    if (!t.init) {
      if (t.invoked) return void (window.console && console.error && console.error("Drift snippet included twice."));
      t.invoked = !0, t.methods = [ "identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on" ], 
      t.factory = function(e) {
        return function() {
          var n = Array.prototype.slice.call(arguments);
          return n.unshift(e), t.push(n), t;
        };
      }, t.methods.forEach(function(e) {
        t[e] = t.factory(e);
      }), t.load = function(t) {
        var e = 3e5, n = Math.ceil(new Date() / e) * e, o = document.createElement("script");
        o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + n + "/" + t + ".js";
        var i = document.getElementsByTagName("script")[0];
        i.parentNode.insertBefore(o, i);
      };
    }
  }();
  drift.SNIPPET_VERSION = '0.3.1';
  drift.load('42dnw952zhy4');
});
