const msg: string = "Hello!";
alert(msg);

type StyleItem = {
    name: string;
    file: string;
};

const styles: StyleItem[] = [
    {
        name: "Styl 1",
        file: "/style-1.css"
    },
    {
        name: "Styl 2",
        file: "/style-2.css"
    },
    {
        name: "Styl 3",
        file: "/style-3.css"
    }
];

let currentStyleName: string = styles[0].name;

function addStyle(fileName: string): void {
    const oldLink = document.getElementById("dynamic-style");

    if (oldLink !== null) {
        oldLink.remove();
    }

    const link = document.createElement("link");
    link.id = "dynamic-style";
    link.rel = "stylesheet";
    link.href = fileName;

    document.head.appendChild(link);
}

function createStyleButtons(): void {
    const container = document.createElement("div");
    container.id = "style-buttons";

    styles.forEach((style: StyleItem) => {
        const button = document.createElement("button");
        button.textContent = style.name;

        button.addEventListener("click", () => {
            currentStyleName = style.name;
            addStyle(style.file);
            console.log("Wybrany styl:", currentStyleName);
        });

        container.appendChild(button);
    });

    document.body.prepend(container);
}

createStyleButtons();
addStyle(styles[0].file);
