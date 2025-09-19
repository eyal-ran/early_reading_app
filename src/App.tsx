import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import LanguageSelector from './components/LanguageSelector';
import { languages, type LanguagePack, type LetterCard } from './data/languages';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { useFeedbackSounds } from './hooks/useFeedbackSounds';
import './styles/App.css';

type LevelMode = 'symbol-to-name' | 'name-to-symbol' | 'sound-to-symbol';

interface LevelConfig {
  id: string;
  title: string;
  description: string;
  mode: LevelMode;
  promptLabel: string;
}

interface Question {
  letter: LetterCard;
  options: string[];
}

const LEVEL_CONFIGS: LevelConfig[] = [
  {
    id: 'symbol-to-name',
    title: 'Name that Letter',
    description: 'See a letter, pick how we say it!',
    mode: 'symbol-to-name',
    promptLabel: 'Which name matches this letter?',
  },
  {
    id: 'name-to-symbol',
    title: 'Spot the Letter',
    description: 'Read the letter name and find its shape.',
    mode: 'name-to-symbol',
    promptLabel: 'Which letter matches this name?',
  },
  {
    id: 'sound-to-symbol',
    title: 'Listen & Match',
    description: 'Listen to the sound and choose the letter.',
    mode: 'sound-to-symbol',
    promptLabel: 'Which letter makes this sound?',
  },
];

const QUESTION_COUNT = 8;

