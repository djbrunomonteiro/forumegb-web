import Quill from "quill";

export function QuillConfig() {
  const characterLimit = 200000;
  const Size = [
    "8px",
    "10px",
    "12px",
    "14px",
    "16px",
    "22px",
    "26px",
    "32px",
    "42px",
    "52px",
    "small",
    false,
    "large",
    "huge",
  ];
  const Font = [
    "Roboto",
    "Roboto Slab",
    "Mali",
    "Yanone Kaffeesatz",
    "Dosis",
    "Anton",
    "Lobster",
    "Pacifico",
    "Aguafina Script",
    "Dancing Script",
    "Arial",
    "Arial Black",
    "Courier New",
    "Comic Sans MS",
    "Helvetica",
    "Impact",
    "Lucida Grande",
    "Lucida Sans",
    "Tahoma",
    "Times",
    "Times New Roman",
    "Verdana",
  ].sort();
  const Modules = {
    // syntax: true,
    toolbar: [
      [{ font: Font }],
      [{ size: Size }],
      ["bold", "italic", "strike", "underline"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["clean"],
    ],
  };

  function register(size = Size, font = Font) {
    const SizeRef = Quill.import("attributors/style/size") as any;
    const FontRef = Quill.import("attributors/style/font") as any;
    SizeRef.whitelist = size;
    FontRef.whitelist = font;
    Quill.register(SizeRef, true);
    Quill.register(FontRef, true);
  }

  return { Size, Font, Modules, characterLimit, register };
}