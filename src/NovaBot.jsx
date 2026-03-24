import { useState, useEffect, useRef } from "react";

// ── 카페봇 인라인 ──────────────────────────────────────────────
function CafeBot({ onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "안녕하세요 ☕ 카페 자동응답입니다! 무엇을 도와드릴까요?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const QUICK = ["메뉴", "예약", "주차", "영업시간", "가격"];

  async function send(text) {
    if (!text.trim()) return;
    const userMsg = { role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system:
            "당신은 친절한 카페 직원입니다. 영업시간은 오전 10시~오후 8시, 예약 가능합니다. 메뉴, 예약, 주차, 영업시간, 가격 관련 질문에 짧고 친절하게 답하세요. 이모지를 적절히 사용하세요.",
          messages: [{ role: "user", content: text }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "잠시 후 다시 시도해주세요.";
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "오류가 발생했어요. 다시 시도해주세요." }]);
    }
    setLoading(false);
  }

  return (
    <div style={styles.botWrap}>
      <div style={{ ...styles.botHeader, background: "linear-gradient(135deg,#ff6b9d,#c44dff)" }}>
        <span>☕ 카페봇</span>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
      </div>
      <div style={styles.botBody}>
        {messages.map((m, i) => (
          <div key={i} style={{ ...styles.bubble, alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "#ff6b9d" : "#2a1a3e" }}>
            {m.text}
          </div>
        ))}
        {loading && <div style={{ ...styles.bubble, alignSelf: "flex-start", background: "#2a1a3e" }}>입력 중...</div>}
        <div ref={bottomRef} />
      </div>
      <div style={styles.quickRow}>
        {QUICK.map((q) => (
          <button key={q} style={styles.quickBtn} onClick={() => send(q)}>{q}</button>
        ))}
      </div>
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="메시지 입력..."
        />
        <button style={{ ...styles.sendBtn, background: "#ff6b9d" }} onClick={() => send(input)}>전송</button>
      </div>
    </div>
  );
}

// ── 네일샵봇 ──────────────────────────────────────────────────
function NailBot({ onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "안녕하세요 💅 네일샵 자동응답입니다! 시술, 예약, 가격 모두 도와드릴게요." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const QUICK = ["시술종류", "예약", "가격", "소요시간", "위치"];

  async function send(text) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "당신은 친절한 네일샵 직원입니다. 젤네일, 아크릴, 네일아트 등 시술 관련 질문에 짧고 친절하게 답하세요. 영업시간은 오전11시~오후9시. 이모지를 적절히 사용하세요.",
          messages: [{ role: "user", content: text }],
        }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: data.content?.[0]?.text || "잠시 후 다시 시도해주세요." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "오류가 발생했어요." }]);
    }
    setLoading(false);
  }

  return (
    <div style={styles.botWrap}>
      <div style={{ ...styles.botHeader, background: "linear-gradient(135deg,#ff9ff3,#f368e0)" }}>
        <span>💅 네일샵봇</span>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
      </div>
      <div style={styles.botBody}>
        {messages.map((m, i) => (
          <div key={i} style={{ ...styles.bubble, alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "#f368e0" : "#2a1a3e" }}>
            {m.text}
          </div>
        ))}
        {loading && <div style={{ ...styles.bubble, alignSelf: "flex-start", background: "#2a1a3e" }}>입력 중...</div>}
        <div ref={bottomRef} />
      </div>
      <div style={styles.quickRow}>
        {QUICK.map((q) => <button key={q} style={styles.quickBtn} onClick={() => send(q)}>{q}</button>)}
      </div>
      <div style={styles.inputRow}>
        <input style={styles.input} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(input)} placeholder="메시지 입력..." />
        <button style={{ ...styles.sendBtn, background: "#f368e0" }} onClick={() => send(input)}>전송</button>
      </div>
    </div>
  );
}

