import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `당신은 "NOVA" — AI 우주 탐험 가이드입니다.

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

시작 멘트 스타일:
"새로운 별이 탄생했어요 ✨ AI 세계에 오신 걸 환영합니다"

자주 묻는 질문:
Q: AI로 돈 벌 수 있어요?
A: 네! 소상공인 가게에 AI 예약봇 만들어주고 30~50만원 받는 게 가장 빠른 방법이에요. 코딩 몰라도 돼요 🚀

Q: 뭐부터 시작해요?
A: 딱 하나만요. Claude.ai 가입하고 "미용실 봇 만들어줘" 해보세요. 5분이면 첫 번째 별이 생겨요 ✨

Q: 코딩 못해도 되나요?
A: 완전 됩니다! Claude한테 만들어달라고 하면 돼요. NOVA도 그렇게 만들어졌어요 😊

모르는 질문엔 솔직하게 말하고 관련 방향 제시하기.
항상 마지막에 다음 탐험 유도: "또 궁금한 별이 있나요? 🌟"`;

const STARS_COUNT = 120;

function generateStars() {
  return Array.from({ length: STARS_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.7 + 0.3,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 4,
  }));
}

const STARS = generateStars();

const QUICK = [
  "🚀 AI로 돈 벌 수 있어요?",
  "⭐ 뭐부터 시작해요?",
  "🪐 코딩 몰라도 되나요?",
  "💫 봇은 어떻게 만들어요?",
  "🌟 얼마나 벌 수 있어요?",
];

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: "6px", height: "6px", borderRadius: "50%",
          background: "radial-gradient(circle, #a78bfa, #7c3aed)",
          animation: `starPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
          boxShadow: "0 0 6px #a78bfa"
        }} />
      ))}
    </div>
  );
}

export default function NovaBot() {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "새로운 별이 탄생했어요 ✨\n\nAI 세계에 오신 걸 환영합니다.\n저는 NOVA — 당신의 AI 탐험 가이드예요.\n\n궁금한 것 뭐든 물어보세요. 어렵지 않게 알려드릴게요 🚀"
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const bottomRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    let frame;
    const animate = () => {
      setOrbitAngle(a => (a + 0.3) % 360);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

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
          system: SYSTEM_PROMPT,
          messages: next.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages(p => [...p, {
        role: "assistant",
        content: data.content?.[0]?.text || "신호가 끊겼어요. 다시 시도해주세요 🛸"
      }]);
    } catch {
      setMessages(p => [...p, {
        role: "assistant",
        content: "우주 신호가 잠깐 끊겼어요 🛸 다시 시도해주세요!"
      }]);
    }
    setLoading(false);
  }

  const orbitX = Math.cos((orbitAngle * Math.PI) / 180) * 18;
  const orbitY = Math.sin((orbitAngle * Math.PI) / 180) * 8;

  return (
    <div style={{
      height: "100vh", maxWidth: "420px", margin: "0 auto",
      background: "#020408",
      display: "flex", flexDirection: "column",
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
          from{opacity:0;transform:translateY(12px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes orbitRing {
          from{transform:rotate(0deg)} to{transform:rotate(360deg)}
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0; }
        textarea { resize: none; }
        textarea:focus { outline: none; }
        button:active { transform: scale(0.94); }
      `}</style>

      {/* 별 배경 */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {STARS.map(s => (
          <div key={s.id} style={{
            position: "absolute",
            left: `${s.x}%`, top: `${s.y}%`,
            width: `${s.size}px`, height: `${s.size}px`,
            borderRadius: "50%",
            background: s.size > 1.8
              ? "radial-gradient(circle, #fff, #a78bfa)"
              : "#fff",
            opacity: s.opacity,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            boxShadow: s.size > 2 ? `0 0 ${s.size * 2}px rgba(167,139,250,0.6)` : "none"
          }} />
        ))}
      </div>

      {/* 성운 배경 */}
      <div style={{
        position: "absolute", top: "-100px", right: "-80px",
        width: "300px", height: "300px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, rgba(99,102,241,0.08) 40%, transparent 70%)",
        animation: "nebula 8s ease-in-out infinite",
        pointerEvents: "none", zIndex: 0
      }} />
      <div style={{
        position: "absolute", bottom: "100px", left: "-60px",
        width: "220px", height: "220px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)",
        animation: "nebula 10s ease-in-out infinite 2s",
        pointerEvents: "none", zIndex: 0
      }} />

      {/* 헤더 */}
      <div style={{
        position: "relative", zIndex: 10,
        background: "rgba(2,4,8,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(167,139,250,0.15)",
        padding: "16px 20px",
        flexShrink: 0,
        display: "flex", alignItems: "center", gap: "14px",
      }}>
        {/* NOVA 로고 - 궤도 애니메이션 */}
        <div style={{ position: "relative", width: "50px", height: "50px", flexShrink: 0 }}>
          {/* 궤도 링 */}
          <div style={{
            position: "absolute", inset: "4px",
            borderRadius: "50%",
            border: "1px solid rgba(167,139,250,0.3)",
          }} />
          {/* 중심 별 */}
          <div style={{
            position: "absolute", inset: "10px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #c4b5fd, #7c3aed)",
            boxShadow: "0 0 16px rgba(124,58,237,0.8), 0 0 32px rgba(124,58,237,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px"
          }}>✦</div>
          {/* 궤도 위성 */}
          <div style={{
            position: "absolute",
            top: `calc(50% + ${orbitY}px - 4px)`,
            left: `calc(50% + ${orbitX}px - 4px)`,
            width: "8px", height: "8px",
            borderRadius: "50%",
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
            letterSpacing: "3px"
          }}>NOVA</div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
            <div style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: "#4ade80",
              boxShadow: "0 0 8px #4ade80"
            }} />
            <span style={{
              fontSize: "11px", color: "rgba(167,139,250,0.6)",
              fontFamily: "'Orbitron', monospace", letterSpacing: "1px"
            }}>AI NAVIGATOR</span>
          </div>
        </div>

        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{
            fontSize: "9px", color: "rgba(167,139,250,0.4)",
            fontFamily: "monospace", letterSpacing: "1px"
          }}>SECTOR 001</div>
          <div style={{
            fontSize: "9px", color: "rgba(59,130,246,0.5)",
            fontFamily: "monospace"
          }}>FREE EXPLORATION</div>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "20px 16px 8px",
        position: "relative", zIndex: 5
      }}>
        {messages.map((m, i) => {
          const isBot = m.role === "assistant";
          return (
            <div key={i} style={{
              display: "flex",
              flexDirection: isBot ? "row" : "row-reverse",
              alignItems: "flex-end",
              gap: "10px",
              marginBottom: "16px",
              animation: "msgAppear 0.3s ease"
            }}>
              {isBot && (
                <div style={{
                  width: "34px", height: "34px", flexShrink: 0,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #7c3aed, #4c1d95)",
                  border: "1px solid rgba(167,139,250,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px",
                  boxShadow: "0 0 12px rgba(124,58,237,0.5)"
                }}>✦</div>
              )}
              <div style={{
                maxWidth: "74%",
                background: isBot
                  ? "rgba(17,10,40,0.9)"
                  : "linear-gradient(135deg, rgba(124,58,237,0.8), rgba(99,102,241,0.7))",
                border: isBot
                  ? "1px solid rgba(167,139,250,0.2)"
                  : "1px solid rgba(167,139,250,0.4)",
                borderRadius: isBot ? "4px 18px 18px 18px" : "18px 4px 18px 18px",
                padding: "12px 15px",
                backdropFilter: "blur(10px)",
                boxShadow: isBot
                  ? "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(167,139,250,0.1)"
                  : "0 4px 20px rgba(124,58,237,0.3)",
              }}>
                {m.content.split("\n").map((line, j) => (
                  <p key={j} style={{
                    margin: j < m.content.split("\n").length - 1 ? "0 0 6px" : "0",
                    fontSize: "14px",
                    lineHeight: "1.65",
                    color: isBot ? "rgba(224,231,255,0.9)" : "#fff",
                  }}>
                    {line.split(/\*\*(.*?)\*\*/g).map((part, k) =>
                      k % 2 === 1
                        ? <strong key={k} style={{ color: "#c4b5fd" }}>{part}</strong>
                        : part
                    )}
                  </p>
                ))}
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={{
            display: "flex", alignItems: "flex-end",
            gap: "10px", marginBottom: "16px"
          }}>
            <div style={{
              width: "34px", height: "34px", flexShrink: 0,
              borderRadius: "50%",
              background: "radial-gradient(circle, #7c3aed, #4c1d95)",
              border: "1px solid rgba(167,139,250,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", boxShadow: "0 0 12px rgba(124,58,237,0.5)"
            }}>✦</div>
            <div style={{
              background: "rgba(17,10,40,0.9)",
              border: "1px solid rgba(167,139,250,0.2)",
              borderRadius: "4px 18px 18px 18px",
              padding: "14px 16px",
              backdropFilter: "blur(10px)"
            }}>
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 빠른 질문 */}
      <div style={{
        position: "relative", zIndex: 10,
        padding: "8px 16px",
        background: "rgba(2,4,8,0.7)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(167,139,250,0.08)",
        display: "flex", gap: "6px", overflowX: "auto", flexShrink: 0
      }}>
        {QUICK.map((q, i) => (
          <button key={i} onClick={() => send(q)} style={{
            background: "rgba(124,58,237,0.12)",
            border: "1px solid rgba(167,139,250,0.2)",
            borderRadius: "20px", padding: "7px 13px",
            color: "rgba(196,181,253,0.8)", fontSize: "11px",
            cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
            fontFamily: "'Noto Sans KR', sans-serif",
            transition: "all 0.2s",
            backdropFilter: "blur(10px)"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(124,58,237,0.25)";
            e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(124,58,237,0.12)";
            e.currentTarget.style.borderColor = "rgba(167,139,250,0.2)";
          }}
          >{q}</button>
        ))}
      </div>

      {/* 입력창 */}
      <div style={{
        position: "relative", zIndex: 10,
        padding: "10px 16px 28px",
        background: "rgba(2,4,8,0.85)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(167,139,250,0.1)",
        flexShrink: 0,
        display: "flex", gap: "10px", alignItems: "flex-end"
      }}>
        <div style={{
          flex: 1,
          background: "rgba(17,10,40,0.8)",
          border: "1px solid rgba(167,139,250,0.25)",
          borderRadius: "20px",
          padding: "11px 16px",
          backdropFilter: "blur(10px)",
          boxShadow: "inset 0 1px 0 rgba(167,139,250,0.08)"
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="우주에 신호를 보내세요... ✨"
            rows={1}
            style={{
              width: "100%", background: "none", border: "none",
              color: "rgba(224,231,255,0.9)", fontSize: "14px",
              fontFamily: "'Noto Sans KR', sans-serif",
              lineHeight: "1.5", maxHeight: "80px", overflow: "auto",
              caretColor: "#a78bfa",
            }}
          />
        </div>
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          style={{
            width: "44px", height: "44px",
            borderRadius: "50%", flexShrink: 0,
            background: input.trim() && !loading
              ? "radial-gradient(circle, #7c3aed, #4c1d95)"
              : "rgba(255,255,255,0.06)",
            border: input.trim() && !loading
              ? "1px solid rgba(167,139,250,0.5)"
              : "1px solid rgba(255,255,255,0.08)",
            color: input.trim() && !loading ? "#fff" : "rgba(255,255,255,0.2)",
            fontSize: "18px",
            cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
            boxShadow: input.trim() && !loading
              ? "0 0 20px rgba(124,58,237,0.5), 0 4px 12px rgba(0,0,0,0.3)"
              : "none"
          }}
        >
          {input.trim() && !loading ? "🚀" : "✦"}
        </button>
      </div>
    </div>
  );
}
