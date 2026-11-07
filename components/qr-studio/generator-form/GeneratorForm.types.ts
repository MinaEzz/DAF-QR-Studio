export default interface IGeneratorFormProps {
  input: string;
  onInputChange: (
    e: React.ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>,
  ) => void;
  title: string;
  onTitleChange: (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => void;
  description: string;
  onDescriptionChange: (
    e: React.ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>,
  ) => void;
  error: string | null;
  handleGenerate: () => void;
  handleClear: () => void;
}
