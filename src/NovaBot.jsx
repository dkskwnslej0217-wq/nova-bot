import { useState, useRef, useEffect } from "react";

// ── 시스템 프롬프트 ───────────────────────────────────────────
const NOVA_SYSTEM = `당신은 "NOVA" — AI 우주 탐험 가이드입니다.

NOVA의 정체성:
우주를 탐험하듯 AI의 세계를 안내하는 존재입니다.
AI를 처음 시작하는 사람들이 길을 잃지 않도록 이정표가 되어줍니다.

말투:
- 우주 탐험 비유를 자연스럽게 섞기 ("그건 당신의 첫 번째 별이 될 거예요")
- 친근하고 따뜻하게
- 짧고 명확하게
- 어려운 용어 없이
- 이모지 적당히 (✨🌟🚀🪐💫)

핵심 지식:
- AI로 돈 버는 방법: 소상공인 봇 제작 (30~50만원/건), 월 유지비, 콘텐츠 대행
- 코딩 없이 가능: Claude가 코드 생성, Vercel로 배포
- API = AI에게 일 시키는 열쇠
- Make.com = AI의 근육 (자동화 도구)
- Notion = 디지털 노트 (문서/계획)
- 구글시트 = 데이터 창고
- GitHub = 코드 저장소
- Vercel = 웹사이트 배포 서비스 (무료)
- 봇 만드는 순서: Claude에서 만들기 → Vercel 배포 → URL 공유

자주 묻는 질문:
Q: AI로 돈 벌 수 있어요?
A: 네! 소상공인 가게에 AI 예약봇 만들어주고 30~50만원 받는 게 가장 빠른 방법이에요. 코딩 몰라도 돼요 🚀

Q: 뭐부터 시작해요?
A: 딱 하나만요. Claude.ai 가입하고 "미용실 봇 만들어줘" 해보세요. 5분이면 첫 번째 별이 생겨요 ✨

Q: 코딩 못해도 되나요?
A: 완전 됩니다! Claude한테 만들어달라고 하면 돼요. NOVA도 그렇게 만들어졌어요 😊

모르는 질문엔 솔직하게 말하고 관련 방향 제시하기.
항상 마지막에 다음 탐험 유도: "또 궁금한 별이 있나요? 🌟"`;

const CAFE_SYSTEM = `당신은 친절한 카페 직원 AI입니다.
영업시간: 오전 10시 ~ 오후 8시 / 예약 가능
메뉴, 예약, 주차, 영업시간, 가격 관련 질문에 짧고 친절하게 답하세요.
이모지를 적절히 사용하세요. ☕`;

const NAIL_SYSTEM = `당신은 친절한 네일샵 직원 AI입니다.
영업시간: 오전 11시 ~ 오후 9시 / 예약 필수
젤네일, 아크릴, 네일아트 등 시술 관련 질문에 짧고 친절하게 답하세요.
이모지를 적절히 사용하세요. 💅`;

const PILATES_SYSTEM = `당신은 친절한 필라테스 센터 직원 AI입니다.
영업시간: 오전 7시 ~ 오후 10시
그룹/개인 수업, 등록, 가격, 시간표 관련 질문에 짧고 친절하게 답하세요.
이모지를 적절히 사용하세요. 🧘`;

const HAIR_SYSTEM = `당신은 친절한 미용실 직원 AI입니다.
영업시간: 오전 10시 ~ 오후 8시 / 예약 가능
컷, 염색, 파마, 트리트먼트 등 헤어 시술 관련 질문에 짧고 친절하게 답하세요.
이모지를 적절히 사용하세요. ✂️`;

