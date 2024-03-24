if (!document.querySelector("#saveCredentials")) {
	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.id = "saveCredentials";
	checkbox.value = "true";
	checkbox.name = "saveCredentials";

	const label = document.createElement("label");
	label.htmlFor = "saveCredentials";
	label.appendChild(document.createTextNode("Save this account"));

	const form = document.querySelector("form");
	form.appendChild(checkbox);
	form.appendChild(label);
}

document
	.querySelector('button[type="submit"]')
	.addEventListener("click", (event) => {
		const emailInput = document.querySelector('input[name="email"]');
		const passwordInput = document.querySelector('input[name="password"]');
		const email = emailInput.value;
		const password = passwordInput.value;
		const saveCredentials = document.querySelector(
			'input[name="saveCredentials"]'
		).checked;

		if (saveCredentials) {
			require("electron").ipcRenderer.send("save-credentials", {
				email,
				password,
			});
		}
	});
