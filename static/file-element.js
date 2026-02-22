class FileElement extends HTMLElement {
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: "closed" });
    }

    static get observedAttributes() {
        return ["src", "alt", "width", "height"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`);
        this.render();
    }

    connectedCallback() {
        this.render();

        this._shadow.addEventListener("contextmenu", (event) =>
            event.preventDefault(),
        );
    }

    render() {
        const src = this.getAttribute("src") || "";
        const alt = this.getAttribute("alt") || "";
        const width = this.getAttribute("width") || "auto";
        const height = this.getAttribute("height") || "auto";

        this._shadow.innerHTML = `
        <style>
          .mask {
            position: relative;
            height: 400px;
            width: 300px;

            user-select: none;
            -webkit-user-drag: none;
            border-radius: 12px;
            overflow: hidden;

            & > img {
              object-fit: cover;
              width: 100%;
              height: 100%;
              pointer-events: none;
            }

            &::after {
              content: "*";
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: 1;
              pointer-events: none;
            }
          }
        </style>
        <div class="mask">
          <img src="${src}" alt="${alt}" width="${width}" height="${height}" />
        </div>
    `;
    }
}

customElements.define("file-element", FileElement);