// ── 행성 데이터 ───────────────────────────────────────────────
const PLANETS = [
  {
    id: "cafe", emoji: "☕", label: "카페봇", color: "#ff6b9d",
    orbitR: 100, speed: 14, startAngle: 0,
    system: CAFE_SYSTEM,
    welcome: "안녕하세요 ☕ 카페 자동응답입니다!\n메뉴, 예약, 주차 뭐든지 물어보세요.",
    quick: ["메뉴 알려줘", "예약하고 싶어요", "주차 되나요?", "영업시간"],
  },
  {
    id: "nail", emoji: "💅", label: "네일샵봇", color: "#f368e0",
    orbitR: 148, speed: 20, startAngle: 72,
    system: NAIL_SYSTEM,
    welcome: "안녕하세요 💅 네일샵 자동응답입니다!\n시술, 예약, 가격 모두 안내해드려요.",
    quick: ["시술 종류", "예약하기", "가격 문의", "소요시간"],
  },
  {
    id: "pilates", emoji: "🧘", label: "필라테스봇", color: "#00cec9",
    orbitR: 196, speed: 27, startAngle: 144,
    system: PILATES_SYSTEM,
    welcome: "안녕하세요 🧘 필라테스 센터입니다!\n수업, 등록, 가격을 안내해드릴게요.",
    quick: ["수업 종류", "등록하기", "가격 문의", "시간표"],
  },
  {
    id: "hair", emoji: "✂️", label: "미용실봇", color: "#fdcb6e",
    orbitR: 244, speed: 34, startAngle: 216,
    system: HAIR_SYSTEM,
    welcome: "안녕하세요 ✂️ 미용실 자동응답입니다!\n시술, 예약, 가격 안내해드릴게요.",
    quick: ["컷 가격", "염색 문의", "파마 예약", "위치"],
  },
  {
    id: "nova", emoji: "🚀", label: "NOVA봇", color: "#a29bfe",
    orbitR: 292, speed: 42, startAngle: 288,
    system: NOVA_SYSTEM,
    welcome: "새로운 별이 탄생했어요 ✨\n\nAI 세계에 오신 걸 환영합니다.\n저는 NOVA — 당신의 AI 탐험 가이드예요.\n\n궁금한 것 뭐든 물어보세요 🚀",
    quick: ["🚀 AI로 돈 벌 수 있어요?", "⭐ 뭐부터 시작해요?", "🪐 코딩 몰라도 되나요?", "💫 봇은 어떻게 만들어요?"],
  },
];

// ── 별 생성 ───────────────────────────────────────────────────
const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2.5 + 0.5,
  opacity: Math.random() * 0.7 + 0.3,
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 4,
}));

