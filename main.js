document.addEventListener("DOMContentLoaded", () => {
  // popup
  document.querySelectorAll(".detail-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const popup = this.nextElementSibling;
      popup.classList.toggle("active");
    });
  });

  document.querySelectorAll(".close").forEach((close) => {
    close.addEventListener("click", function () {
      this.parentElement.classList.remove("active");
    });
  });
  document.getElementById("show-register")?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
  });

  document.getElementById("show-login")?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("register-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
  });

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", register);
  }
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", login);
  }
});
async function login(e) {
  e.preventDefault();
  const username = document.getElementById("username-log").value.trim();
  const password = document.getElementById("password-log").value;
  const result_log = document.getElementById("result-log");
  if (!username || !password) {
    result_log.innerHTML = "Please fill in all field";
    return;
  }
  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    result_log.innerHTML = data.message;
  } catch (err) {
    console.log(err);
    result_log.innerHTML = "Error connecting to server";
  }
}

async function register(e) {
  e.preventDefault();

  const username = document.getElementById("username-res").value.trim();
  const password = document.getElementById("password-res").value;
  const repass = document.getElementById("re-res").value;
  const result_res = document.getElementById("result-res");

  if (!username || !password) {
    result_res.innerHTML = "Please fill in all fields";
    return;
  }

  if (password !== repass) {
    result_res.innerHTML = "Passwords do not match";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, repass }),
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("register-form").style.display = "none";
      document.getElementById("login-form").style.display = "block";
      result_res.innerHTML = "Registration successful! Please login.";
    } else {
      result_res.innerHTML = data.message;
    }
  } catch (err) {
    console.error(err);
    result_res.innerHTML = "Error connecting to server";
  }
}
