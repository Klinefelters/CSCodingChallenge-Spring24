require("electron")
	.ipcRenderer.invoke("get-credentials")
	.then((credentials) => {
		window.credentials = credentials;

		window.menu =
			window.menu || document.querySelector("#credentials-menu");
		if (!window.menu) {
			window.menu = document.createElement("div");
			window.menu.id = "credentials-menu";
			window.menu.style.position = "absolute";
			window.menu.style.right = "50%";
			window.menu.style.bottom = "10%";
			window.menu.style.transform = "translateX(50%)";
			document.body.appendChild(menu);
		} else {
			window.menu.innerHTML = "";
		}

		for (let i = 0; i < window.credentials.length; i++) {
			let credential = window.credentials[i];

			let buttonDiv = document.createElement("div");
			buttonDiv.style.display = "flex";
			buttonDiv.style.justifyContent = "space-between";
			buttonDiv.style.border = "1px solid black";
			buttonDiv.style.borderRadius = "5px";

			let button = document.createElement("button");
			button.textContent = credential.email;
			button.style.backgroundColor = "transparent";
			button.style.border = "0px solid black";
			button.addEventListener("click", () => {
				let emailInput = document.querySelector('input[name="email"]');
				let passwordInput = document.querySelector(
					'input[name="password"]'
				);
				let submitButton = document.querySelector(
					'button[type="submit"]'
				);

				emailInput.value = credential.email;
				passwordInput.value = credential.password;
				emailInput.dispatchEvent(new Event("input", { bubbles: true }));
				passwordInput.dispatchEvent(
					new Event("input", { bubbles: true })
				);

				submitButton.click();
			});

			let deleteButton = document.createElement("button");
			deleteButton.textContent = "X";
			deleteButton.style.color = "red";
			deleteButton.style.border = "0px solid black";
			deleteButton.style.backgroundColor = "transparent";
			deleteButton.addEventListener("click", () => {
				require("electron").ipcRenderer.send("delete-credential", {
					i,
				});
				button.remove();
				deleteButton.remove();
			});

			buttonDiv.appendChild(button);
			buttonDiv.appendChild(deleteButton);
			window.menu.appendChild(buttonDiv);
		}
	});
