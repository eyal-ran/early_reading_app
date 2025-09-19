import type { LanguagePack } from '../data/languages';
import './LanguageSelector.css';

interface Props {
  languages: LanguagePack[];
  activeLanguageId: string;
  onSelect: (languageId: string) => void;
}

const LanguageSelector = ({ languages, activeLanguageId, onSelect }: Props) => (
  <div className="language-selector">
    {languages.map((language) => (
      <button
        key={language.id}
        className={`language-pill ${
          activeLanguageId === language.id ? 'language-pill--active' : ''
        }`}
        onClick={() => onSelect(language.id)}
      >
        {language.label}
      </button>
    ))}
  </div>
);

export default LanguageSelector;