// ── 타이핑 점 ─────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: "6px", height: "6px", borderRadius: "50%",
          background: "radial-gradient(circle, #a78bfa, #7c3aed)",
          animation: `starPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
          boxShadow: "0 0 6px #a78bfa",
        }} />
      ))}
    </div>
  );
}

// ── 챗봇 패널 ─────────────────────────────────────────────────
function BotPanel({ planet, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: planet.welcome },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    const next = [...messages, { role: "user", content: msg }];
    setMessages(next);
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          system: planet.system,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((p) => [...p, {
        role: "assistant",
        content: data.content?.[0]?.text || "신호가 끊겼어요. 다시 시도해주세요 🛸",
      }]);
    } catch {
      setMessages((p) => [...p, {
        role: "assistant",
        content: "우주 신호가 잠깐 끊겼어요 🛸 다시 시도해주세요!",
      }]);
    }
    setLoading(false);
  }

  const accentColor = planet.color;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      animation: "fadeIn 0.2s ease",
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        width: "100%", maxWidth: "420px",
        height: "72vh",
        background: "#020408",
        borderRadius: "20px 20px 0 0",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        boxShadow: `0 -8px 40px ${accentColor}44`,
        animation: "slideUp 0.3s ease",
        border: `1px solid ${accentColor}33`,
        borderBottom: "none",
      }}>
        {/* 패널 헤더 */}
        <div style={{
          padding: "14px 18px",
          background: "rgba(2,4,8,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${accentColor}33`,
          display: "flex", alignItems: "center", gap: "12px",
          flexShrink: 0,
        }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "50%",
            background: `radial-gradient(circle, ${accentColor}, ${accentColor}88)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px",
            boxShadow: `0 0 16px ${accentColor}66`,
          }}>{planet.emoji}</div>
          <div>
            <div style={{
              fontFamily: "'Orbitron', monospace",
              fontWeight: "700", fontSize: "15px",
              color: accentColor, letterSpacing: "2px",
            }}>{planet.label.toUpperCase()}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
              <span style={{ fontSize: "10px", color: "rgba(167,139,250,0.6)", fontFamily: "monospace", letterSpacing: "1px" }}>ONLINE</span>
            </div>
          </div>
          <button onClick={onClose} style={{
            marginLeft: "auto",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "50%", width: "32px", height: "32px",
            color: "rgba(255,255,255,0.5)", fontSize: "16px",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        {/* 메시지 영역 */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "16px 16px 8px",
          position: "relative", zIndex: 5,
        }}>
          {messages.map((m, i) => {
            const isBot = m.role === "assistant";
            return (
              <div key={i} style={{
                display: "flex",
                flexDirection: isBot ? "row" : "row-reverse",
                alignItems: "flex-end",
                gap: "10px", marginBottom: "14px",
                animation: "msgAppear 0.3s ease",
              }}>
                {isBot && (
                  <div style={{
                    width: "30px", height: "30px", flexShrink: 0,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${accentColor}, ${accentColor}66)`,
                    border: `1px solid ${accentColor}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px",
                    boxShadow: `0 0 10px ${accentColor}44`,
                  }}>{planet.emoji}</div>
                )}
                <div style={{
                  maxWidth: "74%",
                  background: isBot
                    ? "rgba(17,10,40,0.9)"
                    : `linear-gradient(135deg, ${accentColor}cc, ${accentColor}88)`,
                  border: isBot
                    ? "1px solid rgba(167,139,250,0.15)"
                    : `1px solid ${accentColor}66`,
                  borderRadius: isBot ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                  padding: "11px 14px",
                  backdropFilter: "blur(10px)",
                  boxShadow: isBot
                    ? "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(167,139,250,0.08)"
                    : `0 4px 20px ${accentColor}44`,
                }}>
                  {m.content.split("\n").map((line, j, arr) => (
                    <p key={j} style={{
                      margin: j < arr.length - 1 ? "0 0 5px" : "0",
                      fontSize: "14px", lineHeight: "1.65",
                      color: isBot ? "rgba(224,231,255,0.9)" : "#fff",
                    }}>
                      {line.split(/\*\*(.*?)\*\*/g).map((part, k) =>
                        k % 2 === 1
                          ? <strong key={k} style={{ color: accentColor }}>{part}</strong>
                          : part
                      )}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
          {loading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", marginBottom: "14px" }}>
              <div style={{
                width: "30px", height: "30px", flexShrink: 0, borderRadius: "50%",
                background: `radial-gradient(circle, ${accentColor}, ${accentColor}66)`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px",
              }}>{planet.emoji}</div>
              <div style={{
                background: "rgba(17,10,40,0.9)",
                border: "1px solid rgba(167,139,250,0.15)",
                borderRadius: "4px 16px 16px 16px",
                padding: "13px 15px", backdropFilter: "blur(10px)",
              }}>
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* 빠른 질문 */}
        <div style={{
          padding: "8px 14px",
          background: "rgba(2,4,8,0.7)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(167,139,250,0.08)",
          display: "flex", gap: "6px", overflowX: "auto", flexShrink: 0,
        }}>
          {planet.quick.map((q, i) => (
            <button key={i} onClick={() => send(q)} style={{
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}44`,
              borderRadius: "20px", padding: "6px 12px",
              color: accentColor, fontSize: "11px",
              cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
              fontFamily: "'Noto Sans KR', sans-serif",
              transition: "all 0.2s",
            }}>{q}</button>
          ))}
        </div>

        {/* 입력창 */}
        <div style={{
          padding: "10px 14px 24px",
          background: "rgba(2,4,8,0.9)",
          backdropFilter: "blur(20px)",
          borderTop: `1px solid ${accentColor}22`,
          flexShrink: 0,
          display: "flex", gap: "10px", alignItems: "flex-end",
        }}>
          <div style={{
            flex: 1,
            background: "rgba(17,10,40,0.8)",
            border: `1px solid ${accentColor}44`,
            borderRadius: "20px", padding: "11px 16px",
            backdropFilter: "blur(10px)",
            boxShadow: "inset 0 1px 0 rgba(167,139,250,0.08)",
          }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
              }}
              placeholder="우주에 신호를 보내세요... ✨"
              rows={1}
              style={{
                width: "100%", background: "none", border: "none",
                color: "rgba(224,231,255,0.9)", fontSize: "14px",
                fontFamily: "'Noto Sans KR', sans-serif",
                lineHeight: "1.5", maxHeight: "80px", overflow: "auto",
                resize: "none", outline: "none",
                caretColor: accentColor,
              }}
            />
          </div>
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{
              width: "44px", height: "44px", borderRadius: "50%", flexShrink: 0,
              background: input.trim() && !loading
                ? `radial-gradient(circle, ${accentColor}, ${accentColor}88)`
                : "rgba(255,255,255,0.06)",
              border: input.trim() && !loading
                ? `1px solid ${accentColor}88`
                : "1px solid rgba(255,255,255,0.08)",
              color: input.trim() && !loading ? "#fff" : "rgba(255,255,255,0.2)",
              fontSize: "18px",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
              boxShadow: input.trim() && !loading
                ? `0 0 20px ${accentColor}66, 0 4px 12px rgba(0,0,0,0.3)`
                : "none",
            }}
          >
            {input.trim() && !loading ? "🚀" : "✦"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 메인 허브 ─────────────────────────────────────────────────
export default function NovaBot() {
  const [activeBot, setActiveBot] = useState(null);
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const [angles, setAngles] = useState(() => PLANETS.map((p) => p.startAngle));
  const [orbitAngle, setOrbitAngle] = useState(0);
  const lastTimeRef = useRef(null);

  useEffect(() => {
    let frame;
    const animate = (ts) => {
      if (!lastTimeRef.current) lastTimeRef.current = ts;
      const dt = (ts - lastTimeRef.current) / 1000;
      lastTimeRef.current = ts;
      setAngles((prev) => prev.map((a, i) => (a + (360 / PLANETS[i].speed) * dt) % 360));
      setOrbitAngle((a) => (a + 0.3) % 360);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const cx = 200, cy = 200;

  function planetPos(orbitR, angleDeg) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + orbitR * Math.cos(rad),
      y: cy + orbitR * 0.4 * Math.sin(rad),
    };
  }

  const orbitX = Math.cos((orbitAngle * Math.PI) / 180) * 18;
  const orbitY = Math.sin((orbitAngle * Math.PI) / 180) * 8;
  const activePlanet = PLANETS.find((p) => p.id === activeBot);

  return (
    <div style={{
      minHeight: "100vh", maxWidth: "420px", margin: "0 auto",
      background: "#020408",
      display: "flex", flexDirection: "column", alignItems: "center",
      fontFamily: "'Noto Sans KR', -apple-system, sans-serif",
      overflow: "hidden", position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Orbitron:wght@400;700;900&display=swap');
        @keyframes starPulse {
          0%,100%{opacity:0.4;transform:scale(1)}
          50%{opacity:1;transform:scale(1.4)}
        }
        @keyframes twinkle {
          0%,100%{opacity:0.3} 50%{opacity:1}
        }
        @keyframes nebula {
          0%,100%{opacity:0.15;transform:scale(1) rotate(0deg)}
          50%{opacity:0.25;transform:scale(1.05) rotate(3deg)}
        }
        @keyframes msgAppear {
          from{opacity:0;transform:translateY(10px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes fadeIn {
          from{opacity:0} to{opacity:1}
        }
        @keyframes slideUp {
          from{transform:translateY(100%)} to{transform:translateY(0)}
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0; }
        textarea { resize: none; }
        textarea:focus { outline: none; }
        button:active { transform: scale(0.94); }
      `}</style>

      {/* 별 배경 */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {STARS.map((s) => (
          <div key={s.id} style={{
            position: "absolute",
            left: `${s.x}%`, top: `${s.y}%`,
            width: `${s.size}px`, height: `${s.size}px`,
            borderRadius: "50%",
            background: s.size > 1.8 ? "radial-gradient(circle, #fff, #a78bfa)" : "#fff",
            opacity: s.opacity,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            boxShadow: s.size > 2 ? `0 0 ${s.size * 2}px rgba(167,139,250,0.6)` : "none",
          }} />
        ))}
      </div>

      {/* 성운 배경 */}
      <div style={{
        position: "fixed", top: "-100px", right: "-80px",
        width: "300px", height: "300px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, rgba(99,102,241,0.08) 40%, transparent 70%)",
        animation: "nebula 8s ease-in-out infinite",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: "100px", left: "-60px",
        width: "220px", height: "220px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)",
        animation: "nebula 10s ease-in-out infinite 2s",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* 헤더 */}
      <div style={{
        position: "relative", zIndex: 10, width: "100%",
        background: "rgba(2,4,8,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(167,139,250,0.15)",
        padding: "16px 20px",
        display: "flex", alignItems: "center", gap: "14px",
      }}>
        {/* NOVA 로고 궤도 애니메이션 — 원본 그대로 */}
        <div style={{ position: "relative", width: "50px", height: "50px", flexShrink: 0 }}>
          <div style={{
            position: "absolute", inset: "4px", borderRadius: "50%",
            border: "1px solid rgba(167,139,250,0.3)",
          }} />
          <div style={{
            position: "absolute", inset: "10px", borderRadius: "50%",
            background: "radial-gradient(circle, #c4b5fd, #7c3aed)",
            boxShadow: "0 0 16px rgba(124,58,237,0.8), 0 0 32px rgba(124,58,237,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px",
          }}>✦</div>
          <div style={{
            position: "absolute",
            top: `calc(50% + ${orbitY}px - 4px)`,
            left: `calc(50% + ${orbitX}px - 4px)`,
            width: "8px", height: "8px", borderRadius: "50%",
            background: "radial-gradient(circle, #93c5fd, #3b82f6)",
            boxShadow: "0 0 8px rgba(59,130,246,0.9)",
          }} />
        </div>

        <div>
          <div style={{
            fontFamily: "'Orbitron', monospace",
            fontWeight: "700", fontSize: "18px",
            background: "linear-gradient(90deg, #c4b5fd, #93c5fd)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            letterSpacing: "3px",
          }}>NOVA UNIVERSE</div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
            <span style={{
              fontSize: "10px", color: "rgba(167,139,250,0.6)",
              fontFamily: "'Orbitron', monospace", letterSpacing: "1px",
            }}>5 PLANETS ACTIVE</span>
          </div>
        </div>

        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: "9px", color: "rgba(167,139,250,0.4)", fontFamily: "monospace", letterSpacing: "1px" }}>SECTOR 001</div>
          <div style={{ fontSize: "9px", color: "rgba(59,130,246,0.5)", fontFamily: "monospace" }}>FREE EXPLORATION</div>
        </div>
      </div>

      {/* 태양계 SVG */}
      <div style={{ position: "relative", zIndex: 5, width: "100%", display: "flex", justifyContent: "center" }}>
        <svg viewBox="0 0 400 400" width="100%" style={{ maxWidth: "400px", overflow: "visible" }}>
          {/* 궤도 점선 */}
          {PLANETS.map((p) => (
            <ellipse key={p.id + "-orbit"}
              cx={cx} cy={cy} rx={p.orbitR} ry={p.orbitR * 0.4}
              fill="none" stroke="rgba(167,139,250,0.12)" strokeWidth="1" strokeDasharray="5 7"
            />
          ))}

          {/* 호버 연결선 */}
          {hoveredPlanet && (() => {
            const p = PLANETS.find((x) => x.id === hoveredPlanet);
            const idx = PLANETS.indexOf(p);
            const pos = planetPos(p.orbitR, angles[idx]);
            return <line x1={cx} y1={cy} x2={pos.x} y2={pos.y}
              stroke={p.color} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="4 5" />;
          })()}

          {/* NOVA 코어 */}
          <circle cx={cx} cy={cy} r="30" fill="url(#coreGrad)" filter="url(#glow)" />
          <circle cx={cx} cy={cy} r="22" fill="#0d0020" />
          <text x={cx} y={cy + 7} textAnchor="middle" fontSize="20" fill="white">✦</text>

          {/* 행성들 */}
          {PLANETS.map((p, i) => {
            const pos = planetPos(p.orbitR, angles[i]);
            const isHover = hoveredPlanet === p.id;
            const r = isHover ? 22 : 18;
            return (
              <g key={p.id} style={{ cursor: "pointer" }}
                onClick={() => setActiveBot(p.id)}
                onMouseEnter={() => setHoveredPlanet(p.id)}
                onMouseLeave={() => setHoveredPlanet(null)}
              >
                <circle cx={pos.x} cy={pos.y} r={r + 8} fill={p.color} opacity="0.12" />
                <circle cx={pos.x} cy={pos.y} r={r} fill={p.color} filter="url(#glow)" />
                <text x={pos.x} y={pos.y + 6} textAnchor="middle" fontSize={isHover ? "15" : "13"}>{p.emoji}</text>
                {isHover && (
                  <text x={pos.x} y={pos.y + r + 14} textAnchor="middle"
                    fontSize="10" fill={p.color} fontWeight="bold"
                    fontFamily="'Noto Sans KR', sans-serif"
                  >{p.label}</text>
                )}
              </g>
            );
          })}

          <defs>
            <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#7c3aed" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      {/* 안내 텍스트 */}
      <div style={{
        position: "relative", zIndex: 5,
        textAlign: "center", padding: "0 20px 14px",
        color: "rgba(167,139,250,0.4)",
        fontSize: "11px", letterSpacing: "1px",
        fontFamily: "'Orbitron', monospace",
      }}>TAP A PLANET TO CONNECT</div>

      {/* 빠른 접근 버튼 */}
      <div style={{
        position: "relative", zIndex: 5, width: "100%",
        padding: "0 16px 32px",
        display: "flex", flexWrap: "wrap",
        gap: "8px", justifyContent: "center",
      }}>
        {PLANETS.map((p) => (
          <button key={p.id} onClick={() => setActiveBot(p.id)} style={{
            background: `${p.color}14`,
            border: `1px solid ${p.color}44`,
            borderRadius: "20px", padding: "7px 16px",
            color: p.color, fontSize: "12px",
            cursor: "pointer",
            fontFamily: "'Noto Sans KR', sans-serif",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `${p.color}28`;
            e.currentTarget.style.boxShadow = `0 0 12px ${p.color}44`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `${p.color}14`;
            e.currentTarget.style.boxShadow = "none";
          }}>
            {p.emoji} {p.label}
          </button>
        ))}
      </div>

      {/* 챗봇 패널 */}
      {activePlanet && (
        <BotPanel planet={activePlanet} onClose={() => setActiveBot(null)} />
      )}
    </div>
  );
}
