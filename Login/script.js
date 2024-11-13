document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginButton = document.getElementById("loginButton");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("username").value.trim();
    const senha = document.getElementById("password").value.trim();

    if (!email || !senha) {
      showToast("Por favor, preencha todos os campos.");
      return;
    }

    loginButton.classList.add("loading");
    loginButton.textContent = "Carregando...";

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const response = await fetch("http://localhost:3000/authentication", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        throw new Error("Erro na autenticação");
      }

      const data = await response.json();

      if (data.Id_usuario) {
        sessionStorage.setItem("user", JSON.stringify(data));
        window.location.href = "../index.html";
        showToast("Login feito com sucesso!");
      } else {
        showToast("Nome de usuário ou senha incorretos.");
      }
    } catch (error) {
      console.error("Erro:", error);
      showToast("Ocorreu um erro ao fazer login. Tente novamente.");
    } finally {
      loginButton.classList.remove("loading");
      loginButton.textContent = "Login";
    }
  });

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
});