const getShuffled = <T,>(array: T[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const buildQuestionSet = (
  language: LanguagePack,
  mode: LevelMode,
): Question[] => {
  const questionTotal = Math.min(QUESTION_COUNT, language.letters.length);
  const baseLetters = getShuffled(language.letters).slice(0, questionTotal);
  return baseLetters.map((letter) => {
    const otherLetters = getShuffled(
      language.letters.filter((item) => item.symbol !== letter.symbol),
    ).slice(0, 3);

    if (mode === 'symbol-to-name') {
      const options = getShuffled([
        letter.name,
        ...otherLetters.map((item) => item.name),
      ]);
      return { letter, options };
    }

    const options = getShuffled([
      letter.symbol,
      ...otherLetters.map((item) => item.symbol),
    ]);
    return { letter, options };
  });
};

const App = () => {
  const [activeLanguageId, setActiveLanguageId] = useState(languages[0].id);
  const [activeLevelIndex, setActiveLevelIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  const [showLevelSummary, setShowLevelSummary] = useState(false);

  const { speak } = useSpeechSynthesis();
  const { playSuccess, playError } = useFeedbackSounds();

  const activeLanguage = useMemo(
    () => languages.find((lang) => lang.id === activeLanguageId) ?? languages[0],
    [activeLanguageId],
  );

  const activeLevel = LEVEL_CONFIGS[activeLevelIndex];

  useEffect(() => {
    const nextQuestions = buildQuestionSet(activeLanguage, activeLevel.mode);
    setQuestions(nextQuestions);
    setQuestionIndex(0);
    setScore(0);
    setSelectedValue(null);
    setFeedback(null);
    setShowLevelSummary(false);
  }, [activeLanguage, activeLevel]);

  const currentQuestion = questions[questionIndex];

  useEffect(() => {
    if (!currentQuestion) return;
    if (activeLevel.mode === 'sound-to-symbol') {
      speak({
        text: `Listen carefully. ${currentQuestion.letter.phoneme}`,
        locale: activeLanguage.locale,
        rate: 0.85,
      });
    }
  }, [activeLevel.mode, activeLanguage.locale, currentQuestion, speak]);

  const handlePlaySound = () => {
    if (!currentQuestion) return;
    const letter = currentQuestion.letter;

    const baseText =
      activeLevel.mode === 'symbol-to-name'
        ? `Letter ${letter.symbol}. It sounds like ${letter.phoneme}`
        : activeLevel.mode === 'name-to-symbol'
        ? `${letter.name}. The letter looks like ${letter.symbol}`
        : `${letter.phoneme}`;

    speak({ text: baseText, locale: activeLanguage.locale, rate: 0.85 });
  };

  const handleOptionSelect = (option: string) => {
    if (!currentQuestion || selectedValue) return;

    const { letter } = currentQuestion;
    let isCorrect = false;

    if (activeLevel.mode === 'symbol-to-name') {
      isCorrect = option === letter.name;
    } else {
      isCorrect = option === letter.symbol;
    }

    setSelectedValue(option);
    setFeedback(isCorrect ? 'success' : 'error');

    if (isCorrect) {
      setScore((prev) => prev + 1);
      playSuccess();
      speak({
        text: `Great job! ${letter.name} is correct!`,
        locale: activeLanguage.locale,
      });
    } else {
      playError();
      const correctValue =
        activeLevel.mode === 'symbol-to-name' ? letter.name : letter.symbol;
      speak({
        text: `Nice try. The correct answer is ${correctValue}.`,
        locale: activeLanguage.locale,
      });
    }
  };

  const handleNextQuestion = () => {
    if (questionIndex + 1 >= questions.length) {
      setShowLevelSummary(true);
      setSelectedValue(null);
      setFeedback(null);
      return;
    }
    setQuestionIndex((prev) => prev + 1);
    setSelectedValue(null);
    setFeedback(null);
  };

  const handleLevelAdvance = () => {
    setShowLevelSummary(false);
    setSelectedValue(null);
    setFeedback(null);
    setQuestionIndex(0);
    setScore(0);
    if (activeLevelIndex + 1 < LEVEL_CONFIGS.length) {
      setActiveLevelIndex((prev) => prev + 1);
    } else {
      setActiveLevelIndex(0);
    }
  };

  const totalQuestions = questions.length || 1;
  const progress = ((questionIndex + (selectedValue ? 1 : 0)) / totalQuestions) * 100;

  return (
    <div
      className="app-shell"
      style={{
        '--primary-color': activeLanguage.colors.primary,
        '--secondary-color': activeLanguage.colors.secondary,
        '--accent-color': activeLanguage.colors.accent,
      } as CSSProperties}
      dir={activeLanguage.direction}
    >
      <div className="app-card">
        <header className="app-header">
          <h1>Early Reader Adventure</h1>
          <p className="tagline">Discover letters through play, sound, and color!</p>
        </header>

        <LanguageSelector
          languages={languages}
          activeLanguageId={activeLanguageId}
          onSelect={(id) => {
            setActiveLanguageId(id);
            setActiveLevelIndex(0);
          }}
        />

        <section className="level-strip">
          {LEVEL_CONFIGS.map((level, index) => (
            <button
              key={level.id}
              className={`level-pill ${
                index === activeLevelIndex ? 'level-pill--active' : ''
              }`}
              onClick={() => setActiveLevelIndex(index)}
            >
              <span className="level-pill__title">Level {index + 1}</span>
              <span className="level-pill__subtitle">{level.title}</span>
            </button>
          ))}
        </section>

        <div className="progress-bar">
          <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
        </div>

        {!showLevelSummary && currentQuestion && (
          <section className="game-panel">
            <div className="prompt-card">
              <div className="prompt-card__header">
                <h2>{activeLevel.title}</h2>
                <p>{activeLevel.description}</p>
              </div>

              <div className="prompt-card__body">
                <span className="prompt-label">{activeLevel.promptLabel}</span>
                <div className="prompt-display">
                  {activeLevel.mode === 'symbol-to-name' && (
                    <span className="prompt-letter" lang={activeLanguage.locale}>
                      {currentQuestion.letter.symbol}
                    </span>
                  )}
                  {activeLevel.mode === 'name-to-symbol' && (
                    <span className="prompt-name">{currentQuestion.letter.name}</span>
                  )}
                  {activeLevel.mode === 'sound-to-symbol' && (
                    <span className="prompt-sound">🎧 Listen</span>
                  )}
                  <button className="speaker-button" onClick={handlePlaySound}>
                    <span className="sr-only">Hear the letter</span>
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 9V15H8L13 20V4L8 9H4Z"
                        fill="currentColor"
                        opacity="0.9"
                      />
                      <path
                        d="M16.5 8.5C17.3284 9.32843 17.8284 10.4896 17.8284 11.8284C17.8284 13.1671 17.3284 14.3284 16.5 15.1568"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M19.5 5.5C21.1569 7.15685 22 9.32843 22 12C22 14.6716 21.1569 16.8431 19.5 18.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="options-grid">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedValue === option;
                const isCorrect =
                  activeLevel.mode === 'symbol-to-name'
                    ? option === currentQuestion.letter.name
                    : option === currentQuestion.letter.symbol;

                return (
                  <button
                    key={option}
                    className={`option-card ${
                      isSelected && isCorrect
                        ? 'option-card--correct'
                        : isSelected
                        ? 'option-card--incorrect'
                        : ''
                    }`}
                    onClick={() => handleOptionSelect(option)}
                    disabled={Boolean(selectedValue)}
                  >
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            <footer className="game-footer">
              <div className="score-pill">
                ⭐ Score: {score} / {totalQuestions}
              </div>
              {selectedValue && (
                <button className="next-button" onClick={handleNextQuestion}>
                  {questionIndex + 1 >= questions.length
                    ? 'Finish Level'
                    : 'Next Challenge'}
                </button>
              )}
              {feedback && (
                <span
                  className={`feedback-bubble ${
                    feedback === 'success' ? 'feedback-bubble--success' : 'feedback-bubble--error'
                  }`}
                >
                  {feedback === 'success' ? 'You did it!' : 'Keep trying!'}
                </span>
              )}
            </footer>
          </section>
        )}

        {showLevelSummary && (
          <section className="summary-card">
            <h2>Level Complete!</h2>
            <p>
              You answered <strong>{score}</strong> out of <strong>{totalQuestions}</strong>{' '}
              challenges correctly.
            </p>
            <div className="summary-actions">
              <button className="next-button" onClick={handleLevelAdvance}>
                {activeLevelIndex + 1 < LEVEL_CONFIGS.length
                  ? 'Continue to the next level'
                  : 'Play again from the start'}
              </button>
              <button
                className="ghost-button"
                onClick={() => {
                  setShowLevelSummary(false);
                  setQuestionIndex(0);
                  setSelectedValue(null);
                  setFeedback(null);
                  setScore(0);
                  setQuestions(buildQuestionSet(activeLanguage, activeLevel.mode));
                }}
              >
                Replay this level
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default App;
