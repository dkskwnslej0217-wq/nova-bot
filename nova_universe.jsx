import { useState, useEffect, useRef } from "react";

// ─── 행성(서비스) 데이터 ───────────────────────────────────────────
const PLANETS = [
  {
    id: "cafe",
    emoji: "☕",
    label: "카페봇",
    sublabel: "CAFÉ AI",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.6)",
    ring: "rgba(236,72,153,0.25)",
    orbitR: 110,
    orbitSpeed: 0.18,
    startAngle: 0,
    size: 38,
    systemPrompt: `당신은 카페의 친절한 AI 직원입니다. 사장님 대신 고객 문의에 답변합니다.
카페 정보: 영업시간 오전10시~오후8시, 예약 가능, 주차 매장문의.
메뉴: 아메리카노4000원, 카페라떼4500원, 바닐라라떼5000원, 딸기에이드5500원, 치즈케이크6000원.
항상 친절하고 짧게. 마지막엔 "또 궁금한 점 있으시면 편하게 물어보세요 😊"`,
    quick: ["☕ 메뉴 알려주세요", "📅 예약 되나요?", "🕙 영업시간이요?", "💰 가격대는요?"],
    welcome: "안녕하세요 ☕\n저희 카페에 오신 걸 환영해요!\n궁금하신 점 편하게 물어보세요 😊",
  },
  {
    id: "nail",
    emoji: "💅",
    label: "네일샵봇",
    sublabel: "NAIL AI",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.6)",
    ring: "rgba(168,85,247,0.25)",
    orbitR: 170,
    orbitSpeed: 0.11,
    startAngle: 72,
    size: 34,
    systemPrompt: `당신은 네일샵의 친절한 AI 직원입니다. 고객 문의에 짧고 친절하게 답합니다.
네일샵 정보: 영업시간 오전11시~오후8시, 예약 필수(당일 가능 시 안내), 주차 건물 내 무료.
시술: 기본케어20000원, 젤네일35000원~, 아트추가10000원~, 속눈썹20000원~.
항상 따뜻하게. 마지막엔 "또 궁금한 점 있으시면 편하게 물어보세요 💅"`,
    quick: ["💅 시술 종류가 뭐예요?", "📅 예약하고 싶어요", "💰 가격이 어떻게 돼요?", "🕙 영업시간이요?"],
    welcome: "안녕하세요 💅\n네일샵 AI 직원이에요!\n예약, 가격, 시술 뭐든 물어보세요 ✨",
  },
  {
    id: "pilates",
    emoji: "🧘",
    label: "필라테스봇",
    sublabel: "PILATES AI",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.6)",
    ring: "rgba(6,182,212,0.25)",
    orbitR: 230,
    orbitSpeed: 0.075,
    startAngle: 144,
    size: 32,
    systemPrompt: `당신은 필라테스 센터의 친절한 AI 직원입니다. 고객 문의에 짧고 친절하게 답합니다.
센터 정보: 영업시간 오전6시~오후10시, 예약 앱/전화 가능, 주차 건물 지하.
수업: 그룹클래스(월4회)100000원, 개인PT(50분)80000원, 듀엣(50분)55000원/인.
첫방문 체험레슨 30000원. 항상 건강하고 따뜻하게. 마지막엔 "더 궁금한 점 있으시면 언제든 물어보세요 🧘"`,
    quick: ["🧘 수업 종류가 뭐예요?", "💰 가격 알려주세요", "📅 체험 신청할게요", "🕙 운영시간이요?"],
    welcome: "안녕하세요 🧘\n필라테스 센터 AI 직원이에요!\n수업, 예약, 가격 뭐든 물어보세요 ✨",
  },
  {
    id: "hair",
    emoji: "✂️",
    label: "미용실봇",
    sublabel: "HAIR AI",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.6)",
    ring: "rgba(245,158,11,0.25)",
    orbitR: 290,
    orbitSpeed: 0.05,
    startAngle: 216,
    size: 30,
    systemPrompt: `당신은 미용실의 친절한 AI 직원입니다. 고객 문의에 짧고 친절하게 답합니다.
미용실 정보: 영업시간 오전10시~오후8시(화요일 휴무), 예약 필수, 주차 매장 앞 2대.
시술: 커트(여)15000원, 커트(남)12000원, 펌55000원~, 염색45000원~, 클리닉20000원~.
항상 친절하게. 마지막엔 "또 궁금한 점 있으시면 편하게 물어보세요 ✂️"`,
    quick: ["✂️ 가격표 알려주세요", "📅 예약하고 싶어요", "🕙 영업시간이요?", "🎨 염색 얼마예요?"],
    welcome: "안녕하세요 ✂️\n미용실 AI 직원이에요!\n예약, 시술, 가격 뭐든 물어보세요 😊",
  },
  {
    id: "nova",
    emoji: "🚀",
    label: "NOVA봇",
    sublabel: "AI 가이드",
    color: "#c4b5fd",
    glow: "rgba(196,181,253,0.7)",
    ring: "rgba(196,181,253,0.2)",
    orbitR: 350,
    orbitSpeed: 0.032,
    startAngle: 288,
    size: 28,
    systemPrompt: `당신은 "NOVA" — AI 우주 탐험 가이드입니다.
AI로 돈 버는 방법, 소상공인 봇 제작(30~50만원/건), 코딩 없이 AI 사업 시작하는 법을 안내합니다.
말투: 우주 비유, 친근하고 짧게, 이모지 적당히.
마지막엔 "또 궁금한 별이 있나요? 🌟"`,
    quick: ["🚀 AI로 돈 벌 수 있어요?", "⭐ 뭐부터 시작해요?", "🤖 봇은 어떻게 만들어요?", "💰 얼마나 벌 수 있어요?"],
    welcome: "새로운 별이 탄생했어요 ✨\n저는 NOVA — AI 탐험 가이드예요.\n궁금한 것 뭐든 물어보세요 🚀",
  },
];