// ── 필라테스봇 ────────────────────────────────────────────────
function PilatesBot({ onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "안녕하세요 🧘 필라테스 센터 자동응답입니다! 수업, 등록, 가격을 안내해드려요." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const QUICK = ["수업종류", "등록", "가격", "시간표", "위치"];

  async function send(text) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "당신은 친절한 필라테스 센터 직원입니다. 그룹/개인 수업, 등록, 가격 관련 질문에 짧고 친절하게 답하세요. 영업시간은 오전7시~오후10시. 이모지를 적절히 사용하세요.",
          messages: [{ role: "user", content: text }],
        }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: data.content?.[0]?.text || "잠시 후 다시 시도해주세요." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "오류가 발생했어요." }]);
    }
    setLoading(false);
  }

  return (
    <div style={styles.botWrap}>
      <div style={{ ...styles.botHeader, background: "linear-gradient(135deg,#a8edea,#00b894)" }}>
        <span>🧘 필라테스봇</span>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
      </div>
      <div style={styles.botBody}>
        {messages.map((m, i) => (
          <div key={i} style={{ ...styles.bubble, alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "#00b894" : "#2a1a3e" }}>
            {m.text}
          </div>
        ))}
        {loading && <div style={{ ...styles.bubble, alignSelf: "flex-start", background: "#2a1a3e" }}>입력 중...</div>}
        <div ref={bottomRef} />
      </div>
      <div style={styles.quickRow}>
        {QUICK.map((q) => <button key={q} style={styles.quickBtn} onClick={() => send(q)}>{q}</button>)}
      </div>
      <div style={styles.inputRow}>
        <input style={styles.input} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(input)} placeholder="메시지 입력..." />
        <button style={{ ...styles.sendBtn, background: "#00b894" }} onClick={() => send(input)}>전송</button>
      </div>
    </div>
  );
}

// ── 미용실봇 ──────────────────────────────────────────────────
function HairBot({ onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "안녕하세요 ✂️ 미용실 자동응답입니다! 시술, 예약, 가격 안내해드릴게요." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const QUICK = ["컷", "염색", "파마", "예약", "가격"];

  async function send(text) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "당신은 친절한 미용실 직원입니다. 컷, 염색, 파마, 트리트먼트 등 헤어 시술 관련 질문에 짧고 친절하게 답하세요. 영업시간은 오전10시~오후8시. 이모지를 적절히 사용하세요.",
          messages: [{ role: "user", content: text }],
        }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: data.content?.[0]?.text || "잠시 후 다시 시도해주세요." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "오류가 발생했어요." }]);
    }
    setLoading(false);
  }

  return (
    <div style={styles.botWrap}>
      <div style={{ ...styles.botHeader, background: "linear-gradient(135deg,#ffeaa7,#fdcb6e)" }}>
        <span style={{ color: "#2d2d2d" }}>✂️ 미용실봇</span>
        <button onClick={onClose} style={{ ...styles.closeBtn, color: "#2d2d2d" }}>✕</button>
      </div>
      <div style={styles.botBody}>
        {messages.map((m, i) => (
          <div key={i} style={{ ...styles.bubble, alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "#fdcb6e" : "#2a1a3e", color: m.role === "user" ? "#2d2d2d" : "#fff" }}>
            {m.text}
          </div>
        ))}
        {loading && <div style={{ ...styles.bubble, alignSelf: "flex-start", background: "#2a1a3e" }}>입력 중...</div>}
        <div ref={bottomRef} />
      </div>
      <div style={styles.quickRow}>
        {QUICK.map((q) => <button key={q} style={styles.quickBtn} onClick={() => send(q)}>{q}</button>)}
      </div>
      <div style={styles.inputRow}>
        <input style={styles.input} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(input)} placeholder="메시지 입력..." />
        <button style={{ ...styles.sendBtn, background: "#fdcb6e", color: "#2d2d2d" }} onClick={() => send(input)}>전송</button>
      </div>
    </div>
  );
}

// ── 노바봇 (원본) ─────────────────────────────────────────────
function NovaOriginalBot({ onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "안녕하세요! 저는 NOVA입니다 🚀 무엇이든 도와드릴게요!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send(text) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "당신은 NOVA, 우주를 테마로 한 AI 어시스턴트입니다. 친절하고 스마트하게 답변하세요. 이모지를 적절히 활용하세요.",
          messages: [{ role: "user", content: text }],
        }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: data.content?.[0]?.text || "잠시 후 다시 시도해주세요." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "오류가 발생했어요." }]);
    }
    setLoading(false);
  }

  return (
    <div style={styles.botWrap}>
      <div style={{ ...styles.botHeader, background: "linear-gradient(135deg,#6c5ce7,#a29bfe)" }}>
        <span>🚀 NOVA봇</span>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
      </div>
      <div style={styles.botBody}>
        {messages.map((m, i) => (
          <div key={i} style={{ ...styles.bubble, alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "#6c5ce7" : "#2a1a3e" }}>
            {m.text}
          </div>
        ))}
        {loading && <div style={{ ...styles.bubble, alignSelf: "flex-start", background: "#2a1a3e" }}>입력 중...</div>}
        <div ref={bottomRef} />
      </div>
      <div style={styles.inputRow}>
        <input style={styles.input} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(input)} placeholder="메시지 입력..." />
        <button style={{ ...styles.sendBtn, background: "#6c5ce7" }} onClick={() => send(input)}>전송</button>
      </div>
    </div>
  );
}

