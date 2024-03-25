if (!document.querySelector("#magicButton")) {
	const magicButton = document.createElement("button");
	magicButton.id = "magicButton";
	magicButton.textContent = "✧˖°";
	magicButton.style.color = "grey";
	magicButton.style.backgroundColor = "white";
	magicButton.style.border = "0px solid grey";
	magicButton.style.position = "absolute";
	magicButton.style.bottom = "35px";
	magicButton.style.right = "105px";
	magicButton.style.hover = "cursor";
	magicButton.title = "Ask GPT for a part";
	document.head.append(style);

	const modal = document.createElement("div");
	modal.id = "modal";
	modal.style.display = "none";
	modal.style.position = "fixed";
	modal.style.bottom = "50px";
	modal.style.right = "150px";
	modal.style.transform = "translate(-50%, -50%)";
	modal.style.padding = "20px";
	modal.style.backgroundColor = "#fff";
	modal.style.border = "1px solid #000";
	modal.draggable = true;

	const input = document.createElement("input");
	input.type = "text";

	const closeButton = document.createElement("button");
	closeButton.textContent = "X";
	closeButton.style.position = "absolute";
	closeButton.style.top = "0";
	closeButton.style.right = "0";
	closeButton.style.backgroundColor = "transparent";
	closeButton.style.border = "none";
	closeButton.addEventListener("click", () => {
		modal.style.display = "none";
	});

	const submitButton = document.createElement("button");
	submitButton.textContent = "Submit";

	modal.appendChild(input);
	modal.appendChild(closeButton);
	modal.appendChild(submitButton);

	magicButton.addEventListener("click", () => {
		modal.style.display = "block";
	});

	document.body.appendChild(magicButton);
	document.body.appendChild(modal);
}
magicButton.style.display = "block";
