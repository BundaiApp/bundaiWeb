import { useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { toRomaji } from 'wanakana';

const cues = [
  {
    start: 1.0,
    end: 2.93,
    english: "Only during Rika's full manifestation.",
    parts: [
      { text: 'リカ', key: 'リカ' },
      { text: 'の', key: 'の' },
      { text: ' ' },
      { text: '完全顕現中', key: '完全顕現中' },
      { text: 'のみ', key: 'のみ' },
    ],
  },
  {
    start: 2.93,
    end: 7.37,
    english:
      'Only during Rika full manifestation can Okkotsu use high-output cursed energy.',
    parts: [
      { text: '乙骨', key: '乙骨' },
      { text: 'は', key: 'は' },
      { text: ' ' },
      { text: '高出力', key: '高出力' },
      { text: 'での', key: 'での' },
      { text: ' ' },
      { text: '呪力', key: '呪力' },
      { text: '放出', key: '放出' },
      { text: 'が', key: 'が' },
      { text: ' ' },
      { text: '可能', key: '可能' },
      { text: 'と', key: 'と' },
      { text: 'なる', key: 'なる' },
    ],
  },
  {
    start: 7.37,
    end: 12.64,
    timecode: 'S03E12 • 00:20:34-00:20:47',
    english: "However, his peak output is slightly below Ishigori's.",
    parts: [
      { text: 'しかし', key: 'しかし' },
      { text: ' ' },
      { text: '最大出力', key: '最大出力' },
      { text: 'は', key: 'は' },
      { text: ' ' },
      { text: '石流', key: '石流' },
      { text: 'に', key: 'に' },
      { text: ' ' },
      { text: 'やや', key: 'やや' },
      { text: '劣る', key: '劣る' },
    ],
  },
  {
    start: 12.64,
    end: 13.01,
    english: 'Before Ishigori can reach maximum output.',
    parts: [
      { text: '石流', key: '石流' },
      { text: 'が', key: 'が' },
      { text: ' ' },
      { text: '最大出力', key: '最大出力' },
      { text: 'へと', key: 'へと' },
      { text: ' ' },
      { text: '達する', key: '達する' },
      { text: '前に', key: '前に' },
    ],
  },
];

const glossary = {
  乙骨: {
    reading: 'おっこつ',
    meanings: ['Okkotsu', 'family name'],
  },
  リカ: {
    reading: 'りか',
    meanings: ['Rika'],
  },
  の: {
    reading: 'の',
    meanings: ['possessive particle', 'of'],
  },
  完全顕現中: {
    reading: 'かんぜんけんげんちゅう',
    meanings: ['during full manifestation'],
  },
  のみ: {
    reading: 'のみ',
    meanings: ['only', 'nothing but'],
  },
  は: {
    reading: 'は',
    meanings: ['topic marker'],
  },
  での: {
    reading: 'での',
    meanings: ['at', 'in', 'by means of'],
  },
  呪力: {
    reading: 'じゅりょく',
    meanings: ['cursed energy'],
  },
  放出: {
    reading: 'ほうしゅつ',
    meanings: ['release', 'emission', 'discharge'],
  },
  が: {
    reading: 'が',
    meanings: ['subject marker'],
  },
  可能: {
    reading: 'かのう',
    meanings: ['possible', 'capable'],
  },
  と: {
    reading: 'と',
    meanings: ['and', 'with', 'quoting particle'],
  },
  なる: {
    reading: 'なる',
    meanings: ['to become'],
  },
  高出力: {
    reading: 'こうしゅつりょく',
    meanings: ['high output'],
  },
  最大出力: {
    reading: 'さいだいしゅつりょく',
    meanings: ['maximum output', 'peak output'],
  },
  石流: {
    reading: 'いしごおり',
    meanings: ['Ishigori'],
  },
  しかし: {
    reading: 'しかし',
    meanings: ['however', 'but'],
  },
  に: {
    reading: 'に',
    meanings: ['to', 'toward', 'at', 'in'],
  },
  やや: {
    reading: 'やや',
    meanings: ['slightly', 'somewhat'],
  },
  劣る: {
    reading: 'おとる',
    meanings: ['to be inferior', 'to be lower than'],
  },
  を: {
    reading: 'を',
    meanings: ['object marker'],
  },
  へと: {
    reading: 'へと',
    meanings: ['toward', 'into'],
  },
  達する: {
    reading: 'たっする',
    meanings: ['to reach', 'to attain'],
  },
  前に: {
    reading: 'まえに',
    meanings: ['before'],
  },
  溜めて: {
    reading: 'ためて',
    meanings: ['charging up', 'accumulating'],
  },
  放つ: {
    reading: 'はなつ',
    meanings: ['to release', 'to fire', 'to unleash'],
  },
};

export default function InteractiveSubtitleDemo({ colors }) {
  const demoCue = cues[2];
  const demoStartTime = demoCue.start + 0.08;
  const videoRef = useRef(null);
  const frameRef = useRef(null);
  const hideTimerRef = useRef(null);
  const hasPrimedVideoRef = useRef(false);
  const initialKey = 'しかし';
  const [activeCard, setActiveCard] = useState({
    key: initialKey,
    entry: glossary[initialKey],
    pronunciation: toRomaji(glossary[initialKey].reading || ''),
    left: 50,
    top: 250,
  });
  const [isMuted, setIsMuted] = useState(true);

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const queueHideCard = () => {
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      setActiveCard(null);
      if (videoRef.current) {
        void videoRef.current.play().catch(() => {});
      }
    }, 120);
  };

  const showCard = (event, key) => {
    const entry = glossary[key];
    if (!entry || !frameRef.current) return;
    clearHideTimer();
    if (videoRef.current) {
      videoRef.current.pause();
    }
    const frameRect = frameRef.current.getBoundingClientRect();
    const tokenRect = event.currentTarget.getBoundingClientRect();
    const cardWidth = 280;
    const cardHeight = 260;
    const subtitlePanelTop = frameRect.height - 190;
    const desiredLeft = tokenRect.left - frameRect.left - 32;
    const desiredTop = tokenRect.top - frameRect.top - cardHeight - 18;
    const maxTop = Math.max(16, subtitlePanelTop - cardHeight - 12);

    setActiveCard({
      key,
      entry,
      pronunciation: toRomaji(entry.reading || ''),
      left: Math.max(
        16,
        Math.min(desiredLeft, frameRect.width - cardWidth - 16),
      ),
      top: Math.max(16, Math.min(desiredTop, maxTop)),
    });
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    void videoRef.current.play().catch(() => {});
    setIsMuted(nextMuted);
  };

  return (
    <div className="px-4 mb-12 sm:mb-14">
      <div className="flex items-center justify-center gap-3 mb-5 sm:mb-6">
        <p
          className="text-base sm:text-lg max-w-3xl text-center"
          style={{ color: colors.textSecondary }}
        >
          Hover over the words to see it in action.
        </p>
        <div className="relative flex items-center justify-center">
          <div
            className="text-sm sm:text-base font-bold px-3 py-1.5 rounded-full"
            style={{
              color: '#ffffff',
              backgroundColor: '#F97316',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)',
            }}
          >
            Hover over the word!
          </div>
          <div
            className="absolute -bottom-30 left-1/2 w-0 h-0"
            style={{
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: '12px solid #F97316',
              transform: 'translateX(-50%)',
              filter: 'drop-shadow(0 2px 4px rgba(249, 115, 22, 0.4))',
            }}
          />
        </div>
      </div>

      <div
        ref={frameRef}
        className="relative mx-auto overflow-hidden rounded-[2rem] shadow-2xl"
        style={{
          maxWidth: 1120,
          backgroundColor: '#111827',
          border: `1px solid ${colors.outline}`,
        }}
      >
        <video
          ref={videoRef}
          src="/demo/jjk-s03e12-demo.mp4"
          poster="/demo/jjk-s03e12-poster.jpg"
          className="block w-full h-auto"
          autoPlay
          muted
          preload="metadata"
          playsInline
          onPlay={(event) => setIsMuted(event.currentTarget.muted)}
          onLoadedMetadata={(event) => {
            if (hasPrimedVideoRef.current) return;
            hasPrimedVideoRef.current = true;
            event.currentTarget.currentTime = demoStartTime;
            event.currentTarget.pause();
          }}
          onEnded={(event) => {
            event.currentTarget.currentTime = demoStartTime;
            void event.currentTarget.play().catch(() => {});
          }}
        />

        <div className="absolute top-4 left-1/2 z-20 -translate-x-1/2">
          <div
            className="rounded-full px-4 py-2 text-xs sm:text-sm font-bold tracking-[0.04em] backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(255,255,255,0.88)',
              color: colors.textPrimary,
              border: '1px solid rgba(255,255,255,0.48)',
              boxShadow: '0 10px 30px rgba(31,26,61,0.12)',
            }}
          >
            {demoCue.timecode}
          </div>
        </div>

        <button
          type="button"
          aria-label={isMuted ? 'Unmute demo audio' : 'Mute demo audio'}
          onClick={toggleMute}
          className="absolute right-4 top-4 sm:right-5 sm:top-5 z-20 rounded-full p-3 backdrop-blur-sm transition-transform hover:scale-105"
          style={{
            backgroundColor: 'rgba(17,24,39,0.68)',
            color: '#ffffff',
            border: '1px solid rgba(255,255,255,0.14)',
          }}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </button>

        {activeCard ? (
          <div
            className="absolute z-30 w-[248px] rounded-[1.5rem] p-4 sm:p-5 shadow-2xl"
            style={{
              left: activeCard.left,
              top: activeCard.top,
              backgroundColor: '#f9d648',
              border: '2px solid rgba(17,24,39,0.12)',
              color: '#111827',
            }}
            onMouseEnter={clearHideTimer}
            onMouseLeave={queueHideCard}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="text-3xl font-black leading-none">
                  {activeCard.key}
                </div>
                <div className="mt-2 text-lg italic font-semibold opacity-80">
                  {activeCard.entry.reading}
                </div>
                <div className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] opacity-65">
                  {activeCard.pronunciation}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xl font-black">
                <span>+</span>
                <span>×</span>
              </div>
            </div>

            <div className="mt-4 text-sm font-bold">Meanings:</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {activeCard.entry.meanings.map((meaning) => (
                <span
                  key={meaning}
                  className="rounded-full px-3 py-1 text-sm font-semibold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.72)' }}
                >
                  {meaning}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="absolute inset-x-0 bottom-5 sm:bottom-7 z-20 px-4 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <div
              className="rounded-[1.75rem] px-4 py-4 sm:px-6 sm:py-5"
              style={{
                backgroundColor: 'rgba(12,18,28,0.82)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
              }}
            >
              <p
                className="text-center text-2xl sm:text-3xl md:text-4xl font-black leading-tight"
                style={{ color: '#ffffff' }}
              >
                {demoCue.parts.map((part, index) =>
                  part.key ? (
                    <span
                      key={`${part.key}-${index}`}
                      className="cursor-pointer rounded-lg px-1.5 transition-colors"
                      style={{
                        backgroundColor:
                          activeCard?.key === part.key
                            ? 'rgba(249,214,72,0.28)'
                            : 'transparent',
                      }}
                      onMouseEnter={(event) => showCard(event, part.key)}
                      onMouseLeave={queueHideCard}
                    >
                      {part.text}
                    </span>
                  ) : (
                    <span key={`${part.text}-${index}`}>{part.text}</span>
                  ),
                )}
              </p>
              <p
                className="mt-2 text-center text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase"
                style={{ color: 'rgba(255,255,255,0.72)' }}
              >
                {demoCue.english}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
