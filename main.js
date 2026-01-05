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

  // 🔥 register form submit
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", register);
  }
});

async function register(e) {
  e.preventDefault(); // 🔥 CHẶN reload

  const username = document.getElementById("username-res").value.trim();
  const password = document.getElementById("password-res").value;
  const repass = document.getElementById("re-res").value;
  const result = document.getElementById("result");

  // validate
  if (!username || !password) {
    result.innerHTML = "Please fill in all fields";
    return;
  }

  if (password !== repass) {
    result.innerHTML = "Passwords do not match";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, repass }),
    });

    const data = await response.text();

    if (response.ok && data.includes("success")) {
      registerForm.style.display = "none";
      document.getElementById("login-form").style.display = "block";
      result.innerHTML = "Registration successful! Please login.";
    } else {
      result.innerHTML = data;
    }
  } catch (err) {
    console.error(err);
    result.innerHTML = "Error connecting to server";
  }
}