// ─── 별 배경 ──────────────────────────────────────────────────────
const STAR_COUNT = 180;
const STARS = Array.from({ length: STAR_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2.2 + 0.4,
  opacity: Math.random() * 0.6 + 0.2,
  dur: Math.random() * 4 + 2,
  delay: Math.random() * 5,
}));

// ─── 타이핑 점 ────────────────────────────────────────────────────
function TypingDots({ color }) {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: "6px", height: "6px", borderRadius: "50%",
          background: color || "#a78bfa",
          animation: `dotPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
          boxShadow: `0 0 6px ${color || "#a78bfa"}`
        }} />
      ))}
    </div>
  );
}

// ─── 채팅 패널 ────────────────────────────────────────────────────
function ChatPanel({ planet, onClose }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: planet.welcome }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    const next = [...messages, { role: "user", content: msg }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          system: planet.systemPrompt,
          messages: next.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages(p => [...p, { role: "assistant", content: data.content?.[0]?.text || "잠시 후 다시 시도해주세요 😊" }]);
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "신호가 잠깐 끊겼어요. 다시 시도해주세요 🛸" }]);
    }
    setLoading(false);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        width: "100%", maxWidth: "420px", height: "82vh",
        background: "#060210",
        border: `1px solid ${planet.ring}`,
        borderRadius: "24px 24px 0 0",
        display: "flex", flexDirection: "column",
        boxShadow: `0 -8px 60px ${planet.glow}`,
        overflow: "hidden",
        animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* 패널 헤더 */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${planet.ring}`, display: "flex", alignItems: "center", gap: "12px", flexShrink: 0, background: "rgba(0,0,0,0.3)" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: `radial-gradient(circle, ${planet.color}, #1a0030)`, border: `1px solid ${planet.ring}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", boxShadow: `0 0 14px ${planet.glow}` }}>{planet.emoji}</div>
          <div>
            <div style={{ color: planet.color, fontWeight: "700", fontSize: "15px", letterSpacing: "1px" }}>{planet.label}</div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "1px" }}>{planet.sublabel}</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: "22px", cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>

        {/* 메시지 */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {messages.map((m, i) => {
            const isBot = m.role === "assistant";
            return (
              <div key={i} style={{ display: "flex", flexDirection: isBot ? "row" : "row-reverse", alignItems: "flex-end", gap: "8px", marginBottom: "14px", animation: "msgIn 0.25s ease" }}>
                {isBot && <div style={{ width: "30px", height: "30px", flexShrink: 0, borderRadius: "50%", background: `radial-gradient(circle, ${planet.color}aa, #1a0030)`, border: `1px solid ${planet.ring}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>{planet.emoji}</div>}
                <div style={{ maxWidth: "76%", background: isBot ? "rgba(255,255,255,0.05)" : `${planet.color}33`, border: `1px solid ${isBot ? "rgba(255,255,255,0.1)" : planet.ring}`, borderRadius: isBot ? "4px 16px 16px 16px" : "16px 4px 16px 16px", padding: "10px 13px", backdropFilter: "blur(10px)" }}>
                  {m.content.split("\n").map((line, j, arr) => (
                    <p key={j} style={{ margin: j < arr.length - 1 ? "0 0 5px" : "0", fontSize: "13px", lineHeight: "1.65", color: "rgba(255,245,255,0.9)" }}>
                      {line.split(/\*\*(.*?)\*\*/g).map((p, k) => k % 2 === 1 ? <strong key={k} style={{ color: planet.color }}>{p}</strong> : p)}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
          {loading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "14px" }}>
              <div style={{ width: "30px", height: "30px", flexShrink: 0, borderRadius: "50%", background: `radial-gradient(circle, ${planet.color}aa, #1a0030)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>{planet.emoji}</div>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px 16px 16px 16px", padding: "12px 14px" }}><TypingDots color={planet.color} /></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* 빠른 질문 */}
        <div style={{ padding: "8px 12px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "6px", overflowX: "auto", flexShrink: 0 }}>
          {planet.quick.map((q, i) => (
            <button key={i} onClick={() => send(q)} style={{ background: `${planet.color}18`, border: `1px solid ${planet.color}44`, borderRadius: "20px", padding: "6px 12px", color: `${planet.color}cc`, fontSize: "11px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "'Noto Sans KR', sans-serif" }}>{q}</button>
          ))}
        </div>

        {/* 입력창 */}
        <div style={{ padding: "10px 14px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "10px", alignItems: "flex-end", flexShrink: 0 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: `1px solid ${planet.color}44`, borderRadius: "18px", padding: "10px 14px" }}>
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="궁금한 점을 입력해주세요..." rows={1} style={{ width: "100%", background: "none", border: "none", color: "rgba(255,245,255,0.9)", fontSize: "13px", fontFamily: "'Noto Sans KR', sans-serif", lineHeight: "1.5", maxHeight: "72px", overflow: "auto", caretColor: planet.color, resize: "none" }} />
          </div>
          <button onClick={() => send()} disabled={!input.trim() || loading} style={{ width: "42px", height: "42px", borderRadius: "50%", flexShrink: 0, background: input.trim() && !loading ? `radial-gradient(circle, ${planet.color}, #1a0030)` : "rgba(255,255,255,0.05)", border: `1px solid ${input.trim() && !loading ? planet.color : "rgba(255,255,255,0.1)"}`, color: "#fff", fontSize: "16px", cursor: input.trim() && !loading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", boxShadow: input.trim() && !loading ? `0 0 18px ${planet.glow}` : "none" }}>
            {input.trim() && !loading ? "✉️" : planet.emoji}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 메인 우주 허브 ───────────────────────────────────────────────
export default function NovaUniverse() {
  const [angles, setAngles] = useState(() => PLANETS.map(p => p.startAngle));
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [intro, setIntro] = useState(true);
  const rafRef = useRef(null);
  const cx = 210, cy = 300; // 캔버스 중심 (420 wide)

  // 공전 애니메이션
  useEffect(() => {
    let last = performance.now();
    const tick = (now) => {
      const dt = now - last; last = now;
      setAngles(prev => prev.map((a, i) => (a + PLANETS[i].orbitSpeed * (dt / 16)) % 360));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // 행성 좌표
  const positions = angles.map((a, i) => ({
    x: cx + Math.cos((a * Math.PI) / 180) * PLANETS[i].orbitR,
    y: cy + Math.sin((a * Math.PI) / 180) * PLANETS[i].orbitR * 0.42,
  }));

  return (
    <div style={{ height: "100vh", maxWidth: "420px", margin: "0 auto", background: "#020408", overflow: "hidden", position: "relative", fontFamily: "'Noto Sans KR', -apple-system, sans-serif", userSelect: "none" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Orbitron:wght@700;900&display=swap');
        @keyframes twinkle { 0%,100%{opacity:0.2} 50%{opacity:1} }
        @keyframes corePulse { 0%,100%{box-shadow:0 0 30px rgba(196,181,253,0.5),0 0 60px rgba(124,58,237,0.3)} 50%{box-shadow:0 0 50px rgba(196,181,253,0.8),0 0 100px rgba(124,58,237,0.5)} }
        @keyframes orbitRotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes dotPulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.4)} }
        @keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes msgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes introFade { 0%{opacity:0;transform:scale(0.9)} 100%{opacity:1;transform:scale(1)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      {/* ── 별 배경 */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {STARS.map(s => (
          <div key={s.id} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, borderRadius: "50%", background: s.size > 1.8 ? "radial-gradient(circle,#fff,#c4b5fd)" : "#fff", opacity: s.opacity, animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }} />
        ))}
      </div>

      {/* ── SVG 궤도선 + 연결선 */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }} viewBox="0 0 420 600" preserveAspectRatio="none">
        {/* 궤도 타원 */}
        {PLANETS.map((p, i) => (
          <ellipse key={p.id} cx={cx} cy={cy} rx={p.orbitR} ry={p.orbitR * 0.42}
            fill="none" stroke={p.color} strokeWidth="0.5" strokeDasharray="4 8"
            opacity={hovered === i ? 0.45 : 0.15} style={{ transition: "opacity 0.3s" }} />
        ))}
        {/* 코어→행성 연결선 (hover시) */}
        {PLANETS.map((p, i) => hovered === i && (
          <line key={`line-${p.id}`} x1={cx} y1={cy} x2={positions[i].x} y2={positions[i].y}
            stroke={p.color} strokeWidth="0.8" strokeDasharray="3 5" opacity="0.5" />
        ))}
      </svg>

      {/* ── NOVA 코어 (중심) */}
      <div style={{ position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)", zIndex: 10 }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "radial-gradient(circle, #c4b5fd 0%, #7c3aed 50%, #1a0030 100%)", animation: "corePulse 3s ease-in-out infinite", display: "flex", alignItems: "center", justifyContent: "center", cursor: "default" }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "9px", fontWeight: "900", color: "#fff", letterSpacing: "1px", textAlign: "center", lineHeight: 1.2 }}>NOVA<br/>CORE</div>
        </div>
      </div>

      {/* ── 행성들 */}
      {PLANETS.map((p, i) => {
        const { x, y } = positions[i];
        const isHov = hovered === i;
        return (
          <div key={p.id}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(i)}
            style={{
              position: "absolute",
              left: x, top: y,
              transform: `translate(-50%,-50%) scale(${isHov ? 1.25 : 1})`,
              zIndex: 20,
              cursor: "pointer",
              transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
            {/* 행성 본체 */}
            <div style={{
              width: `${p.size}px`, height: `${p.size}px`,
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, ${p.color}ee, #0a0010)`,
              border: `1.5px solid ${p.color}88`,
              boxShadow: isHov ? `0 0 24px ${p.glow}, 0 0 48px ${p.glow}44` : `0 0 10px ${p.glow}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: `${p.size * 0.45}px`,
              animation: isHov ? "float 1.5s ease-in-out infinite" : "none",
            }}>{p.emoji}</div>

            {/* 라벨 */}
            {isHov && (
              <div style={{
                position: "absolute", top: `${p.size + 6}px`, left: "50%", transform: "translateX(-50%)",
                background: "rgba(0,0,0,0.85)", border: `1px solid ${p.color}55`,
                borderRadius: "10px", padding: "4px 9px", whiteSpace: "nowrap",
                color: p.color, fontSize: "10px", fontWeight: "700", letterSpacing: "0.5px",
                boxShadow: `0 0 12px ${p.glow}`,
              }}>{p.label}</div>
            )}
          </div>
        );
      })}

      {/* ── 헤더 */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 30, padding: "20px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "22px", fontWeight: "900", background: "linear-gradient(90deg,#c4b5fd,#93c5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "4px" }}>NOVA</div>
          <div style={{ fontSize: "10px", color: "rgba(196,181,253,0.5)", letterSpacing: "2px", marginTop: "2px" }}>UNIVERSE · SECTOR 001</div>
        </div>
        <a href="https://nova-bot-plum-seven.vercel.app/" target="_blank" rel="noreferrer" style={{ fontSize: "11px", color: "rgba(196,181,253,0.5)", border: "1px solid rgba(196,181,253,0.2)", borderRadius: "20px", padding: "5px 12px", textDecoration: "none" }}>🚀 NOVA 봇</a>
      </div>

      {/* ── 하단 안내 */}
      <div style={{ position: "absolute", bottom: 32, left: 0, right: 0, zIndex: 30, textAlign: "center" }}>
        <div style={{ fontSize: "11px", color: "rgba(196,181,253,0.4)", letterSpacing: "1px" }}>✦ 별을 클릭하면 봇이 열려요 ✦</div>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "10px", flexWrap: "wrap", padding: "0 20px" }}>
          {PLANETS.map((p, i) => (
            <button key={p.id} onClick={() => setActive(i)} style={{ background: `${p.color}18`, border: `1px solid ${p.color}44`, borderRadius: "20px", padding: "5px 12px", color: `${p.color}cc`, fontSize: "10px", cursor: "pointer", fontFamily: "'Noto Sans KR', sans-serif" }}>{p.emoji} {p.label}</button>
          ))}
        </div>
      </div>

      {/* ── 채팅 패널 */}
      {active !== null && <ChatPanel planet={PLANETS[active]} onClose={() => setActive(null)} />}
    </div>
  );
}