// ── 행성 데이터 ───────────────────────────────────────────────
const PLANETS = [
  { id: "cafe",     emoji: "☕", label: "카페봇",    color: "#ff6b9d", orbitR: 120, speed: 12, startAngle: 0   },
  { id: "nail",     emoji: "💅", label: "네일샵봇",  color: "#f368e0", orbitR: 170, speed: 18, startAngle: 72  },
  { id: "pilates",  emoji: "🧘", label: "필라테스봇",color: "#00b894", orbitR: 220, speed: 25, startAngle: 144 },
  { id: "hair",     emoji: "✂️", label: "미용실봇",  color: "#fdcb6e", orbitR: 270, speed: 32, startAngle: 216 },
  { id: "nova",     emoji: "🚀", label: "NOVA봇",    color: "#a29bfe", orbitR: 320, speed: 40, startAngle: 288 },
];

// ── 메인 허브 ─────────────────────────────────────────────────
export default function NovaUniverse() {
  const [activeBot, setActiveBot] = useState(null);
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const [angles, setAngles] = useState(() => PLANETS.map((p) => p.startAngle));
  const animRef = useRef(null);
  const lastTimeRef = useRef(null);

  // 공전 애니메이션
  useEffect(() => {
    const animate = (ts) => {
      if (!lastTimeRef.current) lastTimeRef.current = ts;
      const dt = (ts - lastTimeRef.current) / 1000;
      lastTimeRef.current = ts;
      setAngles((prev) =>
        prev.map((a, i) => (a + (360 / PLANETS[i].speed) * dt) % 360)
      );
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const cx = 360; // SVG 중심 x
  const cy = 360; // SVG 중심 y

  function planetPos(orbitR, angleDeg) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + orbitR * Math.cos(rad),
      y: cy + orbitR * 0.42 * Math.sin(rad), // 타원 효과
    };
  }

  function openBot(id) { setActiveBot(id); }
  function closeBot() { setActiveBot(null); }

  const BotMap = {
    cafe: CafeBot,
    nail: NailBot,
    pilates: PilatesBot,
    hair: HairBot,
    nova: NovaOriginalBot,
  };
  const ActiveBotComponent = activeBot ? BotMap[activeBot] : null;

  return (
    <div style={styles.root}>
      {/* 별 배경 */}
      <div style={styles.stars} />

      {/* 타이틀 */}
      <div style={styles.title}>
        <div style={styles.titleMain}>🌌 NOVA UNIVERSE</div>
        <div style={styles.titleSub}>행성을 클릭해서 봇을 실행하세요</div>
      </div>

      {/* 우주 SVG */}
      <div style={styles.solarWrap}>
        <svg width="720" height="720" viewBox="0 0 720 720" style={{ maxWidth: "100%", overflow: "visible" }}>
          {/* 궤도 점선 */}
          {PLANETS.map((p) => (
            <ellipse
              key={p.id + "-orbit"}
              cx={cx} cy={cy}
              rx={p.orbitR} ry={p.orbitR * 0.42}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
              strokeDasharray="6 8"
            />
          ))}

          {/* 호버 연결선 */}
          {hoveredPlanet && (() => {
            const p = PLANETS.find((x) => x.id === hoveredPlanet);
            const idx = PLANETS.indexOf(p);
            const pos = planetPos(p.orbitR, angles[idx]);
            return (
              <line
                x1={cx} y1={cy} x2={pos.x} y2={pos.y}
                stroke={p.color} strokeWidth="1.5" strokeOpacity="0.6"
                strokeDasharray="4 4"
              />
            );
          })()}

          {/* NOVA 코어 */}
          <circle cx={cx} cy={cy} r="38" fill="url(#coreGrad)" filter="url(#glow)" />
          <circle cx={cx} cy={cy} r="28" fill="#1a0533" />
          <text x={cx} y={cy + 6} textAnchor="middle" fontSize="22" fill="white">✦</text>

          {/* 행성들 */}
          {PLANETS.map((p, i) => {
            const pos = planetPos(p.orbitR, angles[i]);
            const isHover = hoveredPlanet === p.id;
            const r = isHover ? 24 : 20;
            return (
              <g
                key={p.id}
                style={{ cursor: "pointer" }}
                onClick={() => openBot(p.id)}
                onMouseEnter={() => setHoveredPlanet(p.id)}
                onMouseLeave={() => setHoveredPlanet(null)}
              >
                <circle cx={pos.x} cy={pos.y} r={r + 6} fill={p.color} opacity="0.18" />
                <circle cx={pos.x} cy={pos.y} r={r} fill={p.color} filter="url(#glow)" />
                <text x={pos.x} y={pos.y + 6} textAnchor="middle" fontSize={isHover ? "16" : "14"}>{p.emoji}</text>
                {isHover && (
                  <text x={pos.x} y={pos.y + r + 16} textAnchor="middle" fontSize="11" fill={p.color} fontWeight="bold">
                    {p.label}
                  </text>
                )}
              </g>
            );
          })}

          <defs>
            <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c44dff" />
              <stop offset="100%" stopColor="#6c00ff" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      {/* 빠른 접근 버튼 */}
      <div style={styles.quickAccess}>
        {PLANETS.map((p) => (
          <button
            key={p.id}
            style={{ ...styles.accessBtn, borderColor: p.color, color: p.color }}
            onClick={() => openBot(p.id)}
          >
            {p.emoji} {p.label}
          </button>
        ))}
      </div>

      {/* 봇 슬라이드업 */}
      {ActiveBotComponent && (
        <div style={styles.botOverlay}>
          <ActiveBotComponent onClose={closeBot} />
        </div>
      )}
    </div>
  );
}

// ── 스타일 ────────────────────────────────────────────────────
const styles = {
  root: {
    minHeight: "100vh",
    background: "radial-gradient(ellipse at center, #1a0533 0%, #0a0015 70%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Noto Sans KR', sans-serif",
    color: "#fff",
    overflow: "hidden",
    position: "relative",
  },
  stars: {
    position: "fixed",
    inset: 0,
    background:
      "radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.8) 0%, transparent 100%)," +
      "radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.6) 0%, transparent 100%)," +
      "radial-gradient(1px 1px at 70% 10%, rgba(255,255,255,0.7) 0%, transparent 100%)," +
      "radial-gradient(1px 1px at 85% 45%, rgba(255,255,255,0.5) 0%, transparent 100%)," +
      "radial-gradient(1px 1px at 50% 80%, rgba(255,255,255,0.6) 0%, transparent 100%)," +
      "radial-gradient(1px 1px at 20% 90%, rgba(255,255,255,0.4) 0%, transparent 100%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  title: {
    textAlign: "center",
    marginTop: 32,
    zIndex: 1,
  },
  titleMain: {
    fontSize: "2rem",
    fontWeight: "bold",
    letterSpacing: "0.12em",
    textShadow: "0 0 20px #c44dff",
  },
  titleSub: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.5)",
    marginTop: 6,
  },
  solarWrap: {
    zIndex: 1,
    marginTop: -20,
  },
  quickAccess: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    padding: "0 16px 32px",
    zIndex: 1,
  },
  accessBtn: {
    background: "transparent",
    border: "1px solid",
    borderRadius: 20,
    padding: "6px 16px",
    fontSize: "0.8rem",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  botOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    zIndex: 100,
    animation: "fadeIn 0.25s ease",
  },
  botWrap: {
    width: "100%",
    maxWidth: 480,
    background: "#13002a",
    borderRadius: "20px 20px 0 0",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: "70vh",
    boxShadow: "0 -8px 40px rgba(196,77,255,0.3)",
    animation: "slideUp 0.3s ease",
  },
  botHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 18px",
    fontWeight: "bold",
    fontSize: "1rem",
    color: "#fff",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "1.1rem",
    cursor: "pointer",
  },
  botBody: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  bubble: {
    maxWidth: "78%",
    padding: "10px 14px",
    borderRadius: 14,
    fontSize: "0.88rem",
    lineHeight: 1.55,
    color: "#fff",
    whiteSpace: "pre-wrap",
  },
  quickRow: {
    display: "flex",
    gap: 8,
    padding: "8px 14px",
    overflowX: "auto",
    flexShrink: 0,
  },
  quickBtn: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 16,
    padding: "5px 12px",
    color: "#fff",
    fontSize: "0.78rem",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  inputRow: {
    display: "flex",
    gap: 8,
    padding: "10px 14px 16px",
    flexShrink: 0,
  },
  input: {
    flex: 1,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: "10px 14px",
    color: "#fff",
    fontSize: "0.88rem",
    outline: "none",
  },
  sendBtn: {
    border: "none",
    borderRadius: 20,
    padding: "10px 18px",
    color: "#fff",
    fontSize: "0.88rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
