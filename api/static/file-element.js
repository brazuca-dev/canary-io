import { createC2pa } from "https://cdn.jsdelivr.net/npm/@contentauth/c2pa-web@0.6.0/+esm";

const wasmSrc =
    "https://cdn.jsdelivr.net/npm/@contentauth/c2pa-web@0.6.0/dist/resources/c2pa_bg.wasm";

class FileElement extends HTMLElement {
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: "closed" });
    }
    
    async checkImageProvenance(imageUrl, type) {
        const c2pa = await createC2pa({
            wasmSrc,
            trustAnchors: ``,
            embedCheckNode: true,
        });

        const file = await (await fetch(imageUrl)).blob();

        try {
            const reader = await c2pa.reader.fromBlob(type, file);

            if (reader) {
                const activeManifest = await reader.activeManifest();
                console.dir(activeManifest);
                reader.free();
            }
        } catch (err) {
            console.error("Error to read C2PA:", err);
        }
    }

    static get observedAttributes() {
        return ["src", "alt", "width", "height"];
    }

    connectedCallback() {
        this.render();

        this._shadow.addEventListener("contextmenu", (event) =>
            event.preventDefault(),
        );
    }

    async render() {
        const src = this.getAttribute("src") || "";
        const alt = this.getAttribute("alt") || "";
        const width = this.getAttribute("width") || "auto";
        const height = this.getAttribute("height") || "auto";

        await this.checkImageProvenance(src, this.getAttribute("type"));

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
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: 1;
              pointer-events: none;
            }
          }

          .cr-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #fff;
            border-radius: 50%;
            padding: 8px 6px;
            font-size: 12px;
            font-weight: bold;
            color: #000;
            z-index: 2;
          }

          .cr-content {
            background: #fff;
            border-radius: 5px;
            padding: 8px 12px;
            font-size: 12px;
            font-weight: bold;
            color: #000;
            z-index: 5;
          }
        </style>
        <div class="mask">
          <div>
            <button type="button" popovertarget="c2pa_info" class="cr-badge">
              CR
            </button>

            <div id="c2pa_info" class="cr-content" popover>
              hello world
            </div>
          </div>
          
          <img src="${src}" alt="${alt}" width="${width}" height="${height}" />
        </div>
    `;
    }
}

customElements.define("file-element", FileElement);