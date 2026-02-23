class FileElement extends HTMLElement {
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: "closed" });
    }

    static get observedAttributes() {
        return ["src", "alt", "type", "width", "height"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(
            `Attribute ${name} changed from ${oldValue} to ${newValue}`,
        );
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
        const type = this.getAttribute("type") || "image";
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

            & > img, video {
              object-fit: cover;
              width: 100%;
              height: 100%;
            }

            & > img {
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
          ${
              type === "image"
                  ? `<img src="${src}" alt="${alt}" width="${width}" height="${height}" />`
                  : `<video autoplay loop controls>
                <source src="${src}" type="video/${type}">
                Your browser does not support the video tag.
              </video>`
          }
        </div>
    `;
        // Prevent download
        this._shadow
            .querySelector("video")
            ?.setAttribute(
                "controlsList",
                "nodownload nofullscreen noremoteplayback",
            );
    }
}

customElements.define("file-element", FileElement);
