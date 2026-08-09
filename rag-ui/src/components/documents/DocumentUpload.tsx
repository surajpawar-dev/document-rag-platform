import { UploadCloud } from "lucide-react";
import { FormEvent, useState } from "react";

export function DocumentUpload({ onUpload }: { onUpload: (file: File, title: string) => Promise<void> }) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) return;
    setIsUploading(true);
    try {
      await onUpload(file, title || file.name);
      setFile(null);
      setTitle("");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form className="upload-panel glass-panel" onSubmit={submit}>
      <label className="file-drop">
        <UploadCloud size={24} />
        <span>{file ? file.name : "Choose a PDF document"}</span>
        <input type="file" accept="application/pdf,.pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
      </label>
      <input value={title} placeholder="Document title" onChange={(event) => setTitle(event.target.value)} />
      <button disabled={!file || isUploading}>{isUploading ? "Uploading..." : "Upload"}</button>
    </form>
  );
}
